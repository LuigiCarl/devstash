import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy Policy", description: "How DevStash collects, uses, and protects user data." };

export default function PrivacyPolicy() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return <LegalPage title="Privacy Policy" updated="October 21, 2026">
    <section><h2>Overview</h2><p>DevStash is a private developer bookmark manager. This policy explains what information we collect, why we use it, where it is stored, and the choices available to you.</p></section>
    <section><h2>Information we collect</h2><ul><li>When you use Google Sign-In, we receive your name, email address, profile image, and a Google account identifier through the basic OpenID Connect profile and email scopes.</li><li>We store the bookmarks, descriptions, tags, collections, favorites, and preferences you create in DevStash.</li><li>We may process essential technical information such as session identifiers, request timestamps, and security logs needed to operate and protect the service.</li><li>Guest workspaces use a random session token stored in an HttpOnly cookie. Guest content is not connected to a Google account unless you choose to sign in.</li></ul></section>
    <section><h2>How we use Google user data</h2><p>Google account data is used only to authenticate you, create your DevStash account, display your profile, keep your workspace private, and let you return to the same workspace. DevStash does not request or access Gmail, Google Drive, contacts, calendars, or other Google service content.</p></section>
    <section><h2>Sharing and service providers</h2><p>We do not sell your personal information or use Google user data for advertising. Information may be processed by infrastructure providers used to run DevStash, including the hosting platform, database provider, and Google authentication services. We may also disclose information when required by law or necessary to protect users and the service.</p></section>
    <section><h2>Storage and retention</h2><p>Account data and saved resources are retained while your account remains active. You may permanently delete your account and its content from Settings. Guest workspaces expire after seven days and can be deleted sooner by ending the guest session. Backups and security records, if any, may remain for a limited period before routine deletion.</p></section>
    <section><h2>Security</h2><p>We use encrypted HTTPS connections, secure cookies, access controls, and account-level data separation. No internet service can guarantee absolute security, so you should avoid storing passwords, secret keys, access tokens, or other sensitive credentials as bookmarks or notes.</p></section>
    <section><h2>Your choices and rights</h2><ul><li>View and manage your saved content inside DevStash.</li><li>Sign out at any time.</li><li>Delete individual resources or permanently delete your account and associated workspace.</li><li>Revoke DevStash access from your Google Account permissions page.</li><li>Contact the support email shown on the DevStash Google OAuth consent screen for privacy or data requests.</li></ul></section>
    <section><h2>Children</h2><p>DevStash is not directed to children under 13, or the minimum age required in their country, and we do not knowingly collect their personal information.</p></section>
    <section><h2>Changes to this policy</h2><p>We may update this policy as the service changes. The latest version and effective date will always be published on this page.</p></section>
    <section><h2>Contact</h2><p>For privacy questions or requests, {supportEmail ? <>email <a className="font-semibold text-[var(--accent)] underline" href={`mailto:${supportEmail}`}>{supportEmail}</a>.</> : <>use the support email published on the DevStash Google OAuth consent screen.</>}</p></section>
  </LegalPage>;
}
