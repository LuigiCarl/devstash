import type { Actor } from "./actor";
import { bookmarks, collections, tags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export function bookmarkOwner(actor:Actor){return actor.kind==="user"?eq(bookmarks.userId,actor.id):eq(bookmarks.guestId,actor.id)}
export function collectionOwner(actor:Actor){return actor.kind==="user"?eq(collections.userId,actor.id):eq(collections.guestId,actor.id)}
export function tagOwner(actor:Actor){return actor.kind==="user"?eq(tags.userId,actor.id):eq(tags.guestId,actor.id)}
export function ownerValues(actor:Actor){return actor.kind==="user"?{userId:actor.id,guestId:null}:{userId:null,guestId:actor.id}}
