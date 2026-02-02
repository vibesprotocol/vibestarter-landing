import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#0A0A0A] text-white grid-bg">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
