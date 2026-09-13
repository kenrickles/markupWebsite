import type { Metadata } from "next";
import Link from "next/link";
import { experiences, education, awards } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";
import PrintResume from "@/components/PrintResume";
export const metadata: Metadata = {
  title: "Résumé",
  alternates: { canonical: `${SITE_URL}/resume/` },
};
export default function Resume() {
  return (
    <main className="resume-page wrap">
      <div className="resume-toolbar">
        <Link href="/">← Back to portfolio</Link>
        <PrintResume />
      </div>
      <header>
        <p className="eyebrow">Singapore · Protocol engineering</p>
        <h1>Kenrick Tan</h1>
        <p>Protocol Engineer at Galaxy Digital</p>
        <a href="mailto:kenrickles@gmail.com">kenrickles@gmail.com</a>
        <p>
          <a href="https://github.com/kenrickles">github.com/kenrickles</a> ·{" "}
          <a href="https://linkedin.com/in/kenrick-tan">
            linkedin.com/in/kenrick-tan
          </a>
        </p>
      </header>
      <section>
        <h2>Experience</h2>
        {experiences.map((job) => (
          <article key={job.role}>
            <h3>
              {job.role} · {job.company}
            </h3>
            <p className="muted">
              {job.timeframe} · {job.location}
            </p>
            <ul>
              {job.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section>
        <h2>Education</h2>
        {education.map((item) => (
          <article key={item.school}>
            <h3>{item.school}</h3>
            <p>{item.program}</p>
            <p className="muted">{item.timeframe}</p>
          </article>
        ))}
      </section>
      <section>
        <h2>Recognition</h2>
        <ul>
          {awards.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
