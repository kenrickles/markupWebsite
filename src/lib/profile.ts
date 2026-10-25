import { historicalExperiences } from "./recoveredProfile";
export const experiences = [
  {
    timeframe: "Sep 2025 — Present",
    role: "Protocol Engineer",
    company: "Galaxy Digital",
    location: "Singapore",
    highlights: [
      "Platform and infrastructure engineering for digital assets.",
      "Working across protocol engineering, release delivery, and operational reliability.",
      "AI Champion, exploring practical applications of AI in engineering workflows.",
    ],
    stack: [
      "Protocol Engineering",
      "Infrastructure",
      "Release Engineering",
      "AI Tooling",
    ],
  },
  {
    timeframe: "May 2024 — Sep 2025",
    role: "SRE Specialist",
    company: "Prudential Singapore",
    location: "Singapore",
    highlights: [
      "Led the migration from Bitbucket to GitHub Enterprise and standardized CI/CD across business lines.",
      "Designed an MVP internal AI tooling suite with a custom MCP server integrating LLM automation into Jira and Confluence.",
      "Co-led release management automation with ticket validation, dependency checks, and Jira-linked release gating.",
      "Architected reusable GitHub Actions workflows with Docker, Helm, and GitOps-driven multi-environment releases.",
      "Introduced secrets rotation, image scanning, Renovate automation, and static analysis tools (Checkmarx, Snyk, Codacy).",
      "Mentored SRE/DevSecOps teams across SG/CN/IN/VN while aligning stakeholders in regulated environments.",
    ],
    stack: [
      "GitHub Actions",
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "AWS",
    ],
  },
  {
    timeframe: "Mar 2023 — May 2024",
    role: "Senior DevSecOps Engineer",
    company: "Partior Pte Ltd",
    location: "Singapore",
    highlights: [
      "Containerized GoQuorum and 8 DApps, packaging hardened images for production.",
      "Built Helm charts for GoQuorum and DApps, managing 7 Kubernetes environments with 40+ clusters.",
      "Integrated HashiCorp Vault via External Secrets Operator and enforced mTLS/TLS across networks and apps.",
      "Delivered end-to-end integration testing across seven release cycles.",
    ],
    stack: ["Kubernetes", "Helm", "Go", "Vault", "GCP"],
  },
  {
    timeframe: "Feb 2022 — Feb 2023",
    role: "DevSecOps Engineer",
    company: "Partior Pte Ltd",
    location: "Singapore",
    highlights: [
      "Co-developed an one-touch DevOps automation pipeline for delivery of a secure, easy, fast, highly available and scalable strategic blockchain network across multiple cloud platforms",
      "Containerisation of GoQuorum blockchain network application for strategic platform including all peripheral for deployment of an optimum cloud-container-native application network.",
      "Containerisation of DApps for clients to deploy easily with AWS EKS and GCP GKE",
      "Co-develop a command line interface in go-lang based on the Cobra framework",
      "Smart contract deployment via CICD Pipelines using Github Actions",
      "Cloud native deployment for sitnet, testnet and prodnet",
      "Integration of Hashicorp Vault with CICD Pipeline and k8s clusters alongside External Secrets Operator",
    ],
    stack: ["Go", "Terraform", "Docker", "Python"],
  },
  {
    timeframe: "May 2021 — Feb 2022",
    role: "Associate Cloud Engineer",
    company: "Versent Singapore",
    location: "Singapore",
    highlights: [
      "Migrated CI/CD from Bamboo to Jenkins for 250 projects and delivered training enablement.",
      "Led technical debt analysis and remediation across 38 issues.",
      "Troubleshot Azure DevOps pipelines and delivered a Prometheus/Grafana/Thanos + ArgoCD POC.",
    ],
    stack: ["Jenkins", "Bamboo", "Azure", "Prometheus", "ArgoCD"],
  },
  ...historicalExperiences,
];

export const education = [
  {
    timeframe: "Sep 2020 — Apr 2021",
    program: "Coding Bootcamp (Frontend, Backend, DSA)",
    school: "Rocket Academy",
    location: "Singapore",
    highlights: [
      "Learnt practical technologies and key principles for Front-end and Backend Apps as well as Data Structures and Algorithms",
    ],
  },
  {
    timeframe: "Aug 2015 — Jan 2020",
    program: "Bachelor of Arts, Double Major",
    school: "Singapore Management University",
    location: "Singapore",
    highlights: ["High Merit in Psychology and Corporate Communications"],
  },
  {
    timeframe: "Jan 2018 — May 2018",
    program: "Exchange Program",
    school: "IE University",
    location: "Segovia, Spain",
    highlights: [],
  },
];

export const awards = [
  "Ho See Beng Scholarship (2017)",
  "Commissioner of Police Commendation",
  "National Service Grade A (Top 10% of Cohort)",
  "CID Director Awards",
];
