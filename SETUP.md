# Setup Guide - Insight by T

## ✅ Current Status

- ✅ Dependencies installed
- ✅ Dev server running on port 3000
- ✅ Project structure complete
- ⚠️ **Need to add NewsAPI key**

---

## 🚀 Next Steps

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory (`c:\Users\Teacher\Desktop\CliveUx\Insight by C\`) with the following content:

```env
NEWS_PROVIDER=newsapi
NEWS_API_KEY=your_actual_newsapi_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**To get a NewsAPI key:**
1. Go to https://newsapi.org/register
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Replace `your_actual_newsapi_key_here` with your actual key

### Step 2: Restart the dev server

After creating `.env.local`, restart the dev server:

1. Stop the current server (Ctrl+C in the terminal)
2. Run: `npm run dev`
3. Open http://localhost:3000 in your browser

### Step 3: Test the application

1. **Home Page** (`/`): Should show news feed with filters
2. **Filters**: Try selecting a category, region, or time range
3. **Search**: Use the search bar in the header
4. **Bookmarks**: Click the bookmark icon on articles
5. **Bookmarks Page** (`/bookmarks`): View saved articles
6. **About Page** (`/about`): View project information

---

## 🔧 Troubleshooting

### If you see "NEWS_API_KEY is not configured"

- Make sure `.env.local` exists in the root directory
- Verify the file name is exactly `.env.local` (not `.env.local.txt`)
- Restart the dev server after creating the file

### If the dev server won't start

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### If you see API errors

- Check your NewsAPI key is correct
- Verify you haven't exceeded the free tier rate limit (100 requests/day)
- Check the browser console for detailed error messages

---

## 📝 Project Structure

```
Insight by C/
├── app/                    # Next.js app router pages
│   ├── api/news/          # API route for fetching news
│   ├── bookmarks/         # Bookmarks page
│   ├── about/             # About page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
│   ├── news/             # News-related utilities
│   ├── storage/          # LocalStorage helpers
│   └── url/              # URL query helpers
├── styles/               # Global styles
└── .env.local           # Environment variables (create this!)
```

---

## 🎯 Features to Test

- [ ] Filter by category (business, technology, etc.)
- [ ] Filter by region (Africa, Europe, etc.)
- [ ] Filter by country (when region is selected)
- [ ] Filter by time range (24h, 7d, 30d)
- [ ] Search by keyword
- [ ] Sort by latest/relevance
- [ ] Bookmark articles
- [ ] View bookmarks page
- [ ] Dark mode toggle
- [ ] Mobile filters drawer
- [ ] Story clustering (similar headlines grouped)

---

## 📚 Additional Resources

- [NewsAPI Documentation](https://newsapi.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

