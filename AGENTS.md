<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Site layout pieces (header, footer, cards, page heroes) live in src/components/site.tsx and button/field styles in src/styles.css; restyle there so every page stays consistent.
- Visitor tracking lives in src/lib/tracking.ts (browser, consent + cookies), src/routes/api/public/track.ts (collector, write-only), and the analytics_summary SQL function read by /admin; keep new funnel events in all three so the dashboard stays in sync.
- Admin access is the user_roles table; the first account created becomes admin automatically.
