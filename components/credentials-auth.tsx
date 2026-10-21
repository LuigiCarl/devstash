"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

export function CredentialsAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true); setError("");
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    try {
      if (mode === "register") {
        const confirmPassword = String(form.get("confirmPassword") ?? "");
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password, name: name || undefined }) });
        const result = await response.json().catch(() => null);
        if (!response.ok) { setError(result?.error ?? "Could not create account."); return; }
      }

      const result = await signIn("credentials", { username, password, redirect: false });
      if (result?.error) { setError(mode === "login" ? "Invalid username or password." : "Account created. Please log in with your new credentials."); return; }
      router.replace("/dashboard"); router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setWorking(false);
    }
  }

  return <div className="mt-7">
    <div className="grid grid-cols-2 rounded-xl bg-[var(--soft)] p-1 text-sm font-semibold"><button type="button" onClick={() => { setMode("login"); setError(""); }} className={`rounded-lg px-3 py-2.5 transition ${mode === "login" ? "bg-[var(--panel)] text-[var(--text)] shadow-sm" : "muted hover:text-[var(--text)]"}`}>Log in</button><button type="button" onClick={() => { setMode("register"); setError(""); }} className={`rounded-lg px-3 py-2.5 transition ${mode === "register" ? "bg-[var(--panel)] text-[var(--text)] shadow-sm" : "muted hover:text-[var(--text)]"}`}>Create account</button></div>
    <form onSubmit={submit} className="mt-5 space-y-4">
      {mode === "register" && <label className="block text-sm font-semibold">Display name <span className="muted font-normal">(optional)</span><input name="name" maxLength={60} autoComplete="name" placeholder="How should we call you?" className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" /></label>}
      <label className="block text-sm font-semibold">Username<div className="relative mt-2"><UserRound className="muted absolute left-3.5 top-1/2 -translate-y-1/2" size={18} /><input name="username" required minLength={3} maxLength={30} pattern="[A-Za-z0-9_]+" autoComplete="username" placeholder="your_username" className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" /></div>{mode === "register" && <span className="muted mt-1.5 block text-xs font-normal">Letters, numbers, and underscores only.</span>}</label>
      <label className="block text-sm font-semibold">Password<div className="relative mt-2"><LockKeyhole className="muted absolute left-3.5 top-1/2 -translate-y-1/2" size={18} /><input name="password" required minLength={8} maxLength={72} type={showPassword ? "text" : "password"} autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder={mode === "register" ? "At least 8 characters" : "Enter your password"} className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] pl-11 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="muted absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 hover:text-[var(--text)]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
      {mode === "register" && <label className="block text-sm font-semibold">Confirm password<div className="relative mt-2"><LockKeyhole className="muted absolute left-3.5 top-1/2 -translate-y-1/2" size={18} /><input name="confirmPassword" required minLength={8} maxLength={72} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter the password again" className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" /></div></label>}
      {error && <p role="alert" className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-600">{error}</p>}
      <button disabled={working} className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60">{working ? "Please wait…" : mode === "login" ? "Log in to DevStash" : "Create my account"}</button>
    </form>
  </div>;
}
