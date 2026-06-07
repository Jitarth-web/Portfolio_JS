# Jitarth Singh Portfolio

Modern developer portfolio built with React, Vite, Tailwind CSS, and GSAP.

## Figma Assets

The raw `Portfolio.fig` file is a Figma document, not a browser asset. Export images from Figma as PNG, JPG, WebP, or SVG and place them in:

```text
src/assets/
```

Recommended filenames:

```text
src/assets/jitarth-avatar.png
src/assets/project-attendance.png
src/assets/project-payment.png
src/assets/project-blind-stick.png
src/assets/project-student-portal.png
src/assets/resume.pdf
```

The current project already includes `src/assets/jitarth-avatar.png`.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173`.

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Push this project to GitHub.
2. In Vercel, click **Add New Project** and import the repository.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.
