import Link from "next/link";
import { Bookmark, FolderKanban, Search, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { PublicFooter } from "@/components/public-footer";

const features = [
  { icon: Bookmark, title: "Save useful resources", text: "Keep documentation, tools, tutorials, and articles in one private library." },
  { icon: FolderKanban, title: "Organize your way", text: "Use technologies, tags, favorites, and collections to keep everything tidy." },
  { icon: Search, title: "Find anything quickly", text: "Search and filter your saved resources without digging through browser folders." },
];

export default function Home() {
  return <div className="min-h-screen">
    <header className="border-b border-[var(--line)] px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between"><Logo /><Link href="/login" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">Open DevStash</Link></div>
    </header>
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
        <div><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">Developer resource manager</p><h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">Every great resource. One tidy place.</h1><p className="muted mt-6 max-w-2xl text-lg leading-8">DevStash is a private bookmark manager for developers. Save, organize, search, and revisit the resources that help you build.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/login" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Get started</Link><Link href="/privacy" className="rounded-xl border border-[var(--line)] px-5 py-3 font-semibold">How we protect your data</Link></div></div>
        <aside className="panel rounded-3xl p-7"><ShieldCheck className="text-emerald-500" size={34}/><h2 className="mt-5 text-xl font-bold">Private by default</h2><p className="muted mt-3 leading-7">Your bookmarks belong to your account. Google Sign-In is used only to identify you; DevStash does not request access to Gmail, Drive, contacts, or other Google services.</p></aside>
      </section>
      <section className="border-y border-[var(--line)] bg-[var(--panel)]"><div className="mx-auto grid max-w-6xl gap-5 px-6 py-16 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-[var(--line)] p-6"><Icon className="text-[var(--accent)]"/><h2 className="mt-5 font-bold">{title}</h2><p className="muted mt-2 text-sm leading-6">{text}</p></article>)}</div></section>
    </main>
    <PublicFooter />
  </div>;
}
