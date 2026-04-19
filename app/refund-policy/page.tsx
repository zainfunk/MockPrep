import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy · Placed',
  description: 'Refund Policy for Placed.',
};

export default function RefundPolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-zinc">
      <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
      <p className="text-zinc-500 text-sm">Last updated: 2026-04-19</p>

      <h2>Free Tier</h2>
      <p>
        The free tier requires no payment — there is nothing to refund. If you cancel
        a paid subscription, your account continues with the free tier at no cost.
      </p>

      <h2>Monthly Subscriptions</h2>
      <p>
        Placed offers a 7-day refund window on your first paid subscription charge. If you
        are not satisfied within 7 days of your first payment, email{' '}
        <a href="mailto:support@placed.dev">support@placed.dev</a> from the email on your
        account and we will issue a full refund to your original payment method, no
        questions asked.
      </p>

      <p>
        After the first 7 days, subscriptions are non-refundable. You can cancel at any
        time from the <Link href="/pricing">Pricing page</Link> &rarr; Manage
        subscription. On cancellation, Pro access continues until the end of the current
        billing period, then the account reverts to the free tier.
      </p>

      <h2>Disputes and Chargebacks</h2>
      <p>
        If you believe you were charged in error, please email us before initiating a
        chargeback. Chargebacks without contacting us first may result in the associated
        account being disabled.
      </p>

      <h2>Exceptional Cases</h2>
      <p>
        We may consider refunds outside the standard window on a case-by-case basis for
        billing errors, service outages of more than 24 hours, or other exceptional
        circumstances. Contact us to discuss.
      </p>

      <h2>Processing Time</h2>
      <p>
        Refunds are issued to the original payment method and typically appear on your
        statement within 5–10 business days, depending on your bank.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about refunds? Email{' '}
        <a href="mailto:support@placed.dev">support@placed.dev</a>.
      </p>
    </article>
  );
}
