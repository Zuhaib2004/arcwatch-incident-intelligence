# Arcwatch Incident Intelligence

Arcwatch is an evidence-driven incident investigation platform for cloud and distributed systems. It correlates telemetry, deployment changes, and configuration evidence to rank likely root causes, recommend a remediation, and keep consequential actions behind explicit human approval.

**Live demo:** [arcwatch-incident-command.zilyas53.chatgpt.site](https://arcwatch-incident-command.zilyas53.chatgpt.site)

> Current stage: interactive product prototype. The interface and controlled replay workflow are functional; live telemetry collectors and the production investigation backend are the next implementation phase.

## Why this project exists

Production incidents rarely present one clean signal. Responders move between metrics, traces, logs, deployment history, and infrastructure state while an outage is unfolding. Arcwatch explores a safer incident-intelligence workflow built around:

- evidence before conclusions;
- calibrated root-cause rankings instead of unsupported answers;
- reproducible incident replays;
- human approval before remediation;
- post-action verification and measurable evaluation.

## Current capabilities

- Incident command center with active severity and service context
- Evidence timeline spanning Prometheus, OpenTelemetry, GitHub, and Kubernetes signals
- Ranked root-cause hypothesis with confidence and supporting reasoning
- Approval-gated rollback recommendation
- Interactive connection-pool exhaustion replay
- Replay metrics for diagnosis latency, ranking quality, and unsafe actions
- Responsive interface for desktop and mobile
- Automated production-build and server-rendering checks

## System direction

```text
Demo microservices
       │
       ├── OpenTelemetry traces
       ├── Prometheus metrics
       ├── application logs
       └── deployment/configuration events
                    │
                    ▼
          Evidence normalization layer
                    │
                    ▼
        Correlation + diagnosis engine
                    │
             ┌──────┴──────┐
             ▼             ▼
      Evidence timeline   Evaluation harness
             │
             ▼
     Approval policy engine
             │
             ▼
     Restricted remediation
             │
             ▼
       Outcome verification
```

## Evaluation plan

The finished system will be tested against reproducible failure scenarios rather than judged only by a polished demonstration.

| Metric | Purpose |
|---|---|
| Root-cause top-1/top-3 accuracy | Measures diagnosis ranking quality |
| Mean time to diagnosis | Measures operational usefulness |
| Evidence citation accuracy | Verifies claims are supported by collected signals |
| Unsafe-action rate | Measures remediation policy effectiveness |
| Recovery verification rate | Confirms an approved action actually restored service |
| Cost and latency per investigation | Measures production feasibility |

Planned scenarios include connection-pool exhaustion, expired credentials, queue backlogs, bad deployments, dependency timeouts, memory leaks, rate limiting, and configuration drift.

## Roadmap

- [x] Build the incident command-center experience
- [x] Add approval-gated remediation interaction
- [x] Add a controlled incident replay workflow
- [x] Deploy the interactive prototype
- [ ] Create containerized demo microservices
- [ ] Instrument services with OpenTelemetry
- [ ] Add Prometheus metric collection
- [ ] Persist incidents and evidence in PostgreSQL
- [ ] Build evidence normalization and correlation services
- [ ] Add reproducible failure injection
- [ ] Implement evaluation datasets and scoring
- [ ] Add post-remediation verification
- [ ] Provision cloud infrastructure with Terraform

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Validate a production build and rendered output:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

## Technology

- TypeScript and React
- vinext and Vite
- Cloudflare-compatible deployment output
- Node test runner
- Planned: Python, FastAPI, PostgreSQL, OpenTelemetry, Prometheus, Docker, Terraform, and AWS

## Engineering principles

1. Every diagnosis must reference observable evidence.
2. Confidence must be evaluated, not presented decoratively.
3. High-impact actions require approval and a restricted execution policy.
4. Remediation is incomplete until recovery is verified.
5. Customer-specific integrations should become reusable connectors and playbooks.

## Project status

This repository documents the project incrementally. Issues and milestones will track the transition from an interactive prototype to a working distributed-systems investigation platform.
