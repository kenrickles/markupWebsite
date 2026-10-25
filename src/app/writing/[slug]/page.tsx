import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWritings } from "@/lib/writing";
import { SITE_URL } from "@/lib/site";
export const dynamicParams = false;
export async function generateStaticParams() {
  const posts = await getWritings();
  // Static export requires one param even before the first publication.
  // This reserved path renders notFound(), never an invented article.
  return posts.length
    ? posts.map((p) => ({ slug: p.slug }))
    : [{ slug: "_empty" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getWritings()).find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/writing/${slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/writing/${slug}/`,
    },
  };
}
export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getWritings()).find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <main className="standalone-writing">
      <Link href={`/#notes/${post.slug}`}>← Open in Notes</Link>
      <article>
        <p className="profile-kicker">
          {post.kind} · {post.category}
        </p>
        <h1>{post.title}</h1>
        <p className="writing-description">{post.description}</p>
        <p className="writing-meta">
          <time dateTime={post.date}>{post.date}</time> · {post.minutes} min
          read
        </p>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
      <Link href="/writing/">All writing</Link>
    </main>
  );
}
