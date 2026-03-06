// app/page.tsx
import { Metadata } from "next";
import Script from "next/script";
import LiveFeed from "@/components/LiveFeed";
import { client } from "@/sanity/lib/client";
import { allUpdatesQuery } from "@/sanity/lib/queries";
import Image from "next/image";

// === CONFIGURATION – change these values to update site information ===
const SITE_NAME = "shomikaero";
const BASE_URL = "https://shomikaero.com";
// ======================================================================

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Live Feed",
  description:
    "Real-time updates from the air sports world – paragliding, skydiving, hang gliding, and more.",
  openGraph: {
    title: `Live Feed | ${SITE_NAME}`,
    description: "Real-time updates from the air sports world",
    url: BASE_URL,
  },
};

async function getUpdates() {
  const updates = await client.fetch(allUpdatesQuery);
  return updates;
}

// Structured data for the live feed (optional, can be expanded)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Live Feed | ${SITE_NAME}`,
  description: metadata.description,
  url: BASE_URL,
};

export default async function Home() {
  const initialUpdates = await getUpdates();

  return (
    <>
      {/* Sticky header – now with solid white background to prevent content from showing through */}
      <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                {SITE_NAME}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Air sports live updates
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <LiveFeed initialUpdates={initialUpdates} />
      </main>

      {/* Structured data for SEO */}
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
