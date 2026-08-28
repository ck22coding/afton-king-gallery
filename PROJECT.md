# Afton King — Art Gallery

**Status:** Live — deployed on Vercel at https://afton-king-gallery.vercel.app
**Task Type:** website
**Created:** 2026-01-30
**Last updated:** 2026-08-27

## Summary

Art gallery website for Afton King. A single self-contained `index.html` (~5.5 MB, images inlined) — no build step, no framework. Deployed to Vercel. Pushing to `main` on GitHub auto-deploys to production (verified 2026-08-27).

## Code path

`/Users/carterking/Projects/afton-king-gallery/`

## Deployment

- **Live:** https://afton-king-gallery.vercel.app
- **Vercel project:** `afton-king-gallery` (carter-kings-projects-24d66166)
- **GitHub:** `ck22coding/afton-king-gallery`
- **Redeploy:** push to `main` — GitHub auto-deploy ships it to production. (`vercel --prod` from this folder also works, but needs `vercel link` first: `.vercel/` is git-ignored and not present.)

## Notes

- `archive/afton-king-gallery-new/` holds a retired, byte-identical staging copy of the build (git-ignored, kept for reference only).
- `vercel.json`: `cleanUrls: true`, `trailingSlash: false`.
- `.vercelignore` keeps `.claude/`, `archive/`, and `PROJECT.md` out of the deploy (PROJECT.md would otherwise be public at /PROJECT.md).
- React + ReactDOM load as production builds from unpkg with SRI hashes. If you bump the version, recompute the `integrity` hash or the browser will block the script and the page goes blank.
