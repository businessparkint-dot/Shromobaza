# Shromobazar

Premium responsive landing page for **Shromobazar** — a Global Workforce Platform.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Button, Input, Badge)
- **Framer Motion** (animations)
- **Lucide React** (icons)

## Getting Started

### Prerequisites

Install [Node.js 20+](https://nodejs.org/) and npm.

### Install & Run

```bash
cd shromobazar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout, fonts, SEO metadata
│   ├── page.tsx        # Landing page composition
│   └── globals.css     # Tailwind + theme tokens
├── components/
│   ├── layout/         # Header, Footer
│   ├── sections/       # All 10 landing sections
│   ├── ui/             # shadcn/ui components
│   └── motion/         # Framer Motion wrappers
└── lib/
    ├── data.ts         # Static content & types
    └── utils.ts        # cn() utility
```

## Sections

1. Sticky Header
2. Hero with CTA
3. Search Bar
4. Statistics (animated counters)
5. Categories Grid
6. Featured Workers
7. Latest Jobs
8. Why Choose Shromobazar
9. Download App
10. Footer

## Design Tokens

| Token   | Value     |
|---------|-----------|
| Navy    | `#081B3A` |
| Orange  | `#FF5A1F` |
| Background | White  |

## Accessibility

- Semantic HTML landmarks
- ARIA labels on interactive elements
- Skip-to-content link
- Keyboard focus rings
- `prefers-reduced-motion` support
- Screen reader-only headings where needed

## License

Private — Shromobazar
