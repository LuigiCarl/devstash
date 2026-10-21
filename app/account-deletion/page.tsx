import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Account Deletion", description: "How to delete a DevStash account and its data." };

export default function AccountDeletion() {
  return <LegalPage title="Account and data deletion" updated="October 21, 2026">
    <section><h2>Delete from DevStash</h2><p>Sign in, open <Link href="/dashboard/settings" className="font-semibold text-[var(--accent)] underline">Settings</Link>, choose <strong>Delete account</strong>, and confirm. This permanently deletes your DevStash profile, active sessions, bookmarks, tags, and collections.</p></section>
    <section><h2>Guest workspace</h2><p>Open Settings and choose <strong>End session</strong>. This permanently deletes the guest workspace. Unused guest workspaces expire after seven days.</p></section>
    <section><h2>Revoke Google access</h2><p>Deleting DevStash data does not delete your Google account. You may separately remove DevStash from your Google Account’s third-party connections page. Revoking access alone does not delete data already stored in DevStash, so use the in-app deletion option first.</p></section>
    <section><h2>Need help?</h2><p>If you cannot access your account, contact the support email shown on the DevStash Google OAuth consent screen and send the request from the same email address associated with the account.</p></section>
  </LegalPage>;
}
