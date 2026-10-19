CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  delivery_location text,
  notes text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  customer_email_sent boolean NOT NULL DEFAULT false,
  company_email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- First account ever created becomes the store admin.
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_admin AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

CREATE TABLE public.analytics_sessions (
  id text PRIMARY KEY,
  visitor_id text NOT NULL,
  is_returning boolean NOT NULL DEFAULT false,
  visit_number int NOT NULL DEFAULT 1,
  landing_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device text,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.analytics_sessions (started_at DESC);
CREATE INDEX ON public.analytics_sessions (visitor_id);
GRANT ALL ON public.analytics_sessions TO service_role;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.analytics_events (
  id bigserial PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  type text NOT NULL,
  path text NOT NULL,
  label text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.analytics_events (session_id, created_at);
CREATE INDEX ON public.analytics_events (created_at DESC);
GRANT ALL ON public.analytics_events TO service_role;
GRANT USAGE ON SEQUENCE public.analytics_events_id_seq TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.analytics_summary(_days int DEFAULT 7)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE since timestamptz := now() - make_interval(days => greatest(1, least(_days, 365)));
  result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'not allowed'; END IF;
  WITH s AS (SELECT * FROM analytics_sessions WHERE started_at >= since),
  e AS (SELECT ev.* FROM analytics_events ev JOIN s ON s.id = ev.session_id),
  flags AS (
    SELECT s.id,
      bool_or(e.path LIKE '/products/%' AND e.type='page_view') AS product,
      bool_or(e.type='add_to_cart') AS cart_add,
      bool_or(e.path='/cart' AND e.type='page_view') AS cart_view,
      bool_or(e.path='/checkout' AND e.type='page_view') AS checkout,
      bool_or(e.type='order_placed') AS ordered
    FROM s LEFT JOIN e ON e.session_id = s.id GROUP BY s.id
  ),
  last_pv AS (
    SELECT DISTINCT ON (e.session_id) e.session_id, e.path FROM e WHERE e.type='page_view'
    ORDER BY e.session_id, e.created_at DESC
  )
  SELECT jsonb_build_object(
    'sessions', (SELECT count(*) FROM s),
    'visitors', (SELECT count(DISTINCT visitor_id) FROM s),
    'returning_sessions', (SELECT count(*) FROM s WHERE is_returning),
    'funnel', jsonb_build_array(
      jsonb_build_object('step','Visited site','count',(SELECT count(*) FROM flags)),
      jsonb_build_object('step','Viewed a product','count',(SELECT count(*) FROM flags WHERE product)),
      jsonb_build_object('step','Added to cart','count',(SELECT count(*) FROM flags WHERE cart_add)),
      jsonb_build_object('step','Opened cart','count',(SELECT count(*) FROM flags WHERE cart_view)),
      jsonb_build_object('step','Reached checkout','count',(SELECT count(*) FROM flags WHERE checkout)),
      jsonb_build_object('step','Placed order','count',(SELECT count(*) FROM flags WHERE ordered))),
    'exit_pages', COALESCE((SELECT jsonb_agg(x) FROM (SELECT l.path, count(*) AS count FROM last_pv l JOIN flags f ON f.id=l.session_id WHERE NOT COALESCE(f.ordered,false) GROUP BY l.path ORDER BY count DESC LIMIT 10) x), '[]'),
    'entry_pages', COALESCE((SELECT jsonb_agg(x) FROM (SELECT landing_path AS path, count(*) AS count FROM s GROUP BY 1 ORDER BY 2 DESC LIMIT 10) x), '[]'),
    'referrers', COALESCE((SELECT jsonb_agg(x) FROM (SELECT COALESCE(NULLIF(utm_source,''), NULLIF(referrer,''), 'Direct') AS source, count(*) AS count FROM s GROUP BY 1 ORDER BY 2 DESC LIMIT 10) x), '[]'),
    'devices', COALESCE((SELECT jsonb_agg(x) FROM (SELECT COALESCE(device,'unknown') AS device, count(*) AS count FROM s GROUP BY 1 ORDER BY 2 DESC) x), '[]'),
    'top_clicks', COALESCE((SELECT jsonb_agg(x) FROM (SELECT path, label, count(*) AS count FROM e WHERE type='click' GROUP BY 1,2 ORDER BY 3 DESC LIMIT 15) x), '[]'),
    'recent', COALESCE((SELECT jsonb_agg(x) FROM (
      SELECT s.id, s.visitor_id, s.is_returning, s.visit_number, s.device, s.started_at,
        COALESCE(NULLIF(s.utm_source,''), NULLIF(s.referrer,''), 'Direct') AS source,
        COALESCE(f.ordered,false) AS ordered,
        (SELECT jsonb_agg(jsonb_build_object('t',ev.type,'p',ev.path,'l',ev.label,'at',ev.created_at) ORDER BY ev.created_at)
           FROM (SELECT * FROM analytics_events WHERE session_id=s.id ORDER BY created_at LIMIT 60) ev) AS steps
      FROM s LEFT JOIN flags f ON f.id=s.id ORDER BY s.started_at DESC LIMIT 25) x), '[]')
  ) INTO result;
  RETURN result;
END $$;
REVOKE EXECUTE ON FUNCTION public.analytics_summary(int) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.analytics_summary(int) TO authenticated;