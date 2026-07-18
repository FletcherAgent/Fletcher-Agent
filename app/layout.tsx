import type { Metadata } from "next";
import { Barlow_Condensed, Barlow, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Fletcher Agent — AI-Powered Robinhood Chain Orchestrator",
  description: "First autonomous trading + liquidity agent on Robinhood Chain",
  icons: {
    icon: "/logo.PNG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
