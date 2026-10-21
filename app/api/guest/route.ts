import { db } from "@/lib/db";
import { guestSessions } from "@/lib/db/schema";
import { GUEST_COOKIE, hashGuestToken } from "@/lib/auth/actor";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request:Request){
  const token=randomBytes(32).toString("base64url");
  const expires=new Date(Date.now()+7*24*60*60*1000);
  await db.insert(guestSessions).values({tokenHash:hashGuestToken(token),expiresAt:expires});
  (await cookies()).set(GUEST_COOKIE,token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",expires});
  return NextResponse.redirect(new URL("/dashboard",request.url),303);
}

export async function DELETE(){
  const cookieStore=await cookies();
  const token=cookieStore.get(GUEST_COOKIE)?.value;
  if(token)await db.delete(guestSessions).where(eq(guestSessions.tokenHash,hashGuestToken(token)));
  cookieStore.delete(GUEST_COOKIE);
  return Response.json({ok:true});
}
