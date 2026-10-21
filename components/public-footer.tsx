import Link from "next/link";

export function PublicFooter() {
  return <footer className="border-t border-[var(--line)] px-6 py-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
      <p className="muted">© 2026 DevStash</p>
      <nav aria-label="Legal" className="flex flex-wrap justify-center gap-5">
        <Link href="/privacy" className="hover:text-[var(--accent)]">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-[var(--accent)]">Terms of Service</Link>
        <Link href="/account-deletion" className="hover:text-[var(--accent)]">Delete account</Link>
      </nav>
    </div>
  </footer>;
}
