import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registrationSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  }

  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Use 3–30 letters, numbers, or underscores and a password of at least 8 characters." }, { status: 400 });
  }

  const { username, password, name } = parsed.data;
  try {
    const [existing] = await db.select({ id: users.id }).from(users).where(sql`lower(${users.username}) = ${username}`).limit(1);
    if (existing) return Response.json({ error: "Username is already taken." }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const [created] = await db.insert(users).values({
      username,
      passwordHash,
      name: name ?? username,
      email: `${randomUUID()}@local.devstash.invalid`,
    }).onConflictDoNothing().returning({ id: users.id });

    if (!created) return Response.json({ error: "Username is already taken." }, { status: 409 });
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Account registration failed", error);
    return Response.json({ error: "Could not create your account right now. Please try again." }, { status: 500 });
  }
}
