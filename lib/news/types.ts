export type Article = {
  id: string; // stable hash
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: string; // ISO
  country?: string; // e.g. "za"
  category?: string; // e.g. "technology"
};

export type Filters = {
  q?: string;
  category?: string; // business | tech | sports | ...
  country?: string; // za | us | gb ...
  region?: string; // africa | europe | americas ...
  time?: "24h" | "7d" | "30d";
  sort?: "publishedAt" | "relevancy";
};

export type StoryCluster = {
  id: string;
  title: string; // best headline
  articles: Article[];
  topSource: string;
  publishedAt: string; // latest in cluster
};

export type NewsResponse = {
  filters: Filters;
  total: number;
  items: Array<Article | StoryCluster>;
};

