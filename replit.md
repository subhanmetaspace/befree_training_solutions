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
- **Payment**: N-Genius payment gateway integration

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
│   ├── Checkout.jsx    # Cart/checkout page
│   ├── PaymentPage.jsx # Payment form
│   ├── PaymentSuccess.jsx # Payment confirmation
│   └── ...             # Other pages
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state
├── hooks/              # Custom React hooks
├── lib/                # Utilities
└── assets/             # Static assets

backend-ngenius-integration/  # Backend payment integration code
├── config/             # Configuration files
├── controllers/        # Route controllers
├── database/           # SQL schema
├── routes/             # API routes
├── services/           # N-Genius service
└── README.md           # Integration documentation
```

## Development Setup
The app runs on port 5000 in development with CRA's webpack dev server.

### Environment Variables (Development)
- `PORT=5000` - Dev server port
- `HOST=0.0.0.0` - Bind to all interfaces
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Allow Replit proxy
- `REACT_APP_API_BACKEND` - Backend API URL

## Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## External Dependencies
The app connects to an external backend API at:
- `https://backend.befreetraining.net/api/v1/`

## Payment Flow
1. User selects a plan on `/plans`
2. Checkout page (`/checkout`) shows cart with billing options
3. Payment page (`/payment`) collects contact and payment info
4. Backend creates N-Genius order and returns payment URL
5. User completes payment on N-Genius hosted page
6. Redirect to `/payment-success` or `/payment-cancel`

## Deployment
Configured for static deployment:
- Build command: `npm run build`
- Output directory: `build/`

## Recent Changes
- 2026-01-20: Initial setup for Replit environment
- 2026-01-20: Redesigned Checkout and Payment pages with modern UI
- 2026-01-20: Added N-Genius payment gateway integration code
- 2026-01-20: Added PaymentSuccess and PaymentCancel pages

## User Preferences
- Currency: AED (UAE Dirham)
- Payment Gateway: N-Genius by Network International
