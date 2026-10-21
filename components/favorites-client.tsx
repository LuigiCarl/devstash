"use client";

import { useState } from "react";
import { AccessibleDialog } from "@/components/accessible-dialog";
import { BookmarkCard, type BookmarkItem } from "@/components/bookmark-card";
import { toast } from "sonner";

export function FavoritesClient({ initial }: { initial: BookmarkItem[] }) {
  const [items, setItems] = useState(initial);
  const [deleteTarget, setDeleteTarget] = useState<BookmarkItem | null>(null);

  async function toggleFavorite(item: BookmarkItem) {
    setItems(value => value.filter(current => current.id !== item.id));
    const response = await fetch(`/api/bookmarks/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: false }),
    });
    if (!response.ok) {
      const data = await response.json();
      setItems(value => value.some(current => current.id === item.id) ? value : [item, ...value]);
      toast.error(data.error ?? "Could not remove favorite");
      return;
    }
    toast.success("Removed from favorites");
  }

  async function remove() {
    if (!deleteTarget) return;
    const response = await fetch(`/api/bookmarks/${deleteTarget.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error ?? "Could not delete bookmark");
      return;
    }
    setItems(value => value.filter(current => current.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Bookmark deleted");
  }

  return <>
    {items.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map(item => <BookmarkCard key={item.id} item={item} onFavorite={toggleFavorite} onDelete={setDeleteTarget} />)}</div> : <div className="panel grid min-h-64 place-items-center rounded-2xl"><p className="muted">No favorites yet.</p></div>}
    {deleteTarget && <AccessibleDialog title="Delete bookmark?" labelledBy="favorite-delete-dialog-title" onClose={() => setDeleteTarget(null)}><p className="muted mt-4 text-sm">This will permanently remove “{deleteTarget.title}”.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button onClick={() => void remove()} className="rounded-xl bg-rose-600 px-4 py-2 text-white">Delete</button></div></AccessibleDialog>}
  </>;
}
