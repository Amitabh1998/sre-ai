import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { validateEnv } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "ReliOps AI - AI-Powered Incident Response Platform",
    template: "%s | ReliOps AI",
  },
  description: "Stop fighting fires. Start preventing them. ReliOps AI automates incident investigation and root cause analysis, helping SRE teams resolve issues faster and learn from every incident.",
  keywords: ["SRE", "DevOps", "Incident Management", "AI", "Monitoring", "Root Cause Analysis", "MTTR", "Observability"],
  authors: [{ name: "ReliOps AI Team" }],
  creator: "ReliOps AI Inc.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ReliOps AI",
    title: "ReliOps AI - AI-Powered Incident Response Platform",
    description: "Automate incident investigation and reduce MTTR by 80% with AI-powered root cause analysis",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Validate environment variables on server startup
if (typeof window === "undefined") {
  try {
    validateEnv();
  } catch (error) {
    console.error("Environment validation failed:", error);
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#101723" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

