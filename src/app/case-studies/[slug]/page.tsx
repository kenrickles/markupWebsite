import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";

import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: study.title,
    alternates: { canonical: `${SITE_URL}/case-studies/${study.slug}/` },
    description: study.summary,
    openGraph: {
      title: `${study.title} | Kenrick Tan`,
      description: study.summary,
      url: `${SITE_URL}/case-studies/${study.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} | Kenrick Tan`,
      description: study.summary,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const study = getCaseStudy((await params).slug);
  if (!study) return notFound();

  return (
    <main className="min-h-screen">
      <div className="case-page wrap">
        <Link href="/" className="back-link">
          ← Kenrick Tan / Back to work
        </Link>

        <div className="mt-8 space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Case study
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase">
            {study.title}
          </h1>
          <p className="text-lg text-[color:var(--muted)]">{study.subtitle}</p>
        </div>

        <div className="mt-10 glass-card p-6 sm:p-8 space-y-6">
          <p className="text-[color:var(--muted)] text-base sm:text-lg">
            {study.summary}
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {study.impact.map((item) => (
              <div
                key={item}
                className="border-2 border-[color:var(--border)] p-4"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                  Impact
                </p>
                <p className="mt-2 font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:gap-8">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold">Problem</h2>
            <p className="text-[color:var(--muted)] mt-4">{study.problem}</p>
          </div>

          <ArchitectureDiagram
            title={study.diagram.title}
            nodes={study.diagram.nodes}
            edges={study.diagram.edges}
          />

          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold">Approach</h2>
            <ul className="mt-4 space-y-3 text-[color:var(--muted)]">
              {study.approach.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold">Outcomes</h2>
            <ul className="mt-4 space-y-3 text-[color:var(--muted)]">
              {study.outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {study.metrics && (
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold">Metrics</h2>
              <p className="text-[color:var(--muted)] mt-2 text-sm">
                Before → After comparison
              </p>
              <div className="mt-4 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] mb-4">
                    Before
                  </h3>
                  <dl className="space-y-3">
                    {Object.entries(study.metrics.before).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-2 border-b border-[color:var(--border)]"
                        >
                          <dt className="text-sm text-[color:var(--muted)] capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </dt>
                          <dd className="text-sm font-semibold">{value}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] mb-4">
                    After
                  </h3>
                  <dl className="space-y-3">
                    {Object.entries(study.metrics.after).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-[color:var(--border)]"
                      >
                        <dt className="text-sm text-[color:var(--muted)] capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </dt>
                        <dd className="text-sm font-semibold text-[color:var(--accent)]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold">Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 border-2 border-[color:var(--border)] text-xs uppercase tracking-[0.3em]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
