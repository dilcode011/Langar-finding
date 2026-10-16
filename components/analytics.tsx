'use client';

import Script from 'next/script';

/**
 * Google Tag Manager snippet.
 * Replace GTM-XXXXXXX with your real GTM container ID.
 * To activate: import this component in app/layout.tsx and render it inside <head>.
 *
 * MANUAL STEP REQUIRED:
 *   1. Create a GTM container at https://tagmanager.google.com/
 *   2. Replace 'GTM-XXXXXXX' below with your container ID
 *   3. In GTM, create a GA4 Configuration tag with your GA4 Measurement ID
 *   4. Set up GA4 events: purchase, add_to_cart, form_submit, click (call/WhatsApp)
 */

const GTM_ID = 'GTM-XXXXXXX'; // PLACEHOLDER — replace with real GTM ID

export function GoogleTagManager() {
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') return null;

  return (
    <>
      {/* GTM Script — loads lazily after page is interactive */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}

/** GTM noscript fallback — add this as the first child of <body> */
export function GoogleTagManagerNoscript() {
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

/** Push a custom event to the GTM dataLayer */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({ event: eventName, ...params });
  }
}
