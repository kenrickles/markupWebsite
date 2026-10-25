"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BatteryFull, BriefcaseBusiness, ChevronLeft, ChevronRight, Code2, FileText, Folder, Github, GraduationCap, Mail, MapPin, Maximize2, Minus, Moon, Search, Sun, Wifi, X } from "lucide-react";
import { experiences, education, awards } from "@/lib/profile";
import { assetPath } from "@/lib/site";

type Note = "about" | "experience" | "projects" | "education" | "contact";
const notes: { id: Note; title: string; preview: string; category: string }[] = [
  { id: "about", title: "Hi, I’m Kenrick.", preview: "A little about the person behind the platform.", category: "Pinned" },
  { id: "experience", title: "The journey so far", preview: "Galaxy Digital, Prudential, Partior & Versent", category: "Work" },
  { id: "projects", title: "Things I’ve built", preview: "Infrastructure, delivery & practical AI", category: "Work" },
  { id: "education", title: "Always a student", preview: "Psychology, code & everything in between", category: "Personal" },
  { id: "contact", title: "Let’s connect", preview: "Good conversations start with a hello.", category: "Personal" },
];
const projects = [
  { title: "Enterprise delivery, simplified", company: "Prudential Singapore", text: "Migration from Bitbucket to GitHub Enterprise, reusable GitHub Actions workflows, and Jira-linked release gating.", tags: ["GitHub Actions", "Helm", "GitOps"] },
  { title: "Blockchain infrastructure", company: "Partior", text: "Hardened GoQuorum and DApp containers, Helm charts, and secrets integration across seven Kubernetes environments.", tags: ["Kubernetes", "GoQuorum", "Vault"] },
  { title: "AI where the work happens", company: "Prudential Singapore", text: "An MVP internal AI tooling suite with a custom MCP server connecting LLM automation to Jira and Confluence.", tags: ["MCP", "Jira", "Confluence"] },
  { title: "A better developer starting point", company: "Partior & Versent", text: "A Go CLI for client onboarding at Partior, and a Bamboo-to-Jenkins migration covering 250 projects at Versent.", tags: ["Go", "Jenkins", "Developer experience"] },
];

export default function DesktopPortfolio() {
  const [active, setActive] = useState<Note>("about");
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [night, setNight] = useState(false);
  const [clock, setClock] = useState("Singapore · SGT");
  const [history, setHistory] = useState<Note[]>(["about"]);
  const [cursor, setCursor] = useState(0);
  const windowRef = useRef<HTMLElement>(null);
  const gesture = useRef<{ x: number; y: number; left: number; top: number; width: number; height: number; mode: "move" | "resize" } | null>(null);
  const beginGesture = (e: PointerEvent<HTMLElement>, mode: "move" | "resize") => {
    if (expanded || window.innerWidth <= 760 || e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    gesture.current = { x: e.clientX, y: e.clientY, left: rect.left, top: rect.top, width: rect.width, height: rect.height, mode };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const moveGesture = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current; const el = windowRef.current;
    if (!g || !el) return;
    const dx = e.clientX - g.x; const dy = e.clientY - g.y;
    el.style.transform = "none";
    el.style.left = `${g.left}px`; el.style.top = `${g.top}px`;
    if (g.mode === "move") {
      el.style.left = `${Math.max(8, Math.min(window.innerWidth - g.width - 8, g.left + dx))}px`;
      el.style.top = `${Math.max(42, Math.min(window.innerHeight - 140, g.top + dy))}px`;
    } else {
      el.style.width = `${Math.max(660, Math.min(window.innerWidth - g.left - 12, g.width + dx))}px`;
      el.style.height = `${Math.max(380, Math.min(window.innerHeight - g.top - 110, g.height + dy))}px`;
    }
  };
  const endGesture = () => { gesture.current = null; };
  const toggleExpanded = () => { windowRef.current?.removeAttribute("style"); setExpanded(!expanded); };
  useEffect(() => {
    const reset = () => { windowRef.current?.removeAttribute("style"); };
    window.addEventListener("resize", reset); return () => window.removeEventListener("resize", reset);
  }, []);
  const contentRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => setClock(new Intl.DateTimeFormat("en-SG", { timeZone: "Asia/Singapore", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    update(); const timer = setInterval(update, 60000); return () => clearInterval(timer);
  }, []);
  useEffect(() => { contentRef.current?.scrollTo(0, 0); }, [active]);
  useEffect(() => {
    const fromHash = () => {
      const aliases: Record<string, Note> = { about: "about", projects: "projects", experience: "experience", contact: "contact", education: "education" };
      const note = aliases[window.location.hash.slice(1)];
      if (note) { setActive(note); setHistory([note]); setCursor(0); setOpened(true); }
    };
    const frame = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", fromHash); };
  }, []);
  const select = (id: Note) => {
    setOpened(true);
    if (id !== active) { setHistory([...history.slice(0, cursor + 1), id]); setCursor(cursor + 1); setActive(id); }
  };
  const travel = (direction: number) => { const next = cursor + direction; if (next >= 0 && next < history.length) { setCursor(next); setActive(history[next]); } };
  const filtered = notes.filter(n => `${n.title} ${n.preview}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className={`desktop-portfolio${night ? " desktop-night" : ""}`}>
      <a className="desktop-skip" href="#note-content">Skip to content</a>
      <header className="desktop-menubar">
        <div className="menu-left"><span className="system-mark" aria-hidden="true">✳</span><strong>Kenrick’s desktop</strong><span className="menu-secondary">Portfolio</span><Link className="menu-secondary" href="/resume/">Résumé</Link></div>
        <div className="menu-right"><button aria-label={night ? "Switch to day wallpaper" : "Switch to night wallpaper"} onClick={() => setNight(!night)}>{night ? <Moon size={15} /> : <Sun size={15} />}</button><Wifi size={15} /><BatteryFull size={20} /><time>{clock}</time></div>
      </header>
      <div className="desktop-greeting" aria-hidden="true"><span>make complex things</span><em>feel simple.</em></div>
      <nav className="desktop-files" aria-label="Desktop shortcuts">
        <button onClick={() => select("projects")}><span className="desktop-folder"><Folder size={46} fill="currentColor" strokeWidth={1} /></span><span>Selected work</span></button>
        <Link href="/resume/"><span className="desktop-document"><FileText size={35} strokeWidth={1.3} /><small>CV</small></span><span>Kenrick — Résumé</span></Link>
      </nav>
      {opened ? <section ref={windowRef} className={`notes-window${expanded ? " notes-expanded" : ""}`} aria-label="Portfolio notes">
        <header className="notes-titlebar" onPointerDown={e => beginGesture(e, "move")} onPointerMove={moveGesture} onPointerUp={endGesture} onPointerCancel={endGesture} onDoubleClick={e => { if (!(e.target as HTMLElement).closest("button")) toggleExpanded(); }}>
          <div className="traffic-lights"><button className="traffic-close" aria-label="Close notes" onClick={() => setOpened(false)}><X size={9} /></button><button className="traffic-minimize" aria-label="Minimize notes" onClick={() => setOpened(false)}><Minus size={9} /></button><button className="traffic-expand" aria-label={expanded ? "Restore window" : "Expand window"} onClick={toggleExpanded}><Maximize2 size={8} /></button></div>
          <span>Notes</span><span className="titlebar-person">Kenrick Tan</span>
        </header>
        <div className="notes-layout">
          <aside className="notes-sidebar" aria-label="Notes navigation">
            <label className="note-search"><Search size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes" aria-label="Search notes" /><kbd>⌕</kbd></label>
            <div className="notes-list">{["Pinned", "Work", "Personal"].map(category => {
              const group = filtered.filter(n => n.category === category);
              return group.length > 0 && <div className="note-group" key={category}><p className="note-group-label">{category === "Pinned" && <span aria-hidden="true">⌁ </span>}{category}</p>{group.map(n => <button key={n.id} className={`note-item${active === n.id ? " note-selected" : ""}`} onClick={() => select(n.id)} aria-current={active === n.id ? "page" : undefined}><strong>{n.title}</strong><span>{n.preview}</span></button>)}</div>;
            })}{filtered.length === 0 && <p className="search-empty" role="status">No matching notes.</p>}</div>
            <div className="sidebar-footer"><span className="status-dot" />Based in Singapore<span>{notes.length} notes</span></div>
          </aside>
          <div className="note-main">
            <div className="note-toolbar"><div><button aria-label="Previous note" disabled={cursor === 0} onClick={() => travel(-1)}><ChevronLeft size={17} /></button><button aria-label="Next note" disabled={cursor === history.length - 1} onClick={() => travel(1)}><ChevronRight size={17} /></button></div><span>Personal / {active === "about" ? "A little introduction" : notes.find(n => n.id === active)?.title}</span><Link href="/resume/" aria-label="Open printable résumé"><FileText size={17} /></Link></div>
            <article id="note-content" className="note-content" ref={contentRef} tabIndex={-1}>
              <div className="note-dateline">A few notes on work, life & building things</div>
              {active === "about" && <>
                <div className="intro-topline"><span className="note-eyebrow">HELLO, WORLD</span><span className="intro-location"><MapPin size={12} />Singapore</span></div>
                <div className="intro-heading"><h1>Hi, I’m Kenrick<span>.</span></h1><Image className="note-portrait" src={assetPath("/kenrick.jpg")} alt="Kenrick Tan" width={68} height={68} priority /></div>
                <p className="intro-lead">I build the platforms<br />behind the possibilities.</p>
                <p>I’m a <strong>Protocol Engineer at Galaxy Digital</strong>, working at the intersection of digital assets, infrastructure, and developer experience. I like taking complicated systems and making them dependable — and easier for people to use.</p>
                <p>Before Galaxy, I worked on cloud platforms, release engineering, and DevSecOps at <button className="inline-note-link" onClick={() => select("experience")}>Prudential, Partior, and Versent</button>. Along the way: Kubernetes environments, enterprise CI/CD migrations, a Go CLI, and practical AI tooling.</p>
                <div className="note-callout"><span aria-hidden="true">↳</span><p>My starting point is always the same:<br /><strong>understand the people, then build the right thing.</strong></p></div>
                <p>I studied psychology and communications before finding my way into engineering. That background still shapes how I work: ask better questions, connect the dots, and bring people along.</p>
                <p className="personal-note">Away from the keyboard? Probably at a mahjong table, playing on my Switch, or learning the drums.</p>
                <div className="note-divider" /><div className="note-bottom-links"><button onClick={() => select("projects")}>Explore my work <ArrowUpRight size={15} /></button><button onClick={() => select("contact")}>Say hello <ArrowUpRight size={15} /></button></div>
                <p className="note-signature">Thanks for stopping by.<span>Kenrick</span></p>
              </>}
              {active === "experience" && <><span className="note-eyebrow">THE WORK CHAPTER</span><h1>The journey so far<span>.</span></h1><p className="section-intro">From cloud foundations to digital assets. A few places where I’ve helped make complex work more dependable.</p><div className="desktop-experience">{experiences.map((job,i) => <section key={job.role}><div className="experience-marker">{String(i+1).padStart(2,"0")}</div><div><span className="entry-date">{job.timeframe}</span><h2>{job.company}</h2><p className="entry-role">{job.role}</p><ul>{job.highlights.map(h => <li key={h}>{h}</li>)}</ul><div className="note-tags">{job.stack.map(s => <span key={s}>{s}</span>)}</div></div></section>)}</div><Link className="note-text-link" href="/resume/">Open full résumé <ArrowUpRight size={15} /></Link></>}
              {active === "projects" && <><span className="note-eyebrow">A FEW ENGINEERING NOTES</span><h1>Things I’ve built<span>.</span></h1><p className="section-intro">A selection of work across infrastructure, delivery, developer experience, and applied AI.</p><div className="desktop-projects">{projects.map((p,i) => <section key={p.title}><div className="project-index"><Code2 size={20}/><span>0{i+1} / {p.company}</span></div><h2>{p.title}</h2><p>{p.text}</p><div className="note-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div></section>)}</div><a className="note-text-link" href="https://github.com/kenrickles" target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={15}/></a></>}
              {active === "education" && <><span className="note-eyebrow">CURIOSITY IS THE CONSTANT</span><h1>Always a student<span>.</span></h1><p className="section-intro">Psychology taught me to ask why. Engineering gave me a way to build what comes next.</p>{education.map(e => <section className="education-entry" key={e.school}><GraduationCap size={24}/><div><span className="entry-date">{e.timeframe}</span><h2>{e.school}</h2><p>{e.program}</p>{e.highlights.map(h => <p className="education-detail" key={h}>{h}</p>)}</div></section>)}<h2 className="recognition-heading">A few milestones</h2><ul className="recognition-list">{awards.map(a => <li key={a}>{a}</li>)}</ul></>}
              {active === "contact" && <><span className="note-eyebrow">THE INTERNET IS BETTER WITH PEOPLE</span><h1>Let’s connect<span>.</span></h1><p className="section-intro">Have an interesting engineering problem, an idea to build, or just want to say hello? I’d love to hear from you.</p><a className="contact-letter" href="mailto:kenrickles@gmail.com"><Mail size={25}/><span><small>WRITE ME A NOTE</small><strong>kenrickles@gmail.com</strong></span><ArrowUpRight size={20}/></a><div className="contact-directory"><a href="https://github.com/kenrickles" target="_blank" rel="noreferrer"><Github size={20}/><span>GitHub<small>Code, experiments & things in progress</small></span><ArrowUpRight size={16}/></a><a href="https://linkedin.com/in/kenrick-tan" target="_blank" rel="noreferrer"><BriefcaseBusiness size={20}/><span>LinkedIn<small>The professional chapter</small></span><ArrowUpRight size={16}/></a><a href="https://t.me/kenrickles" target="_blank" rel="noreferrer"><Mail size={20}/><span>Telegram<small>A quick hello</small></span><ArrowUpRight size={16}/></a></div><p className="note-signature">See you around.<span>Kenrick</span></p></>}
            </article>
            <footer className="note-status"><span>{active === "about" ? "A personal introduction" : "Kenrick’s notes"}</span><span>Made with intention · © {new Date().getFullYear()}</span></footer>
          </div>
        </div>
        <div className="window-resize" aria-hidden="true" onPointerDown={e => beginGesture(e, "resize")} onPointerMove={moveGesture} onPointerUp={endGesture} onPointerCancel={endGesture}/>
      </section> : <button className="reopen-note" onClick={() => setOpened(true)}><FileText size={32}/><strong>A little about Kenrick</strong><span>Open Notes <ArrowUpRight size={14}/></span></button>}
      <footer className="desktop-bottom"><span>ENGINEER BY PRACTICE. CURIOUS BY DEFAULT.</span><span>Feel free to look around.</span></footer>
      <nav className="desktop-dock" aria-label="Application dock">
        <button onClick={() => { setQuery(""); select("about"); }} aria-label="Open introduction" className="dock-app dock-finder"><span className="finder-face" aria-hidden="true">☺</span><span className="dock-tooltip">About me</span><i className={opened && active === "about" ? "dock-active" : ""}/></button>
        <button onClick={() => { setQuery(""); select("experience"); }} aria-label="Open experience" className="dock-app dock-work"><BriefcaseBusiness size={29}/><span className="dock-tooltip">Experience</span><i className={opened && active === "experience" ? "dock-active" : ""}/></button>
        <button onClick={() => { setQuery(""); select("projects"); }} aria-label="Open projects" className="dock-app dock-code"><Code2 size={31}/><span className="dock-tooltip">Projects</span><i className={opened && active === "projects" ? "dock-active" : ""}/></button>
        <button onClick={() => { setQuery(""); select("about"); }} aria-label="Open notes" className="dock-app dock-notes"><span className="notes-icon" aria-hidden="true"/><span className="dock-tooltip">Notes</span><i className={opened ? "dock-active" : ""}/></button>
        <button onClick={() => { setQuery(""); select("contact"); }} aria-label="Open contact" className="dock-app dock-mail"><Mail size={31}/><span className="dock-tooltip">Contact</span><i className={opened && active === "contact" ? "dock-active" : ""}/></button>
        <span className="dock-separator"/>
        <Link href="/resume/" aria-label="Open résumé" className="dock-app dock-resume"><FileText size={29}/><span className="dock-tooltip">Résumé</span></Link>
        <a href="https://github.com/kenrickles" target="_blank" rel="noreferrer" aria-label="Visit GitHub" className="dock-app dock-github"><Github size={29}/><span className="dock-tooltip">GitHub</span></a>
      </nav>
      <noscript><div className="desktop-noscript">For the complete work history, <Link href="/resume/">read my résumé <ArrowLeft size={12}/></Link>.</div></noscript>
    </main>
  );
}
