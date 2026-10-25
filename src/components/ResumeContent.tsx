import { experiences, education } from "@/lib/profile";
import {
  certifications,
  recoveredRecognition,
  recoveredHome,
} from "@/lib/recoveredProfile";

export default function ResumeContent() {
  return (
    <>
      <header>
        <p className="eyebrow">Singapore · Protocol engineering</p>
        <h1>Kenrick Tan</h1>
        <p>Protocol Engineer at Galaxy Digital</p>
        <p>{recoveredHome.subtitle}</p>
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
            <p className="muted">
              {item.timeframe} · {item.location}
            </p>
            {item.highlights.map((h) => (
              <p key={h}>{h}</p>
            ))}
          </article>
        ))}
      </section>
      <section>
        <h2>Certifications</h2>
        {certifications.map((c) => (
          <article key={c.title}>
            <h3>{c.title}</h3>
            <p>
              {c.organization} · {c.timeframe}
            </p>
            <a href={c.href}>Verify Certification</a>
          </article>
        ))}
        <h2>Awards</h2>
        {recoveredRecognition.map((a) => (
          <article key={a.title}>
            <h3>{a.title}</h3>
            <p>
              {a.organization} · {a.timeframe}
            </p>
            <ul>
              {a.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
}
