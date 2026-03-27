# RECIPE

A modern recipe management platform powered by Next.js App Router.

This application lets users discover, create, and organize recipes with authentication, tagging, ingredient management, image uploads, and profile editing.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [How API Communication Works](#how-api-communication-works)
- [Quality and Linting](#quality-and-linting)
- [Deployment](#deployment)

## Overview

RECIPE is designed as a clean web experience for a recipe platform API.
It uses a server-side proxy layer in Next.js routes to forward requests to the backend API while attaching an auth token from secure cookies.

This gives you:

- A better separation between browser and backend concerns
- Centralized auth handling through httpOnly cookies
- Consistent API access patterns through shared hooks and utility methods

## Core Features

- User authentication (register, login, logout)
- Profile viewing and updating
- Recipe listing and detail pages
- Recipe creation, editing, deletion, and image upload
- Ingredient and tag management
- Reusable UI components and form primitives
- SWR-based data fetching for responsive UI updates

<details>
<summary><strong>Feature Walkthrough</strong></summary>

### Public Experience

- Landing page with product highlights
- Login and registration pages

### Authenticated Experience

- Browse recipes
- Create and edit recipes
- Manage tags and ingredients
- Update user profile

</details>

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- SWR
- React Hook Form + Zod
- Headless UI + Heroicons

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` in the project root and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the backend API (without trailing `/api`) |

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint checks |

## Project Structure

```text
app/
	api/
		auth/
		proxy/
	recipes/
	ingredients/
	tags/
	profile/
	login/
	register/
components/
	ui/
	recipe/
	layout/
hooks/
lib/
types/
```

## How API Communication Works

The app uses a backend proxy flow:

1. Client code calls methods in `lib/api.ts`.
2. Requests are sent to Next.js API routes under `/api/proxy/...`.
3. The proxy route forwards to `${NEXT_PUBLIC_API_URL}/api/...`.
4. Auth token from cookie is attached as `Authorization: Token <token>`.
5. Response is returned to the client.

Authentication token lifecycle:

- Login route stores token as httpOnly cookie.
- Proxy reads cookie and forwards auth header.
- Logout route deletes the cookie.

## Quality and Linting

Run lint checks:

```bash
npm run lint
```

There is also a helper script in the repository root named `test_auth.js` for quick authentication-flow testing.

## Deployment

Build and run in production mode:

```bash
npm run build
npm run start
```

Before deployment, ensure:

- `NEXT_PUBLIC_API_URL` points to your production backend
- Backend CORS and auth settings are aligned with your web app domain
- Secure cookies are enabled in production

---

If you are extending this project, keep API access centralized in `lib/api.ts` and prefer shared hooks in `hooks/` for data logic consistency.
