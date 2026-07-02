# BFA Web MVP

## Overview

`BFA Web MVP` is a modern, responsive school website built for Bright Future Academy. It is designed as a marketing and information portal with a strong homepage experience, route-based navigation, and an admissions-driven workflow.

The app is built with React, TypeScript, Vite, and Tailwind CSS, and it uses local school imagery for the homepage slideshow.

## Live Repository

This project is published at:

- https://github.com/AyiekoGershon/BFA-web-mvp

## Features

- Responsive landing page and navigation
- Client-side routing with `react-router-dom`
- Hero section with rotating homepage background images
- Reusable shared layout (`Header`, `Footer`, `Layout`)
- Breadcrumb and active-page indicator for inner pages
- Pages for:
  - `Home`
  - `About`
  - `Academics`
  - `Admissions`
  - `Gallery`
  - `News`
  - `FAQ`
  - `Contact`
  - `Nursery`
  - `Primary`
- Placeholder routes for future pages such as facilities, careers, leadership, mission, privacy, and terms
- Local image slideshow using assets from `public/images/Home`
- Accessible mobile navigation with a collapsible menu

## Architecture

- `src/main.tsx` - App entry point
- `src/App.tsx` - Route definitions and shared layout wrapper
- `src/components/layout` - `Header`, `Footer`, and `Layout` components
- `src/components/sections` - Home page content sections such as hero, about, academics, facilities, leadership, testimonials, FAQ, and contact
- `src/pages` - Individual route pages
- `src/lib/data.ts` - Site metadata and content data arrays
- `src/index.css` - Global styles and theme variables

## Design Notes

- Tailwind CSS is used for styling and responsive layout
- `lucide-react` provides iconography
- `siteInfo` and page data are centralized in `src/lib/data.ts`
- The homepage hero uses `public/images/Home/flag.png` as the first slideshow image, then cycles through additional local photos

## Installation

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open the app in your browser at:

```bash
http://localhost:5173
```

## Production Build

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Linting

Lint the project using Oxlint:

```bash
npm run lint
```

## GitHub

Remote repository:

- https://github.com/AyiekoGershon/BFA-web-mvp

If you want to connect the repository manually, use:

```bash
git remote add origin https://github.com/AyiekoGershon/BFA-web-mvp.git
git branch -M main
git push -u origin main
```

## Future Improvements

Suggested enhancements for the next phase:

- Add real content for placeholder pages
- Implement a multilingual option
- Add a newsletter or parent portal integration
- Improve accessibility and keyboard navigation
- Add unit and integration tests

## License

This repository does not include a license file. Add one if you want to share it publicly with a chosen license.
