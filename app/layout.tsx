import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Air Sports Live - Real-time Updates",
  description:
    "Live updates from the air sports world - paragliding, skydiving, hang gliding, and more",
  keywords:
    "air sports, live updates, paragliding, skydiving, hang gliding, real-time",
  authors: [{ name: "Air Sports Live" }],
  openGraph: {
    title: "Air Sports Live - Real-time Updates",
    description: "Live updates from the air sports world",
    type: "website",
    siteName: "Air Sports Live",
  },
  twitter: {
    card: "summary",
    title: "Air Sports Live",
    description: "Real-time updates from the sky",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
          bg-white
          text-gray-900
          min-h-screen
          flex
          flex-col
          font-sans
        `}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white border border-gray-200 px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        <div id="main-content" className="flex-1">
          {children}
        </div>

        <footer className="border-t border-gray-100 py-6 mt-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-gray-400 text-center">
              Air Sports Live — Real-time updates from the sky
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
