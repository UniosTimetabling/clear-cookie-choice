import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const s = (max: number) => z.string().max(max);
const payload = z.object({
  sessionId: s(64).min(8),
  visitorId: s(64).min(8),
  newSession: z.boolean(),
  isReturning: z.boolean(),
  visitNumber: z.number().int().min(1).max(100000),
  landingPath: s(500),
  referrer: s(300),
  utmSource: s(200),
  utmMedium: s(200),
  utmCampaign: s(200),
  device: z.enum(["mobile", "tablet", "desktop"]),
  events: z
    .array(
      z.object({
        type: z.enum(["page_view", "page_exit", "click", "add_to_cart", "begin_checkout", "order_placed", "remove_from_cart"]),
        path: s(500),
        label: s(200).optional(),
        meta: z.record(z.string(), z.unknown()).optional(),
        at: z.string().datetime(),
      }),
    )
    .min(1)
    .max(50),
});

// Public collector: anyone can post anonymous journey events. Writes only, never returns data.
export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const text = await request.text();
        if (text.length > 64_000) return new Response(null, { status: 413 });
        let body: z.infer<typeof payload>;
        try {
          body = payload.parse(JSON.parse(text));
        } catch {
          return new Response(null, { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const now = new Date().toISOString();
        const row = {
          id: body.sessionId,
          visitor_id: body.visitorId,
          is_returning: body.isReturning,
          visit_number: body.visitNumber,
          landing_path: body.events[0]?.path ?? body.landingPath,
          referrer: body.referrer || null,
          utm_source: body.utmSource || null,
          utm_medium: body.utmMedium || null,
          utm_campaign: body.utmCampaign || null,
          device: body.device,
          last_seen_at: now,
        };
        // Create the visit if it's new; never overwrite where an existing visit began.
        const { error: sErr } = await supabaseAdmin.from("analytics_sessions").upsert(row, { onConflict: "id", ignoreDuplicates: true });
        if (sErr) {
          console.error("track session", sErr);
          return new Response(null, { status: 500 });
        }
        if (!body.newSession) {
          await supabaseAdmin.from("analytics_sessions").update({ last_seen_at: now }).eq("id", body.sessionId);
        }
        const { error } = await supabaseAdmin.from("analytics_events").insert(
          body.events.map((e) => ({
            session_id: body.sessionId,
            visitor_id: body.visitorId,
            type: e.type,
            path: e.path,
            label: e.label ?? null,
            meta: (e.meta ?? {}) as never,
            created_at: e.at,
          })),
        );
        if (error) {
          console.error("track events", error);
          return new Response(null, { status: 500 });
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
