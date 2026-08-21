import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./console.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMonoMono = JetBrains_Mono({
  weight: ["100", "200", "300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

// The human voice: editorial serif for claims and statements, sentence case.
// Single weight by design — hierarchy comes from size, italics and air, never bold.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});


export const metadata: Metadata = {
  metadataBase: new URL("https://vibestarter.xyz"),
  // SEO title leads with what customers actually search; the brand tagline
  // ("Execution collapsed. Funding did not.") stays on the OG/Twitter cards.
  title: "Vibestarter · Crowdfunding for Vibe-Coded Apps on Base",
  description:
    "Time-released crowdfunding on Base. Founders get 10% at close, then 15% monthly over six months, each monthly release challengeable by backers for 72 hours. Provenance sealed on-chain.",
  keywords: [
    "vibecoins",
    "vibecoding",
    "crowdfunding",
    "crypto",
    "base",
    "web3",
    "AI agents",
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Vibestarter · Execution collapsed. Funding did not.",
    description:
      "Time-released crowdfunding on Base. Founders get 10% at close, then 15% monthly over six months, each monthly release challengeable by backers for 72 hours. Provenance sealed on-chain.",
    url: "https://vibestarter.xyz",
    siteName: "Vibestarter",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vibestarter: Execution collapsed. Funding did not. Time-released crowdfunding on Base.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibestarter · Execution collapsed. Funding did not.",
    description:
      "Time-released crowdfunding on Base. Founders get 10% at close, then 15% monthly over six months, each monthly release challengeable by backers for 72 hours. Provenance sealed on-chain.",
    images: ["/og-image.jpg"],
  },
  other: {
    'base:app_id': '699cdd4c6b5b98f55322fb20',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${jetbrainsMonoMono.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased bg-[#0A0A0A] text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
