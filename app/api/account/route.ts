import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });

  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const deleted = await db.delete(users).where(eq(users.id, session.user.id)).returning({ id: users.id });
  if (!deleted.length) return Response.json({ error: "Account not found" }, { status: 404 });
  return Response.json({ success: true });
}
