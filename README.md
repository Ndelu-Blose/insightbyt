# Insight by T

A filter-first news intelligence website that helps you find signal over noise.

## Features

- **Filter-first UI**: Filters are always visible on desktop
- **Region-aware news**: Filter by region or specific countries
- **Story clustering**: Similar headlines are automatically grouped together
- **Shareable views**: All filters are stored in the URL
- **Bookmarks**: Save articles for later reading
- **Dark mode**: Premium editorial UI with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
NEWS_PROVIDER=newsapi
NEWS_API_KEY=your_newsapi_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Get a NewsAPI key from [https://newsapi.org](https://newsapi.org)

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
  layout.tsx          # Root layout with theme provider
  page.tsx           # Home page with filters and feed
  bookmarks/page.tsx # Bookmarks page
  about/page.tsx     # About page
  api/news/route.ts  # API route for fetching news

components/
  header.tsx              # Site header with search and theme toggle
  filters-panel.tsx      # Desktop filter panel
  mobile-filters-drawer.tsx # Mobile filter drawer
  news-feed.tsx          # News feed component
  article-card.tsx       # Individual article card
  story-card.tsx         # Story cluster card
  loading-skeleton.tsx   # Loading state skeleton
  empty-state.tsx        # Empty state component

lib/
  news/
    types.ts         # TypeScript type definitions
    provider.ts      # News API provider adapter
    normalize.ts     # Article normalization
    cluster.ts       # Story clustering algorithm
    region-map.ts    # Region to countries mapping
  url/
    query.ts         # URL query parameter helpers
  storage/
    bookmarks.ts     # LocalStorage bookmark helpers
  utils/
    hash.ts          # ID generation utility
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **next-themes** (Dark mode)
- **date-fns** (Date formatting)
- **NewsAPI.org** (News data source)

## Environment Variables

- `NEWS_PROVIDER`: News provider to use (default: "newsapi")
- `NEWS_API_KEY`: Your NewsAPI.org API key (required)
- `NEXT_PUBLIC_APP_URL`: Base URL of the application (optional, defaults to localhost in dev)

## Deployment

### Deploy to Vercel

This project is ready to deploy on Vercel. Follow these steps:

1. **Push your code to GitHub** (if not already done)

2. **Import your project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**:
   In the Vercel project settings, add these environment variables:
   - `NEWS_API_KEY`: Your NewsAPI.org API key (required)
   - `NEWS_PROVIDER`: `newsapi` (optional, defaults to "newsapi")
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (optional, will be auto-detected)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment

Alternatively, you can deploy using the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

### Build Settings

Vercel will automatically detect:
- **Framework Preset**: Next.js
- **Build Command**: `next build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

No additional configuration is required. The project is optimized for Vercel's platform.

## License

MIT

