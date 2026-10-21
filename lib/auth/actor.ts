import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { bookmarks, collections, guestSessions, tags, users } from "@/lib/db/schema";

export const GUEST_COOKIE = "devstash_guest";
export type Actor = { kind: "user"; id: string; name: string | null; email: string | null; image: string | null } | { kind: "guest"; id: string; name: "Guest"; email: null; image: null };
export const hashGuestToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function getActor(): Promise<Actor | null> {
  const session = await auth();
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE)?.value;

  if (session?.user?.id) {
    const [user] = await db.select({ id: users.id, name: users.name, username: users.username, email: users.email, image: users.image }).from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user) return null;

    if (token) {
      const [guest] = await db.select({ id: guestSessions.id }).from(guestSessions).where(eq(guestSessions.tokenHash, hashGuestToken(token))).limit(1);
      if (guest) {
        await db.update(bookmarks).set({ userId: user.id, guestId: null }).where(eq(bookmarks.guestId, guest.id));
        await db.update(collections).set({ userId: user.id, guestId: null }).where(eq(collections.guestId, guest.id));
        await db.update(tags).set({ userId: user.id, guestId: null }).where(eq(tags.guestId, guest.id));
        await db.delete(guestSessions).where(eq(guestSessions.id, guest.id));
      }
    }

    return { kind: "user", id: user.id, name: user.name ?? user.username, email: user.username ? null : user.email, image: user.image };
  }

  if (!token) return null;
  const [guest] = await db.select({ id: guestSessions.id }).from(guestSessions).where(and(eq(guestSessions.tokenHash, hashGuestToken(token)), gt(guestSessions.expiresAt, new Date()))).limit(1);
  return guest ? { kind: "guest", id: guest.id, name: "Guest", email: null, image: null } : null;
}
