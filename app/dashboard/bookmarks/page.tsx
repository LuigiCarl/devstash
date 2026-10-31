"use client";

import { FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { BookmarkCard, type BookmarkItem } from "@/components/bookmark-card";
import { PageHeading } from "@/components/page-heading";
import { toast } from "sonner";

type Tag = { id: string; name: string };
type Technology = { id: string; name: string };
type Filters = { q: string; tag: string; technology: string; category: string; favorite: string; sort: string; page: number; pageSize: number };
const categories = ["Documentation", "Library", "Tool", "Tutorial", "Article"];
const defaultFilters: Filters = { q: "", tag: "", technology: "", category: "", favorite: "", sort: "newest", page: 1, pageSize: 12 };

function readFilters(): Filters {
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "", tag: p.get("tag") ?? "", technology: p.get("technology") ?? "",
    category: p.get("category") ?? "", favorite: p.get("favorite") === "true" ? "true" : "",
    sort: ["newest", "oldest", "title"].includes(p.get("sort") ?? "") ? p.get("sort")! : "newest",
    page: Math.max(1, Number(p.get("page") ?? 1) || 1),
    pageSize: [6, 12, 24, 48].includes(Number(p.get("pageSize"))) ? Number(p.get("pageSize")) : 12,
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

function BookmarkForm({
  editing,
  categories,
  technologies,
  tags,
  onSave,
  onCancel,
  onCreateTag,
}: {
  editing: BookmarkItem | null;
  categories: string[];
  technologies: Technology[];
  tags: Tag[];
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  onCreateTag: (name: string) => Promise<Tag | null>;
}) {
  const [url, setUrl] = useState(editing?.url ?? "");
  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState(editing?.category ?? "Documentation");
  const [technologyId, setTechnologyId] = useState(editing?.technologyId ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    editing?.tags?.map(t => t.id) ?? []
  );
  const [isFavorite, setIsFavorite] = useState(Boolean(editing?.isFavorite));
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleUrlChange(val: string) {
    setUrl(val);
    if (!title) {
      try {
        const u = val.startsWith("http") ? new URL(val) : new URL(`https://${val}`);
        const host = u.hostname.replace(/^www\./, "");
        const parts = host.split(".");
        const name = parts[0];
        if (name && name.length > 1) {
          setTitle(name.charAt(0).toUpperCase() + name.slice(1));
        }
      } catch {}
    }
  }

  function toggleTag(id: string) {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  async function handleAddTag() {
    if (!newTag.trim()) return;
    const created = await onCreateTag(newTag);
    if (created) {
      setSelectedTagIds(prev => [...prev, created.id]);
      setNewTag("");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="url-input" className="text-xs font-semibold text-slate-300">
            URL
          </label>
          <span className="text-[11px] font-normal text-indigo-400">Pasting suggests a title</span>
        </div>
        <input
          id="url-input"
          name="url"
          value={url}
          onChange={e => handleUrlChange(e.target.value)}
          required
          type="url"
          pattern="https?://.*"
          placeholder="https://example.com/docs"
          autoFocus
          className="mt-1 h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="title-input" className="block text-xs font-semibold text-slate-300">
          Title
        </label>
        <input
          id="title-input"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="e.g. Next.js Documentation"
          className="mt-1 h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="description-input" className="text-xs font-semibold text-slate-300">
            Description
          </label>
          <span className="text-[11px] font-normal text-slate-500">Optional</span>
        </div>
        <textarea
          id="description-input"
          name="description"
          defaultValue={editing?.description ?? ""}
          rows={2}
          placeholder="Quick summary or notes on why this is useful..."
          className="mt-1 min-h-[64px] w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Category
        </label>
        <input type="hidden" name="category" value={category} />
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-[var(--line)] bg-[var(--bg)] text-slate-400 hover:text-white hover:bg-[var(--soft)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="technology-select" className="text-xs font-semibold text-slate-300">
            Technology
          </label>
          <span className="text-[11px] font-normal text-slate-500">Optional</span>
        </div>
        <select
          id="technology-select"
          name="technologyId"
          value={technologyId}
          onChange={e => setTechnologyId(e.target.value)}
          className="mt-1 h-9 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 text-xs sm:text-sm text-[var(--text)] focus:border-indigo-500 focus:outline-none"
        >
          <option value="">No technology</option>
          {technologies.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">Tags</label>
          <div className="flex items-center gap-1">
            <input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleAddTag();
                }
              }}
              placeholder="+ Add new tag"
              className="h-6 w-24 rounded-md border border-[var(--line)] bg-transparent px-1.5 text-[11px] placeholder:text-slate-500 focus:w-32 focus:border-indigo-500 focus:outline-none transition-all"
            />
            {newTag.trim() && (
              <button
                type="button"
                onClick={() => void handleAddTag()}
                className="h-6 rounded-md bg-indigo-600 px-1.5 text-[10px] font-bold text-white hover:bg-indigo-500"
              >
                Add
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => {
            const isChecked = selectedTagIds.includes(tag.id);
            return (
              <label
                key={tag.id}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition border select-none ${
                  isChecked
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-400 font-semibold"
                    : "border-[var(--line)] bg-[var(--bg)] text-slate-400 hover:text-slate-200"
                }`}
              >
                <input
                  name="tagIds"
                  value={tag.id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTag(tag.id)}
                  className="size-3.5 rounded accent-indigo-600"
                />
                #{tag.name}
              </label>
            );
          })}
          {tags.length === 0 && (
            <span className="text-xs text-slate-500">No tags yet. Type above to create one.</span>
          )}
        </div>
      </div>

      <div className="pt-1">
        <label htmlFor="favorite-checkbox" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer select-none">
          <input
            id="favorite-checkbox"
            name="isFavorite"
            type="checkbox"
            checked={isFavorite}
            onChange={e => setIsFavorite(e.target.checked)}
            className="size-4 rounded border-[var(--line)] bg-[var(--bg)] accent-indigo-600"
          />
          <Heart size={15} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
          <span>Favorite</span>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]/60">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[var(--line)] px-4 py-2 text-xs sm:text-sm font-medium hover:bg-[var(--soft)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default function Bookmarks() {
  const [items, setItems] = useState<BookmarkItem[]>([]), [tags, setTags] = useState<Tag[]>([]), [technologies, setTechnologies] = useState<Technology[]>([]);
  const [filters, setFilters] = useState<Filters>(() => typeof window === "undefined" ? defaultFilters : readFilters()), [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12, total: 0, totalPages: 1 }), [editing, setEditing] = useState<BookmarkItem | null>(null);
  const [dialog, setDialog] = useState<"bookmark" | "tag" | "delete" | null>(null), [deleteTarget, setDeleteTarget] = useState<BookmarkItem | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  async function load(next: Filters) {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => { if (value) params.set(key, String(value)); });
    const response = await fetch(`/api/bookmarks?${params}`);
    const data = await response.json();
    if (!response.ok) { toast.error(data.error ?? "Could not load bookmarks"); setLoading(false); return; }
    setItems(data.data ?? []); setPagination(data.pagination ?? { page: 1, pageSize: next.pageSize, total: 0, totalPages: 1 }); setLoading(false);
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
      if (new URLSearchParams(window.location.search).get("new") === "true") setDialog("bookmark");
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
    setTags(value => [...value, result.data].sort((a, b) => a.name.localeCompare(b.name))); window.dispatchEvent(new Event("devstash:tags-changed")); setDialog("bookmark"); toast.success("Tag created");
  }
  async function deleteTag(tag: Tag) {
    const response = await fetch(`/api/tags/${tag.id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); toast.error(data.error ?? "Could not delete tag"); return; }
    setTags(value => value.filter(item => item.id !== tag.id));
    window.dispatchEvent(new Event("devstash:tags-changed"));
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
    if (response.ok) {
      const nextPage = items.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      toast.success("Bookmark deleted");
      update({ page: nextPage });
    }
    else toast.error("Could not delete bookmark");
    setDeleteTarget(null); setDialog(null);
  }
  function submitSearch(event: FormEvent) { event.preventDefault(); update({ page: 1 }); }
  const firstResult = pagination.total ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const lastResult = Math.min(pagination.page * pagination.pageSize, pagination.total);
  const visiblePages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1).filter(page =>
    page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 1
  );

  const activeFilterCount = [
    Boolean(filters.technology),
    Boolean(filters.category),
    Boolean(filters.tag),
    Boolean(filters.favorite),
    filters.sort !== "newest",
  ].filter(Boolean).length;

  return <><PageHeading title="Bookmarks" description={`${pagination.total} resources in your stash.`} action={<button onClick={() => { setEditing(null); setDialog("bookmark"); }} className="flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-indigo-600 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white transition hover:bg-indigo-500"><Plus size={16} />Add bookmark</button>} />
    <form onSubmit={submitSearch} className="panel mb-5 space-y-2.5 rounded-2xl p-2.5 sm:space-y-3 sm:p-3.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2 sm:border-0 sm:bg-transparent">
          <Search className="muted mx-1 shrink-0" size={17} />
          <input
            value={filters.q}
            onChange={event => setFilters(value => ({ ...value, q: event.target.value }))}
            className="h-9 sm:h-10 min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-[var(--text)] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="Search title, URL, or description..."
            aria-label="Search bookmarks"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => update({ q: "", page: 1 })}
              aria-label="Clear search"
              className="muted mr-1 rounded-md p-1 hover:bg-[var(--soft)]"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowMobileFilters(value => !value)}
          className={`flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition sm:hidden ${
            activeFilterCount > 0
              ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
              : "border-[var(--line)] bg-[var(--panel)] text-slate-600 dark:text-slate-300"
          }`}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="grid size-4 place-items-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          type="submit"
          className="hidden rounded-xl bg-[var(--soft)] px-4 text-sm font-semibold text-[var(--accent)] sm:block"
        >
          Search
        </button>
      </div>

      <div
        className={`${
          showMobileFilters ? "grid" : "hidden sm:grid"
        } grid-cols-2 gap-2 border-t border-[var(--line)]/60 pt-2.5 sm:border-t-0 sm:pt-0 sm:grid-cols-2 lg:grid-cols-5`}
      >
        <select
          value={filters.technology}
          onChange={e => update({ technology: e.target.value, page: 1 })}
          aria-label="Filter by technology"
          className="h-9 sm:h-10 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2 text-xs sm:text-sm"
        >
          <option value="">All technologies</option>
          {technologies.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={e => update({ category: e.target.value, page: 1 })}
          aria-label="Filter by category"
          className="h-9 sm:h-10 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2 text-xs sm:text-sm"
        >
          <option value="">All categories</option>
          {categories.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <select
          value={filters.tag}
          onChange={e => update({ tag: e.target.value, page: 1 })}
          aria-label="Filter by tag"
          className="h-9 sm:h-10 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2 text-xs sm:text-sm"
        >
          <option value="">All tags</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>#{tag.name}</option>
          ))}
        </select>
        <select
          value={filters.favorite}
          onChange={e => update({ favorite: e.target.value, page: 1 })}
          aria-label="Filter by favorite status"
          className="h-9 sm:h-10 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2 text-xs sm:text-sm"
        >
          <option value="">All bookmarks</option>
          <option value="true">Favorites only</option>
        </select>
        <select
          value={filters.sort}
          onChange={e => update({ sort: e.target.value, page: 1 })}
          aria-label="Sort bookmarks"
          className="h-9 sm:h-10 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-2 text-xs sm:text-sm col-span-2 sm:col-span-1"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {activeFilterCount > 0 && !showMobileFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:hidden">
          <span className="text-[11px] font-medium text-slate-500">Active:</span>
          {filters.technology && (
            <button
              type="button"
              onClick={() => update({ technology: "", page: 1 })}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400"
            >
              Tech: {technologies.find(t => t.id === filters.technology)?.name ?? "selected"} <X size={11} />
            </button>
          )}
          {filters.category && (
            <button
              type="button"
              onClick={() => update({ category: "", page: 1 })}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400"
            >
              {filters.category} <X size={11} />
            </button>
          )}
          {filters.tag && (
            <button
              type="button"
              onClick={() => update({ tag: "", page: 1 })}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400"
            >
              #{tags.find(t => t.id === filters.tag)?.name ?? "tag"} <X size={11} />
            </button>
          )}
          {filters.favorite === "true" && (
            <button
              type="button"
              onClick={() => update({ favorite: "", page: 1 })}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400"
            >
              Favorites <X size={11} />
            </button>
          )}
          {filters.sort !== "newest" && (
            <button
              type="button"
              onClick={() => update({ sort: "newest", page: 1 })}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-400"
            >
              Sort: {filters.sort} <X size={11} />
            </button>
          )}
          <button
            type="button"
            onClick={() => update({ technology: "", category: "", tag: "", favorite: "", sort: "newest", page: 1 })}
            className="text-[11px] underline text-slate-500 hover:text-slate-300 ml-1"
          >
            Clear
          </button>
        </div>
      )}
    </form>
    {loading ? <div className="h-64 animate-pulse rounded-2xl bg-[var(--panel)]" /> : items.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map(item => <BookmarkCard key={item.id} item={item} onFavorite={favorite} onEdit={value => { setEditing(value); setDialog("bookmark"); }} onDelete={value => { setDeleteTarget(value); setDialog("delete"); }} />)}</div> : <div className="panel grid h-64 place-items-center rounded-2xl muted">No bookmarks found.</div>}
    {!loading && pagination.total > 0 && <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="muted text-sm">Showing {firstResult}–{lastResult} of {pagination.total}</p>
      <nav aria-label="Bookmark pages" className="flex items-center gap-1">
        <button disabled={pagination.page <= 1} onClick={() => update({ page: pagination.page - 1 })} aria-label="Previous page" className="grid size-9 place-items-center rounded-lg border border-[var(--line)] disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={17} /></button>
        {visiblePages.map((page, index) => <span key={page} className="contents">
          {index > 0 && page - visiblePages[index - 1] > 1 && <span className="muted px-1" aria-hidden="true">…</span>}
          <button onClick={() => update({ page })} aria-label={`Page ${page}`} aria-current={page === pagination.page ? "page" : undefined} className={`grid size-9 place-items-center rounded-lg text-sm font-medium ${page === pagination.page ? "bg-indigo-600 text-white" : "border border-[var(--line)] hover:bg-[var(--soft)]"}`}>{page}</button>
        </span>)}
        <button disabled={pagination.page >= pagination.totalPages} onClick={() => update({ page: pagination.page + 1 })} aria-label="Next page" className="grid size-9 place-items-center rounded-lg border border-[var(--line)] disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={17} /></button>
      </nav>
      <label className="muted flex items-center gap-2 text-sm">Show<select value={filters.pageSize} onChange={event => update({ pageSize: Number(event.target.value), page: 1 })} className="h-9 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-2 text-[var(--text)]"><option value={6}>6</option><option value={12}>12</option><option value={24}>24</option><option value={48}>48</option></select></label>
    </div>}
    {dialog === "bookmark" && (
      <Dialog
        title={editing ? "Edit bookmark" : "Add bookmark"}
        labelledBy="bookmark-dialog-title"
        onClose={() => { setDialog(null); setEditing(null); }}
      >
        <BookmarkForm
          editing={editing}
          categories={categories}
          technologies={technologies}
          tags={tags}
          onSave={save}
          onCancel={() => { setDialog(null); setEditing(null); }}
          onCreateTag={async (name: string) => {
            const trimmed = name.trim();
            if (!trimmed) return null;
            const res = await fetch("/api/tags", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: trimmed }),
            });
            const result = await res.json();
            if (!res.ok) {
              toast.error(result.error ?? "Could not create tag");
              return null;
            }
            setTags(value => [...value, result.data].sort((a, b) => a.name.localeCompare(b.name)));
            window.dispatchEvent(new Event("devstash:tags-changed"));
            toast.success(`Tag #${trimmed} created`);
            return result.data;
          }}
        />
      </Dialog>
    )}
    {dialog === "tag" && <Dialog title="Create tag" labelledBy="tag-dialog-title" onClose={() => setDialog("bookmark")}><form action={createTag} className="mt-4 space-y-4"><label className="block text-sm font-medium">Tag name<input name="name" required autoFocus className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setDialog("bookmark")} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button className="rounded-xl bg-indigo-600 px-4 py-2 text-white">Create tag</button></div></form></Dialog>}
    {dialog === "delete" && <Dialog title="Delete bookmark?" labelledBy="delete-dialog-title" onClose={() => setDialog(null)}><p className="muted mt-4 text-sm">This will permanently remove “{deleteTarget?.title}”.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDialog(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button onClick={() => void remove()} className="rounded-xl bg-rose-600 px-4 py-2 text-white">Delete</button></div></Dialog>}
  </>;
}
