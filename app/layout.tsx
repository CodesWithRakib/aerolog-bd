// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// === CONFIGURATION – change these values to update site information ===
const SITE_NAME = "shomikaero";
const BASE_URL = "https://shomikaero.com";
// ======================================================================

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} – Air Sports Live Updates`,
  },
  description:
    "Live updates from the air sports world – paragliding, skydiving, hang gliding, and more. Real-time notifications from the sky.",
  keywords:
    "air sports, live updates, paragliding, skydiving, hang gliding, real-time",
  authors: [{ name: SITE_NAME }],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: `${SITE_NAME} – Air Sports Live Updates`,
    description: "Live updates from the air sports world",
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: "Real-time updates from the sky",
  },
  robots: "index, follow",
  alternates: {
    canonical: BASE_URL,
  },
};

// ✅ Moved viewport to its own export (Next.js 14+ requirement)
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Structured data for the website
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: BASE_URL,
  description:
    "Live updates from the air sports world – paragliding, skydiving, hang gliding, and more.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${inter.variable} 
          ${jetbrainsMono.variable} 
          antialiased
          bg-background
          text-foreground
          min-h-screen
          flex
          flex-col
          font-sans
        `}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background border border-border px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        <div id="main-content" className="flex-1">
          {children}
        </div>

        <footer className="border-t border-border py-6 mt-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-muted-foreground text-center">
              {SITE_NAME} — Real-time updates from the sky
            </p>
          </div>
        </footer>

        {/* Structured data */}
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
