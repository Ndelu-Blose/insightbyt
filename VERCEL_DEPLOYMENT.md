# Vercel Deployment Guide

This project is ready to deploy on Vercel. Follow these steps to get your application live.

## Prerequisites

- A GitHub account (recommended) or GitLab/Bitbucket
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A NewsAPI key (get one at [newsapi.org](https://newsapi.org))

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import your project to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**
   In the "Environment Variables" section, add:
   - `NEWS_API_KEY`: Your NewsAPI.org API key (required)
   - `NEWS_PROVIDER`: `newsapi` (optional, defaults to "newsapi")
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (optional, will be auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   # Set environment variables via CLI or dashboard
   vercel env add NEWS_API_KEY
   vercel env add NEWS_PROVIDER
   ```

## Build Configuration

Vercel automatically detects:
- **Framework Preset**: Next.js
- **Build Command**: `next build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

No additional configuration is required. The project is optimized for Vercel's platform.

## Environment Variables

### Required
- `NEWS_API_KEY`: Your NewsAPI.org API key

### Optional
- `NEWS_PROVIDER`: News provider to use (default: "newsapi")
- `NEXT_PUBLIC_APP_URL`: Base URL of the application (auto-detected on Vercel)

## Post-Deployment

After deployment:

1. **Verify your deployment**
   - Visit your Vercel deployment URL
   - Test the news feed functionality
   - Verify filters and search work correctly

2. **Set up custom domain (optional)**
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Monitor your deployment**
   - Check Vercel dashboard for build logs
   - Monitor function logs for API route issues
   - Set up Vercel Analytics (already included via @vercel/analytics)

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify your NewsAPI key is valid
- Review build logs in Vercel dashboard

### API Route Errors
- Ensure `NEWS_API_KEY` is set in environment variables
- Check NewsAPI rate limits (free tier: 100 requests/day)
- Review function logs in Vercel dashboard

### Static Generation Issues
- The project is configured for static generation where possible
- API routes are marked as dynamic
- Components using `useSearchParams` are wrapped in Suspense boundaries

## Performance

The application is optimized for Vercel:
- Static page generation for better performance
- Dynamic API routes for real-time data
- Image optimization via Next.js Image component
- Automatic code splitting and optimization

## Support

For issues specific to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **NewsAPI**: Check [NewsAPI Documentation](https://newsapi.org/docs)

