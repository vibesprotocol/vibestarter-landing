# Vibestarter Landing Page

Marketing site for [Vibestarter](https://vibestarter.xyz): time-released crowdfunding for vibecoded apps on Base. Built with Next.js 16, Tailwind CSS, and TypeScript.

## Design

Editorial dark theme. `BRANDING.md` is the definitive reference for fonts, colors, logo usage, and typographic rules.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: GSAP + Lenis smooth scroll
- **Fonts**: Instrument Serif, Inter, JetBrains Mono (via next/font)
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                  # Routes: /, /thesis, /whitepaper, /privacy, /terms, /risk-disclosure
├── experience/           # The live landing page (editorial sections + ui chrome)
├── components/           # Legacy sections (no longer routed) + shared utilities
└── hooks/
content/whitepaper/       # Whitepaper markdown, synced from the app repo (do not edit here)
```

## Deployment

```bash
npm run build && vercel --prod
```
