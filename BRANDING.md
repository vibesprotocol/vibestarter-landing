# Vibestarter Branding Guidelines

Definitive reference for fonts, colors, logo usage, and typographic hierarchy across the Vibestarter landing site.

---

## Logo

The Vibestarter logo is a two-part lockup: a **terminal icon** (SVG) and the **wordmark** "Vibestarter".

### Terminal Icon

A stylized terminal prompt consisting of two strokes:

- `>` chevron: `M4 8L14 16L4 24` (strokeWidth 3, round caps/joins)
- `_` cursor: `M16 24H28` (strokeWidth 3, round cap)

ViewBox: `0 0 32 32`. Always rendered as an inline SVG, never as a raster image.

### Wordmark

- Text: **Vibestarter** (title case, never all-caps)
- Font: **JetBrains Mono** (`font-display`)
- Tracking: `tracking-tight`

### Icon-to-Text Sizing Rule

The `>_` terminal icon must always match the **cap-height** of the "V" in the wordmark. This is the single most important rule for brand consistency.

**The formula:**
- Icon height = **0.7em** of the wordmark font-size
- Icon uses the **cropped viewBox** `2 6 28 20` (removes internal padding from the 32×32 canvas)
- Icon aspect ratio is **1.4:1** (width:height), derived from the cropped viewBox (28:20)
- Gap between icon and wordmark = **0.14em** of the wordmark font-size

**Applied at different sizes:**

| Context | Font-size | Icon height | Icon width | Gap |
|---------|-----------|-------------|------------|-----|
| Header (sm+) | 20px | 14px | 19.6px | 4px |
| Footer (mobile) | 36px | 25.2px | 35.3px | 5px |
| SVG logo (large) | 36px | 25.2px | 35.3px | 5px |
| SVG logo (compact) | 20px | 14px | 19.6px | 3px |

**Implementation in CSS (footer/scalable):**
```tsx
<svg className="h-[0.7em]" viewBox="2 6 28 20" fill="none">
```

**Implementation in standalone SVG files:**
```svg
<svg x="0" y="14.4" width="35.3" height="25.2" viewBox="2 6 28 20">
```

### Header Lockup

```
[icon] [wordmark]
```

- Icon size: `w-5 h-5` (mobile), `w-6 h-6` (sm+)
- Icon viewBox: `0 0 32 32`
- Icon color: `#91D982` (accent green)
- Wordmark size: `text-lg` (mobile), `text-xl` (sm+)
- Wordmark font: `font-display tracking-tight`
- Gap: `gap-0.5` (mobile), `gap-1` (sm+)
- Container: `flex items-center`

### Footer Lockup

```
[icon] [wordmark]
[tagline]
```

- Icon size: `h-[0.7em]` (scales with text)
- Icon viewBox: `2 6 28 20` (cropped to remove internal padding)
- Icon color: `black` (on green background)
- Wordmark size: `text-4xl` (mobile), `text-5xl` (sm), `text-6xl` (lg)
- Wordmark font: `font-display tracking-tight`
- Gap: `gap-2` (mobile), `gap-3` (sm+)
- Container: `inline-flex items-center`
- Tagline: sits below the lockup with `mt-4`, uses `font-sans font-light`

---

## Fonts

Two font families are used, loaded via `next/font/google`:

| Role | Font | CSS Variable | Tailwind Class | Weights |
|------|------|-------------|----------------|---------|
| Body / UI | Inter | `--font-sans` | `font-sans` | Variable (all) |
| Display / Headings | JetBrains Mono | `--font-display` | `font-display` | 100-700 |
| Code / Labels | JetBrains Mono | `--font-mono` | `font-mono` | 100-500 |

### Loading (layout.tsx)

```tsx
import { Inter, JetBrains_Mono } from "next/font/google";

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
```

All three variables are applied to `<html>`. The body defaults to `font-sans` (Inter).

### Font Pairing Rationale

- **Inter** — Clean, highly legible proportional sans-serif for body text. Default 16px size.
- **JetBrains Mono** — Monospace font used for display headings and code, reinforcing the developer/terminal aesthetic of the brand. Creates visual contrast against Inter body text.

---

## Typographic Hierarchy

### Display Headings

Used for hero h1 and section headings. Always JetBrains Mono via `font-display`.

- **Hero h1**: `font-display font-bold text-[clamp(40px,7vw,72px)] leading-[1.05] tracking-tight`
- **Section headings** (`.section-heading`): `font-display text-3xl md:text-4xl font-bold tracking-tight`

### Section Labels

Small uppercase labels above section headings.

- Class: `.section-label`
- Style: `font-mono text-[10px] uppercase tracking-[0.3em] text-accent`

### Body Text

Standard paragraph text for descriptions and subtext.

- Font: `font-sans` (Inter)
- Weight: `font-light` (300) for subtexts and descriptions
- Weight: `font-normal` (400) for general body copy
- Weight: `font-medium` (500) or `font-semibold` (600) for emphasis
- Size: 16px base, `text-base sm:text-lg` for section descriptions
- Color: `text-muted` (#B8C4CE) or `text-white/60` for secondary text

### Mono / Technical Labels

Used for data labels, step indicators, timestamps, and technical info.

- Font: `font-mono` (JetBrains Mono via `--font-mono`)
- Size: `text-[10px]` to `text-xs`
- Color: `text-white/40` to `text-white/50`
- Often paired with `uppercase tracking-wider` or `tracking-widest`

### Canvas Text

For HTML Canvas 2D contexts (e.g., FundingGapAnimation), use the font string directly since CSS variables don't work:

```js
ctx.font = "bold 11px 'JetBrains Mono', monospace";
```

---

## Colors

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#91D982` | Primary green. Logos, highlights, active states |
| `accent-bright` | `#0D8BCA` | Secondary blue. Links, secondary highlights |
| `accent-light` | `#D9F1FC` | Light blue. Subtle accents |
| `muted` | `#B8C4CE` | Muted text. Descriptions, secondary copy |
| `background` | `#0A0A0A` | Page background |
| `surface` | `#0a0a0a` | Card/component surface |
| `border` | `#1f1f1f` | Borders and dividers |
| `primary` | `#ffffff` | Primary text |

### Accent Gradient

Used for the hero headline accent span:

```css
.text-accent-gradient {
  background-image: linear-gradient(135deg, #91D982, #0D8BCA);
  -webkit-background-clip: text;
  color: transparent;
}
```

### Opacity Conventions

- `text-white/60` — secondary body text
- `text-white/50` — tertiary/supporting text
- `text-white/40` — faint labels and metadata
- `bg-white/[0.02]` — card backgrounds
- `border-white/[0.06]` — card borders
- `bg-accent/10`, `border-accent/20` — tinted accent containers

---

## Component Patterns

### Buttons

- **Primary**: `.btn-primary` — `bg-white text-black font-medium rounded-lg`
- **Secondary**: `.btn-secondary` — `border border-border rounded-lg`
- Sizes: `px-6 sm:px-8 py-3.5 sm:py-4 text-[15px]` (CTA), `px-6 py-2.5 text-[15px]` (nav)

### Cards

- Background: `bg-white/[0.02]`
- Border: `border border-white/[0.06]`
- Radius: `rounded-2xl` (large cards), `rounded-xl` (smaller cards)
- Padding: `p-6 sm:p-8`

### Section Structure

Each section follows this pattern:

```
section-label        — "The Problem", "Market Thesis", etc.
section-heading      — JetBrains Mono (font-display), scramble-animated
description          — Inter (font-sans), font-light, text-muted
[content]
```

### Text Scramble Animation

Section headings use a typewriter-style scramble effect triggered on scroll:

- Characters reveal left-to-right
- Each character shows 2 cycles of random special characters before resolving
- Cycle speed: 30ms per tick
- Scramble charset: `@#$%&*!?><{}[]=/\|~^0123456789`
- Unrevealed characters use `visibility: hidden` to prevent layout shift

---

## Spacing

### Page Container

- Max width: `max-w-[1400px]`
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Centered: `mx-auto`

### Section Padding

- Standard: `py-12 sm:py-16 lg:py-20`
- Large: `py-16 sm:py-20 lg:py-24`

### Section Header Margins

- Label to heading: `mb-4`
- Heading to description: `mb-4`
- Description to content: `mb-8` to `mb-12`

---

## Footer

The footer uses an inverted color scheme:

- Background: `bg-accent` (#91D982 green)
- Text: `text-black`
- Logo icon stroke: `black`
- Link color: `text-black/80`, hover `text-black`
- Column headers: `font-mono text-xs tracking-widest uppercase text-black/60`
- Bracket notation: `[ SITEMAP ]`, `[ SOCIAL ]`, `[ PLATFORM ]`
- Risk disclosure: `text-black/40 text-[11px] sm:text-xs font-mono`

---

## Background

A subtle fixed grid overlay is applied to the body via `.grid-bg::before`:

- Pattern: 40px grid
- Color: `rgba(255, 255, 255, 0.01)` — nearly invisible
- Fixed position, covers full viewport
- `pointer-events: none`, `z-index: 0`

---

## Scrollbar

Custom styled to match the dark theme:

- Width: 6px
- Track: transparent
- Thumb: `#262626`, hover `#404040`
- Border radius: 3px

---

## Logo Files

All wordmark SVGs use the exact proportions from the icon-to-text sizing rule above.

| File | Location | Dimensions | Usage |
|------|----------|-----------|-------|
| `vibestarter-logo-large.svg` | `Marketing/` | 268×54 | Full lockup, white on transparent |
| `vibestarter-logo-dark-bg.svg` | `Marketing/` | 268×54 | Full lockup, white text for dark backgrounds |
| `vibestarter-logo-light-bg.svg` | `Marketing/` | 268×54 | Full lockup, black text for light/green backgrounds |
| `vibestarter-logo-transparent.svg` | `Marketing/` | 149×30 | Compact lockup (header-sized) |
| `vibestarter-logo-icon-only.svg` | `Marketing/` | 32×32 | Icon only, no wordmark |
| `favicon.svg` | `public/` | 32×32 | Icon with dark bg rounded rect |

### SVG Logo Structure

All wordmark logos use nested `<svg>` for the icon to preserve the cropped viewBox:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="268" height="54" viewBox="0 0 268 54">
  <!-- Icon: nested SVG with cropped viewBox, sized to 0.7em -->
  <svg x="0" y="14.4" width="35.3" height="25.2" viewBox="2 6 28 20">
    <path d="M4 8L14 16L4 24" stroke="#91D982" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M16 24H28" stroke="#91D982" stroke-width="3"
          stroke-linecap="round" fill="none"/>
  </svg>
  <!-- Wordmark: 5px gap after icon, JetBrains Mono -->
  <text x="40.3" y="40" font-family="'JetBrains Mono', monospace"
        font-size="36" font-weight="400" letter-spacing="-0.025em"
        fill="white">Vibestarter</text>
</svg>
```
