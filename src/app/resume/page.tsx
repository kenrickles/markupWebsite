import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { assetPath } from "@/lib/site";
import PrintResume from "@/components/PrintResume";
import ResumeContent from "@/components/ResumeContent";
export const metadata: Metadata = {
  title: "Résumé",
  alternates: { canonical: `${SITE_URL}/resume/` },
};
export default function Resume() {
  return (
    <main className="resume-page wrap">
      <div className="resume-toolbar">
        <Link href="/">← Back to portfolio</Link>
        <a href={assetPath("/kenrick-tan-resume.pdf")} download>
          Download PDF
        </a>
        <PrintResume />
      </div>
      <ResumeContent />
    </main>
  );
}
