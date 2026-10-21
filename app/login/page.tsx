import { auth, signIn } from "@/auth";
import { Logo } from "@/components/logo";
import { Boxes, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

export const instant = false;

export default async function Login(){
  const session=await auth();
  if(session?.user) redirect("/dashboard");
  return <main className="grid min-h-screen lg:grid-cols-2"><section className="hidden bg-[#0e1322] p-12 text-white lg:flex lg:flex-col"><Logo/><div className="my-auto max-w-xl"><p className="text-sm font-semibold uppercase tracking-[.2em] text-indigo-300">Build your knowledge base</p><h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">Every great resource.<br/>One tidy place.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">Save the documentation, tools, and ideas that help you build better software.</p><div className="mt-10 space-y-4 text-sm text-slate-300">{["Private by default","Organized with collections and tags","Fast search across your entire stash"].map(x=><p className="flex items-center gap-3" key={x}><CheckCircle2 className="text-indigo-400" size={19}/>{x}</p>)}</div></div><p className="text-xs text-slate-500">Built for developers who value focus.</p></section><section className="grid place-items-center p-6"><div className="w-full max-w-sm"><div className="mb-10 lg:hidden"><Logo/></div><span className="grid size-12 place-items-center rounded-2xl bg-[var(--soft)] text-[var(--accent)]"><Boxes/></span><h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome to DevStash</h1><p className="muted mt-3 leading-6">Sign in to organize your developer resources and pick up where you left off.</p><form action={async()=>{"use server";await signIn("google",{redirectTo:"/dashboard"})}}><button className="panel mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl font-semibold transition hover:bg-[var(--bg)]"><span className="text-lg font-bold text-blue-500">G</span>Continue with Google</button></form><p className="muted mt-6 text-center text-xs leading-5">DevStash only requests your basic profile and email.</p></div></section></main>
}
