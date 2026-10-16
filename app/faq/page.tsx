import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — Langar Finder',
  description:
    'Frequently asked questions about Langar Finder — how to find free langar near you, submit a Gurudwara, get verified, and more.',
  alternates: { canonical: 'https://langarfind.com/faq' },
};

const faqs = [
  {
    q: 'What is langar?',
    a: 'Langar is the Sikh tradition of a free community kitchen open to people of all religions, castes, and backgrounds. It is served at Gurudwaras (Sikh temples) and by community volunteers worldwide.',
  },
  {
    q: 'Is Langar Finder free to use?',
    a: 'Yes. Langar Finder is completely free for everyone. Langar itself is always free, and this platform is too.',
  },
  {
    q: 'How do I find a langar near me?',
    a: 'Click "Search Near Me (GPS)" on the homepage to allow location access and instantly see verified Gurudwaras and langars within 20 km of your current position.',
  },
  {
    q: 'How do I add a Gurudwara or langar listing?',
    a: 'Create a free account and click "Add a Langar" in the navigation. Fill in the name, address, timing, and food items. Your listing will be reviewed and approved by our moderators within 24–48 hours.',
  },
  {
    q: 'How are listings verified?',
    a: 'Listings are marked "Verified" after our community moderators confirm the information via direct contact or on-ground verification. Listings that receive 20 or more community "Likes" are automatically flagged for priority verification.',
  },
  {
    q: 'What is a "Regular Feeder"?',
    a: 'A Regular Feeder is an individual or organisation that provides free meals on a daily or weekly basis — not necessarily at a Gurudwara. These can be community kitchens, NGOs, or volunteer groups.',
  },
  {
    q: 'What is a "Historical Gurudwara"?',
    a: 'Historical Gurudwaras are shrines of significant religious or historical importance within Sikhism — for example, those associated with the ten Sikh Gurus.',
  },
  {
    q: 'A listing has wrong information. How do I report it?',
    a: 'Open the listing page and click the "Report" button. Describe the issue and submit. Our team will review and update the listing promptly.',
  },
  {
    q: 'Can I use Langar Finder outside India?',
    a: 'Yes! We welcome listings from anywhere in the world where Gurudwaras and langar are active. Use the "Add a Langar" form and select the appropriate region.',
  },
  {
    q: 'How do I join the WhatsApp community?',
    a: 'Click the "Join Community" button in the header or visit our WhatsApp group link to connect with volunteers, share updates, and coordinate food drives.',
  },
];

// FAQPage JSON-LD schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-12 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#2D5A1E]/60">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-[#2D5A1E]">FAQ</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-extrabold text-[#2D5A1E] mb-3">
        Frequently Asked Questions
      </h1>
      <p className="text-[#2D5A1E]/70 font-medium mb-10 leading-relaxed">
        Everything you need to know about using Langar Finder to discover free
        community meals and Gurudwaras near you.
      </p>

      {/* FAQ list */}
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-[#E2E8D4] bg-[#F7FAF0] open:bg-white transition-colors"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-bold text-[#2D5A1E] list-none">
              <h2 className="text-base font-extrabold">{faq.q}</h2>
              <span className="text-xl text-[#A1CB35] group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="px-5 pb-5 text-sm text-[#2D5A1E]/75 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-[#A1CB35] p-6 text-center">
        <p className="font-extrabold text-[#2D5A1E] mb-3">Still have questions?</p>
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#2D5A1E] text-white text-sm font-extrabold hover:bg-[#234A17] transition-colors"
        >
          Contact Us
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-[#E2E8D4] flex flex-wrap gap-4 text-sm">
        <Link href="/about" className="text-[#2D5A1E] hover:underline font-medium">About Us</Link>
        <Link href="/help" className="text-[#2D5A1E] hover:underline font-medium">Help & Support</Link>
        <Link href="/" className="text-[#2D5A1E] hover:underline font-medium">Back to Home</Link>
      </div>
    </div>
  );
}
