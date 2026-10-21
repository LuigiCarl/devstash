import { notFound } from "next/navigation";
import { getActor } from "@/lib/auth/actor";
import { bookmarkOwner, collectionOwner } from "@/lib/auth/ownership";
import { db } from "@/lib/db";
import { bookmarks, collectionBookmarks, collections, technologies } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { PageHeading } from "@/components/page-heading";
import { CollectionDetail } from "@/components/collection-detail";
import { Suspense } from "react";
import { connection } from "next/server";

const fields = { id: bookmarks.id, title: bookmarks.title, url: bookmarks.url, description: bookmarks.description, category: bookmarks.category, isFavorite: bookmarks.isFavorite, createdAt: bookmarks.createdAt, technologyName: technologies.name, technologySlug: technologies.slug, brandColor: technologies.brandColor };

async function CollectionContent({ params }: { params: PageProps<"/dashboard/collections/[id]">["params"] }) {
  await connection();
  const actor = await getActor();
  if (!actor) return null;
  const { id } = await params;
  const [collection] = await db.select({ id: collections.id, name: collections.name }).from(collections).where(and(eq(collections.id, id), collectionOwner(actor))).limit(1);
  if (!collection) notFound();
  const [selected, available] = await Promise.all([
    db.select(fields).from(collectionBookmarks).innerJoin(bookmarks, eq(collectionBookmarks.bookmarkId, bookmarks.id)).leftJoin(technologies, eq(bookmarks.technologyId, technologies.id)).where(and(eq(collectionBookmarks.collectionId, id), bookmarkOwner(actor))).orderBy(desc(bookmarks.createdAt)),
    db.select(fields).from(bookmarks).leftJoin(technologies, eq(bookmarks.technologyId, technologies.id)).where(bookmarkOwner(actor)).orderBy(desc(bookmarks.createdAt)),
  ]);
  return <><PageHeading title={collection.name} description={`${selected.length} resources in this collection.`} /><CollectionDetail collectionId={id} initial={selected} available={available} /></>;
}

function CollectionSkeleton() {
  return <div className="space-y-5"><div className="h-16 animate-pulse rounded-2xl bg-[var(--panel)]" /><div className="h-64 animate-pulse rounded-2xl bg-[var(--panel)]" /></div>;
}

export default function CollectionPage({ params }: PageProps<"/dashboard/collections/[id]">) {
  return <Suspense fallback={<CollectionSkeleton />}><CollectionContent params={params} /></Suspense>;
}
