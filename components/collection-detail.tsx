"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AccessibleDialog } from "@/components/accessible-dialog";
import { BookmarkCard, type BookmarkItem } from "@/components/bookmark-card";
import { toast } from "sonner";

export function CollectionDetail({ collectionId, initial, available }: { collectionId: string; initial: BookmarkItem[]; available: BookmarkItem[] }) {
  const [items, setItems] = useState(() => initial.filter((item, index, values) => values.findIndex(current => current.id === item.id) === index)), [open, setOpen] = useState(false);
  const choices = available.filter(item => !items.some(current => current.id === item.id));
  async function add(item: BookmarkItem) {
    const response = await fetch(`/api/collections/${collectionId}/bookmarks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookmarkId: item.id }) });
    if (!response.ok) { const data = await response.json(); toast.error(data.error ?? "Could not add bookmark"); return; }
    setItems(value => value.some(current => current.id === item.id) ? value : [item, ...value]); toast.success("Added to collection");
  }
  async function remove(item: BookmarkItem) {
    const response = await fetch(`/api/collections/${collectionId}/bookmarks/${item.id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); toast.error(data.error ?? "Could not remove bookmark"); return; }
    setItems(value => value.filter(current => current.id !== item.id)); toast.success("Removed from collection");
  }
  return <><button onClick={() => setOpen(true)} className="mb-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />Add resources</button>{items.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map(item => <div key={item.id} className="relative"><BookmarkCard item={item} /><button onClick={() => void remove(item)} className="absolute bottom-4 right-4 rounded-lg px-2 py-1 text-xs text-rose-500 hover:bg-rose-500/10">Remove</button></div>)}</div> : <div className="panel grid h-56 place-items-center rounded-2xl muted">This collection is empty.</div>}
    {open && <AccessibleDialog title="Add resources" labelledBy="collection-resources-dialog-title" onClose={() => setOpen(false)}><div className="mt-5 space-y-2">{choices.length ? choices.map(item => <button onClick={() => void add(item)} key={item.id} className="flex w-full items-center justify-between rounded-xl border border-[var(--line)] p-3 text-left"><span><b className="block text-sm">{item.title}</b><span className="muted text-xs">{item.url}</span></span><Plus size={16} /></button>) : <p className="muted py-8 text-center text-sm">All bookmarks are already added.</p>}</div></AccessibleDialog>}
  </>;
}
