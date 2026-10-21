"use client";

import { FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { BookmarkCard, type BookmarkItem } from "@/components/bookmark-card";
import { PageHeading } from "@/components/page-heading";
import { toast } from "sonner";

type Tag = { id: string; name: string };
type Technology = { id: string; name: string };
type Filters = { q: string; tag: string; technology: string; category: string; favorite: string; sort: string; page: number };
const categories = ["Documentation", "Library", "Tool", "Tutorial", "Article"];
const defaultFilters: Filters = { q: "", tag: "", technology: "", category: "", favorite: "", sort: "newest", page: 1 };

function readFilters(): Filters {
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "", tag: p.get("tag") ?? "", technology: p.get("technology") ?? "",
    category: p.get("category") ?? "", favorite: p.get("favorite") === "true" ? "true" : "",
    sort: ["newest", "oldest", "title"].includes(p.get("sort") ?? "") ? p.get("sort")! : "newest",
    page: Math.max(1, Number(p.get("page") ?? 1) || 1),
  };
}

function Dialog({ title, labelledBy, children, onClose }: { title: string; labelledBy: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !ref.current) return;
      const focusable = ref.current.querySelectorAll<HTMLElement>("button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[href]");
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [onClose]);
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="panel max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl p-6">
      <div className="flex items-center justify-between"><h2 id={labelledBy} className="text-xl font-bold">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="muted rounded-lg p-1 hover:bg-[var(--bg)]"><X size={18} /></button></div>
      {children}
    </div>
  </div>;
}

export default function Bookmarks() {
  const [items, setItems] = useState<BookmarkItem[]>([]), [tags, setTags] = useState<Tag[]>([]), [technologies, setTechnologies] = useState<Technology[]>([]);
  const [filters, setFilters] = useState<Filters>(() => typeof window === "undefined" ? defaultFilters : readFilters()), [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 }), [editing, setEditing] = useState<BookmarkItem | null>(null);
  const [dialog, setDialog] = useState<"bookmark" | "tag" | "delete" | null>(null), [deleteTarget, setDeleteTarget] = useState<BookmarkItem | null>(null);

  async function load(next: Filters) {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => { if (value) params.set(key, String(value)); });
    const response = await fetch(`/api/bookmarks?${params}`);
    const data = await response.json();
    if (!response.ok) { toast.error(data.error ?? "Could not load bookmarks"); setLoading(false); return; }
    setItems(data.data ?? []); setPagination(data.pagination ?? { page: 1, total: 0, totalPages: 1 }); setLoading(false);
  }
  function update(next: Partial<Filters>, replace = true) {
    const value = { ...filters, ...next };
    setFilters(value);
    const params = new URLSearchParams();
    Object.entries(value).forEach(([key, item]) => { if (item) params.set(key, String(item)); });
    window.history[replace ? "replaceState" : "pushState"]({}, "", `${window.location.pathname}?${params}`);
    void load(value);
  }
  useEffect(() => {
    const initial = typeof window === "undefined" ? defaultFilters : readFilters();
    Promise.all([fetch("/api/tags").then(r => r.json()), fetch("/api/technologies").then(r => r.json())]).then(([tagData, technologyData]) => {
      setTags(tagData.data ?? []); setTechnologies(technologyData.data ?? []); void load(initial);
    }).catch(() => { toast.error("Could not load filter options"); setLoading(false); });
    function onPopState() {
      const next = readFilters();
      setFilters(next);
      void load(next);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  async function createTag(data: FormData) {
    const name = String(data.get("name") ?? "").trim(); if (!name) return;
    const response = await fetch("/api/tags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) }), result = await response.json();
    if (!response.ok) { toast.error(result.error ?? "Could not create tag"); return; }
    setTags(value => [...value, result.data].sort((a, b) => a.name.localeCompare(b.name))); setDialog("bookmark"); toast.success("Tag created");
  }
  async function deleteTag(tag: Tag) {
    const response = await fetch(`/api/tags/${tag.id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); toast.error(data.error ?? "Could not delete tag"); return; }
    setTags(value => value.filter(item => item.id !== tag.id));
    if (filters.tag === tag.id) update({ tag: "", page: 1 });
    toast.success("Tag deleted");
  }
  async function save(data: FormData) {
    const payload = { title: data.get("title"), url: data.get("url"), description: data.get("description"), category: data.get("category"), technologyId: data.get("technologyId") || null, isFavorite: data.get("isFavorite") === "on", tagIds: data.getAll("tagIds") };
    const response = await fetch(editing ? `/api/bookmarks/${editing.id}` : "/api/bookmarks", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }), result = await response.json();
    if (!response.ok) { toast.error(result.error ?? "Could not save"); return; }
    toast.success(editing ? "Bookmark updated" : "Bookmark saved"); setDialog(null); setEditing(null); await load(filters);
  }
  async function favorite(item: BookmarkItem) {
    const response = await fetch(`/api/bookmarks/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isFavorite: !item.isFavorite }) });
    if (response.ok) setItems(value => value.map(current => current.id === item.id ? { ...current, isFavorite: !current.isFavorite } : current));
  }
  async function remove() {
    if (!deleteTarget) return;
    const response = await fetch(`/api/bookmarks/${deleteTarget.id}`, { method: "DELETE" });
    if (response.ok) { setItems(value => value.filter(item => item.id !== deleteTarget.id)); setPagination(value => ({ ...value, total: value.total - 1 })); toast.success("Bookmark deleted"); }
    else toast.error("Could not delete bookmark");
    setDeleteTarget(null); setDialog(null);
  }
  function submitSearch(event: FormEvent) { event.preventDefault(); update({ page: 1 }); }

  return <><PageHeading title="Bookmarks" description={`${pagination.total} resources in your stash.`} action={<button onClick={() => { setEditing(null); setDialog("bookmark"); }} className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white"><Plus size={17} />Add bookmark</button>} />
    <form onSubmit={submitSearch} className="panel mb-5 grid gap-3 rounded-2xl p-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center lg:col-span-2"><Search className="muted mx-2" size={17} /><input value={filters.q} onChange={e => setFilters(value => ({ ...value, q: e.target.value }))} className="h-10 flex-1 bg-transparent outline-none" placeholder="Search bookmarks..." aria-label="Search bookmarks" /></div>
      <select value={filters.technology} onChange={e => update({ technology: e.target.value, page: 1 })} aria-label="Filter by technology" className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 text-sm"><option value="">All technologies</option>{technologies.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
      <select value={filters.category} onChange={e => update({ category: e.target.value, page: 1 })} aria-label="Filter by category" className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 text-sm"><option value="">All categories</option>{categories.map(category => <option key={category}>{category}</option>)}</select>
      <select value={filters.tag} onChange={e => update({ tag: e.target.value, page: 1 })} aria-label="Filter by tag" className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 text-sm"><option value="">All tags</option>{tags.map(tag => <option key={tag.id} value={tag.id}>#{tag.name}</option>)}</select>
      <select value={filters.favorite} onChange={e => update({ favorite: e.target.value, page: 1 })} aria-label="Filter by favorite status" className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 text-sm"><option value="">All bookmarks</option><option value="true">Favorites only</option></select>
      <select value={filters.sort} onChange={e => update({ sort: e.target.value, page: 1 })} aria-label="Sort bookmarks" className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A-Z</option></select>
      <button className="rounded-xl bg-[var(--soft)] px-4 text-sm font-semibold text-[var(--accent)]">Search</button>
    </form>
    {loading ? <div className="h-64 animate-pulse rounded-2xl bg-[var(--panel)]" /> : items.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map(item => <BookmarkCard key={item.id} item={item} onFavorite={favorite} onEdit={value => { setEditing(value); setDialog("bookmark"); }} onDelete={value => { setDeleteTarget(value); setDialog("delete"); }} />)}</div> : <div className="panel grid h-64 place-items-center rounded-2xl muted">No bookmarks found.</div>}
    {pagination.totalPages > 1 && <nav aria-label="Bookmark pages" className="mt-6 flex items-center justify-center gap-3"><button disabled={filters.page <= 1} onClick={() => update({ page: filters.page - 1 })} aria-label="Previous page" className="rounded-xl border border-[var(--line)] p-2 disabled:opacity-40"><ChevronLeft size={18} /></button><span className="text-sm">Page {filters.page} of {pagination.totalPages}</span><button disabled={filters.page >= pagination.totalPages} onClick={() => update({ page: filters.page + 1 })} aria-label="Next page" className="rounded-xl border border-[var(--line)] p-2 disabled:opacity-40"><ChevronRight size={18} /></button></nav>}
    {dialog === "bookmark" && <Dialog title={editing ? "Edit bookmark" : "Add bookmark"} labelledBy="bookmark-dialog-title" onClose={() => { setDialog(null); setEditing(null); }}><form action={save} className="mt-4 space-y-4"><label className="block text-sm font-medium">Title<input name="title" defaultValue={editing?.title} required className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3" /></label><label className="block text-sm font-medium">URL<input name="url" defaultValue={editing?.url} required type="url" pattern="https?://.*" className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3" /></label><label className="block text-sm font-medium">Description<textarea name="description" defaultValue={editing?.description ?? ""} className="mt-2 min-h-20 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3" /></label><label className="block text-sm font-medium">Category<select name="category" defaultValue={editing?.category ?? "Documentation"} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3">{categories.map(category => <option key={category}>{category}</option>)}</select></label><label className="block text-sm font-medium">Technology<select name="technologyId" defaultValue={editing?.technologyId ?? ""} className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3"><option value="">No technology</option>{technologies.map(technology => <option key={technology.id} value={technology.id}>{technology.name}</option>)}</select></label><fieldset><div className="flex items-center justify-between"><legend className="text-sm font-medium">Tags</legend><button type="button" onClick={() => setDialog("tag")} className="text-xs font-semibold text-[var(--accent)]">+ New tag</button></div><div className="mt-2 flex flex-wrap gap-2">{tags.map(tag => <span key={tag.id} className="flex items-center gap-1 rounded-lg border border-[var(--line)] px-2 py-1 text-xs"><label><input name="tagIds" value={tag.id} type="checkbox" defaultChecked={editing?.tags?.some(item => item.id === tag.id)} className="mr-1" />#{tag.name}</label><button type="button" onClick={() => void deleteTag(tag)} aria-label={`Delete tag ${tag.name}`} className="text-rose-500">×</button></span>)}</div></fieldset><label className="flex gap-2 text-sm"><input name="isFavorite" type="checkbox" defaultChecked={editing?.isFavorite} /> Favorite</label><div className="flex justify-end gap-2"><button type="button" onClick={() => setDialog(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button className="rounded-xl bg-indigo-600 px-4 py-2 text-white">Save</button></div></form></Dialog>}
    {dialog === "tag" && <Dialog title="Create tag" labelledBy="tag-dialog-title" onClose={() => setDialog("bookmark")}><form action={createTag} className="mt-4 space-y-4"><label className="block text-sm font-medium">Tag name<input name="name" required autoFocus className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setDialog("bookmark")} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button className="rounded-xl bg-indigo-600 px-4 py-2 text-white">Create tag</button></div></form></Dialog>}
    {dialog === "delete" && <Dialog title="Delete bookmark?" labelledBy="delete-dialog-title" onClose={() => setDialog(null)}><p className="muted mt-4 text-sm">This will permanently remove “{deleteTarget?.title}”.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDialog(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button onClick={() => void remove()} className="rounded-xl bg-rose-600 px-4 py-2 text-white">Delete</button></div></Dialog>}
  </>;
}
