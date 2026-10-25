export const recommendationCategories = [
  "All resources",
  "Software",
  "Developer Tools",
  "Books",
  "Resources",
] as const;
export type Recommendation = {
  name: string;
  category: Exclude<(typeof recommendationCategories)[number], "All resources">;
  href: string;
  why: string;
  tradeoff: string;
};
/** Add only Kenrick's own recommendations. Leave empty until personally curated. */
export const recommendations: Recommendation[] = [];
