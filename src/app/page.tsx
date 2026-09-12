import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { experiences, education, awards } from "@/lib/profile";
import { caseStudies } from "@/lib/caseStudies";
import SiteNav from "@/components/SiteNav";
import PortfolioMotion from "@/components/PortfolioMotion";
import HeroTerminal from "@/components/HeroTerminal";
import PageGate from "@/components/PageGate";
import { CountUp } from "@/components/CountUp";
import TerminalLauncher from "@/components/TerminalLauncher";
import MagneticCursor from "@/components/MagneticCursor";
import CommandPalette from "@/components/CommandPalette";
import TiltCard from "@/components/TiltCard";
import ScrambleText from "@/components/ScrambleText";
import SpotlightCard from "@/components/SpotlightCard";
import { assetPath } from "@/lib/site";

const disciplines = [
  "Protocol engineering",
  "Platform infrastructure",
  "Developer experience",
  "Applied AI",
];
const workLabels = [
  "01 / PROTOCOLS",
  "02 / DELIVERY",
  "03 / DEVELOPER EXPERIENCE",
  "04 / APPLIED AI",
];

export default function Home() {
  return (
    <>
      <PageGate>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <PortfolioMotion />
      <MagneticCursor />
      <CommandPalette />
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-meta mono">
            <span>Kenrick Tan / Singapore</span>
            <span>Protocol Engineer @ Galaxy Digital</span>
          </div>
          <div className="hero-composition">
            <div className="hero-copy">
              <p className="eyebrow hero-enter">
                Infrastructure. Protocols. Possibility.
              </p>
              <h1 id="hero-title">
                <span className="hero-line">
                  <ScrambleText text="Complex systems." as="span" duration={1200} />
                </span>
                <span className="hero-line">
                  Clear <em>thinking.</em>
                </span>
              </h1>
              <div className="hero-description hero-enter">
                <span className="small-rule" aria-hidden="true" />
                <p>
                  I build the platforms behind the product. From resilient
                  infrastructure to practical AI, I turn engineering complexity
                  into something teams can use.
                </p>
              </div>
              <div className="hero-actions hero-enter">
                <a className="button-primary" data-magnetic href="#projects">
                  Explore my work <ArrowDown size={18} />
                </a>
                <a className="text-action" data-magnetic href="mailto:kenrickles@gmail.com">
                  Let’s talk <ArrowUpRight size={18} />
                </a>
                <TerminalLauncher />
              </div>
            </div>
            <div className="system-art" aria-hidden="true">
              <div className="art-corner corner-a" />
              <div className="art-corner corner-b" />
              <span className="art-label mono">SYSTEMS / IN MOTION</span>
              <svg className="orbital" viewBox="0 0 500 500" fill="none">
                <defs>
                  <linearGradient
                    id="orbit"
                    x1="0"
                    y1="0"
                    x2="500"
                    y2="500"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#f0a848" />
                    <stop offset=".55" stopColor="#b3772a" />
                    <stop offset="1" stopColor="#3d2f14" />
                  </linearGradient>
                </defs>
                <g
                  className="orbit-group"
                  stroke="url(#orbit)"
                  strokeWidth=".9"
                >
                  {Array.from({ length: 18 }, (_, i) => (
                    <ellipse
                      key={i}
                      cx="250"
                      cy="250"
                      rx="190"
                      ry="74"
                      transform={`rotate(${i * 10} 250 250)`}
                    />
                  ))}
                </g>
                <circle
                  cx="250"
                  cy="250"
                  r="206"
                  stroke="#3a4654"
                  strokeDasharray="2 9"
                />
                <path
                  d="M250 20v25M250 455v25M20 250h25M455 250h25"
                  stroke="#7d8ea0"
                />
                <circle
                  className="orbit-dot"
                  cx="250"
                  cy="44"
                  r="5"
                  fill="#f0a848"
                />
              </svg>
              <div className="art-bottom mono">
                <span>BUILD → SHIP → REFINE</span>
                <span>01—04</span>
              </div>
            </div>
          </div>
          <div className="hero-footer">
            <span className="mono">
              From cloud foundations to digital assets
            </span>
            <a href="#about" className="mono scroll-cue">
              Scroll to discover <ArrowDown size={15} />
            </a>
          </div>
        </section>
        <div className="terminal-strip wrap">
          <HeroTerminal />
        </div>
        <div className="discipline-strip">
          <div className="wrap">
            {disciplines.map((d, i) => (
              <span key={d}>
                <span className="discipline-index mono">0{i + 1}</span>
                {d}
              </span>
            ))}
          </div>
        </div>

        <section id="projects" className="section wrap">
          <div className="section-heading reveal">
            <p className="eyebrow">01 / Selected work</p>
            <div>
              <h2>
                Built for the
                <br />
                <span className="muted">real world.</span>
              </h2>
              <p>
                Release systems, developer platforms, and tooling for the people
                who run them.
              </p>
            </div>
          </div>
          <div className="work-grid">
            {caseStudies.map((study, i) => (
              <TiltCard key={study.slug} max={5}>
              <SpotlightCard
                className={`work-card work-${i} reveal`}
              >
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="work-link"
                >
                  <div className="work-top">
                    <span className="mono">{workLabels[i]}</span>
                    <ArrowUpRight className="work-arrow" size={23} />
                  </div>
                  <div className="work-graphic" aria-hidden="true">
                    {i === 0 ? (
                      <>
                        <span className="signal s1" />
                        <span className="signal s2" />
                        <span className="signal s3" />
                        <span className="signal s4" />
                        <span className="signal-core">
                          PROTOCOL
                          <br />
                          RELIABILITY
                        </span>
                      </>
                    ) : i === 1 ? (
                      <div className="pipeline-art">
                        {["COMMIT", "VERIFY", "RELEASE"].map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    ) : i === 2 ? (
                      <div className="terminal-art">
                        <span>~ / platform</span>
                        <p>
                          <b>❯</b> onboard --guided
                        </p>
                        <p className="terminal-muted">
                          Environment · Configuration · Delivery
                        </p>
                      </div>
                    ) : (
                      <div className="ai-art">
                        <span>Jira</span>
                        <b>MCP</b>
                        <span>Confluence</span>
                      </div>
                    )}
                  </div>
                  <h3>{study.title}</h3>
                  <p>{study.subtitle}</p>
                  <div className="work-bottom">
                    <div className="tags">
                      {study.stack.slice(0, 3).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <span className="case-link">
                      Read case study <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="wrap about-grid">
            <div className="portrait-block reveal">
              <div className="portrait-frame">
                <Image
                  src={assetPath("/kenrick.jpg")}
                  alt="Kenrick Tan"
                  width={640}
                  height={640}
                  sizes="(max-width: 760px) 85vw, 360px"
                />
                <span className="portrait-caption mono">
                  KENRICK TAN / SINGAPORE
                </span>
              </div>
              <p className="mono portrait-note">
                Engineer by practice.
                <br />
                Curious by default.
              </p>
            </div>
            <div className="about-copy reveal">
              <p className="eyebrow">02 / The person behind the platform</p>
              <h2>
                I think in systems.
                <br />
                <span className="muted">I build for people.</span>
              </h2>
              <p>
                I’m Kenrick, a Protocol Engineer at Galaxy Digital. My work sits
                at the intersection of digital assets, infrastructure, and
                developer experience.
              </p>
              <p>
                I’ve helped teams move CI/CD platforms, operate Kubernetes
                environments, and build internal AI tooling. The common thread:
                making complicated work more dependable and easier to do.
              </p>
              <p>
                Before engineering, I studied psychology and communications.
                That perspective stays with me: understand the people, ask
                better questions, then build the right thing.
              </p>
              <div className="about-facts">
                <div>
                  <strong>
                    <CountUp value="40+" />
                  </strong>
                  <span>
                    Clusters across 7 environments
                    <br />
                    at Partior
                  </span>
                </div>
                <div>
                  <strong>
                    <CountUp value="250" />
                  </strong>
                  <span>
                    Projects in a CI/CD migration
                    <br />
                    at Versent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="section wrap">
          <div className="section-heading reveal">
            <p className="eyebrow">03 / Experience</p>
            <div>
              <h2>
                A path through
                <br />
                <span className="muted">systems that matter.</span>
              </h2>
              <p>
                Digital assets, financial services, and the infrastructure that
                connects them.
              </p>
            </div>
          </div>
          <div className="experience-list">
            {experiences.map((job, i) => (
              <details
                key={job.role}
                className="experience-row reveal"
                open={i === 0}
              >
                <summary>
                  <span className="job-date mono">{job.timeframe}</span>
                  <span className="job-title">
                    <strong>{job.company}</strong>
                    <span>{job.role}</span>
                  </span>
                  <span className="expand-icon" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="job-body">
                  <ul>
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="tags">
                    {job.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div className="credentials-grid">
            <div id="education" className="reveal">
              <p className="eyebrow">Education</p>
              {education.map((e) => (
                <div className="credential" key={e.school}>
                  <span className="mono muted">{e.timeframe}</span>
                  <h3>{e.school}</h3>
                  <p>{e.program}</p>
                  {e.highlights.map((h) => (
                    <p key={h} className="credential-detail">
                      {h}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div id="recognition" className="reveal">
              <p className="eyebrow">Recognition</p>
              {awards.map((a) => (
                <div className="award" key={a}>
                  <span aria-hidden="true">✳</span>
                  <p>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="wrap reveal">
            <p className="eyebrow">04 / Say hello</p>
            <h2>
              Have a hard problem?
              <br />
              <a href="mailto:kenrickles@gmail.com">
                Let’s think it through.
                <ArrowUpRight />
              </a>
            </h2>
            <div className="contact-bottom">
              <a href="mailto:kenrickles@gmail.com" className="contact-email">
                kenrickles@gmail.com
              </a>
              <div className="socials">
                <a
                  href="https://github.com/kenrickles"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={18} />
                  GitHub <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://linkedin.com/in/kenrick-tan"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={18} />
                  LinkedIn <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://t.me/kenrickles"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Mail size={18} />
                  Telegram <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer wrap mono">
        <span>© {new Date().getFullYear()} Kenrick Tan</span>
        <span>Always building. Always learning.</span>
        <a href="#main">Back to top ↑</a>
      </footer>
          </PageGate>
    </>
  );
}
