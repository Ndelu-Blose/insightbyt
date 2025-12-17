import { Article } from "./types";
import { generateId } from "@/lib/utils/hash";

export function normalizeArticle(
  apiArticle: any,
  provider: string
): Article {
  if (provider === "newsapi") {
    return {
      id: generateId(
        apiArticle.title || "",
        apiArticle.url || "",
        apiArticle.publishedAt || ""
      ),
      title: apiArticle.title || "No title",
      description: apiArticle.description || undefined,
      url: apiArticle.url || "",
      imageUrl: apiArticle.urlToImage || undefined,
      source: apiArticle.source?.name || "Unknown",
      publishedAt: apiArticle.publishedAt || new Date().toISOString(),
      country: apiArticle.country || undefined,
      category: apiArticle.category || undefined,
    };
  }
  
  // Default fallback for unknown providers
  return {
    id: generateId(
      apiArticle.title || "",
      apiArticle.url || "",
      apiArticle.publishedAt || ""
    ),
    title: apiArticle.title || "No title",
    description: apiArticle.description || undefined,
    url: apiArticle.url || "",
    imageUrl: apiArticle.imageUrl || apiArticle.image || undefined,
    source: apiArticle.source || "Unknown",
    publishedAt: apiArticle.publishedAt || apiArticle.published_at || new Date().toISOString(),
    country: apiArticle.country || undefined,
    category: apiArticle.category || undefined,
  };
}

