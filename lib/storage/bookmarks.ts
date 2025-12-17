import { Article, StoryCluster } from "@/lib/news/types";

const STORAGE_KEY = "insight-bookmarks";
const DEFAULT_COLLECTION = "Saved";

interface StoredBookmark {
  item: Article | StoryCluster;
  collection: string;
  savedAt: string;
}

export function saveBookmark(
  item: Article | StoryCluster,
  collection: string = DEFAULT_COLLECTION
): void {
  if (typeof window === "undefined") return;

  const bookmarks = getStoredBookmarks();
  
  // Remove if already exists
  const filtered = bookmarks.filter((b) => b.item.id !== item.id);
  
  // Add new bookmark
  filtered.push({
    item,
    collection,
    savedAt: new Date().toISOString(),
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function removeBookmark(id: string): void {
  if (typeof window === "undefined") return;

  const bookmarks = getStoredBookmarks();
  const filtered = bookmarks.filter((b) => b.item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getBookmarks(
  collection?: string
): Array<Article | StoryCluster> {
  if (typeof window === "undefined") return [];

  const bookmarks = getStoredBookmarks();
  const filtered = collection
    ? bookmarks.filter((b) => b.collection === collection)
    : bookmarks;
  
  return filtered.map((b) => b.item);
}

export function getCollections(): string[] {
  if (typeof window === "undefined") return [DEFAULT_COLLECTION];

  const bookmarks = getStoredBookmarks();
  const collections = new Set(bookmarks.map((b) => b.collection));
  return Array.from(collections).length > 0
    ? Array.from(collections)
    : [DEFAULT_COLLECTION];
}

export function isBookmarked(id: string): boolean {
  if (typeof window === "undefined") return false;

  const bookmarks = getStoredBookmarks();
  return bookmarks.some((b) => b.item.id === id);
}

function getStoredBookmarks(): StoredBookmark[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

