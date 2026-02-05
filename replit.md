# Fusion Starter - Maurique Labs

## Overview
A React + Express full-stack application for a creative agency website connecting music, technology, and culture. Built with Vite, TypeScript, and Tailwind CSS.

## Project Architecture

### Structure
- `client/` - React frontend with ShadCN UI components
- `server/` - Express backend API
- `shared/` - Shared TypeScript types and utilities
- `public/` - Static assets

### Tech Stack
- **Frontend**: React 18, Vite 7, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Express 5, Node.js
- **Build**: Vite with SWC for fast compilation
- **Package Manager**: pnpm

### Key Configuration
- Dev server runs on port 5000 with both frontend and backend
- Express middleware is integrated into Vite dev server
- Production uses compiled Node.js server serving static SPA files

## Development
Run `pnpm dev` to start the development server on port 5000.

## Production Build
- `pnpm build` - Builds both client and server
- `pnpm start` - Runs the production server

## API Routes
- `GET /api/ping` - Health check endpoint
- `GET /api/demo` - Demo endpoint
- `POST /api/contact` - Contact form submission
