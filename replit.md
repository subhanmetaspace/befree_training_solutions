# BeFree EdTech Platform

## Overview
BeFree is an educational technology platform (edtech) built with React. It allows users to browse classes, view teachers, explore pricing plans, and manage their learning journey. The app connects to an external backend API at `backend.befreetraining.net`.

## Project Architecture
- **Framework**: React 18 with Create React App (CRA)
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router v6
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Auth**: Custom token-based auth stored in localStorage

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Radix/shadcn UI primitives
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   ├── Hero.jsx        # Landing page hero
│   └── ...             # Other feature components
├── pages/              # Route pages
│   ├── Index.jsx       # Home page
│   ├── Auth.jsx        # Login/signup
│   ├── ClassesPage.jsx # Browse classes
│   └── ...             # Other pages
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state
├── hooks/              # Custom React hooks
├── lib/                # Utilities
└── assets/             # Static assets
```

## Development Setup
The app runs on port 5000 in development with CRA's webpack dev server.

### Environment Variables (Development)
- `PORT=5000` - Dev server port
- `HOST=0.0.0.0` - Bind to all interfaces
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Allow Replit proxy

## Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## External Dependencies
The app connects to an external backend API at:
- `https://backend.befreetraining.net/api/v1/`

## Deployment
Configured for static deployment:
- Build command: `npm run build`
- Output directory: `build/`

## Recent Changes
- 2026-01-20: Initial setup for Replit environment
