export const metadata = {
  title: 'Privacy Policy · Placed',
  description: 'Privacy Policy for Placed.',
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-zinc">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-zinc-500 text-sm">Last updated: 2026-04-19</p>

      <p className="mt-8">
        This Privacy Policy explains how Placed collects, uses, and protects your
        information when you use our Service.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account information:</strong> email address and authentication data (managed by Clerk).</li>
        <li><strong>Usage data:</strong> session history, scores, feedback reports, code submissions, and chat transcripts.</li>
        <li><strong>Billing information:</strong> we do not store payment card data. Stripe processes and stores all billing information. We receive only customer and subscription IDs.</li>
        <li><strong>Technical data:</strong> IP address, browser type, and general device information for security and rate limiting.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide, operate, and improve the Service.</li>
        <li>To generate interview feedback and score your sessions.</li>
        <li>To process subscriptions and handle billing through Stripe.</li>
        <li>To enforce usage limits and prevent abuse.</li>
        <li>To communicate with you about your account, billing, and product updates.</li>
      </ul>

      <h2>3. Third-Party Processors</h2>
      <p>We share data only with processors required to operate the Service:</p>
      <ul>
        <li><strong>Clerk</strong> — authentication and user management.</li>
        <li><strong>Supabase</strong> — database storage for session history.</li>
        <li><strong>Anthropic</strong> — AI model provider. Chat content is sent to generate responses and feedback. Anthropic does not use API content to train models by default.</li>
        <li><strong>Stripe</strong> — billing and subscription management.</li>
        <li><strong>Judge0</strong> — sandboxed code execution. Code submissions are sent to Judge0 to run and return output.</li>
        <li><strong>Vercel</strong> — hosting and analytics.</li>
      </ul>
      <p>We do not sell your data to third parties.</p>

      <h2>4. Data Retention</h2>
      <p>
        We retain your account data and session history for as long as your account is
        active. You may request deletion of your account and associated data at any time
        by contacting us. On deletion, we may retain anonymized aggregate data and records
        required for legal or tax purposes.
      </p>

      <h2>5. Your Rights</h2>
      <p>Depending on your location you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction or deletion of that data.</li>
        <li>Export your data in a portable format.</li>
        <li>Withdraw consent for processing (where applicable).</li>
      </ul>
      <p>
        To exercise any of these rights, email us at{' '}
        <a href="mailto:support@placed.dev">support@placed.dev</a>.
      </p>

      <h2>6. Security</h2>
      <p>
        We use industry-standard security measures including encrypted connections (HTTPS),
        authenticated API routes, and third-party providers with SOC 2 / ISO 27001
        certifications. No system is perfectly secure, however — we cannot guarantee that
        your data will never be compromised.
      </p>

      <h2>7. Children</h2>
      <p>
        The Service is not directed at children under 13 and we do not knowingly collect
        information from anyone under 13.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use cookies that are strictly necessary for authentication and session
        management. We do not use advertising or third-party tracking cookies.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be
        communicated to registered users.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this Privacy Policy? Contact us at{' '}
        <a href="mailto:support@placed.dev">support@placed.dev</a>.
      </p>
    </article>
  );
}
