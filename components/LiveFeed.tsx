// components/LiveFeed.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { clientWithToken } from "@/sanity/lib/client";
import { allUpdatesQuery } from "@/sanity/lib/queries";

interface Update {
  _id: string;
  title?: string;
  content: string;
  publishedAt: string;
}

interface LiveFeedProps {
  initialUpdates: Update[];
}

export default function LiveFeed({ initialUpdates }: LiveFeedProps) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [isConnected, setIsConnected] = useState(true);

  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  useEffect(() => {
    const subscription = clientWithToken
      .listen(allUpdatesQuery, {}, { visibility: "query" })
      .subscribe({
        next: () => {
          clientWithToken.fetch(allUpdatesQuery).then(setUpdates);
          setIsConnected(true);
        },
        error: () => setIsConnected(false),
      });

    return () => subscription.unsubscribe();
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return formatInTimeZone(date, timezone, "MMM d");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatInTimeZone(date, timezone, "h:mm a");
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatInTimeZone(date, timezone, "MMM d, yyyy 'at' h:mm a");
  };

  const formatLastUpdated = () => {
    return formatInTimeZone(new Date(), timezone, "h:mm a");
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <div className="w-2 h-2 bg-emerald-600 rounded-full" />
              <div
                className={`absolute inset-0 w-2 h-2 bg-emerald-600 rounded-full animate-ping ${
                  isConnected ? "opacity-75" : "opacity-0"
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-900">
                Live Updates
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline">•</span>
              <span
                className={`text-xs ${
                  isConnected ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {isConnected ? "Connected" : "Reconnecting..."}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{formatLastUpdated()}</span>
            <span className="text-xs font-mono bg-gray-100 px-3 py-1.5 text-gray-700">
              {updates.length} {updates.length === 1 ? "update" : "updates"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {updates.map((update, index) => (
          <article
            key={update._id}
            className="relative bg-white border border-gray-200 p-6 sm:p-8"
          >
            {index === 0 && (
              <div className="absolute -top-px -left-px flex">
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium border-b border-r border-emerald-200">
                  Latest
                </span>
              </div>
            )}

            <div className={index === 0 ? "mt-8" : ""}>
              <div className="flex items-start justify-between gap-4 mb-3">
                {update.title && (
                  <h2 className="font-semibold text-gray-900 text-lg sm:text-xl tracking-tight">
                    {update.title}
                  </h2>
                )}
                <div className="flex flex-col items-end gap-1 ml-auto">
                  <time
                    className="text-xs text-gray-400 whitespace-nowrap font-mono"
                    dateTime={update.publishedAt}
                    title={formatFullDate(update.publishedAt)}
                  >
                    {getTimeAgo(update.publishedAt)}
                  </time>
                  <span className="text-[10px] text-gray-300 font-mono">
                    {formatTime(update.publishedAt)}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {update.content}
                </p>
              </div>

              {update.content.length > 200 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-xs text-gray-500 hover:text-gray-700 group">
                    Read more
                    <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {updates.length === 0 && (
        <div className="text-center py-16 sm:py-20 px-6 border border-gray-200 bg-gray-50">
          <div className="w-16 h-16 mx-auto mb-4 border border-gray-200 bg-white flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-gray-900 text-base sm:text-lg font-medium mb-2">
            No updates yet
          </h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-sm mx-auto">
            Check back soon
          </p>
        </div>
      )}

      {updates.length > 0 && (
        <div className="relative flex justify-center pt-4 sm:pt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-4 text-xs text-gray-400">
            End of feed
          </span>
        </div>
      )}
    </div>
  );
}
