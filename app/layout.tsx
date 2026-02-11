import type { Metadata } from "next";
import { IBM_Plex_Mono, Public_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const bodyFont = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reviewforge.vercel.app"),
  title: {
    default: "ReviewForge | AI-Era Code Review Katas",
    template: "%s | ReviewForge",
  },
  description:
    "Train software engineers to review AI-generated code with 5-minute pull-request katas, instant coaching, and score progression.",
  keywords: [
    "code review kata",
    "engineering training",
    "ai code review",
    "pull request practice",
    "next.js",
  ],
  openGraph: {
    title: "ReviewForge | AI-Era Code Review Katas",
    description:
      "Ship safer software by practicing realistic code reviews across correctness, security, performance, and testing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewForge",
    description: "5-minute code-review drills for AI-generated code quality.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} bg-[var(--bg)] text-[var(--ink)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
