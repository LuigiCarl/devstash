# DevStash 🔖

> **A high-performance, developer-first bookmark and resource manager built with Next.js 16, TypeScript, Tailwind CSS, Drizzle ORM, Neon PostgreSQL, and Auth.js.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=flat&logo=drizzle)](https://orm.drizzle.team/)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5_Beta-purple?style=flat)](https://authjs.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Testing-45ba4b?style=flat&logo=playwright)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_Testing-FCC72B?style=flat&logo=vitest)](https://vitest.dev/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Production_Ready-black?style=flat&logo=vercel)](https://vercel.com/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Database Design](#-architecture--database-design)
- [Quickstart (Local Development)](#-quickstart-local-development)
- [Connecting to Neon PostgreSQL](#-connecting-to-neon-postgresql)
- [Deploying to Vercel](#-deploying-to-vercel)
- [Google OAuth Setup](#-google-oauth-setup)
- [Environment Variables](#-environment-variables)
- [REST API Reference](#-rest-api-reference)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## 🌟 Overview

Developers constantly discover high-value documentation, cheat sheets, GitHub repositories, tools, design resources, and tutorials. When scattered across browser bookmarks, Discord messages, or random notes, they get lost and forgotten.

**DevStash** solves this problem by providing a central, lightning-fast developer command center to save, categorize, tag, and discover resources.

### Why DevStash?
- **Developer-Native**: Categorized by actual programming languages, frameworks, and tools with official brand icons.
- **Multi-Level Organization**: Filter by technology, assign custom user tags, and group resources into distinct collections.
- **Zero Friction**: Test drive immediately in **Guest Workspace** mode with full persistence; easily migrate guest data into an authenticated account later.
- **Personal Stash Security**: Supports Google OAuth with optional single-owner lock (`OWNER_GOOGLE_EMAIL`) for a truly private portfolio showcase, plus built-in credentials authentication.
- **Serverless & Fast**: Powered by Next.js 16 App Router, React 19, and Neon serverless Postgres via Drizzle ORM over HTTP.

---

## ✨ Key Features

### 🔖 Bookmark Management
- **Full CRUD**: Create, view, edit, and delete bookmarks with title, destination URL, description, category, technology stack, tags, and favorite status.
- **Duplicate Prevention**: Warns on duplicate URLs within your library.
- **Safe Outbound Navigation**: All saved links open in new tabs with secure `rel="noopener noreferrer"` attributes.
- **Favorites & Fast Access**: Quickly star high-frequency documentation or tools for one-click filtering.

### 🎨 Authentic Technology Icons
- Integrated registry powered by **Simple Icons** and **Devicon**.
- Recognizes 20+ technologies out-of-the-box: React, Next.js, Vue, Angular, Svelte, JavaScript, TypeScript, Tailwind CSS, Node.js, Python, PostgreSQL, MySQL, MongoDB, Redis, Git, GitHub, Docker, Vercel, AWS, Figma, and more.
- Each technology features its verified brand color and renders cleanly across light and dark modes.

### 📁 Collections & Custom Tags
- **Collections**: Create custom groupings (e.g., *"Next.js Stack"*, *"Interview Prep"*, *"CSS Inspiration"*) and manage multi-collection bookmark memberships.
- **Tags**: Case-insensitive user-scoped tags with deduplication.
- **Resource Categories**: Structured categorization across *Documentation*, *Library*, *Tool*, *Article*, *Tutorial*, *Design*, *Platform*, and *Community*.

### 🔍 Search, Filters & Views
- **Real-time Search**: Search across bookmark titles, descriptions, URLs, and tags.
- **Multi-criteria Filtering**: Filter by technology, category, and favorite status simultaneously.
- **Flexible Sorting**: Sort resources by Newest, Oldest, or Alphabetical (A-Z).
- **Layout Switcher**: Toggle smoothly between responsive **Grid** and compact **List** views.

### 🔐 Multi-Tier Authentication
- **Google OAuth (Auth.js v5)**: One-click sign-in using Google accounts.
- **Personal Portfolio Restriction**: Set `OWNER_GOOGLE_EMAIL` to lock Google sign-in to your personal account while allowing recruiters or visitors to use Guest mode.
- **Credentials Auth**: Username and password login backed by secure hashing.
- **Anonymous Guest Workspace**: Instant guest session powered by cryptographically hashed session cookies in Neon.
- **Seamless Data Migration**: When a guest user logs in or registers, all bookmarks, collections, and tags created during the guest session automatically transfer to their new user account!

### 🌓 UI/UX Polish
- **Dark & Light Mode**: Built-in theme switcher using `next-themes`.
- **Accessible Components**: Accessible dialogs, keyboard navigation, and semantic HTML.
- **Toast Notifications**: Informative feedback powered by `sonner`.
- **Fluid Transitions**: Micro-interactions and layout transitions powered by `motion`.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Components, Route Handlers, Turbopack |
| **Frontend** | [React 19](https://react.dev/) | Modern UI library with Server Actions & Concurrent features |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS styling with modern theme tokens |
| **Icons** | [Lucide React](https://lucide.dev/) & [Simple Icons](https://simpleicons.org/) | Interface icons and official tech logos |
| **Database** | [Neon](https://neon.tech/) | Serverless PostgreSQL with autoscaling and connection pooling |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL query builder via `drizzle-orm/neon-http` |
| **Authentication** | [Auth.js (NextAuth v5)](https://authjs.dev/) | JWT-based sessions with `@auth/drizzle-adapter` & Google OAuth |
| **Validation** | [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/) | Runtime input validation and controlled forms |
| **Testing** | [Playwright](https://playwright.dev/) & [Vitest](https://vitest.dev/) | End-to-end user journey tests & unit tests |
| **Deployment** | [Vercel](https://vercel.com/) | Edge & serverless cloud platform |

---

## 🏗 Architecture & Database Design

DevStash uses a monolithic full-stack architecture built inside Next.js. Server Components handle initial data fetching directly against Neon via Drizzle ORM, while Client Components handle interactivity, modals, and filters.

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js 16 Client                     │
│  (Landing / Dashboard / Bookmarks / Collections / Settings) │
└──────────────┬──────────────────────────────▲───────────────┘
               │ HTTP / Route Handlers        │ Server Rendering
┌──────────────▼──────────────────────────────┴───────────────┐
│                    Next.js Route Handlers                   │
│   (/api/bookmarks, /api/collections, /api/tags, /api/auth)  │
│                                                             │
│  • Zod Validation   • Auth.js Session Check  • Ownership Guard│
└──────────────┬──────────────────────────────────────────────┘
               │ SQL over HTTP
┌──────────────▼──────────────────────────────────────────────┐
│                    Drizzle ORM (neon-http)                  │
└──────────────┬──────────────────────────────────────────────┘
               │ Pooled Connection (port 5432 / sslmode)
┌──────────────▼──────────────────────────────────────────────┐
│                  Neon Serverless PostgreSQL                 │
│                                                             │
│  users ─────── accounts / sessions / verification_tokens    │
│    │                                                        │
│    ├── bookmarks ◄─────────────► technologies               │
│    │       │                                                │
│    │       ├── bookmark_tags ◄─────────► tags               │
│    │       │                                                │
│    │       └── collection_bookmarks ◄──► collections        │
│    │                                                        │
│  guest_sessions (auto-migrated upon login)                  │
└─────────────────────────────────────────────────────────────┘
```

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ ACCOUNTS : "has"
    USERS ||--o{ SESSIONS : "authenticates"
    USERS ||--o{ BOOKMARKS : "owns"
    USERS ||--o{ COLLECTIONS : "creates"
    USERS ||--o{ TAGS : "creates"

    GUEST_SESSIONS ||--o{ BOOKMARKS : "temporarily owns"
    GUEST_SESSIONS ||--o{ COLLECTIONS : "temporarily owns"
    GUEST_SESSIONS ||--o{ TAGS : "temporarily owns"

    TECHNOLOGIES ||--o{ BOOKMARKS : "categorizes"

    BOOKMARKS ||--o{ BOOKMARK_TAGS : "tagged with"
    TAGS ||--o{ BOOKMARK_TAGS : "assigned to"

    COLLECTIONS ||--o{ COLLECTION_BOOKMARKS : "includes"
    BOOKMARKS ||--o{ COLLECTION_BOOKMARKS : "grouped in"

    USERS {
        uuid id PK
        string name
        string username
        string password_hash
        string email UK
        timestamp email_verified
        string image
        timestamp created_at
    }

    GUEST_SESSIONS {
        uuid id PK
        string token_hash UK
        timestamp created_at
        timestamp last_seen_at
        timestamp expires_at
    }

    TECHNOLOGIES {
        uuid id PK
        string name
        string slug UK
        string icon_slug
        string brand_color
        string category
    }

    BOOKMARKS {
        uuid id PK
        uuid user_id FK "nullable"
        uuid guest_id FK "nullable"
        uuid technology_id FK
        string title
        string url
        text description
        string category
        boolean is_favorite
        timestamp created_at
        timestamp updated_at
    }

    COLLECTIONS {
        uuid id PK
        uuid user_id FK "nullable"
        uuid guest_id FK "nullable"
        string name
        timestamp created_at
    }

    TAGS {
        uuid id PK
        uuid user_id FK "nullable"
        uuid guest_id FK "nullable"
        string name
    }

    BOOKMARK_TAGS {
        uuid bookmark_id PK,FK
        uuid tag_id PK,FK
    }

    COLLECTION_BOOKMARKS {
        uuid collection_id PK,FK
        uuid bookmark_id PK,FK
    }
```

> **Ownership Integrity Constraint:** Bookmarks, collections, and tags enforce a dual-ownership check: `((user_id IS NOT NULL) <> (guest_id IS NOT NULL))`. A resource is guaranteed to belong to either a registered user OR an active guest session, never both and never orphaned.

---

## ⚡ Quickstart (Local Development)

Follow these steps to run DevStash on your local machine:

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** (comes with Node.js)
- A free **Neon PostgreSQL** database ([neon.tech](https://neon.tech))
- (Optional) **Google Cloud Console** OAuth 2.0 credentials

### 2. Clone and Install

```bash
git clone https://github.com/your-username/devstash.git
cd devstash
npm install
```

### 3. Configure Environment Variables

Copy the example configuration to `.env.local`:

```bash
# On Windows PowerShell
copy .env.example .env.local

# On macOS / Linux
cp .env.example .env.local
```

Open `.env.local` and add your database and authentication details:

```env
DATABASE_URL=postgresql://user:password@ep-xyz-pooler.neon.tech/neondb?sslmode=require
AUTH_SECRET=run-npx-auth-secret-to-generate
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (Optional for local guest mode, required for Google login)
AUTH_GOOGLE_ID=your-google-oauth-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret
OWNER_GOOGLE_EMAIL=your-email@gmail.com
```

> 💡 **Tip:** Generate a secure `AUTH_SECRET` by running:
> ```bash
> npx auth secret
> ```

### 4. Initialize Database Schema & Seed Technologies

Run the included automated database setup script to create all tables, indexes, constraints, and seed 20 default technologies:

```bash
node scripts/setup-db.mjs
```

You should see:
```text
Database ready: 20 technologies seeded.
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can click **"Explore as guest"** on `/login` to test the full dashboard immediately without Google OAuth.

---

## 🐘 Connecting to Neon PostgreSQL

DevStash uses `@neondatabase/serverless` and `drizzle-orm/neon-http`, optimized for serverless environments.

You can connect to Neon in one of two ways:

### Method A: Standalone Neon Account (Direct)

1. Sign up for a free account at [neon.tech](https://neon.tech).
2. Click **Create Project**, name it (e.g., `devstash`), and choose the region closest to your Vercel deployment (e.g., `us-east-1` or `eu-central-1`).
3. On the Neon Dashboard, copy your connection string from the **Connection Details** widget.
   - Make sure **Pooled connection** is checked (recommended for serverless).
   - The connection string will look like:
     ```text
     postgresql://alex:AbC123xYz@ep-silent-wave-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
4. Paste this URL into `DATABASE_URL` in your `.env.local` file.
5. Initialize the database:
   ```bash
   node scripts/setup-db.mjs
   ```

### Method B: Via Vercel Storage Marketplace

If deploying on Vercel, you can provision Neon directly from the Vercel dashboard:

1. In your project on [vercel.com](https://vercel.com), navigate to the **Storage** tab.
2. Click **Create Database** and choose **Neon Postgres**.
3. Accept the terms, choose a database name, select your region, and click **Create**.
4. Vercel automatically creates and links the database, populating `DATABASE_URL` and `POSTGRES_URL` in your project's Environment Variables.
5. Pull the credentials down to your local machine:
   ```bash
   npx vercel env pull .env.local
   ```
6. Run the setup script to apply the schema:
   ```bash
   node scripts/setup-db.mjs
   ```

---

## 🚀 Deploying to Vercel

Deploying DevStash to Vercel takes only a few minutes.

### Step 1: Push Code to GitHub

Ensure all your latest changes are pushed to your GitHub repository:

```bash
git add .
git commit -m "feat: ready for vercel deployment"
git push origin main
```

### Step 2: Import Project into Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your `devstash` GitHub repository and click **Import**.
4. Framework preset: **Next.js** (detected automatically).
5. Leave Build & Output settings at their defaults.

### Step 3: Configure Environment Variables

Before clicking Deploy, expand the **Environment Variables** section and add the following:

| Variable | Value / Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL pooled connection string | `postgresql://user:pass@ep-xyz-pooler.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | 32+ character random secret string | `npx auth secret` or random base64 string |
| `AUTH_URL` | Your live Vercel production URL | `https://devstash-yourname.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Your live Vercel production URL | `https://devstash-yourname.vercel.app` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxxxxxxxxxxxxx` |
| `OWNER_GOOGLE_EMAIL` | *(Optional)* Restrict Google login to your email | `you@gmail.com` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support contact email for public footer | `support@example.com` |

> ⚠️ **Important:** Do not add quotes around environment variable values in the Vercel dashboard.

### Step 4: Initialize the Production Database

Before logging in, make sure your production Neon database has all required tables and technologies seeded. You can run the setup script against your production database from your local machine:

```bash
# Temporarily target the production database
DATABASE_URL="your_production_neon_database_url" node scripts/setup-db.mjs
```

### Step 5: Configure Google OAuth for Production

In your Google Cloud Console (see [Google OAuth Setup](#-google-oauth-setup)):
- Add `https://your-project.vercel.app` to **Authorized JavaScript origins**.
- Add `https://your-project.vercel.app/api/auth/callback/google` to **Authorized redirect URIs**.

### Step 6: Deploy & Verify

1. Click **Deploy** in Vercel.
2. Once the build finishes, open your live deployment URL.
3. Verify the core features:
   - Browse the landing page at `/`.
   - Test **Explore as guest** on `/login` to confirm database connectivity.
   - Test **Sign in with Google** to confirm OAuth callback.
   - Create a bookmark, assign it to a collection, toggle favorite, and test theme switcher.

---

## 🔑 Google OAuth Setup

To enable Google Sign-In with Auth.js:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** → **OAuth consent screen**:
   - Choose **External** user type and click **Create**.
   - Fill in **App name** (*DevStash*), **User support email**, and **Developer contact email**.
   - Under **Scopes**, ensure `.../auth/userinfo.email` and `.../auth/userinfo.profile` are included.
   - If in *Testing* status, add your Google account to **Test users**.
4. Navigate to **APIs & Services** → **Credentials**:
   - Click **Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `DevStash Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local development)
     - `https://your-app.vercel.app` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-app.vercel.app/api/auth/callback/google`
5. Click **Create** and copy your **Client ID** and **Client Secret**.
6. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in your environment variables.

---

## 🔐 Environment Variables

Reference list of environment variables used across DevStash:

```env
# -----------------------------------------------------------------------------
# DATABASE (Neon PostgreSQL)
# -----------------------------------------------------------------------------
DATABASE_URL="postgresql://user:password@ep-name-pooler.neon.tech/neondb?sslmode=require"

# -----------------------------------------------------------------------------
# AUTHENTICATION (Auth.js / NextAuth v5)
# -----------------------------------------------------------------------------
# Random string for encryption (generate via: npx auth secret)
AUTH_SECRET="generate-with-npx-auth-secret"

# Canonical base URL of the application
AUTH_URL="http://localhost:3000"

# Public URL exposed to client components
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google Cloud OAuth 2.0 Credentials
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-your-google-client-secret"

# (Optional) Lock Google sign-in exclusively to your portfolio email.
# If set, any other Google user will be denied sign-in.
OWNER_GOOGLE_EMAIL="your-email@example.com"

# -----------------------------------------------------------------------------
# SUPPORT / METADATA
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SUPPORT_EMAIL="support@example.com"
```

---

## 📡 REST API Reference

All bookmark, collection, tag, and account endpoints require an active session (authenticated user or valid guest cookie).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/bookmarks` | List bookmarks with optional search (`?search=`), category (`?category=`), tech (`?tech=`), and favorite filter |
| `POST` | `/api/bookmarks` | Create a new bookmark (validates title, URL, techId, category, tags) |
| `GET` | `/api/bookmarks/:id` | Fetch details of a single bookmark |
| `PATCH` | `/api/bookmarks/:id` | Update bookmark fields (title, url, description, favorite, tags, etc.) |
| `DELETE` | `/api/bookmarks/:id` | Delete a bookmark (with ownership verification) |
| `GET` | `/api/collections` | List all collections belonging to current actor |
| `POST` | `/api/collections` | Create a new collection |
| `GET` | `/api/collections/:id` | Fetch collection details and member bookmarks |
| `PATCH` | `/api/collections/:id` | Rename a collection |
| `DELETE` | `/api/collections/:id` | Delete a collection (unlinks member bookmarks without deleting them) |
| `POST` | `/api/collections/:id/bookmarks` | Add a bookmark into a collection |
| `DELETE` | `/api/collections/:id/bookmarks/:bookmarkId` | Remove a bookmark from a collection |
| `GET` | `/api/tags` | List all tags created by current actor |
| `POST` | `/api/tags` | Create a new tag (enforces case-insensitive uniqueness) |
| `DELETE` | `/api/tags/:id` | Delete a tag and remove it from all associated bookmarks |
| `GET` | `/api/technologies` | Get list of all supported technologies with brand slugs and colors |
| `POST` | `/api/guest` | Initialize a new guest session cookie |
| `DELETE` | `/api/guest` | Clear guest session and remove guest data |
| `POST` | `/api/register` | Register a new credentials-based user account |
| `DELETE` | `/api/account` | Permanently delete the user account and cascade delete all data |

---

## 🧪 Testing

DevStash includes automated testing suites for both unit validation and end-to-end browser journeys.

### Unit Tests (Vitest)

Unit tests verify business logic, Zod schema validations, and helper utilities:

```bash
npm run test:unit
```

### End-to-End Tests (Playwright)

Playwright tests verify the critical user flows using a private guest workspace without requiring external OAuth provider mocks:
- Guest workspace creation and dashboard access
- Creating, renaming, and deleting collections
- Creating, filtering, and deleting bookmarks
- Starring and unstarring favorites with persistence across page navigations

To run the full E2E suite:

```bash
# 1. Install browsers on first run
npx playwright install chromium

# 2. Run test suite (starts local dev server automatically)
npm run test:e2e
```

Interactive debugging modes:

```bash
# Run with visible browser window
npx playwright test --headed

# Run with interactive Playwright Inspector
npx playwright test --debug

# View the generated HTML test report
npx playwright show-report
```

---

## 📁 Project Structure

```text
devstash/
├── app/                          # Next.js 16 App Router
│   ├── (auth)/login/             # Sign-in page (Google, Credentials, Guest)
│   ├── account-deletion/         # Account deletion disclosure page
│   ├── api/                      # REST API Route Handlers
│   │   ├── account/              # Account deletion endpoint
│   │   ├── auth/[...nextauth]/   # Auth.js handler routes
│   │   ├── bookmarks/            # Bookmark CRUD endpoints
│   │   ├── collections/          # Collection management & membership
│   │   ├── guest/                # Anonymous guest session endpoints
│   │   ├── register/             # Credentials registration
│   │   ├── tags/                 # Tag CRUD endpoints
│   │   └── technologies/         # Technology registry endpoint
│   ├── dashboard/                # Protected user & guest dashboard
│   │   ├── bookmarks/            # Resource library view
│   │   ├── collections/          # Collections & collection detail
│   │   ├── favorites/            # Starred bookmarks view
│   │   ├── settings/             # User settings & session management
│   │   └── page.tsx              # Dashboard metrics & recent items
│   ├── privacy/                  # Privacy policy page
│   ├── terms/                    # Terms of service page
│   ├── globals.css               # Global Tailwind CSS v4 styling
│   ├── layout.tsx                # Root layout with ThemeProvider
│   └── page.tsx                  # Marketing landing page
├── components/                   # Modular React UI components
│   ├── accessible-dialog.tsx     # Accessible modal dialog primitive
│   ├── bookmark-card.tsx         # Interactive bookmark card & actions
│   ├── collection-detail.tsx     # Collection view & bookmark organizer
│   ├── credentials-auth.tsx      # Username/password form component
│   ├── dashboard-shell.tsx       # Sidebar, mobile navigation, & header
│   ├── favorites-client.tsx      # Favorites page client controller
│   ├── legal-page.tsx            # Legal document template component
│   ├── logo.tsx                  # Brand logo component
│   ├── page-heading.tsx          # Consistent page header with action buttons
│   ├── public-footer.tsx         # Marketing footer
│   ├── settings-client.tsx       # Profile, credentials, & theme controls
│   ├── technology-icon.tsx       # SVG icon renderer for technology brands
│   ├── theme-provider.tsx        # Next-themes dark/light mode provider
│   └── user-avatar.tsx           # User profile picture & initials fallback
├── lib/                          # Core business logic & database
│   ├── auth/
│   │   ├── actor.ts              # Resolves user or guest identity from cookies
│   │   ├── ownership.ts          # Ownership verification helpers
│   │   └── password.ts           # Secure password hashing (bcrypt-compatible)
│   ├── db/
│   │   ├── index.ts              # Neon HTTP Drizzle client initialization
│   │   └── schema.ts             # Relational Drizzle database schema & constraints
│   ├── demo-data.ts              # Sample bookmarks for preview
│   └── validations/              # Zod validation schemas
│       ├── auth.ts               # Credentials & register schemas
│       ├── bookmark.ts           # Bookmark create/update schemas
│       └── organization.ts       # Collection & tag schemas
├── scripts/                      # Utility and setup scripts
│   └── setup-db.mjs              # Neon database initialization & technology seeding
├── tests/                        # Test suites
│   ├── e2e/                      # Playwright E2E browser tests
│   └── unit/                     # Vitest unit tests
├── .env.example                  # Template for required environment variables
├── auth.ts                       # Auth.js (NextAuth v5) core configuration
├── drizzle.config.ts             # Drizzle Kit configuration
├── next.config.ts                # Next.js compiler & experimental configuration
├── package.json                  # Dependencies & npm scripts
├── playwright.config.ts          # Playwright test runner configuration
├── tsconfig.json                 # TypeScript strict configuration
└── vitest.config.ts              # Vitest test runner configuration
```

---

## ❓ Troubleshooting & FAQ

### 1. `redirect_uri_mismatch` error during Google Sign-In
- **Cause:** The URL in Google Cloud Console does not match your current host or path.
- **Fix:** In Google Cloud Console → Credentials → Authorized redirect URIs:
  - For local: `http://localhost:3000/api/auth/callback/google`
  - For Vercel: `https://your-project.vercel.app/api/auth/callback/google`
  - Ensure protocol (`http://` vs `https://`) and spelling are exact. Avoid trailing slashes.

### 2. "Database query error" or "relation does not exist"
- **Cause:** Database tables have not yet been created in Neon.
- **Fix:** Run the setup script:
  ```bash
  node scripts/setup-db.mjs
  ```
  Ensure `DATABASE_URL` in your `.env.local` or environment contains `?sslmode=require`.

### 3. Technologies dropdown is empty in the bookmark modal
- **Cause:** The `technologies` table exists but has not been seeded with rows.
- **Fix:** Run `node scripts/setup-db.mjs`. It safely upserts 20 core technologies (`React`, `Next.js`, `TypeScript`, etc.) into the database.

### 4. How do I restrict the application to my personal account?
- Set `OWNER_GOOGLE_EMAIL="your-google-account@gmail.com"` in your environment variables.
- Anyone trying to sign in with a different Google account will be rejected automatically.
- Other visitors or recruiters can still explore the app safely via **"Explore as guest"**.

### 5. Can guests convert their data into a permanent account?
- **Yes!** When a guest visits `/login` and signs in with Google or creates a credentials account, DevStash detects their guest session token and automatically moves all their bookmarks, collections, and tags to their registered user record.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
