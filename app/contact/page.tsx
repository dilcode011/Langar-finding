import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us — Langar Finder',
  description:
    'Get in touch with the Langar Finder team. Report issues, suggest Gurudwaras, or join our WhatsApp community for real-time langar updates.',
  alternates: { canonical: 'https://langarfind.com/contact' },
};

// JSON-LD ContactPage schema
const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Langar Finder',
  url: 'https://langarfind.com/contact',
  description: 'Get in touch with the Langar Finder team',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-12 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#2D5A1E]/60">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-[#2D5A1E]">Contact</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-extrabold text-[#2D5A1E] mb-3">Contact Us</h1>
      <p className="text-[#2D5A1E]/70 font-medium mb-10 leading-relaxed">
        Have a question, found an issue with a listing, or want to suggest a
        Gurudwara we&apos;re missing? Reach out — we read every message.
      </p>

      {/* Contact options */}
      <div className="space-y-6">

        {/* Email */}
        <div className="rounded-2xl border border-[#E2E8D4] bg-[#F7FAF0] p-6">
          <h2 className="text-base font-extrabold text-[#2D5A1E] mb-1">📧 Email</h2>
          <p className="text-sm text-[#2D5A1E]/70 mb-2">
            For general enquiries, listing corrections, or partnership requests:
          </p>
          <a
            href="mailto:hello@langarfind.com"
            className="text-sm font-bold text-[#2D5A1E] hover:underline"
          >
            hello@langarfind.com
          </a>
          {/* PLACEHOLDER — replace with real email */}
        </div>

        {/* WhatsApp community */}
        <div className="rounded-2xl border border-[#E2E8D4] bg-[#F7FAF0] p-6">
          <h2 className="text-base font-extrabold text-[#2D5A1E] mb-1">💬 WhatsApp Community</h2>
          <p className="text-sm text-[#2D5A1E]/70 mb-3">
            The fastest way to connect, report a langar, or get help from our
            community of volunteers:
          </p>
          <a
            href="https://chat.whatsapp.com/Gjet1eEmideEbH5wxWVzwx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-extrabold hover:bg-[#1da851] transition-colors"
          >
            Join WhatsApp Community
          </a>
        </div>

        {/* Report a listing */}
        <div className="rounded-2xl border border-[#E2E8D4] bg-[#F7FAF0] p-6">
          <h2 className="text-base font-extrabold text-[#2D5A1E] mb-1">🚩 Report a Listing</h2>
          <p className="text-sm text-[#2D5A1E]/70 mb-3">
            If a langar listing has incorrect information or is no longer active,
            use the &ldquo;Report&rdquo; button on any listing page, or email us
            with the listing name and the issue.
          </p>
          <Link
            href="/search"
            className="text-sm font-bold text-[#2D5A1E] hover:underline"
          >
            Browse listings →
          </Link>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-[#E2E8D4] flex flex-wrap gap-4 text-sm">
        <Link href="/faq" className="text-[#2D5A1E] hover:underline font-medium">FAQ</Link>
        <Link href="/about" className="text-[#2D5A1E] hover:underline font-medium">About Us</Link>
        <Link href="/" className="text-[#2D5A1E] hover:underline font-medium">Back to Home</Link>
      </div>
    </div>
  );
}
