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
    <section
      aria-labelledby="live-feed-heading"
      className="space-y-8 sm:space-y-10 w-full max-w-full overflow-hidden"
    >
      {/* Live status header – no longer sticky, with improved wrapping for small screens */}
      <div className="bg-background/95 backdrop-blur-sm -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left section: live indicator and connection status */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div
                className={`absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping ${
                  isConnected ? "opacity-75" : "opacity-0"
                }`}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                Live Updates
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                •
              </span>
              <span
                className={`text-xs whitespace-nowrap ${
                  isConnected ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {isConnected ? "Connected" : "Reconnecting..."}
              </span>
            </div>
          </div>

          {/* Right section: last updated and update count */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatLastUpdated()}
            </span>
            <span className="text-xs font-mono bg-muted px-3 py-1.5 text-foreground whitespace-nowrap">
              {updates.length} {updates.length === 1 ? "update" : "updates"}
            </span>
          </div>
        </div>
      </div>

      {/* Updates list – each article has max width and proper text wrapping */}
      <div className="space-y-5 sm:space-y-6">
        {updates.map((update, index) => (
          <article
            key={update._id}
            className="relative bg-background border border-border p-6 sm:p-8 w-full max-w-full overflow-hidden"
            aria-labelledby={update.title ? `title-${update._id}` : undefined}
          >
            {index === 0 && (
              <div className="absolute -top-px -left-px flex">
                <span className="px-3 py-1.5 bg-primary-light text-primary-dark text-xs font-medium border-b border-r border-primary/20 whitespace-nowrap">
                  Latest
                </span>
              </div>
            )}

            <div className={index === 0 ? "mt-8" : ""}>
              {/* Header with title and timestamp */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                {update.title && (
                  <h2
                    id={`title-${update._id}`}
                    className="font-semibold text-foreground text-lg sm:text-xl tracking-tight break-words"
                  >
                    {update.title}
                  </h2>
                )}
                <div className="flex flex-col items-end gap-1 ml-auto shrink-0">
                  <time
                    className="text-xs text-muted-foreground whitespace-nowrap font-mono"
                    dateTime={update.publishedAt}
                    title={formatFullDate(update.publishedAt)}
                  >
                    {getTimeAgo(update.publishedAt)}
                  </time>
                  <span className="text-[10px] text-muted-foreground/60 font-mono whitespace-nowrap">
                    {formatTime(update.publishedAt)}
                  </span>
                </div>
              </div>

              {/* Content – ensures long words break */}
              <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-foreground/80 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                  {update.content}
                </p>
              </div>

              {/* Read more button (placeholder, non-functional) */}
              {update.content.length > 200 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <button className="text-xs text-muted-foreground hover:text-foreground group">
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

      {/* Empty state */}
      {updates.length === 0 && (
        <div className="text-center py-16 sm:py-20 px-6 border border-border bg-muted">
          <div className="w-16 h-16 mx-auto mb-4 border border-border bg-background flex items-center justify-center">
            <svg
              className="w-6 h-6 text-muted-foreground"
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
          <h3 className="text-foreground text-base sm:text-lg font-medium mb-2">
            No updates yet
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">
            Check back soon
          </p>
        </div>
      )}

      {/* End of feed */}
      {updates.length > 0 && (
        <div className="relative flex justify-center pt-4 sm:pt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-background px-4 text-xs text-muted-foreground">
            End of feed
          </span>
        </div>
      )}
    </section>
  );
}
