import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service · Placed',
  description: 'Terms of Service for Placed.',
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-zinc">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-zinc-500 text-sm">Last updated: 2026-04-19</p>

      <p className="mt-8">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Placed
        (&quot;the Service&quot;), operated by the Placed team (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By creating
        an account or using the Service you agree to these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        Placed provides AI-powered mock technical interview practice, including live
        streaming chat with an AI interviewer, a code editor, execution of user-written
        code against a third-party sandbox, and written feedback on completed sessions.
        Features may change at any time without notice.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must create an account to use most of the Service. You are responsible for
        maintaining the security of your login credentials and for all activity on your
        account. You must be at least 13 years old to use the Service.
      </p>

      <h2>3. Subscriptions and Billing</h2>
      <ul>
        <li>The Service offers a free tier (2 sessions per month) and a paid Pro tier ($19/month, 20 sessions).</li>
        <li>Subscriptions auto-renew monthly until canceled. You can cancel at any time from the Manage Subscription link in your account.</li>
        <li>Billing is handled by Stripe. We do not store your payment information on our servers.</li>
        <li>Unused monthly sessions do not roll over.</li>
        <li>Refunds are handled according to our <Link href="/refund-policy">Refund Policy</Link>.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose or in violation of any applicable law.</li>
        <li>Attempt to reverse-engineer, scrape, resell, or rebuild the Service.</li>
        <li>Use automated systems to create accounts, generate sessions, or avoid usage limits.</li>
        <li>Submit code intended to exfiltrate data, exploit the sandbox, or harm our infrastructure.</li>
        <li>Submit content that is harassing, defamatory, or violates the rights of any third party.</li>
      </ul>

      <h2>5. Your Content</h2>
      <p>
        You retain ownership of the code you write and the messages you send. You grant us
        a license to store, display, and process that content as necessary to operate the
        Service and generate feedback. We may use aggregated, anonymized data to improve
        the Service.
      </p>

      <h2>6. AI Output</h2>
      <p>
        AI-generated responses are provided as-is. They may be inaccurate, incomplete, or
        misleading. The Service is intended as practice only — it is not a substitute for
        professional career coaching, legal advice, or guaranteed employment outcomes.
      </p>

      <h2>7. Third-Party Services</h2>
      <p>
        The Service relies on third-party providers including Anthropic (AI), Clerk
        (authentication), Supabase (storage), Stripe (billing), and Judge0 (code execution).
        Your use of the Service is also subject to their respective terms.
      </p>

      <h2>8. Termination</h2>
      <p>
        We may suspend or terminate your account at any time for violation of these Terms.
        You may delete your account at any time by contacting us. On termination, your
        right to use the Service ends immediately.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranty of any kind. We do not
        guarantee the accuracy of AI output, uptime, or that the Service will meet your
        specific needs.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, our total liability to you for any claim
        arising from the Service will not exceed the amount you paid us in the 12 months
        preceding the claim.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify users of material
        changes. Continued use after changes constitutes acceptance.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these Terms? Contact us at{' '}
        <a href="mailto:support@placed.dev">support@placed.dev</a>.
      </p>
    </article>
  );
}
