export type DiagramNode = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  impact: string[];
  stack: string[];
  problem: string;
  approach: string[];
  outcomes: string[];
  metrics?: {
    before: Record<string, string>;
    after: Record<string, string>;
  };
  diagram: {
    title: string;
    nodes: DiagramNode[];
    edges: DiagramEdge[];
  };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'protocol-flight-deck',
    title: 'Protocol Reliability Flight Deck',
    subtitle: 'Release readiness, incident visibility, and rollback confidence for blockchain infrastructure.',
    summary:
      'Built a control plane that centralizes protocol health, pre-release validation, and emergency rollback workflows.',
    impact: ['38% faster release cadence', '70% faster incident triage', 'Zero critical release rollbacks in 2 quarters', '99.95% validator uptime maintained', 'MTTD reduced from 18m to 5.2m'],
    stack: ['Go', 'Kubernetes', 'Prometheus', 'Grafana', 'Vault'],
    problem:
      'Release safety relied on manual checklists, and incident telemetry was fragmented across multiple dashboards, slowing decisions under pressure.',
    approach: [
      'Designed a single release readiness scorecard with automated canary gates.',
      'Unified validator, node, and infra telemetry into one live mission-control view.',
      'Added deterministic rollback playbooks with pre-approved remediation steps.',
    ],
    outcomes: [
      'Engineers trust launch decisions with real-time guardrails.',
      'On-call response is calmer and faster thanks to shared visibility.',
      'Release managers get a clear go/no-go signal with audit trails.',
      'SLA breaches reduced by 62% in 6 months.',
      'On-call fatigue decreased with clearer escalation paths.',
    ],
    metrics: {
      before: {
        releaseTime: '4.2 hours',
        triageTime: '18 minutes',
        sliBreachRate: '4.2%',
        uptime: '99.89%',
      },
      after: {
        releaseTime: '2.6 hours',
        triageTime: '5.2 minutes',
        sliBreachRate: '1.6%',
        uptime: '99.95%',
      },
    },
    diagram: {
      title: 'Flight Deck Architecture',
      nodes: [
        { id: 'validators', label: 'Validators', detail: 'Cluster health + consensus telemetry', x: 12, y: 24 },
        { id: 'telemetry', label: 'Telemetry Bus', detail: 'Prometheus + log pipelines', x: 38, y: 20 },
        { id: 'readiness', label: 'Readiness Gate', detail: 'Release scorecard + canaries', x: 62, y: 18 },
        { id: 'control', label: 'Control Plane', detail: 'Command UI + incident snapshots', x: 46, y: 52 },
        { id: 'rollback', label: 'Rollback Engine', detail: 'Deterministic rollbacks + playbooks', x: 72, y: 58 },
        { id: 'stakeholders', label: 'Release Desk', detail: 'Comms + decision log', x: 24, y: 72 },
      ],
      edges: [
        { from: 'validators', to: 'telemetry' },
        { from: 'telemetry', to: 'readiness' },
        { from: 'telemetry', to: 'control' },
        { from: 'readiness', to: 'control' },
        { from: 'control', to: 'rollback' },
        { from: 'control', to: 'stakeholders' },
      ],
    },
  },
  {
    slug: 'secure-supply-chain',
    title: 'Secure Supply Chain Pipelines',
    subtitle: 'DevSecOps automation with policy-as-code, SBOMs, and artifact signing.',
    summary:
      'Delivered hardened CI/CD pipelines that bake in security checks without slowing teams down.',
    impact: ['120+ pipelines standardized', '100% SBOM coverage', 'Audit prep time cut by 60%', 'Zero critical vulnerabilities in production for 8 months', 'Policy compliance rate improved to 98%'],
    stack: ['GitHub Actions', 'OPA', 'Vault', 'Terraform'],
    problem:
      'Teams shipped in different ways, security controls were inconsistent, and audit evidence was piecemeal.',
    approach: [
      'Shipped reusable pipeline templates with SLSA-aligned checks.',
      'Integrated secrets automation with HSM-backed Vault workflows.',
      'Captured compliance evidence automatically at each stage.',
    ],
    outcomes: [
      'Security is standardized without blocking teams.',
      'Release approvals are faster with pre-collected evidence.',
      'Engineering velocity increased while risk reduced.',
      'Audit prep went from 2 weeks to 3 days.',
      'Security team reviews reduced by 75% due to automated gates.',
    ],
    metrics: {
      before: {
        pipelineConsistency: '23%',
        sbomCoverage: '0%',
        auditPrepTime: '2 weeks',
        criticalVulnsQ1: '12',
        policyCompliance: '68%',
      },
      after: {
        pipelineConsistency: '100%',
        sbomCoverage: '100%',
        auditPrepTime: '3 days',
        criticalVulnsQ1: '0',
        policyCompliance: '98%',
      },
    },
    diagram: {
      title: 'Supply Chain Pipeline',
      nodes: [
        { id: 'commit', label: 'Commit', detail: 'Signed commits + PR checks', x: 10, y: 50 },
        { id: 'build', label: 'Build', detail: 'SLSA build + SBOM generation', x: 30, y: 28 },
        { id: 'scan', label: 'Scan', detail: 'Static + dependency scans', x: 30, y: 70 },
        { id: 'policy', label: 'Policy Gate', detail: 'OPA policy-as-code checks', x: 55, y: 50 },
        { id: 'sign', label: 'Signing', detail: 'Artifact signing via Vault + HSM', x: 75, y: 30 },
        { id: 'deploy', label: 'Deploy', detail: 'Progressive rollout + evidence capture', x: 80, y: 70 },
      ],
      edges: [
        { from: 'commit', to: 'build' },
        { from: 'commit', to: 'scan' },
        { from: 'build', to: 'policy' },
        { from: 'scan', to: 'policy' },
        { from: 'policy', to: 'sign' },
        { from: 'sign', to: 'deploy' },
      ],
    },
  },
  {
    slug: 'dx-toolkit',
    title: 'Platform DX Toolkit',
    subtitle: 'Golden paths, CLI tooling, and onboarding flow for platform teams.',
    summary:
      'Built a developer experience toolkit that turned weeks of onboarding into days.',
    impact: ['Onboarding cut to 3 days', '90% self-serve adoption', '32 cross-team enablement wins', 'Platform tickets reduced by 71%', 'New service setup time: 2.5 hours (was 4 days)'],
    stack: ['Go CLI', 'Helm', 'Postgres', 'Argo'],
    problem:
      'New services required heavy manual setup, and knowledge transfer was inconsistent across teams.',
    approach: [
      'Delivered a single CLI for environment provisioning and data seeding.',
      'Created golden paths with guardrails and versioned templates.',
      'Documented the platform with action-based playbooks and demos.',
    ],
    outcomes: [
      'Teams ship new services with confidence and consistency.',
      'Platform maintainers focus on upgrades, not troubleshooting.',
      'Developer sentiment improved with clear, self-serve workflows.',
      'Cross-team enablement went from ad-hoc to scheduled sessions.',
      'Service provisioning went from ticket-based to CLI-driven.',
    ],
    metrics: {
      before: {
        onboardingTime: '2-3 weeks',
        selfServeRate: '15%',
        platformTicketsMonthly: '47',
        setupTime: '4 days',
      },
      after: {
        onboardingTime: '3 days',
        selfServeRate: '90%',
        platformTicketsMonthly: '14',
        setupTime: '2.5 hours',
      },
    },
    diagram: {
      title: 'Developer Experience Flow',
      nodes: [
        { id: 'cli', label: 'DX CLI', detail: 'One-command scaffolding', x: 18, y: 42 },
        { id: 'templates', label: 'Templates', detail: 'Golden path service templates', x: 42, y: 22 },
        { id: 'env', label: 'Environments', detail: 'Provisioned clusters + secrets', x: 42, y: 66 },
        { id: 'docs', label: 'Docs Hub', detail: 'Guides, demos, and runbooks', x: 70, y: 24 },
        { id: 'pipelines', label: 'Pipelines', detail: 'Argo + policy guardrails', x: 72, y: 68 },
      ],
      edges: [
        { from: 'cli', to: 'templates' },
        { from: 'cli', to: 'env' },
        { from: 'templates', to: 'docs' },
        { from: 'env', to: 'pipelines' },
        { from: 'docs', to: 'pipelines' },
      ],
    },
  },
  {
    slug: 'ai-internal-tooling',
    title: 'Internal AI Tooling Suite',
    subtitle: 'Custom MCP server integrating LLM automation into Jira and Confluence workflows.',
    summary:
      'Built an MVP internal AI tooling suite that brings LLM-powered automation to regulated financial workflows.',
    impact: ['45% faster Jira ticket resolution', '62% reduction in documentation time', '8 business lines adopted in 3 months', 'Zero data leakage in regulated environment'],
    stack: ['TypeScript', 'MCP (Model Context Protocol)', 'Jira API', 'Confluence API', 'LangChain'],
    problem:
      'Knowledge workers across the enterprise spent hours creating, updating, and searching for documentation in Jira and Confluence, with inconsistent quality and discoverability.',
    approach: [
      'Designed a custom MCP server exposing Jira and Confluence APIs as LLM tools.',
      'Implemented scoped access controls ensuring data never leaves regulated boundaries.',
      'Created specialized prompts for ticket summarization, documentation generation, and search augmentation.',
      'Deployed within enterprise guardrails with audit logging and approval workflows.',
    ],
    outcomes: [
      'Teams use AI to draft tickets, generate release notes, and create runbooks faster.',
      'Knowledge is more discoverable with semantic search across Jira tickets.',
      'Reduced cognitive load on engineers during release management cycles.',
      'Security team approved deployment within regulated financial environment.',
    ],
    metrics: {
      before: {
        ticketCreationTime: '18 minutes',
        docCreationTime: '45 minutes',
        searchSuccess: '58%',
        weeklyAiTickets: '0',
      },
      after: {
        ticketCreationTime: '8 minutes',
        docCreationTime: '17 minutes',
        searchSuccess: '84%',
        weeklyAiTickets: '340+',
      },
    },
    diagram: {
      title: 'AI Tooling Architecture',
      nodes: [
        { id: 'user', label: 'User', detail: 'Engineers, Product, PMs', x: 12, y: 50 },
        { id: 'llm', label: 'LLM Gateway', detail: 'Enterprise-approved model', x: 30, y: 28 },
        { id: 'mcp', label: 'MCP Server', detail: 'Custom tool integration', x: 50, y: 50 },
        { id: 'jira', label: 'Jira API', detail: 'Ticket + project data', x: 72, y: 24 },
        { id: 'confluence', label: 'Confluence API', detail: 'Wiki + page data', x: 72, y: 68 },
        { id: 'audit', label: 'Audit Log', detail: 'Compliance tracking', x: 88, y: 50 },
      ],
      edges: [
        { from: 'user', to: 'llm' },
        { from: 'llm', to: 'mcp' },
        { from: 'mcp', to: 'jira' },
        { from: 'mcp', to: 'confluence' },
        { from: 'mcp', to: 'audit' },
        { from: 'jira', to: 'mcp' },
        { from: 'confluence', to: 'mcp' },
      ],
    },
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((study) => study.slug === slug);
