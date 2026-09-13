import type { Metadata, Viewport } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
});
const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kenrick Tan | Protocol Engineer",
    template: "%s | Kenrick Tan",
  },
  description:
    "Protocol Engineer at Galaxy Digital. Building calm, resilient infrastructure for regulated financial platforms. 5+ years in Kubernetes, CI/CD, and platform engineering.",
  keywords: [
    "SRE",
    "DevSecOps",
    "Protocol Engineer",
    "Infrastructure",
    "Kubernetes",
    "Platform Engineering",
    "GitHub Actions",
    "Helm",
    "Terraform",
    "AWS",
    "AI Tooling",
    "Singapore",
    "Portfolio",
    "Release Engineering",
    "Site Reliability Engineering",
  ],
  authors: [{ name: "Kenrick Tan", url: SITE_URL }],
  creator: "Kenrick Tan",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Kenrick Tan | Protocol Engineer",
    description:
      "Protocol Engineer at Galaxy Digital. Building calm, resilient infrastructure for regulated financial platforms.",
    siteName: "Kenrick Tan Portfolio",
    images: [
      {
        url: `${SITE_URL}/kenrick.jpg`,

        alt: "Kenrick Tan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenrick Tan | Protocol Engineer",
    description:
      "Protocol Engineer at Galaxy Digital. Building calm, resilient infrastructure for regulated financial platforms.",
    images: [`${SITE_URL}/kenrick.jpg`],
    creator: "@kenrickles",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kenrick Tan",
  url: SITE_URL,
  image: `${SITE_URL}/kenrick.jpg`,
  sameAs: [
    "https://github.com/kenrickles",
    "https://linkedin.com/in/kenrick-tan",
    "https://t.me/kenrickles",
  ],
  jobTitle: "Protocol Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Galaxy Digital",
    url: "https://www.galaxy.com",
  },
  description:
    "SRE and DevSecOps specialist focused on regulated financial environments, release engineering, and pragmatic AI tooling.",
  knowsAbout: [
    "Kubernetes",
    "Docker",
    "Helm",
    "Terraform",
    "GitHub Actions",
    "AWS",
    "GCP",
    "Site Reliability Engineering",
    "DevSecOps",
    "Platform Engineering",
    "CI/CD",
    "GitOps",
    "AI Tooling",
    "Model Context Protocol (MCP)",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${mono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=new URLSearchParams(location.search).get('theme');if(t!=='light'&&t!=='dark'){try{t=localStorage.getItem('kenrick-theme')}catch(e){}}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.classList.toggle('light',t==='light')}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`antialiased ${geist.variable} ${mono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
