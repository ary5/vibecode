# Face Scan

A client-side web app that scans your face via the camera and rates where you fall on a masculine–feminine spectrum. All processing runs in the browser — no backend or API keys required.

> **Roadmap:** This app is planned to become a **stare-off game** using [@vladmandic/human](https://github.com/vladmandic/human). See [docs/STARE-OFF-MIGRATION.md](docs/STARE-OFF-MIGRATION.md) for the full migration plan.

## Local development

Requires [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open https://localhost:5173/ after starting the dev server. The first `pnpm dev` may prompt for permission to install a local certificate authority (required once for trusted HTTPS).

For mobile testing on your LAN, use the **HTTPS** Network URL printed in the terminal (not `http://`).

## Deploy to Netlify

This repo is configured for Netlify via [`netlify.toml`](netlify.toml):

| Setting | Value |
|---------|--------|
| Build command | `pnpm build` |
| Publish directory | `dist` |
| Node version | 20 |

1. Push this repo to GitHub.
2. In [Netlify](https://app.netlify.com/), choose **Add new site → Import an existing project**.
3. Connect the GitHub repo and deploy (Netlify auto-detects the settings from `netlify.toml`).
4. Open the deployed `https://` URL on your phone and allow camera access.

## Tech stack

- React + TypeScript + Vite
- [@vladmandic/human](https://github.com/vladmandic/human) for in-browser face detection and gender classification (models load from CDN on first scan)
