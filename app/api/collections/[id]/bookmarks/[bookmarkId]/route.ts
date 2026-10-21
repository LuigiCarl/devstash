import { getActor } from "@/lib/auth/actor";
import { collectionOwner } from "@/lib/auth/ownership";
import { db } from "@/lib/db";
import { collectionBookmarks, collections } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(_:Request,{params}:RouteContext<"/api/collections/[id]/bookmarks/[bookmarkId]">){
  const actor=await getActor();if(!actor)return Response.json({error:"Unauthorized"},{status:401});
  const{id,bookmarkId}=await params;const[collection]=await db.select({id:collections.id}).from(collections).where(and(eq(collections.id,id),collectionOwner(actor))).limit(1);
  if(!collection)return Response.json({error:"Not found"},{status:404});
  await db.delete(collectionBookmarks).where(and(eq(collectionBookmarks.collectionId,id),eq(collectionBookmarks.bookmarkId,bookmarkId)));
  return Response.json({ok:true});
}
