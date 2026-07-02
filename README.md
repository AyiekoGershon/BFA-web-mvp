# BFA web mvp

## Overview

`BFA web mvp` is a React + TypeScript + Vite website for Bright Future Academy. It features a responsive school landing page with navigation, hero slideshow, sections for academics, admissions, gallery, news, FAQ, and contact.

## Key Features

- Client-side routing with `react-router-dom`
- Responsive layout using Tailwind CSS
- Dynamic homepage hero slideshow using local image assets
- Shared layout with header, footer, and breadcrumb/page indicator
- Sections for admissions, academics, facilities, leadership, testimonials, FAQ, and contact

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

## Local Setup

```bash
npm install
npm run dev
```

Open the app at `http://localhost:5173` after the development server starts.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production app
- `npm run preview` - Preview built app
- `npm run lint` - Run Oxlint

## Notes

The homepage background uses images from `public/images/Home`, with `flag.png` as the first image in the slideshow.

If this project is connected to a remote repository, set the remote URL and push with:

```bash
git remote add origin <remote-url>
git push -u origin main
```
