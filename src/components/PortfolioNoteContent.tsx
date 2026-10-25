import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experiences, education, awards } from "@/lib/profile";
import { caseStudies } from "@/lib/caseStudies";
import { assetPath } from "@/lib/site";
export type PortfolioNote =
  "about" | "experience" | "projects" | "education" | "contact";
/** Existing professional content retained while the original Hugo content source is unresolved. */
export default function PortfolioNoteContent({
  active,
  select,
}: {
  active: PortfolioNote;
  select: (note: PortfolioNote) => void;
}) {
  if (active === "about")
    return (
      <>
        <h1>Hi, I’m Kenrick.</h1>
        <p className="intro-lead">Complex systems. Clear thinking.</p>
        <p>
          I build the platforms behind the product. From resilient
          infrastructure to practical AI, I turn engineering complexity into
          something teams can use.
        </p>
        <Image
          className="note-portrait"
          src={assetPath("/kenrick.jpg")}
          alt="Kenrick Tan"
          width={96}
          height={96}
          priority
        />
        <h2>
          I think in systems.
          <br />I build for people.
        </h2>
        <p>
          I’m Kenrick, a Protocol Engineer at Galaxy Digital. My work sits at
          the intersection of digital assets, infrastructure, and developer
          experience.
        </p>
        <p>
          I’ve helped teams move CI/CD platforms, operate Kubernetes
          environments, and build internal AI tooling. The common thread: making
          complicated work more dependable and easier to do.
        </p>
        <p>
          Before engineering, I studied psychology and communications. That
          perspective stays with me: understand the people, ask better
          questions, then build the right thing.
        </p>
        <ul className="note-facts">
          <li>
            <strong>40+</strong> Clusters across 7 environments at Partior
          </li>
          <li>
            <strong>250</strong> Projects in a CI/CD migration at Versent
          </li>
        </ul>
        <div className="note-bottom-links">
          <button onClick={() => select("projects")}>
            Explore my work <ArrowUpRight size={14} />
          </button>
          <button onClick={() => select("contact")}>
            Let’s talk <ArrowUpRight size={14} />
          </button>
        </div>
      </>
    );
  if (active === "experience")
    return (
      <>
        <h1>Experience</h1>
        <h2>A path through systems that matter.</h2>
        <p>
          Digital assets, financial services, and the infrastructure that
          connects them.
        </p>
        <div className="desktop-experience">
          {experiences.map((job) => (
            <section key={job.role}>
              <span className="entry-date">
                {job.timeframe} · {job.location}
              </span>
              <h2>{job.company}</h2>
              <p className="entry-role">{job.role}</p>
              <ul>
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="note-tags">
                {job.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </section>
          ))}
        </div>
        <Link href="/resume/" className="note-text-link">
          Open full résumé <ArrowUpRight size={14} />
        </Link>
      </>
    );
  if (active === "projects")
    return (
      <>
        <h1>Selected work</h1>
        <h2>Built for the real world.</h2>
        <p>
          Release systems, developer platforms, and tooling for the people who
          run them.
        </p>
        <div className="desktop-projects">
          {caseStudies.map((study) => (
            <section key={study.slug}>
              <h2>
                <Link href={`/case-studies/${study.slug}/`}>{study.title}</Link>
              </h2>
              <p>{study.subtitle}</p>
              <div className="note-tags">
                {study.stack.slice(0, 3).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <Link
                className="note-text-link"
                href={`/case-studies/${study.slug}/`}
              >
                Read case study <ArrowUpRight size={13} />
              </Link>
            </section>
          ))}
        </div>
      </>
    );
  if (active === "education")
    return (
      <>
        <h1>Education & recognition</h1>
        {education.map((e) => (
          <section className="education-entry" key={e.school}>
            <span className="entry-date">{e.timeframe}</span>
            <h2>{e.school}</h2>
            <p>{e.program}</p>
            {e.highlights.map((h) => (
              <p key={h}>{h}</p>
            ))}
          </section>
        ))}
        <h2>Recognition</h2>
        <ul>
          {awards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </>
    );
  return (
    <>
      <h1>Say hello</h1>
      <h2>
        Have a hard problem?
        <br />
        Let’s think it through.
      </h2>
      <a className="contact-letter" href="mailto:kenrickles@gmail.com">
        kenrickles@gmail.com <ArrowUpRight size={15} />
      </a>
      <div className="contact-directory">
        <a
          href="https://github.com/kenrickles"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <ArrowUpRight size={14} />
        </a>
        <a
          href="https://linkedin.com/in/kenrick-tan"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn <ArrowUpRight size={14} />
        </a>
        <a href="https://t.me/kenrickles" target="_blank" rel="noreferrer">
          Telegram <ArrowUpRight size={14} />
        </a>
      </div>
    </>
  );
}
