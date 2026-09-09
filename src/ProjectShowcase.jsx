import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";

export function ProjectShowcase({ project, showcase }) {
  useEffect(() => {
    document.title = `${project.title} · 效果展示｜梁伟业`;
  }, [project.title]);

  return (
    <main className="showcase-page">
      <nav className="showcase-nav" aria-label="效果展示导航">
        <a href="/">LIANG WEIYE<span> / PROJECT SHOWCASE</span></a>
        <a href="/#projects"><ArrowLeft /> 返回代表项目</a>
      </nav>
      <header className="showcase-intro">
        <span className="detail-label">{project.index} / {project.title}</span>
        <h1>{showcase.headline}</h1>
        <p className="showcase-preview">{showcase.previewLabel ?? "效果展示预览 · 场景流程示意，未连接业务服务"}</p>
        {project.metrics && <dl className="project-metrics showcase-metrics">
          {project.metrics.map(({ value, label }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>}
      </header>
      <section className="showcase-flow" aria-labelledby="showcase-flow-title">
        <div className="showcase-section-heading"><span className="detail-label">01 / SCENARIO</span><h2 id="showcase-flow-title">业务场景与交付流程</h2><p>{showcase.scenario}</p></div>
        <ol className="showcase-steps">
          {showcase.steps.map((step, index) => <li key={step.title}><span className="detail-label">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
        </ol>
      </section>
      {showcase.engineering && <section className="showcase-engineering" aria-labelledby="showcase-engineering-title">
        <span className="detail-label">02 / ENGINEERING</span>
        <h2 id="showcase-engineering-title">关键问题与实现决策</h2>
        <div className="engineering-cases">{showcase.engineering.map((item) => <article key={item.title}>
          <h3>{item.title}</h3>
          <dl>
            <div><dt>工程问题</dt><dd>{item.problem}</dd></div>
            <div><dt>实现方式</dt><dd>{item.design}</dd></div>
            <div><dt>职责与边界</dt><dd>{item.boundary}</dd></div>
          </dl>
        </article>)}</div>
      </section>}
      <section className="showcase-outcome" aria-labelledby="showcase-outcome-title">
        <span className="detail-label">03 / OUTCOME</span>
        <h2 id="showcase-outcome-title">带来的效果</h2>
        <p>{showcase.effect}</p>
        {project.ongoing && <aside className="project-ongoing"><h3>{project.ongoing.title}</h3><p>{project.ongoing.text}</p></aside>}
        <p className="showcase-note">{showcase.note}</p>
      </section>
      <footer className="showcase-footer"><p>{project.stack}</p><div className="showcase-footer-links">{project.sourceHref && <a href={project.sourceHref} target="_blank" rel="noopener noreferrer">查看源码 <ArrowUpRight /></a>}<a href="/#experience">查看实习经历 <ArrowUpRight /></a></div></footer>
    </main>
  );
}
