"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Clock, LogOut, Monitor, Moon, ShieldCheck, Sun, Trash2 } from "lucide-react";
import { PageHeading } from "./page-heading";
import { AccessibleDialog } from "./accessible-dialog";
import { UserAvatar } from "./user-avatar";

type Actor = { kind: "user" | "guest"; name: string | null; email: string | null; image: string | null };
const subscribeToMount = () => () => {};

export function SettingsClient({ actor }: { actor: Actor }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToMount, () => true, () => false);
  const router = useRouter();
  const [dialog, setDialog] = useState<"guest" | "account" | null>(null);
  const [working, setWorking] = useState(false);

  async function leaveGuest() {
    setWorking(true);
    const response = await fetch("/api/guest", { method: "DELETE" });
    if (response.ok) { router.replace("/login"); router.refresh(); }
    else setWorking(false);
  }

  async function deleteAccount() {
    setWorking(true);
    const response = await fetch("/api/account", { method: "DELETE" });
    if (response.ok) { await signOut({ callbackUrl: "/" }); return; }
    setWorking(false);
  }

  return <>
    <PageHeading title="Settings" description="Manage your profile, privacy, and workspace preferences." />
    <div className="grid max-w-3xl gap-5">
      <section className="panel rounded-2xl p-6"><h2 className="font-semibold">Profile</h2><p className="muted mt-1 text-sm">{actor.kind === "guest" ? "This is a temporary private workspace." : actor.email ? "Your profile comes from your Google account." : "You are signed in with a local DevStash account."}</p><div className="mt-6 flex items-center gap-4"><UserAvatar image={actor.image} name={actor.name ?? (actor.kind === "guest" ? "Guest" : null)} email={actor.email} size="lg" /><div><p className="font-semibold">{actor.name ?? "Guest"}</p><p className="muted text-sm">{actor.email ?? (actor.kind === "guest" ? "No account connected" : "Local account")}</p></div><span className={`ml-auto hidden items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold sm:flex ${actor.kind === "guest" ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>{actor.kind === "guest" ? <Clock size={14} /> : <ShieldCheck size={14} />} {actor.kind === "guest" ? "Available for up to 7 days" : actor.email ? "Google connected" : "Local account"}</span></div></section>
      <section className="panel rounded-2xl p-6"><h2 className="font-semibold">Appearance</h2><p className="muted mt-1 text-sm">Choose how DevStash looks on this device.</p><div className="mt-5 grid grid-cols-3 gap-3">{[["light", "Light", Sun], ["dark", "Dark", Moon], ["system", "System", Monitor]].map(([value, label, Icon]) => <button key={String(value)} disabled={!mounted} onClick={() => setTheme(String(value))} aria-pressed={mounted && theme === value} className={`flex flex-col items-center gap-3 rounded-xl border p-4 text-sm font-medium transition disabled:cursor-wait ${mounted && theme === value ? "border-indigo-500 bg-[var(--soft)] text-[var(--accent)] shadow-sm" : "border-[var(--line)] hover:bg-[var(--bg)]"}`}><Icon size={20} />{String(label)}</button>)}</div></section>
      <section className="panel rounded-2xl p-6"><h2 className="font-semibold">Privacy and legal</h2><p className="muted mt-1 text-sm">Review how DevStash handles your account and saved resources.</p><div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-[var(--accent)]"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link><Link href="/account-deletion">Data deletion instructions</Link></div></section>
      <section className="panel flex items-center justify-between gap-4 rounded-2xl p-6"><div><h2 className="font-semibold">{actor.kind === "guest" ? "Delete guest workspace" : "Sign out"}</h2><p className="muted mt-1 text-sm">{actor.kind === "guest" ? "Ending the session permanently deletes all guest bookmarks, tags, and collections." : "End your current DevStash session on this device."}</p></div><button onClick={() => actor.kind === "guest" ? setDialog("guest") : void signOut({ callbackUrl: "/login" })} className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-semibold"><LogOut size={16} />{actor.kind === "guest" ? "End session" : "Sign out"}</button></section>
      {actor.kind === "user" && <section className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold text-rose-600">Delete account</h2><p className="muted mt-1 text-sm">Permanently delete your profile and all bookmarks, tags, collections, and sessions.</p></div><button onClick={() => setDialog("account")} className="flex shrink-0 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white"><Trash2 size={16} />Delete</button></div></section>}
    </div>
    {dialog === "guest" && <AccessibleDialog title="Delete guest workspace?" labelledBy="delete-guest-title" onClose={() => setDialog(null)}><p className="muted mt-4 text-sm leading-6">All bookmarks, collections, and tags in this guest workspace will be permanently deleted. This cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDialog(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Keep workspace</button><button disabled={working} onClick={() => void leaveGuest()} className="rounded-xl bg-rose-600 px-4 py-2 text-white disabled:opacity-60">{working ? "Deleting…" : "Delete workspace"}</button></div></AccessibleDialog>}
    {dialog === "account" && <AccessibleDialog title="Permanently delete account?" labelledBy="delete-account-title" onClose={() => setDialog(null)}><p className="muted mt-4 text-sm leading-6">This permanently deletes your DevStash profile and every bookmark, tag, and collection associated with it. Your Google account will not be deleted. This action cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDialog(null)} className="rounded-xl border border-[var(--line)] px-4 py-2">Cancel</button><button disabled={working} onClick={() => void deleteAccount()} className="rounded-xl bg-rose-600 px-4 py-2 text-white disabled:opacity-60">{working ? "Deleting…" : "Delete my account"}</button></div></AccessibleDialog>}
  </>;
}
