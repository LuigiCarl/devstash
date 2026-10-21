import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/).filter(Boolean).filter(line => !line.trim().startsWith("#")).map(line => {
  const index = line.indexOf("=");
  return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['\"]|['\"]$/g, "")];
}));
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
const sql = neon(env.DATABASE_URL);

await sql.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
await sql.query(`CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, email text NOT NULL UNIQUE, email_verified timestamp, image text, created_at timestamp NOT NULL DEFAULT now())`);
await sql.query(`CREATE TABLE IF NOT EXISTS accounts (user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, type text NOT NULL, provider text NOT NULL, provider_account_id text NOT NULL, refresh_token text, access_token text, expires_at integer, token_type text, scope text, id_token text, session_state text, PRIMARY KEY(provider, provider_account_id))`);
await sql.query(`CREATE TABLE IF NOT EXISTS sessions (session_token text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires timestamp NOT NULL)`);
await sql.query(`CREATE TABLE IF NOT EXISTS verification_tokens (identifier text NOT NULL, token text NOT NULL, expires timestamp NOT NULL, PRIMARY KEY(identifier, token))`);
await sql.query(`CREATE TABLE IF NOT EXISTS guest_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), token_hash text NOT NULL UNIQUE, created_at timestamp NOT NULL DEFAULT now(), last_seen_at timestamp NOT NULL DEFAULT now(), expires_at timestamp NOT NULL)`);
await sql.query(`CREATE INDEX IF NOT EXISTS guest_sessions_expires_idx ON guest_sessions(expires_at)`);
await sql.query(`CREATE TABLE IF NOT EXISTS technologies (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, icon_slug text NOT NULL, brand_color text NOT NULL, category text NOT NULL)`);
await sql.query(`CREATE TABLE IF NOT EXISTS bookmarks (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, technology_id uuid REFERENCES technologies(id) ON DELETE SET NULL, title text NOT NULL, url text NOT NULL, description text, category text NOT NULL, is_favorite boolean NOT NULL DEFAULT false, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now())`);
await sql.query(`CREATE INDEX IF NOT EXISTS bookmarks_user_idx ON bookmarks(user_id)`);
await sql.query(`CREATE INDEX IF NOT EXISTS bookmarks_user_created_idx ON bookmarks(user_id, created_at)`);
await sql.query(`CREATE TABLE IF NOT EXISTS collections (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, name text NOT NULL, created_at timestamp NOT NULL DEFAULT now())`);
await sql.query(`CREATE INDEX IF NOT EXISTS collections_user_idx ON collections(user_id)`);
await sql.query(`CREATE TABLE IF NOT EXISTS tags (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, name text NOT NULL, UNIQUE(user_id, name))`);
await sql.query(`CREATE TABLE IF NOT EXISTS bookmark_tags (bookmark_id uuid NOT NULL REFERENCES bookmarks(id) ON DELETE CASCADE, tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE, PRIMARY KEY(bookmark_id, tag_id))`);
await sql.query(`CREATE TABLE IF NOT EXISTS collection_bookmarks (collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE, bookmark_id uuid NOT NULL REFERENCES bookmarks(id) ON DELETE CASCADE, PRIMARY KEY(collection_id, bookmark_id))`);
await sql.query(`ALTER TABLE bookmarks ALTER COLUMN user_id DROP NOT NULL`);
await sql.query(`ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS guest_id uuid REFERENCES guest_sessions(id) ON DELETE CASCADE`);
await sql.query(`CREATE INDEX IF NOT EXISTS bookmarks_guest_idx ON bookmarks(guest_id)`);
await sql.query(`ALTER TABLE collections ALTER COLUMN user_id DROP NOT NULL`);
await sql.query(`ALTER TABLE collections ADD COLUMN IF NOT EXISTS guest_id uuid REFERENCES guest_sessions(id) ON DELETE CASCADE`);
await sql.query(`CREATE INDEX IF NOT EXISTS collections_guest_idx ON collections(guest_id)`);
await sql.query(`ALTER TABLE tags ALTER COLUMN user_id DROP NOT NULL`);
await sql.query(`ALTER TABLE tags ADD COLUMN IF NOT EXISTS guest_id uuid REFERENCES guest_sessions(id) ON DELETE CASCADE`);
await sql.query(`CREATE INDEX IF NOT EXISTS tags_guest_idx ON tags(guest_id)`);
await sql.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='bookmarks_one_owner') THEN ALTER TABLE bookmarks ADD CONSTRAINT bookmarks_one_owner CHECK ((user_id IS NOT NULL) <> (guest_id IS NOT NULL)); END IF; END $$`);
await sql.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='collections_one_owner') THEN ALTER TABLE collections ADD CONSTRAINT collections_one_owner CHECK ((user_id IS NOT NULL) <> (guest_id IS NOT NULL)); END IF; END $$`);
await sql.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='tags_one_owner') THEN ALTER TABLE tags ADD CONSTRAINT tags_one_owner CHECK ((user_id IS NOT NULL) <> (guest_id IS NOT NULL)); END IF; END $$`);

const technologies = [
  ["React","react","react","61DAFB","Frontend"],["Next.js","nextjs","nextdotjs","000000","Frontend"],["Vue","vue","vuedotjs","4FC08D","Frontend"],["Angular","angular","angular","DD0031","Frontend"],["Svelte","svelte","svelte","FF3E00","Frontend"],["JavaScript","javascript","javascript","F7DF1E","Language"],["TypeScript","typescript","typescript","3178C6","Language"],["Tailwind CSS","tailwind-css","tailwindcss","06B6D4","Frontend"],["Node.js","nodejs","nodedotjs","5FA04E","Backend"],["Python","python","python","3776AB","Backend"],["PostgreSQL","postgresql","postgresql","4169E1","Database"],["MySQL","mysql","mysql","4479A1","Database"],["MongoDB","mongodb","mongodb","47A248","Database"],["Redis","redis","redis","FF4438","Database"],["Git","git","git","F05032","Tool"],["GitHub","github","github","181717","Platform"],["Docker","docker","docker","2496ED","Tool"],["Vercel","vercel","vercel","000000","Platform"],["AWS","aws","amazonwebservices","232F3E","Platform"],["Figma","figma","figma","F24E1E","Design"]
];
for (const [name,slug,icon,color,category] of technologies) await sql.query(`INSERT INTO technologies(name,slug,icon_slug,brand_color,category) VALUES($1,$2,$3,$4,$5) ON CONFLICT(slug) DO UPDATE SET name=excluded.name,icon_slug=excluded.icon_slug,brand_color=excluded.brand_color,category=excluded.category`,[name,slug,icon,color,category]);
console.log(`Database ready: ${technologies.length} technologies seeded.`);
