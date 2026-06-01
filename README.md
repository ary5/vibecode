# Face Scan

A client-side web app that scans your face via the camera and rates where you fall on a masculine–feminine spectrum. All processing runs in the browser — no backend or API keys required.

## Local development

Requires [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open https://localhost:5173/ (the dev server uses HTTPS so the camera works on mobile over the network).

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
- [@vladmandic/face-api](https://github.com/vladmandic/face-api) for in-browser face detection and gender classification
