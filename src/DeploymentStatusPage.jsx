import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";

export function DeploymentStatusPage({ project }) {
  useEffect(() => {
    document.title = `${project.title}｜部署中`;
  }, [project.title]);

  return (
    <main className="deployment-page">
      <header className="deployment-header">
        <a className="deployment-wordmark" href="/">LIANG WEIYE</a>
        <a className="deployment-back-link" href="/">
          <ArrowLeft weight="bold" aria-hidden="true" />
          返回作品集
        </a>
      </header>

      <section className="deployment-hero" aria-labelledby="deployment-title">
        <div className="deployment-copy">
          <div className="deployment-status-row">
            <span className="deployment-index">/ {project.index}</span>
            <span className="deployment-status">
              <i aria-hidden="true" />
              DEPLOYMENT IN PROGRESS
            </span>
          </div>

          <div className="deployment-heading-block">
            <span className="deployment-kicker">PROJECT EXPERIENCE</span>
            <h1 id="deployment-title">{project.statusTitle}</h1>
            <p>{project.description}</p>
          </div>

          <div className="deployment-actions">
            <a href={project.sourceHref} target="_blank" rel="noreferrer">
              查看源码 <ArrowUpRight weight="bold" aria-hidden="true" />
            </a>
            <a href="/">
              返回作品集 <ArrowLeft weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="deployment-visual" aria-label="项目部署进度">
          <div className="deployment-orbit-frame">
            <span className="deployment-axis deployment-axis-horizontal" aria-hidden="true" />
            <span className="deployment-axis deployment-axis-vertical" aria-hidden="true" />
            <img src="/agent-orbit-favicon-master.png" alt="Agent 三轨道标志" />
            <span className="deployment-visual-label">AGENT APPLICATION</span>
          </div>
        </div>
      </section>

      <footer className="deployment-meta">
        <div>
          <span>TECHNICAL STACK</span>
          <strong>{project.stack}</strong>
        </div>
        <div className="deployment-coming-soon">
          <span>STATUS</span>
          <strong><i aria-hidden="true" /> COMING SOON</strong>
        </div>
      </footer>
    </main>
  );
}
