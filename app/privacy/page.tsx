import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Langar Finder',
  description:
    'Read the Langar Finder Privacy Policy to learn how we collect, use, and protect your personal information on our free community-meals platform.',
  alternates: { canonical: 'https://langarfind.com/privacy' },
};

export default function PrivacyPage() {
  const lastUpdated = '2026-10-16';

  return (
    <div className="container mx-auto px-4 lg:px-6 py-12 max-w-3xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#2D5A1E]/60">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-[#2D5A1E]">Privacy Policy</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-extrabold text-[#2D5A1E] mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#2D5A1E]/60 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-green max-w-none space-y-6 text-[#2D5A1E]/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">1. Who We Are</h2>
          <p>
            Langar Finder (<strong>langarfind.com</strong>) is a community-driven
            website that helps people discover verified Gurudwaras and free langar
            (community meals) across India. References to &ldquo;we&rdquo;,
            &ldquo;us&rdquo;, or &ldquo;our&rdquo; mean the Langar Finder team.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">2. Information We Collect</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Account data:</strong> email address and display name when you sign up.</li>
            <li><strong>Submission data:</strong> langar name, address, timing, photos, and contact numbers you voluntarily provide.</li>
            <li><strong>Location data:</strong> if you use &ldquo;Search Near Me&rdquo;, your browser requests your GPS coordinates. We do not store this on our servers.</li>
            <li><strong>Usage data:</strong> page views, search queries, and feature interactions (anonymised).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">3. How We Use Your Data</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>To operate, improve, and personalise the platform.</li>
            <li>To verify and moderate community-submitted listings.</li>
            <li>To send service-related notifications (only if you opt in).</li>
            <li>To prevent abuse and maintain platform security.</li>
          </ul>
          <p className="mt-2">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">4. Third-Party Services</h2>
          <p>
            We use <strong>Supabase</strong> for database and authentication,
            hosted in the European Union. Supabase complies with GDPR.
            We may also use Google Analytics (anonymised IP) for aggregate usage
            insights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">5. Cookies</h2>
          <p>
            We use essential session cookies required for authentication. We do
            not use tracking cookies without your consent. You can disable
            cookies in your browser settings, though some features may not work.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time by emailing{' '}
            <a href="mailto:hello@langarfind.com" className="underline">
              hello@langarfind.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Significant changes will be
            announced on the platform. The &ldquo;Last updated&rdquo; date at
            the top reflects the most recent revision.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#2D5A1E] mb-2">8. Contact</h2>
          <p>
            For privacy-related queries, email us at{' '}
            <a href="mailto:hello@langarfind.com" className="underline">
              hello@langarfind.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-[#E2E8D4] flex flex-wrap gap-4 text-sm">
        <Link href="/terms" className="text-[#2D5A1E] hover:underline font-medium">Terms of Use</Link>
        <Link href="/contact" className="text-[#2D5A1E] hover:underline font-medium">Contact Us</Link>
        <Link href="/" className="text-[#2D5A1E] hover:underline font-medium">Back to Home</Link>
      </div>
    </div>
  );
}
