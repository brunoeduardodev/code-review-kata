import type { Metadata } from "next";
import { Archivo, Bodoni_Moda, JetBrains_Mono } from "next/font/google";
import { DEFAULT_DESIGN_THEME } from "@/lib/design-themes";
import "./globals.css";

const displayFont = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const bodyFont = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reviewforge.vercel.app"),
  title: {
    default: "Midnight Review Lab | Code Review Katas",
    template: "%s | Midnight Review Lab",
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
    title: "Midnight Review Lab | Code Review Katas",
    description:
      "Ship safer software by practicing realistic code reviews across correctness, security, performance, and testing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Midnight Review Lab",
    description: "5-minute code-review drills for AI-generated code quality.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme={DEFAULT_DESIGN_THEME}>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} bg-[var(--bg)] text-[var(--ink)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
