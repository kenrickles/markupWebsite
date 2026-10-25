import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
export const writingCategories = ["Engineering", "Thinking", "Life"] as const;
export type WritingCategory = (typeof writingCategories)[number];
export type Writing = {
  slug: string;
  title: string;
  description: string;
  category: WritingCategory;
  date: string;
  tags: string[];
  minutes: number;
  html: string;
  text: string;
  kind: "Essay" | "Working note";
};
/** Server-only: drafts are excluded before content reaches the browser or static routes. */
export async function getWritings(
  directory = path.join(process.cwd(), "content/writing"),
): Promise<Writing[]> {
  const names = await fs.readdir(directory);
  const posts = await Promise.all(
    names
      .filter((n) => n.endsWith(".md"))
      .map(async (name) => {
        const { data, content } = matter(
          await fs.readFile(path.join(directory, name), "utf8"),
        );
        if (data.status !== "published") return null;
        const slug = name.slice(0, -3);
        if (
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
          !data.title ||
          !data.description ||
          !writingCategories.includes(data.category) ||
          typeof data.date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
          Number.isNaN(Date.parse(data.date)) ||
          !content.trim()
        )
          throw new Error(`Invalid published writing: ${name}`);
        const rendered = await remark()
          .use(html, { sanitize: true })
          .process(content);
        return {
          slug,
          title: String(data.title),
          description: String(data.description),
          category: data.category,
          date: data.date,
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          minutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)),
          html: String(rendered),
          text: content,
          kind: data.kind === "Working note" ? "Working note" : "Essay",
        } satisfies Writing;
      }),
  );
  return posts
    .filter((post): post is Writing => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}
