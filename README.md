# VibeFounder Landing Page

The trust layer for vibe-coded token launches. Built with Next.js 14, Tailwind CSS, and TypeScript.

## Design

Inspired by [LayerZero](https://layerzero.network/) — minimal, monochromatic, infrastructure-grade aesthetic.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter, JetBrains Mono (via next/font)
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
├── app/
│   ├── layout.tsx      # Root layout with fonts & metadata
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles & Tailwind
├── components/
│   ├── Navigation.tsx  # Header with mobile menu
│   ├── Hero.tsx        # Hero section
│   ├── FounderCard.tsx # Founder profile card preview
│   ├── Positioning.tsx # Positioning section
│   ├── Principles.tsx  # 4-column principles grid
│   ├── Stats.tsx       # Stats/numbers section
│   ├── HowItWorks.tsx  # Two-column how it works
│   ├── CodeExample.tsx # Code snippet showcase
│   ├── Footer.tsx      # Footer with links
│   ├── Divider.tsx     # Gradient line divider
│   └── index.ts        # Component exports
```

## Features

- ✅ Fully responsive (mobile-first)
- ✅ Mobile hamburger menu
- ✅ Smooth scroll navigation
- ✅ LayerZero-inspired design language
- ✅ Section numbering (01 / 05)
- ✅ Syntax-highlighted code blocks
- ✅ SEO metadata configured
- ✅ TypeScript strict mode

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Or enable static export in `next.config.js` and deploy to any static host.

## Related

- [VibeFounder App](../vibefounder-app) — Main application
- [PRD](../docs/VibeFounder_PRD.md) — Product requirements
- [Architecture](../docs/VibeFounder_ARCHITECTURE.md) — Technical architecture
