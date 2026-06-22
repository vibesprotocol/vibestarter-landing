import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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


export const metadata: Metadata = {
  metadataBase: new URL("https://vibestarter.xyz"),
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vibestarter — Time-released crowdfunding for vibecoded apps on Base",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibestarter — Fund your vibecoded app",
    description:
      "Time-released crowdfunding for vibecoded apps. Launch your Vibetoken with on-chain provenance.",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${jetbrainsMonoMono.variable}`}>
      <body className="font-sans antialiased bg-[#0A0A0A] text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
