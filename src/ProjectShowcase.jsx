import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { showcaseEvidence } from "./showcase-evidence.js";
import "./showcase.css";

function ScreenshotGallery({ evidence }) {
  const [selected, setSelected] = useState(evidence.initialImage ?? 0);
  const shot = evidence.images[selected];
  return <section className="case-gallery" aria-labelledby="case-gallery-title">
    <div className="case-heading"><div><span className="detail-label">PRODUCT / 界面实录</span><h2 id="case-gallery-title">{evidence.lead}</h2></div><span className="case-data-tag">项目实际截图 · 共 {evidence.images.length} 张</span></div>
    <div className="case-gallery-tabs" aria-label="选择展示界面">{evidence.images.map((item, i) => <button type="button" key={item.src} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>0{i + 1}</span>{item.tab}<ArrowUpRight /></button>)}</div>
    <figure className="case-figure">
      <a className="case-image-link" href={shot.src} target="_blank" rel="noopener noreferrer" aria-label={`查看原图：${shot.title}（新标签页）`}><img src={shot.src} alt={shot.alt} width="1920" height="919" /><span>查看原图 <ArrowUpRight /></span></a>
      <figcaption><div><span className="detail-label">0{selected + 1} / {shot.tab}</span><h3>{shot.title}</h3><p>{shot.text}</p></div><div><span className="detail-label">我的实现</span><p>{shot.contribution}</p><small>{shot.note}</small></div></figcaption>
    </figure>
  </section>;
}

function CaseEvidence({ evidence }) {
  return <>
    <section className="case-departments" aria-labelledby="case-departments-title"><span className="detail-label">USE CASES / 部门用途</span><h2 id="case-departments-title">放到具体工作里，解决什么问题</h2><div className="case-department-grid">{evidence.departments.map(item => <article key={item.name}><span>{item.name}</span><h3>{item.task}</h3><p>{item.value}</p></article>)}</div></section>
    <section className="case-ownership" aria-labelledby="case-ownership-title"><div><span className="detail-label">OWNERSHIP / 个人贡献</span><h2 id="case-ownership-title">我负责的部分</h2><p>重庆独小漾服装有限公司<br />AI 工程师 · 2026.06.07—2026.09.09</p></div><div>{evidence.ownership.map((item,i) => <article key={item.title}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section>
  </>;
}

function DevelopmentEvidence({ evidence }) {
  return <>
    <section className="case-evaluation" aria-labelledby="case-evaluation-title"><span className="detail-label">EVALUATION / 验收口径</span><h2 id="case-evaluation-title">把效果落实到可复查的指标</h2><p>典型耗时、配置规模和评测结果分别记录。以下注明了已有依据及后续统计方法。</p><div className="case-evaluation-scroll"><table><thead><tr><th>指标</th><th>统计方式</th><th>依据 / 状态</th></tr></thead><tbody>{evidence.evaluation.map(item => <tr key={item.metric}><th scope="row">{item.metric}</th><td>{item.method}</td><td>{item.status}</td></tr>)}</tbody></table></div></section>
    <section className="case-collaboration" aria-labelledby="case-collaboration-title"><div><span className="detail-label">DEVELOPMENT / 持续开发</span><h2 id="case-collaboration-title">从业务需求到代码交付</h2><p>围绕美编需求推进工作流迭代，负责业务前端与后端接口联调，并承担服务器部署。用具体任务、接口和交付结果说明自己的职责。</p><p className="case-github-count"><strong>397</strong><span>过去一年 GitHub contributions<br />用户提供的个人主页截图</span></p><small>贡献数包含 GitHub 认定的不同活动，不等同于代码提交数或团队人数。</small><a href="https://github.com/lwxiaoye" target="_blank" rel="noopener noreferrer">查看 GitHub 主页 <ArrowUpRight /></a></div><figure><a className="case-github-crop" href="/showcase/github-contributions.png" target="_blank" rel="noopener noreferrer" aria-label="查看 GitHub 贡献截图原图"><img src="/showcase/github-contributions.png" alt="lwxiaoye GitHub 个人主页截图：过去一年 397 次贡献" loading="lazy" width="1920" height="1080" /></a><figcaption>持续开发记录 · 2026 年个人主页截图</figcaption></figure></section>
  </>;
}

export function ProjectShowcase({ project, showcase }) {
  const evidence = showcaseEvidence[project.id];
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
        <p className="showcase-preview">{showcase.previewLabel ?? (evidence ? "项目界面与工程案例 · 实际运行截图" : "效果展示预览 · 场景流程示意，未连接业务服务")}</p>
        {evidence && <div className="case-context"><p>{evidence.context}</p><span>{evidence.role}</span></div>}
        {project.metrics && <dl className="project-metrics showcase-metrics">
          {project.metrics.map(({ value, label }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>}
        {evidence && <p className="case-metric-source">{project.metricNote}</p>}
      </header>
      {evidence && <><ScreenshotGallery key={project.id} evidence={evidence} /><CaseEvidence evidence={evidence} /></>}
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
      {evidence && <DevelopmentEvidence evidence={evidence} />}
      <footer className="showcase-footer"><p>{project.stack}</p><div className="showcase-footer-links">{project.sourceHref && <a href={project.sourceHref} target="_blank" rel="noopener noreferrer">查看源码 <ArrowUpRight /></a>}<a href="/#experience">查看实习经历 <ArrowUpRight /></a></div></footer>
    </main>
  );
}
