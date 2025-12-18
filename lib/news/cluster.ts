import { Article, StoryCluster } from "./types";

// Common stopwords to ignore in similarity calculation
const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
  "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
  "to", "was", "will", "with", "the", "this", "but", "they", "have",
  "had", "what", "said", "each", "which", "their", "time", "if",
  "up", "out", "many", "then", "them", "these", "so", "some", "her",
  "would", "make", "like", "into", "him", "has", "two", "more",
  "very", "after", "words", "long", "than", "first", "been", "call",
  "who", "oil", "sit", "now", "find", "down", "day", "did", "get",
  "come", "made", "may", "part",
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word))
    .join(" ");
}

function computeSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  if (!normalized1 || !normalized2) return 0;
  
  const tokens1 = new Set(normalized1.split(/\s+/));
  const tokens2 = new Set(normalized2.split(/\s+/));
  
  const intersection = new Set(
    [...tokens1].filter((token) => tokens2.has(token))
  );
  const union = new Set([...tokens1, ...tokens2]);
  
  if (union.size === 0) return 0;
  
  // Jaccard similarity
  return intersection.size / union.size;
}

export function clusterArticles(
  articles: Article[]
): Array<Article | StoryCluster> {
  if (articles.length === 0) return [];
  
  const clusters: StoryCluster[] = [];
  const singleArticles: Article[] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < articles.length; i++) {
    if (used.has(i)) continue;
    
    const cluster: Article[] = [articles[i]];
    used.add(i);
    
    // Find similar articles
    for (let j = i + 1; j < articles.length; j++) {
      if (used.has(j)) continue;
      
      const similarity = computeSimilarity(
        articles[i].title,
        articles[j].title
      );
      
      if (similarity >= 0.5) {
        cluster.push(articles[j]);
        used.add(j);
      }
    }
    
    // If cluster has multiple articles, create StoryCluster
    if (cluster.length > 1) {
      // Sort by publishedAt (newest first) to get latest
      cluster.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );
      
      // Use longest/most descriptive headline as title
      const bestTitle = cluster.reduce(
        (best, current) =>
          current.title.length > best.title.length ? current : best,
        cluster[0]
      );
      
      clusters.push({
        id: cluster[0].id + "-cluster",
        title: bestTitle.title,
        articles: cluster,
        topSource: cluster[0].source,
        publishedAt: cluster[0].publishedAt, // Latest (already sorted)
      });
    } else {
      // Single article that wasn't clustered - add it directly to singleArticles
      singleArticles.push(articles[i]);
      used.delete(i); // Unmark it since we're handling it separately
    }
  }
  
  // Combine clusters and single articles
  const result: Array<Article | StoryCluster> = [...clusters, ...singleArticles];
  
  // Sort all results by publishedAt (newest first)
  result.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });
  
  return result;
}

