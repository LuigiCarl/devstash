import { auth } from "@/auth";
import { db } from "@/lib/db";
import { bookmarks, collections, guestSessions, tags } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export const GUEST_COOKIE = "devstash_guest";
export type Actor = {kind:"user";id:string;name:string|null;email:string|null;image:string|null}|{kind:"guest";id:string;name:"Guest";email:null;image:null};
export const hashGuestToken=(token:string)=>createHash("sha256").update(token).digest("hex");

export async function getActor():Promise<Actor|null>{
  const session=await auth();
  const cookieStore=await cookies();
  const token=cookieStore.get(GUEST_COOKIE)?.value;
  if(session?.user?.id){
    if(token){const[guest]=await db.select({id:guestSessions.id}).from(guestSessions).where(eq(guestSessions.tokenHash,hashGuestToken(token))).limit(1);if(guest){await db.update(bookmarks).set({userId:session.user.id,guestId:null}).where(eq(bookmarks.guestId,guest.id));await db.update(collections).set({userId:session.user.id,guestId:null}).where(eq(collections.guestId,guest.id));await db.update(tags).set({userId:session.user.id,guestId:null}).where(eq(tags.guestId,guest.id));await db.delete(guestSessions).where(eq(guestSessions.id,guest.id));}}
    return{kind:"user",id:session.user.id,name:session.user.name??null,email:session.user.email??null,image:session.user.image??null};
  }
  if(!token)return null;
  const [guest]=await db.select({id:guestSessions.id}).from(guestSessions).where(and(eq(guestSessions.tokenHash,hashGuestToken(token)),gt(guestSessions.expiresAt,new Date()))).limit(1);
  return guest?{kind:"guest",id:guest.id,name:"Guest",email:null,image:null}:null;
}
