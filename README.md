# Career Pilot Platform MVP

A lightweight React + TypeScript MVP for discovering and tracking career opportunities in one place.

## What it does

- Aggregates internships, fellowships, hackathons, and open-source programs into a unified feed
- Supports search, category filtering, and remote-only views
- Lets users bookmark opportunities with browser-based persistence
- Displays upcoming deadline reminders and lets users toggle reminders on or off

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

### Project dependencies

- `react` ^18.3.1
- `react-dom` ^18.3.1

### Development dependencies

- `@types/react` ^18.3.4
- `@types/react-dom` ^18.3.0
- `@vitejs/plugin-react` ^4.3.1
- `typescript` ^5.6.2
- `vite` ^5.4.1

2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser at the URL shown by Vite.

## Project structure

- `src/main.tsx` — application entry point
- `src/App.tsx` — main app shell
- `src/components/Dashboard.tsx` — dashboard and feed UI
- `src/components/Tracker.tsx` — opportunity tracking and reminders

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
