import Link from "next/link";
import { ArrowUpRight, Bookmark, Folder, Heart } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { BookmarkCard } from "@/components/bookmark-card";
import { PageHeading } from "@/components/page-heading";
import { getActor } from "@/lib/auth/actor";
import { bookmarkOwner, collectionOwner } from "@/lib/auth/ownership";
import { db } from "@/lib/db";
import { bookmarks, collections, technologies } from "@/lib/db/schema";
import { and, count, desc, eq } from "drizzle-orm";

async function DashboardContent() {
  await connection();
  const actor = await getActor();
  if (!actor) return null;

  const [[all], [favorites], [collectionCount], recent] = await Promise.all([
    db.select({ value: count() }).from(bookmarks).where(bookmarkOwner(actor)),
    db.select({ value: count() }).from(bookmarks).where(and(bookmarkOwner(actor), eq(bookmarks.isFavorite, true))),
    db.select({ value: count() }).from(collections).where(collectionOwner(actor)),
    db.select({ id: bookmarks.id, title: bookmarks.title, url: bookmarks.url, description: bookmarks.description, category: bookmarks.category, isFavorite: bookmarks.isFavorite, createdAt: bookmarks.createdAt, technologyName: technologies.name, technologySlug: technologies.slug, brandColor: technologies.brandColor }).from(bookmarks).leftJoin(technologies, eq(bookmarks.technologyId, technologies.id)).where(bookmarkOwner(actor)).orderBy(desc(bookmarks.createdAt)).limit(3),
  ]);
  const stats = [
    { label: "Total bookmarks", value: all.value, icon: Bookmark, color: "text-indigo-500 bg-indigo-500/10" },
    { label: "Favorites", value: favorites.value, icon: Heart, color: "text-rose-500 bg-rose-500/10" },
    { label: "Collections", value: collectionCount.value, icon: Folder, color: "text-amber-500 bg-amber-500/10" },
  ];

  return <>
    <PageHeading eyebrow="Workspace" title={`Welcome, ${actor.name ?? "Developer"}`} description="Here’s what’s happening in your developer library." />
    <section className="grid gap-4 sm:grid-cols-3">{stats.map(({ label, value, icon: Icon, color }) => <article className="panel rounded-2xl p-5" key={label}><div className="flex items-start justify-between"><div><p className="muted text-sm">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p></div><span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon size={19} /></span></div></article>)}</section>
    <section className="mt-9"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Recently added</h2><p className="muted mt-1 text-sm">Your latest saved resources</p></div><Link href="/dashboard/bookmarks" className="flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">View all <ArrowUpRight size={15} /></Link></div>{recent.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{recent.map(item => <BookmarkCard key={item.id} item={item} />)}</div> : <div className="panel grid min-h-52 place-items-center rounded-2xl p-6 text-center"><div><p className="font-semibold">Your stash is empty</p><Link href="/dashboard/bookmarks?new=true" className="mt-2 inline-block text-sm font-semibold text-[var(--accent)]">Add your first bookmark</Link></div></div>}</section>
  </>;
}

function DashboardSkeleton() {
  return <div className="space-y-7"><div className="h-20 animate-pulse rounded-2xl bg-[var(--panel)]" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map(item => <div key={item} className="h-32 animate-pulse rounded-2xl bg-[var(--panel)]" />)}</div><div className="h-64 animate-pulse rounded-2xl bg-[var(--panel)]" /></div>;
}

export default function Dashboard() {
  return <Suspense fallback={<DashboardSkeleton />}><DashboardContent /></Suspense>;
}
