/**
 * Guess tags from article title and category
 */
export function guessTags(title: string, category?: string): string[] {
  const t = title.toLowerCase();
  const tags: string[] = [];
  
  // Space & Science
  if (t.includes("nasa") || t.includes("space") || t.includes("astron") || t.includes("telescope")) {
    tags.push("Space");
  }
  
  // Economy & Finance
  if (t.includes("inflation") || t.includes("econom") || t.includes("market") || t.includes("stock") || t.includes("dollar")) {
    tags.push("Economy");
  }
  
  // AI & Technology
  if (t.includes("ai") || t.includes("openai") || t.includes("artificial intelligence") || t.includes("chatgpt") || t.includes("machine learning")) {
    tags.push("AI");
  }
  
  // Politics & Policy
  if (t.includes("election") || t.includes("government") || t.includes("president") || t.includes("senate") || t.includes("congress") || t.includes("policy")) {
    tags.push("Policy");
  }
  
  // Sports
  if (t.includes("nba") || t.includes("spurs") || t.includes("knicks") || t.includes("football") || t.includes("soccer") || t.includes("sport")) {
    tags.push("Sports");
  }
  
  // Health
  if (t.includes("health") || t.includes("vaccine") || t.includes("covid") || t.includes("medical") || t.includes("doctor")) {
    tags.push("Health");
  }
  
  // Technology
  if (t.includes("tech") || t.includes("apple") || t.includes("google") || t.includes("microsoft") || t.includes("iphone")) {
    tags.push("Tech");
  }
  
  // Business
  if (t.includes("business") || t.includes("company") || t.includes("ceo") || t.includes("merger") || t.includes("acquisition")) {
    tags.push("Business");
  }
  
  // Use category as fallback
  if (tags.length === 0 && category) {
    const categoryMap: Record<string, string> = {
      technology: "Tech",
      business: "Business",
      health: "Health",
      science: "Science",
      sports: "Sports",
      entertainment: "Entertainment",
      general: "News",
    };
    if (categoryMap[category]) {
      tags.push(categoryMap[category]);
    }
  }
  
  return tags.slice(0, 2);
}

