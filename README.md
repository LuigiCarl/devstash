# DevStash

A responsive developer-resource manager built with Next.js 16, TypeScript, Tailwind CSS, Drizzle ORM, Neon Postgres, and Auth.js-ready schemas.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The checked-in sample data makes the interface explorable before cloud credentials are configured.

## Neon database

1. In Vercel, open **Storage → Create Database → Neon Postgres** and connect it to the project.
2. Copy the pooled Postgres connection string into `DATABASE_URL` in `.env.local`.
3. Generate and apply migrations with `npx drizzle-kit generate` and `npx drizzle-kit migrate`.

## Google OAuth

1. In Google Cloud Console, create or select a project.
2. Configure the OAuth consent screen, then create a **Web application** OAuth client.
3. Add `http://localhost:3000` and your production domain as authorized JavaScript origins.
4. Add these authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR_DOMAIN/api/auth/callback/google`
5. Copy the client ID and secret into `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.
6. Generate `AUTH_SECRET` with `npx auth secret` and set `AUTH_URL` to the active application origin.

Never commit `.env.local`.

## Quality checks

```bash
npm run lint
npm run build
```
