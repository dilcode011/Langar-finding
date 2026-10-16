import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use — Langar Finder',
  description:
    'Read the Langar Finder Terms of Use. Understand your rights and responsibilities when using our free community-meals discovery platform.',
  alternates: { canonical: 'https://langarfind.com/terms' },
};

export default function TermsPage() {
  const lastUpdated = '2026-10-16';

  return (
    <div className="container mx-auto px-4 lg:px-6 py-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#2D5A1E]/60">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-[#2D5A1E]">Terms of Use</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-extrabold text-[#2D5A1E] mb-2">Terms of Use</h1>
      <p className="text-sm text-[#2D5A1E]/60 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-green max-w-none space-y-6 text-[#2D5A1E]/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Langar Finder (<strong>langarfind.com</strong>),
            you agree to be bound by these Terms of Use. If you do not agree,
            please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">2. Community Guidelines</h2>
          <p>When submitting listings, you agree to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Provide accurate, up-to-date information about langar locations.</li>
            <li>Not post false, misleading, or fraudulent listings.</li>
            <li>Respect all communities regardless of religion, caste, or background.</li>
            <li>Not use the platform for commercial promotion without permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">3. User Content</h2>
          <p>
            You retain ownership of content you submit. By submitting, you grant
            Langar Finder a non-exclusive, worldwide, royalty-free licence to
            display and distribute your content for the purposes of operating
            the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">4. Moderation</h2>
          <p>
            All listings are subject to moderation. We reserve the right to
            approve, reject, or remove any listing that violates these terms or
            community standards without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">5. Disclaimer</h2>
          <p>
            Langar Finder provides listing information on a best-effort basis.
            We do not guarantee the accuracy, availability, or quality of any
            listed langar. Always verify details before visiting.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Langar Finder shall not be
            liable for any indirect, incidental, or consequential damages arising
            from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">7. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the platform
            after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">8. Contact</h2>
          <p>
            For questions about these terms, email{' '}
            <a href="mailto:hello@langarfind.com" className="underline">
              hello@langarfind.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-[#E2E8D4] flex flex-wrap gap-4 text-sm">
        <Link href="/privacy" className="text-[#2D5A1E] hover:underline font-medium">Privacy Policy</Link>
        <Link href="/contact" className="text-[#2D5A1E] hover:underline font-medium">Contact Us</Link>
        <Link href="/" className="text-[#2D5A1E] hover:underline font-medium">Back to Home</Link>
      </div>
    </div>
  );
}
