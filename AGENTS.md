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

- All data access goes through `api` in src/lib/api (mirrors the FastAPI endpoints); it uses the in-browser mock unless VITE_USE_MOCK=false — why: swap to the real backend without touching UI code.
- Pricing/overlap rules live as pure functions in src/lib/pricing.ts with tests — why: mock must match the backend's rules exactly.
