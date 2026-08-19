"use client";

import { useState } from "react";

const incidents = [
  { id: "INC-2048", service: "checkout-api", title: "Error rate above SLO", severity: "SEV-1", age: "8m", active: true },
  { id: "INC-2047", service: "identity", title: "Elevated authentication latency", severity: "SEV-2", age: "31m" },
  { id: "INC-2046", service: "order-worker", title: "Queue depth increasing", severity: "SEV-2", age: "1h 12m" },
];

const evidence = [
  { time: "14:32:16", source: "Prometheus", label: "5xx rate crossed 8.4%", detail: "Baseline 0.12% · confidence 99%", tone: "red" },
  { time: "14:31:42", source: "GitHub", label: "deploy/checkout-api@a81f2c", detail: "Connection pool default changed: 40 → 8", tone: "amber" },
  { time: "14:31:39", source: "OpenTelemetry", label: "db.acquire span +2,840ms", detail: "94% of failing traces blocked on pool", tone: "violet" },
  { time: "14:30:05", source: "Kubernetes", label: "Rollout completed", detail: "checkout-api-v184 · 12/12 pods healthy", tone: "blue" },
];

export default function Home() {
  const [approved, setApproved] = useState(false);
  const [replayOpen, setReplayOpen] = useState(false);
  const [replayStage, setReplayStage] = useState(0);

  async function runReplay() {
    setReplayStage(1);
    for (let stage = 2; stage <= 4; stage += 1) {
      await new Promise((resolve) => setTimeout(resolve, 650));
      setReplayStage(stage);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">A</span><span>Arcwatch</span></div>
        <nav aria-label="Primary navigation">
          <a className="nav-item active" href="#command"><span>⌁</span> Command center</a>
          <a className="nav-item" href="#incidents"><span>◫</span> Incidents <b>3</b></a>
          <a className="nav-item" href="#services"><span>◇</span> Services</a>
          <a className="nav-item" href="#replays"><span>▶</span> Replay lab</a>
          <a className="nav-item" href="#evaluations"><span>✓</span> Evaluations</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="system-status"><i /> All collectors online</div>
          <div className="workspace"><span>ZI</span><div><strong>Demo workspace</strong><small>AWS · us-east-1</small></div></div>
        </div>
      </aside>

      <section className="workspace-main" id="command">
        <header className="topbar">
          <div><p className="eyebrow">LIVE INVESTIGATION</p><h1>Command center</h1></div>
          <div className="top-actions"><button className="ghost-button">⌘ K</button><button className="replay-button" onClick={() => { setReplayStage(0); setReplayOpen(true); }}>▶ Run incident replay</button></div>
        </header>

        <div className="content-grid">
          <section className="incident-list" id="incidents">
            <div className="section-heading"><h2>Active incidents</h2><span>3 open</span></div>
            {incidents.map((incident) => (
              <article className={`incident-row ${incident.active ? "selected" : ""}`} key={incident.id}>
                <div className={`severity-dot ${incident.severity === "SEV-1" ? "critical" : "warning"}`} />
                <div className="incident-copy"><div><strong>{incident.title}</strong><span>{incident.age}</span></div><p>{incident.id} · {incident.service}</p></div>
              </article>
            ))}
            <div className="signal-card"><p>WEEKLY SIGNAL</p><strong>23m</strong><span>Mean time to diagnosis</span><small>↓ 41% from last week</small></div>
          </section>

          <section className="investigation">
            <div className="incident-header">
              <div><div className="incident-tags"><span className="sev-tag">SEV-1</span><span>INC-2048</span><span>checkout-api</span></div><h2>Checkout error rate above SLO</h2><p>Started 8 minutes ago · 1,284 affected requests</p></div>
              <span className="investigating"><i /> Investigating</span>
            </div>

            <div className="hypothesis-card">
              <div className="hypothesis-top"><div><p>LEADING HYPOTHESIS</p><h3>Database connection pool exhaustion after deployment</h3></div><div className="confidence"><strong>94%</strong><span>confidence</span></div></div>
              <p className="hypothesis-body">The latest release reduced the connection pool from 40 to 8 while request volume remained stable. Trace latency and error onset align within 37 seconds of rollout completion.</p>
              <div className="reasoning"><span>1</span><p><strong>Temporal correlation</strong> Error spike began immediately after deployment</p><span>2</span><p><strong>Trace evidence</strong> 94% of failed requests waited on <code>db.acquire</code></p><span>3</span><p><strong>Config diff</strong> Pool size changed without a matching capacity adjustment</p></div>
            </div>

            <div className="evidence-section">
              <div className="section-heading"><h2>Evidence timeline</h2><span>4 signals correlated</span></div>
              <div className="timeline">
                {evidence.map((item) => <div className="evidence-row" key={item.time}><time>{item.time}</time><i className={item.tone} /><div><span>{item.source}</span><strong>{item.label}</strong><small>{item.detail}</small></div></div>)}
              </div>
            </div>

            <div className={`remediation-card ${approved ? "approved" : ""}`}>
              <div className="remediation-icon">↶</div>
              <div className="remediation-copy"><p>RECOMMENDED REMEDIATION</p><h3>{approved ? "Rollback approved" : "Roll back checkout-api to v183"}</h3><span>{approved ? "Execution queued · verification will begin automatically" : "Estimated recovery: 3–5 minutes · Risk: Low · Requires approval"}</span></div>
              <button onClick={() => setApproved(true)} disabled={approved}>{approved ? "Approved ✓" : "Review & approve"}</button>
            </div>
          </section>
        </div>
      </section>
      {replayOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setReplayOpen(false)}>
        <section className="replay-modal" role="dialog" aria-modal="true" aria-labelledby="replay-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="modal-close" aria-label="Close replay" onClick={() => setReplayOpen(false)}>×</button>
          <p className="eyebrow">INCIDENT REPLAY LAB</p>
          <h2 id="replay-title">Connection pool exhaustion</h2>
          <p className="modal-intro">Inject a reproducible production failure and watch Arcwatch assemble evidence, rank a diagnosis, and enforce the remediation policy.</p>
          <div className="scenario-meta"><span><b>8</b> services</span><span><b>4</b> collectors</span><span><b>~3s</b> replay</span></div>
          <div className="replay-steps">
            {["Inject configuration regression", "Observe telemetry anomaly", "Correlate deployment evidence", "Produce approval-gated action"].map((label, index) => (
              <div className={`${replayStage > index ? "done" : ""} ${replayStage === index + 1 ? "running" : ""}`} key={label}><i>{replayStage > index ? "✓" : index + 1}</i><span>{label}</span><small>{replayStage === index + 1 ? "running" : replayStage > index ? "complete" : "queued"}</small></div>
            ))}
          </div>
          {replayStage === 4 ? <div className="replay-result"><strong>Replay passed</strong><span>Root cause ranked #1 · unsafe action rate 0% · diagnosis 2.1s</span></div> : <button className="launch-button" onClick={runReplay} disabled={replayStage > 0}>Launch controlled replay</button>}
        </section>
      </div>}
    </main>
  );
}
