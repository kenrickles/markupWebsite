# Writing

Add a Markdown file here using a lowercase, hyphenated filename. The filename becomes the article slug.

```yaml
---
title: "Your title"
description: "A short introduction."
category: Engineering
date: "2026-10-25"
status: draft
kind: Essay
tags: [blockchain, learning]
---
```

Categories: `Engineering`, `Thinking`, `Life`. Kind: `Essay` or `Working note`.
Dates must be quoted ISO dates. Write the body in Markdown, without a repeated H1.

Only `status: published` is included in the website. Draft bodies and metadata are excluded from browser data, search, counts, article routes and the sitemap. Draft files remain visible in this public GitHub repository; do not store private information here.

To publish: finish the text, set the date, change status to `published`, and commit. The static build generates `/writing/<filename>/`; Notes and Latest writing update automatically. Markdown supports headings, lists, quotes, code and links. Raw HTML and unsafe links are sanitised.

Review content locally with `npm run dev`, then run `npm run build` before publishing.
