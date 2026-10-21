import { getActor } from "@/lib/auth/actor";
import { bookmarkOwner, collectionOwner } from "@/lib/auth/ownership";
import { db } from "@/lib/db";
import { bookmarks, collectionBookmarks, collections } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(request:Request,{params}:RouteContext<"/api/collections/[id]/bookmarks">){
  const actor=await getActor(); if(!actor)return Response.json({error:"Unauthorized"},{status:401});
  const{id}=await params; const parsed=z.object({bookmarkId:z.uuid()}).safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return Response.json({error:"Invalid bookmark"},{status:400});
  const[[collection],[bookmark]]=await Promise.all([db.select({id:collections.id}).from(collections).where(and(eq(collections.id,id),collectionOwner(actor))).limit(1),db.select({id:bookmarks.id}).from(bookmarks).where(and(eq(bookmarks.id,parsed.data.bookmarkId),bookmarkOwner(actor))).limit(1)]);
  if(!collection||!bookmark)return Response.json({error:"Not found"},{status:404});
  await db.insert(collectionBookmarks).values({collectionId:id,bookmarkId:bookmark.id}).onConflictDoNothing();
  return Response.json({ok:true},{status:201});
}
