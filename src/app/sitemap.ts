import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/caseStudies";
import { SITE_URL } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((study) => ({
      url: `${SITE_URL}/case-studies/${study.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
