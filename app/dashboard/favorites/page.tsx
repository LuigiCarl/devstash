import { PageHeading } from "@/components/page-heading";
import { FavoritesClient } from "@/components/favorites-client";
import { getActor } from "@/lib/auth/actor";
import { bookmarkOwner } from "@/lib/auth/ownership";
import { db } from "@/lib/db";
import { bookmarks, technologies } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Suspense } from "react";

async function FavoritesContent() {
  const actor = await getActor();
  if (!actor) return null;
  const items = await db.select({ id: bookmarks.id, title: bookmarks.title, url: bookmarks.url, description: bookmarks.description, category: bookmarks.category, isFavorite: bookmarks.isFavorite, createdAt: bookmarks.createdAt, technologyId: bookmarks.technologyId, technologyName: technologies.name, technologySlug: technologies.slug, brandColor: technologies.brandColor }).from(bookmarks).leftJoin(technologies, eq(bookmarks.technologyId, technologies.id)).where(and(bookmarkOwner(actor), eq(bookmarks.isFavorite, true))).orderBy(desc(bookmarks.createdAt));
  return <><PageHeading title="Favorites" description="The resources you reach for most often." /><FavoritesClient initial={items} /></>;
}

export default function Favorites() {
  return <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-[var(--panel)]" />}><FavoritesContent /></Suspense>;
}
