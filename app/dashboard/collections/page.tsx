"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Folder, Pencil, Plus, Trash2 } from "lucide-react";
import { AccessibleDialog } from "@/components/accessible-dialog";
import { PageHeading } from "@/components/page-heading";
import { toast } from "sonner";

type Item = { id: string; name: string; count: number };
type Dialog = "create" | "rename" | "delete" | null;

export default function CollectionsPage() {
  const [items, setItems] = useState<Item[]>([]), [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<Dialog>(null), [selected, setSelected] = useState<Item | null>(null);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/collections"), data = await response.json();
    if (!response.ok) toast.error(data.error ?? "Could not load collections");
    else setItems(data.data ?? []);
    setLoading(false);
  }
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    const editing = dialog === "rename";
    const response = await fetch(editing ? `/api/collections/${selected?.id}` : "/api/collections", {
      method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) { toast.error(data.error ?? "Could not save collection"); return; }
    toast.success(editing ? "Collection renamed" : "Collection created");
    setDialog(null); setSelected(null); await load();
  }
  async function remove() {
    if (!selected) return;
    const response = await fetch(`/api/collections/${selected.id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); toast.error(data.error ?? "Could not delete collection"); return; }
    toast.success("Collection deleted"); setDialog(null); setSelected(null); setItems(value => value.filter(item => item.id !== selected.id));
  }

  return <><PageHeading title="Collections" description="Group related resources into focused spaces." action={<button onClick={() => setDialog("create")} className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white"><Plus size={17} />New collection</button>} />
    {loading ? <div className="h-60 animate-pulse rounded-2xl bg-[var(--panel)]" /> : items.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map(item => <article key={item.id} className="panel rounded-2xl p-5"><div className="flex justify-between"><span className="grid size-11 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500"><Folder size={21} /></span><div className="flex"><button onClick={() => { setSelected(item); setDialog("rename"); }} aria-label={`Rename ${item.name}`} className="muted grid size-9 place-items-center"><Pencil size={16} /></button><button onClick={() => { setSelected(item); setDialog("delete"); }} aria-label={`Delete ${item.name}`} className="muted grid size-9 place-items-center hover:text-rose-500"><Trash2 size={16} /></button></div></div><h2 className="mt-5 font-semibold">{item.name}</h2><p className="muted mt-1 text-sm">{item.count} resources</p><Link href={`/dashboard/collections/${item.id}`} className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-sm font-semibold text-[var(--accent)]">Open collection <ArrowRight size={16} /></Link></article>)}</div> : <div className="panel grid h-64 place-items-center rounded-2xl muted">No collections yet.</div>}
    {dialog === "create" || dialog === "rename" ? <AccessibleDialog title={dialog === "rename" ? "Rename collection" : "Create collection"} labelledBy="collection-dialog-title" onClose={() => { setDialog(null); setSelected(null); }}><form onSubmit={save} className="mt-4 space-y-4"><label className="block text-sm font-medium">Name<input name="name" autoFocus required maxLength={80} defaultValue={selected?.name ?? ""} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setDialog(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button className="rounded-xl bg-indigo-600 px-4 py-2 text-white">{dialog === "rename" ? "Rename" : "Create"}</button></div></form></AccessibleDialog> : null}
    {dialog === "delete" ? <AccessibleDialog title="Delete collection?" labelledBy="collection-delete-dialog-title" onClose={() => setDialog(null)}><p className="muted mt-4 text-sm">Delete “{selected?.name}”? Bookmarks will not be deleted.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDialog(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button onClick={() => void remove()} className="rounded-xl bg-rose-600 px-4 py-2 text-white">Delete</button></div></AccessibleDialog> : null}
  </>;
}
