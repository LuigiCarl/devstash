import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth, signIn } from "@/auth";
import { Logo } from "@/components/logo";
import { CredentialsAuth } from "@/components/credentials-auth";

export const instant = false;

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await connection();
  const { error } = await searchParams;
  const session = await auth();
  const googleEnabled = Boolean(process.env.OWNER_GOOGLE_EMAIL);
  if (session?.user) redirect("/dashboard");

  return <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
    <section className="relative hidden overflow-hidden bg-[#090d1a] p-12 text-white lg:flex lg:flex-col xl:p-16">
      <div className="pointer-events-none absolute -left-24 top-1/3 size-80 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-violet-600/15 blur-3xl" />
      <Link href="/"><Logo /></Link>
      <div className="relative my-auto max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[.24em] text-indigo-300">Your developer knowledge base</p>
        <h1 className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">Less searching.<br /><span className="bg-gradient-to-r from-indigo-300 to-violet-400 bg-clip-text text-transparent">More building.</span></h1>
        <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">Save the documentation, tools, and ideas worth keeping—organized and ready when you need them.</p>
        <div className="mt-11 grid gap-3 text-sm text-slate-300">{["A private workspace for every account", "Collections, tags, and favorites", "Fast search across your entire stash"].map(item => <p className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[.03] px-4 py-3" key={item}><CheckCircle2 className="shrink-0 text-indigo-400" size={18} />{item}</p>)}</div>
      </div>
      <p className="relative text-xs text-slate-500">Built for developers who value focus.</p>
    </section>
    <section className="relative grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_36%)] px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute bottom-0 left-0 size-72 rounded-full bg-indigo-500/[.05] blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 lg:hidden"><Link href="/"><Logo /></Link></div>
        <div className="panel rounded-[2rem] p-6 shadow-2xl shadow-slate-900/10 sm:p-9 dark:shadow-black/30">
        <div className="hidden justify-center sm:flex"><Logo compact size="lg" /></div>
        <div className="mt-5 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--accent)]">Welcome back</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Your stash is waiting</h1><p className="muted mx-auto mt-3 max-w-sm text-sm leading-6">Log in or create a simple account to start organizing your developer resources.</p></div>
        {error && <p role="alert" className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600">Google sign-in could not be completed. Please try again or contact support if the problem continues.</p>}
        <CredentialsAuth />
        {googleEnabled && <><div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-[var(--line)]" /><span className="muted text-[11px] font-semibold uppercase tracking-wider">Owner access</span><span className="h-px flex-1 bg-[var(--line)]" /></div><form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}><button className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-sm font-semibold transition hover:border-indigo-500/40 hover:bg-[var(--soft)]"><span className="text-lg font-bold text-blue-500">G</span>Continue with Google</button></form></>}
        <div className="my-5 h-px bg-[var(--line)]" />
        <form action="/api/guest" method="post" className="text-center"><button className="muted text-sm font-semibold transition hover:text-[var(--accent)]">Explore as guest <span aria-hidden="true">→</span></button></form>
        <p className="muted mt-2 text-center text-xs">Guest workspaces are private and available for 7 days.</p>
        </div>
        <p className="muted mt-5 text-center text-[11px] leading-5">By continuing, you agree to our <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--text)]">Terms</Link> and acknowledge our <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--text)]">Privacy Policy</Link>.</p>
      </div>
    </section>
  </main>;
}
