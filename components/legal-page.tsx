import Link from "next/link";
import { Logo } from "@/components/logo";
import { PublicFooter } from "@/components/public-footer";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return <div className="min-h-screen">
    <header className="border-b border-[var(--line)] px-6 py-4"><div className="mx-auto flex max-w-4xl items-center justify-between"><Link href="/"><Logo /></Link><Link href="/login" className="text-sm font-semibold text-[var(--accent)]">Open app</Link></div></header>
    <main className="mx-auto max-w-4xl px-6 py-14"><p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--accent)]">DevStash legal</p><h1 className="mt-3 text-4xl font-bold tracking-tight">{title}</h1><p className="muted mt-3 text-sm">Last updated: {updated}</p><article className="mt-10 space-y-8 leading-7 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_p]:text-[var(--muted)] [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:text-[var(--muted)]">{children}</article></main>
    <PublicFooter />
  </div>;
}
