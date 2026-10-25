export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { getWritings } from "@/lib/writing";
import { SITE_URL } from "@/lib/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/writing/`, changeFrequency: "weekly", priority: 0.8 },
    ...(await getWritings()).map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}/`,
      lastModified: post.date,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/resume/`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
