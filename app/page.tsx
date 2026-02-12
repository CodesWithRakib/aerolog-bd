// app/page.tsx
import LiveFeed from "@/components/LiveFeed";
import { client } from "@/sanity/lib/client";
import { allUpdatesQuery } from "@/sanity/lib/queries";
import Image from "next/image";

export const revalidate = 10;

async function getUpdates() {
  const updates = await client.fetch(allUpdatesQuery);
  return updates;
}

export default async function Home() {
  const initialUpdates = await getUpdates();

  return (
    <>
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
                Air Sports Live
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Real-time updates from the sky
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
    </>
  );
}

export const metadata = {
  title: "Air Sports Live - Real-time Updates",
  description:
    "Live updates from the air sports world - paragliding, skydiving, and more",
};
