# Trapo multi-portal app

- Next.js (App Router, TypeScript, Tailwind v3) with multiple UI kits (Chakra, MUI, NextUI, Radix, shadcn utils).
- MongoDB connection helper at `src/lib/mongodb.ts`.
- Sample portals on the home grid (`src/app/page.tsx`); “Boring Clock” lives at `/apps/boring-clock`.

## Environment

Env files live in the repo root:

- `.env.local` (for local secrets)
- `.env` (optional defaults)

Required variables:

```
MONGODB_URI=mongodb://127.0.0.1:27017/trapo
MONGODB_DB=trapo
```

## Run

```
npm install
npm run dev
```

Open http://localhost:3000 and choose a portal tile. Lint with `npm run lint`.
