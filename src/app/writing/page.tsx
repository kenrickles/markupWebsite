import Link from "next/link";
import { getWritings } from "@/lib/writing";
import { SITE_URL } from "@/lib/site";
export const metadata = {
  title: "Writing",
  alternates: { canonical: `${SITE_URL}/writing/` },
};
export default async function WritingIndex() {
  const posts = await getWritings();
  return (
    <main className="standalone-writing">
      <Link href="/#notes">← Open Notes</Link>
      <p className="profile-kicker">ENGINEERING · THINKING · LIFE</p>
      <h1>My writing</h1>
      {posts.length ? (
        posts.map((post) => (
          <article key={post.slug}>
            <h2>
              <Link href={`/writing/${post.slug}/`}>{post.title}</Link>
            </h2>
            <p>{post.description}</p>
            <small>
              {post.category} · {post.minutes} min read
            </small>
          </article>
        ))
      ) : (
        <>
          <h2>Good thoughts take time.</h2>
          <p>
            This is where I’ll share what I’m learning, questions I’m sitting
            with, and ideas worth passing on.
          </p>
          <p>Nothing published yet.</p>
        </>
      )}
    </main>
  );
}
