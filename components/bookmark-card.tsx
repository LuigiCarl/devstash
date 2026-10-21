"use client";

import { ExternalLink, Heart, Pencil, Trash2 } from "lucide-react";
import { TechnologyIcon } from "./technology-icon";

export type BookmarkItem = {
  id: string; title: string; url: string; description: string | null;
  category: string; isFavorite: boolean; createdAt: string | Date;
  technologyId?: string | null; technologyName: string | null;
  technologySlug: string | null; brandColor: string | null;
  tags?: { id: string; name: string }[];
};

export function BookmarkCard({ item, onFavorite, onEdit, onDelete }: {
  item: BookmarkItem;
  onFavorite?: (item: BookmarkItem) => void;
  onEdit?: (item: BookmarkItem) => void;
  onDelete?: (item: BookmarkItem) => void;
}) {
  const host = (() => {
    try { return new URL(item.url).hostname.replace("www.", ""); }
    catch { return item.url; }
  })();

  return <article className="panel group relative flex min-h-64 flex-col overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-300/70 hover:shadow-xl hover:shadow-indigo-950/5 dark:hover:border-indigo-500/30">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent opacity-0 transition group-hover:opacity-100" />
    <div className="flex items-start justify-between">
      <span className="grid size-12 place-items-center rounded-2xl text-lg font-black shadow-sm" style={{ background: `#${item.brandColor ?? "6366F1"}20`, color: `#${item.brandColor ?? "6366F1"}` }}>
        <TechnologyIcon slug={item.technologySlug} name={item.technologyName ?? item.title} url={item.url} color={item.brandColor} />
      </span>
      <div className="flex gap-1">
        <button onClick={() => onFavorite?.(item)} aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"} className="grid size-9 place-items-center rounded-lg hover:bg-[var(--bg)]"><Heart size={18} className={item.isFavorite ? "fill-rose-500 text-rose-500" : "muted"} /></button>
        {onEdit && <button onClick={() => onEdit(item)} aria-label="Edit bookmark" className="muted grid size-9 place-items-center rounded-lg hover:bg-[var(--bg)]"><Pencil size={16} /></button>}
        {onDelete && <button onClick={() => onDelete(item)} aria-label="Delete bookmark" className="muted grid size-9 place-items-center rounded-lg hover:bg-rose-500/10 hover:text-rose-500"><Trash2 size={17} /></button>}
      </div>
    </div>
    <div className="mt-4">
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base font-bold tracking-tight hover:text-[var(--accent)]">{item.title}<ExternalLink size={14} className="opacity-0 transition group-hover:opacity-100" /></a>
      <p className="muted mt-1 text-xs">{host}</p>
      {item.description && <p className="muted mt-2 line-clamp-2 text-sm leading-6">{item.description}</p>}
    </div>
    {item.tags?.length ? <div className="mt-4 flex flex-wrap gap-1">{item.tags.map(tag => <span key={tag.id} className="rounded-md bg-[var(--soft)] px-2 py-1 text-xs text-[var(--accent)]">#{tag.name}</span>)}</div> : null}
    <div className="muted mt-auto flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs"><span>{item.technologyName ?? item.category}</span><span>{new Date(item.createdAt).toLocaleDateString()}</span></div>
  </article>;
}
