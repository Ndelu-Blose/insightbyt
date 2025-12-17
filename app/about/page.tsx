import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold">About Insight by T</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">What is Insight by T?</h2>
          <p className="mb-4 text-muted-foreground">
            Insight by T is a filter-first news intelligence website designed to help
            you find signal over noise. We aggregate news from multiple sources and
            provide powerful filtering tools to help you discover the stories that
            matter most to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong>Filter-first UI:</strong> Filters are always visible on desktop,
              making it easy to refine your news feed.
            </li>
            <li>
              <strong>Region-aware news:</strong> Filter by region or specific countries
              to get news relevant to your location.
            </li>
            <li>
              <strong>Story clustering:</strong> Similar headlines are automatically
              grouped together to reduce duplicate stories.
            </li>
            <li>
              <strong>Shareable views:</strong> All filters are stored in the URL, so
              you can share your filtered view with others.
            </li>
            <li>
              <strong>Bookmarks:</strong> Save articles for later reading and organize
              them into collections.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Data Sources</h2>
          <p className="mb-4 text-muted-foreground">
            Insight by T uses{" "}
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              NewsAPI.org
            </a>{" "}
            to aggregate news articles from thousands of sources worldwide. NewsAPI
            provides access to breaking news headlines and articles from news sources
            and blogs across the globe.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Disclaimer</h2>
          <p className="mb-4 text-muted-foreground">
            Insight by T is an aggregator and does not produce original news content.
            We do not verify the accuracy of articles or endorse any particular source
            or viewpoint. All articles link back to their original sources, and users
            are encouraged to verify information independently.
          </p>
          <p className="mb-4 text-muted-foreground">
            News content is provided "as is" without warranty of any kind. Insight by T
            is not responsible for the content, accuracy, or opinions expressed in the
            articles displayed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Privacy</h2>
          <p className="mb-4 text-muted-foreground">
            Insight by T stores bookmarks locally in your browser using LocalStorage.
            No personal data is collected or transmitted to external servers. Your
            browsing history and preferences remain private.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Links</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <a
                href="https://newsapi.org/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                NewsAPI Terms of Service
              </a>
            </li>
            <li>
              <Link href="/" className="text-primary hover:underline">
                Back to Home
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

