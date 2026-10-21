import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { credentialsSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      credentials: { username: {}, password: { type: "password" } },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const [user] = await db.select({ id: users.id, name: users.name, username: users.username, passwordHash: users.passwordHash }).from(users).where(and(sql`lower(${users.username}) = ${parsed.data.username}`, sql`${users.passwordHash} IS NOT NULL`)).limit(1);
        if (!user?.passwordHash || !await verifyPassword(parsed.data.password, user.passwordHash)) return null;
        return { id: user.id, name: user.name ?? user.username, email: null, image: null };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== "google") return true;
      const ownerEmail = process.env.OWNER_GOOGLE_EMAIL?.trim().toLowerCase();
      return Boolean(ownerEmail && user.email?.toLowerCase() === ownerEmail);
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-devstash.session-token.v2" : "devstash.session-token.v2",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },
  pages: { signIn: "/login", error: "/login" },
  trustHost: true,
});
