import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experiences, education } from "@/lib/profile";
import {
  certifications,
  recoveredRecognition,
} from "@/lib/recoveredProfile";
import { assetPath } from "@/lib/site";
export type PortfolioNote = "about" | "experience" | "education" | "contact";
/** User-written introduction and recovered resume details, with later roles retained. */
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
        <p className="intro-lead">
          I build the platforms behind the product. From resilient infrastructure
          to practical AI, I turn engineering complexity into something teams can use.
        </p>
        <h1>Kenrick Tan</h1>
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
          <br />
          I build for people.
        </h2>
        <p>
          I’m Kenrick, a Protocol Engineer at Galaxy Digital. My work sits at the
          intersection of blockchain, digital assets, infrastructure, and developer experience.
        </p>
        <p>
          Before engineering, I studied psychology and communications. That
          perspective stays with me: understand the people, ask better questions,
          then build the right thing.
        </p>
        <p>
          I aspire to be a Renaissance developer, drawing on different disciplines
          to become a better engineer. I value T-shaped thinking: building depth in
          my craft while staying curious about the fields around it.
        </p>
        <p>
          Omotenashi (おもてなし) and kaizen (改善) shape how I approach the work:
          anticipate people’s needs, care about the details, and keep making small improvements.
        </p>
        <p>
          I also believe in paying it forward. People have helped me along the way
          by sharing what they know. I try to do the same.
        </p>
        <div className="note-bottom-links">
          <button onClick={() => select("experience")}>
            Work experience <ArrowUpRight size={14} />
          </button>
          <button onClick={() => select("contact")}>
            Get in touch <ArrowUpRight size={14} />
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
        <h2>Certifications</h2>
        {certifications.map((c) => (
          <section className="education-entry" key={c.title}>
            <h2>{c.title}</h2>
            <p>
              {c.organization} · {c.timeframe}
            </p>
            <a href={c.href} target="_blank" rel="noreferrer">
              Verify Certification ↗
            </a>
          </section>
        ))}
        <h2>Awards</h2>
        {recoveredRecognition.map((a) => (
          <section className="education-entry" key={a.title}>
            <h2>{a.title}</h2>
            <p>
              {a.organization} · {a.timeframe}
            </p>
            <ul>
              {a.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        ))}
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
