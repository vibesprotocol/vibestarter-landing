import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Vibestarter — Fund your vibecoded app",
  description:
    "Time-released crowdfunding for vibecoded apps. Launch your Vibetoken with on-chain provenance.",
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
    title: "Vibestarter — Fund your vibecoded app",
    description:
      "Time-released crowdfunding for vibecoded apps. Launch your Vibetoken with on-chain provenance.",
    url: "https://vibestarter.xyz",
    siteName: "Vibestarter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibestarter — Fund your vibecoded app",
    description:
      "Time-released crowdfunding for vibecoded apps. Launch your Vibetoken with on-chain provenance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased bg-[#0A0A0A] text-white grid-bg-subtle">
        <div className="noise-overlay" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
