# ForgeOne AI Workspace

ForgeOne is a private, original AI workspace shell for planning projects, saving brand notes, organizing launches, and staging future AI/backend integrations.

## Use it locally

Double-click `Start ForgeOne.cmd` on the desktop, or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\Start-ForgeOne.ps1
```

Then open:

```text
http://127.0.0.1:4173/
```

## Public hosting

This folder is static-site ready. Upload `index.html`, `styles.css`, `app.js`, `.nojekyll`, and any future assets to a static host such as GitHub Pages, Netlify, Vercel, Cloudflare Pages, or Base44 static hosting.

Current storage is browser-local. A real public multi-user version needs a backend for accounts, saved projects, file storage, and server-side AI keys.
