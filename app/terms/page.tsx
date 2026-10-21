import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of Service", description: "Terms governing use of DevStash." };

export default function Terms() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return <LegalPage title="Terms of Service" updated="October 21, 2026">
    <section><h2>Acceptance</h2><p>By accessing or using DevStash, you agree to these terms and the Privacy Policy. If you do not agree, do not use the service.</p></section>
    <section><h2>The service</h2><p>DevStash helps users save and organize developer resources. Features may change, be suspended, or be discontinued as the service evolves.</p></section>
    <section><h2>Your account</h2><p>You are responsible for maintaining access to your Google account and for activity performed through your DevStash session. You must provide accurate information and promptly report suspected unauthorized access.</p></section>
    <section><h2>Acceptable use</h2><ul><li>Do not use DevStash for unlawful, abusive, deceptive, or harmful activity.</li><li>Do not attempt to bypass security controls, access another user’s data, disrupt the service, or introduce malicious code.</li><li>Do not store passwords, private keys, access tokens, or illegal content in the service.</li><li>Respect intellectual-property and privacy rights when saving or sharing information.</li></ul></section>
    <section><h2>Your content</h2><p>You retain ownership of the content you add. You grant DevStash only the limited permission needed to store, process, and display that content back to you as part of the service.</p></section>
    <section><h2>Third-party services and links</h2><p>DevStash uses third-party infrastructure and Google Sign-In and may contain links to external websites. Those services have their own terms and privacy practices, and DevStash is not responsible for external content.</p></section>
    <section><h2>Availability and warranties</h2><p>The service is provided “as is” and “as available.” To the extent permitted by law, we disclaim implied warranties and do not guarantee uninterrupted operation, permanent storage, or that every external link remains safe or available.</p></section>
    <section><h2>Termination</h2><p>You may stop using DevStash or delete your account at any time. We may restrict access when reasonably necessary to protect the service, comply with law, or address a violation of these terms.</p></section>
    <section><h2>Changes and contact</h2><p>We may update these terms and will publish the latest version on this page. Questions may be sent {supportEmail ? <>to <a className="font-semibold text-[var(--accent)] underline" href={`mailto:${supportEmail}`}>{supportEmail}</a></> : <>to the support email listed on the DevStash Google OAuth consent screen</>}.</p></section>
  </LegalPage>;
}
