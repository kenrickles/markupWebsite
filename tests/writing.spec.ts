import { test, expect } from "@playwright/test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getWritings } from "../src/lib/writing";

test("publishing excludes drafts, sorts articles and sanitises Markdown", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "portfolio-writing-"));
  try {
    await writeFile(
      path.join(dir, "draft.md"),
      '---\ntitle: "PRIVATE DRAFT MARKER"\nstatus: draft\n---\nNOT FOR CLIENT',
    );
    await writeFile(
      path.join(dir, "first-post.md"),
      '---\ntitle: "First post"\ndescription: "A real description"\ncategory: Engineering\ndate: "2026-10-24"\nstatus: published\n---\n## A heading\n\nA [safe link](https://example.com) and [unsafe](javascript:alert(1)).\n\n<script>alert(1)</script>',
    );
    await writeFile(
      path.join(dir, "second-post.md"),
      '---\ntitle: "Second post"\ndescription: "Another description"\ncategory: Life\ndate: "2026-10-25"\nstatus: published\nkind: Working note\n---\nA thought.',
    );
    const posts = await getWritings(dir);
    expect(posts.map((p) => p.slug)).toEqual(["second-post", "first-post"]);
    expect(posts[0].kind).toBe("Working note");
    expect(posts[1].html).toContain("<h2>A heading</h2>");
    expect(posts[1].html).toContain('href="https://example.com"');
    expect(JSON.stringify(posts)).not.toContain("PRIVATE DRAFT MARKER");
    expect(posts[1].html).not.toContain("javascript:");
    expect(posts[1].html).not.toContain("<script>");
    expect(posts[0].minutes).toBe(1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
