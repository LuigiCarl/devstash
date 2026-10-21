"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { FormEvent, useEffect, useState } from "react";
import { Bookmark, ChevronDown, Folder, Hash, Heart, LayoutDashboard, Menu, Moon, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings, Sun, X } from "lucide-react";
import { Logo } from "./logo";

const nav = [
  [/dashboard$/, "/dashboard", "Overview", LayoutDashboard],
  [/bookmarks/, "/dashboard/bookmarks", "Bookmarks", Bookmark],
  [/favorites/, "/dashboard/favorites", "Favorites", Heart],
  [/collections/, "/dashboard/collections", "Collections", Folder],
] as const;

type User = { kind: "user" | "guest"; name?: string | null; email?: string | null; image?: string | null };
type SidebarTag = { id: string; name: string };

export function DashboardShell({ children, user }: { children: React.ReactNode; user: User }) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<SidebarTag[]>([]);
  const initials = (user.name ?? user.email ?? "Guest").split(" ").map(value => value[0]).join("").slice(0, 2).toUpperCase();
  const onBookmarks = path.startsWith("/dashboard/bookmarks");
  const activeTag = onBookmarks ? searchParams.get("tag") : null;

  useEffect(() => {
    let active = true;
    async function loadTags() {
      const response = await fetch("/api/tags");
      if (!response.ok) return;
      const result = await response.json();
      if (active) setTags(result.data ?? []);
    }
    void loadTags();
    window.addEventListener("devstash:tags-changed", loadTags);
    return () => { active = false; window.removeEventListener("devstash:tags-changed", loadTags); };
  }, []);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/dashboard/bookmarks?q=${encodeURIComponent(query)}` : "/dashboard/bookmarks");
  }

  return <div className="min-h-screen lg:grid" style={{ gridTemplateColumns: collapsed ? "82px 1fr" : "250px 1fr" }}>
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-[var(--line)] bg-[var(--panel)] p-4 transition-transform lg:sticky lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "lg:w-[82px]" : ""}`}>
      <div className="flex h-12 shrink-0 items-center justify-between px-1"><Logo compact={collapsed} /><button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button></div>
      <div className="min-h-0 flex-1 overflow-y-auto pt-6">
        <nav className="space-y-1">{nav.map(([match, href, label, Icon]) => <Link onClick={() => setMobileOpen(false)} key={href} href={href} className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${match.test(path) && !activeTag ? "bg-[var(--soft)] text-[var(--accent)]" : "muted hover:bg-[var(--bg)] hover:text-[var(--text)]"}`}><Icon className="shrink-0" size={19} />{!collapsed && label}</Link>)}</nav>
        {tags.length > 0 && <section className="mt-7" aria-labelledby="sidebar-tags-heading">
          {!collapsed && <h2 id="sidebar-tags-heading" className="muted px-3 text-[11px] font-semibold uppercase tracking-[.18em]">Tags</h2>}
          <nav aria-label="Bookmark tags" className="mt-2 max-h-[min(42vh,24rem)] space-y-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin]">{tags.map(tag => <Link title={collapsed ? `#${tag.name}` : undefined} onClick={() => setMobileOpen(false)} key={tag.id} href={`/dashboard/bookmarks?tag=${encodeURIComponent(tag.id)}`} className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${activeTag === tag.id ? "bg-[var(--soft)] text-[var(--accent)]" : "muted hover:bg-[var(--bg)] hover:text-[var(--text)]"}`}><Hash className="shrink-0" size={18} />{!collapsed && <span className="truncate">{tag.name}</span>}</Link>)}</nav>
        </section>}
      </div>
      <div className="shrink-0 space-y-1 border-t border-[var(--line)] pt-4"><Link href="/dashboard/settings" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${path.includes("settings") ? "bg-[var(--soft)] text-[var(--accent)]" : "muted"}`}><Settings className="shrink-0" size={19} />{!collapsed && "Settings"}</Link><button onClick={() => setCollapsed(value => !value)} className="muted hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm lg:flex">{collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />} {!collapsed && "Collapse sidebar"}</button></div>
    </aside>
    {mobileOpen && <button aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
    <div className="min-w-0">{user.kind === "guest" && <div className="flex min-h-10 items-center justify-center gap-3 bg-indigo-600 px-4 py-2 text-center text-xs font-medium text-white">Guest workspace · Available for up to 7 days unless you end the session. <Link href="/login" className="font-bold underline underline-offset-2">Sign in to keep it</Link></div>}<header className="sticky top-0 z-30 flex h-[73px] items-center gap-3 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 backdrop-blur-xl sm:px-7"><button onClick={() => setMobileOpen(true)} className="lg:hidden" aria-label="Open navigation"><Menu /></button><form onSubmit={submitSearch} className="relative hidden max-w-xl flex-1 md:block"><Search className="muted absolute left-3 top-1/2 -translate-y-1/2" size={18} /><input value={search} onChange={event => setSearch(event.target.value)} className="focus-ring h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] pl-10 pr-4 text-sm" placeholder="Search your resources..." aria-label="Global bookmark search" /></form><div className="ml-auto flex items-center gap-2">{!onBookmarks && <Link href="/dashboard/bookmarks?new=true" className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white"><Plus size={17} /><span className="hidden sm:inline">Add bookmark</span></Link>}<button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--panel)]" aria-label="Toggle theme"><Sun className="hidden dark:block" size={18} /><Moon className="block dark:hidden" size={18} /></button><Link href="/dashboard/settings" title={user.email ?? "Guest workspace"} className="flex items-center gap-2 rounded-xl p-1.5"><span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 text-xs font-bold text-white">{initials}</span><ChevronDown className="muted hidden sm:block" size={14} /></Link></div></header><main className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9">{children}</main></div>
  </div>;
}
