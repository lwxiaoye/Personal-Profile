import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  List,
  MapPin,
  Minus,
  Plus,
  X,
} from "@phosphor-icons/react";
import {
  availabilityFacts,
  capabilities,
  experienceProjects,
  insights,
  projects,
  stages,
} from "./portfolio-data.js";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AgentCanvas({ activeStage }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let ctx;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      return undefined;
    }
    if (!ctx) return undefined;

    let frame = 0;
    let raf = 0;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      if (canvas.width !== Math.round(width * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 8;
      const scale = Math.min(width, height) / 2.35;
      const activeIndex = stages.findIndex((stage) => stage.id === activeStage);
      frame += 0.006;

      const drawFlow = (x1, y1, x2, y2, index, color, lineWidth, offsetY = 0) => {
        ctx.setLineDash([]);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1 + offsetY);
        ctx.quadraticCurveTo(
          cx + Math.sin(index) * 32,
          cy + Math.cos(index) * 24 + offsetY,
          x2,
          y2 + offsetY,
        );
        ctx.stroke();
      };

      stages.forEach((stage, index) => {
        const next = stages[(index + 1) % stages.length];
        const x1 = (stage.x / 100) * width;
        const y1 = (stage.y / 100) * height;
        const x2 = (next.x / 100) * width;
        const y2 = (next.y / 100) * height;
        drawFlow(x1, y1, x2, y2, index, "rgba(20,20,18,.06)", 1.2, 8);
        drawFlow(
          x1,
          y1,
          x2,
          y2,
          index,
          index === activeIndex ? "rgba(20,20,18,.68)" : "rgba(20,20,18,.18)",
          index === activeIndex ? 1.2 : 0.8,
        );
      });

      const start = stages[Math.max(activeIndex, 0)];
      const end = stages[(Math.max(activeIndex, 0) + 1) % stages.length];
      const progress = (Math.sin(frame * 4) + 1) / 2;
      const sx = (start.x / 100) * width;
      const sy = (start.y / 100) * height;
      const ex = (end.x / 100) * width;
      const ey = (end.y / 100) * height;
      const px = sx + (ex - sx) * progress;
      const py = sy + (ey - sy) * progress - Math.sin(progress * Math.PI) * 30;
      ctx.shadowBlur = 12;
      ctx.shadowColor = start.color;
      ctx.fillStyle = start.color;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(20,20,18,.18)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.17, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.12, 0, Math.PI * 2);
      ctx.stroke();

      raf = window.requestAnimationFrame(draw);
    };
    draw();
    return () => window.cancelAnimationFrame(raf);
  }, [activeStage]);

  return <canvas ref={canvasRef} className="agent-canvas" aria-hidden="true" />;
}

function AgentMap({ activeStage, onStageChange }) {
  return (
    <div className="agent-map" aria-label="Agent 运行星图">
      <div className="map-header">
        <div>
          <span className="eyebrow">LIVE SYSTEM</span>
          <h2>Agent 运行星图</h2>
        </div>
        <span className="map-status"><i />任务执行中</span>
      </div>
      <div className="map-stage">
        <AgentCanvas activeStage={activeStage} />
        <div className="orbit-space" aria-hidden="true">
          <span className="orbit-plane orbit-plane-a" />
          <span className="orbit-plane orbit-plane-b" />
          <span className="orbit-plane orbit-plane-c" />
        </div>
        <div className="task-core">
          <span>TASK CORE</span>
          <strong>任务核心</strong>
        </div>
        {stages.map((stage, index) => (
          <button
            type="button"
            key={stage.id}
            className={`stage-node stage-${stage.id}`}
            aria-label={`${stage.name} ${stage.detail}`}
            aria-pressed={activeStage === stage.id}
            onClick={() => onStageChange(stage.id)}
            onMouseEnter={() => onStageChange(stage.id)}
          >
            <span className="node-dot" style={{ "--node-color": stage.color }}>{index + 1}</span>
            <span className="node-copy"><strong>{stage.name}</strong><small>{stage.detail}</small></span>
          </button>
        ))}
      </div>
      <div className="map-footer">
        <span>STATE {String(stages.findIndex((stage) => stage.id === activeStage)).padStart(2, "0")}</span>
        <span>实时连接</span>
        <span>结果可验证</span>
      </div>
    </div>
  );
}

function ProjectRow({ project, open, onToggle }) {
  return (
    <article className={`project-row ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="project-trigger"
        aria-expanded={open}
        aria-label={`${open ? "收起" : "展开"} ${project.title} 项目详情`}
        onClick={onToggle}
      >
        <span className="project-index">{project.index}</span>
        <span className="project-title"><strong>{project.title}</strong><small>{project.label}</small></span>
        <span className="project-summary">{project.summary}</span>
        <span className="project-toggle" aria-hidden="true">{open ? <Minus /> : <Plus />}</span>
      </button>
      <div className="project-detail" hidden={!open}>
        <div className="project-responsibility">
          <span className="detail-label">项目与职责</span>
          <p>{project.responsibility}</p>
        </div>
        <div className="project-highlights">
          <span className="detail-label">关键实现</span>
          <ul>
            {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
        </div>
        <div className="project-contribution">
          <span className="detail-label">团队贡献</span>
          <strong>{project.contribution}</strong>
          <small>{project.stack}</small>
          <div className="project-links">
            {project.livePath ? (
              <a href={project.livePath} aria-label={`在线体验 ${project.title}`}>
                在线体验 <ArrowUpRight weight="bold" />
              </a>
            ) : (
              <span className="link-unavailable">部署地址待提供</span>
            )}
            {project.sourceHref && (
              <a
                href={project.sourceHref}
                target="_blank"
                rel="noreferrer"
                aria-label={`查看 ${project.title} 源码`}
              >
                查看源码 <ArrowUpRight weight="bold" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function CapabilityRow({ capability, open, onToggle }) {
  return (
    <article className={`capability-row ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="capability-trigger"
        aria-expanded={open}
        aria-label={`${open ? "收起" : "查看"} ${capability.title} 能力详情`}
        onClick={onToggle}
      >
        <span className="capability-code">{capability.index} / {capability.eyebrow}</span>
        <span className="capability-title">{capability.title}</span>
        <span className="capability-stack">{capability.stack}</span>
        <span className="capability-toggle" aria-hidden="true">{open ? <Minus /> : <Plus />}</span>
      </button>
      <div className="capability-detail" hidden={!open}>
        <div>
          <span>APPROACH</span>
          <p>{capability.description}</p>
        </div>
        <div>
          <span>METHODS</span>
          <ul>{capability.methods.map((method) => <li key={method}>{method}</li>)}</ul>
        </div>
        <div>
          <span>PROOF</span>
          <strong>{capability.proof}</strong>
        </div>
      </div>
    </article>
  );
}

export function App() {
  const [activeStage, setActiveStage] = useState("intent");
  const [openProject, setOpenProject] = useState("");
  const [openCapability, setOpenCapability] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const heroCopyRef = useRef(null);
  const insightMaskRef = useRef(null);
  const maskFrameRef = useRef(0);
  const stageLockUntilRef = useRef(0);

  useEffect(() => {
    document.title = "梁伟业｜Agent 应用开发";
  }, []);

  const selectStage = (stage, lockMs = 0) => {
    if (lockMs) stageLockUntilRef.current = Date.now() + lockMs;
    setActiveStage(stage);
  };
  const updateMaskPosition = (x, y) => {
    const mask = insightMaskRef.current;
    if (!mask) return;
    mask.style.setProperty("--mask-x", `${x}%`);
    mask.style.setProperty("--mask-y", `${y}%`);
  };
  const setMaskVisible = (visible) => {
    insightMaskRef.current?.setAttribute("aria-hidden", visible ? "false" : "true");
  };
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    window.cancelAnimationFrame(maskFrameRef.current);
    maskFrameRef.current = window.requestAnimationFrame(() => {
      updateMaskPosition(x, y);
      setMaskVisible(true);
    });
  };
  const handlePointerLeave = () => {
    window.cancelAnimationFrame(maskFrameRef.current);
    setMaskVisible(false);
  };
  const navigateMobile = (id) => {
    setMobileNavOpen(false);
    scrollToSection(id);
  };

  useEffect(() => {
    const hideOutsideHero = (event) => {
      const rect = heroCopyRef.current?.getBoundingClientRect();
      if (!rect) return;
      const outside = event.clientX < rect.left
        || event.clientX > rect.right
        || event.clientY < rect.top
        || event.clientY > rect.bottom;
      if (outside) setMaskVisible(false);
    };
    window.addEventListener("pointermove", hideOutsideHero, { passive: true });
    return () => {
      window.cancelAnimationFrame(maskFrameRef.current);
      window.removeEventListener("pointermove", hideOutsideHero);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Date.now() < stageLockUntilRef.current) return;
      setActiveStage((current) => {
        const index = stages.findIndex((stage) => stage.id === current);
        return stages[(index + 1) % stages.length].id;
      });
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <header className="site-header">
        <button type="button" className="wordmark" onClick={() => scrollToSection("home")}>LIANG WEIYE</button>
        <nav className="desktop-nav" aria-label="主导航">
          <button type="button" onClick={() => scrollToSection("about")}>关于我</button>
          <button type="button" onClick={() => scrollToSection("projects")}>Agent 项目</button>
          <button type="button" onClick={() => scrollToSection("skills")}>技术能力</button>
          <button type="button" onClick={() => scrollToSection("experience")}>经历</button>
          <button type="button" onClick={() => scrollToSection("contact")}>联系我</button>
        </nav>
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={mobileNavOpen ? "关闭导航" : "打开导航"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? <X /> : <List />}
        </button>
        <nav className="mobile-nav" aria-label="移动导航" hidden={!mobileNavOpen}>
          <button type="button" onClick={() => navigateMobile("about")}>关于我</button>
          <button type="button" onClick={() => navigateMobile("projects")}>Agent 项目</button>
          <button type="button" onClick={() => navigateMobile("skills")}>技术能力</button>
          <button type="button" onClick={() => navigateMobile("experience")}>经历</button>
          <button type="button" onClick={() => navigateMobile("contact")}>联系我</button>
        </nav>
      </header>

      <section className="hero" id="home">
        <div
          ref={heroCopyRef}
          className="hero-copy"
          data-testid="hero-copy"
          onPointerEnter={handlePointerMove}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="hero-zone hero-name-zone" onMouseEnter={() => selectStage("intent", 2600)}>
            <span className="eyebrow">AGENT APPLICATION DEVELOPER</span>
            <h1>梁伟业</h1>
          </div>
          <div className="hero-zone hero-title-zone" data-testid="hero-title-zone" onMouseEnter={() => selectStage("plan", 2600)}>
            <span className="red-rule" />
            <h2>把 Agent 做成真正能交付的产品</h2>
          </div>
          <div className="hero-zone hero-stack" onMouseEnter={() => selectStage("rag", 2600)}>
            <p>Agent 应用开发 / LangGraph / RAG / Harness Engineering</p>
          </div>
          <div className="hero-actions" onMouseEnter={() => selectStage("tools", 2600)}>
            <button type="button" className="primary-button" onClick={() => scrollToSection("projects")}>
              查看项目 <ArrowRight weight="bold" />
            </button>
            <a
              className="secondary-button"
              href="/梁伟业简历_Agent开发.pdf"
              download="梁伟业简历_Agent开发.pdf"
            >
              下载简历 <DownloadSimple weight="bold" />
            </a>
          </div>
          <div className="hero-statement" onMouseEnter={() => selectStage("plan", 2600)}>
            <span />
            <p>从意图识别，到工具执行，再到结果校验</p>
          </div>
          <div className="hero-metrics" onMouseEnter={() => selectStage("verify", 2600)}>
            <div><strong>3 个完整 Agent 项目</strong><span>端到端落地</span></div>
            <div><strong>意图识别约 95%</strong><span>多场景评测</span></div>
            <div><strong>RAG 召回率 91.3%</strong><span>领域知识库评测</span></div>
          </div>
          <div
            ref={insightMaskRef}
            className="insight-mask"
            data-testid="insight-mask"
            aria-hidden="true"
            style={{ "--mask-x": "72%", "--mask-y": "24%" }}
            aria-live="polite"
          >
            <span>{insights[activeStage].kicker}</span>
            <strong>{insights[activeStage].primary}</strong>
            <small>{insights[activeStage].secondary}</small>
          </div>
        </div>

        <AgentMap
          activeStage={activeStage}
          onStageChange={(stage) => selectStage(stage, 5000)}
        />
        <div className="hero-next-band" aria-hidden="true">
          <span />
          <p>从意图识别，到工具执行，再到结果校验</p>
          <span />
          <i />
        </div>
        <button className="scroll-cue" type="button" onClick={() => scrollToSection("projects")} aria-label="滚动到代表项目">
          <span>SCROLL TO EXPLORE</span><ArrowDown />
        </button>
      </section>

      <section className="projects section" id="projects">
        <div className="section-heading">
          <div><span className="section-index">/ 01</span><h2>代表项目</h2></div>
          <p>从真实业务出发，构建可落地、可追踪、可验证的 Agent 应用。</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              open={openProject === project.id}
              onToggle={() => setOpenProject(openProject === project.id ? "" : project.id)}
            />
          ))}
        </div>
      </section>

      <section className="about section" id="about">
        <div className="section-heading compact">
          <div><span className="section-index">/ 02</span><h2>关于我</h2></div>
        </div>
        <div className="about-grid">
          <p className="about-lead">我关注的不是模型能说什么，而是它如何在真实业务里稳定地完成一件事。</p>
          <div className="about-copy">
            <p>软件工程本科在读，长期投入 Agent 应用开发。遇到不熟悉的问题，我习惯先查资料、做验证，再把可行方案落进完整产品链路。</p>
            <p>从需求理解、架构设计到前后端联调与异常兜底，我希望负责的不只是一个功能，而是它能否真正被使用。</p>
          </div>
        </div>
      </section>

      <section className="skills section" id="skills">
        <div className="section-heading">
          <div><span className="section-index">/ 03</span><h2>技术能力</h2></div>
          <p>不是工具清单。展开每一项，查看我如何把技术放进真实 Agent 链路，以及项目中的可验证结果。</p>
        </div>
        <div className="capability-list">
          {capabilities.map((capability) => (
            <CapabilityRow
              key={capability.id}
              capability={capability}
              open={openCapability === capability.id}
              onToggle={() => setOpenCapability(openCapability === capability.id ? "" : capability.id)}
            />
          ))}
        </div>
      </section>

      <section className="experience section" id="experience">
        <div className="section-heading">
          <div><span className="section-index">/ 04</span><h2>经历</h2></div>
          <p>两段校企合作项目都在团队协作中完成，覆盖 Agent 工作流、知识检索、工具调用和前后端联调。</p>
        </div>
        <div className="experience-base">
          <div>
            <span className="detail-label">SCHOOL–ENTERPRISE BASE</span>
            <h3>青竹数智科技校企合作基地</h3>
          </div>
          <p>Agent 应用开发 · 团队开发经验</p>
          <p>重庆工程学院 · 软件工程本科 · 2027 届</p>
        </div>
        <div className="experience-grid">
          {experienceProjects.map((item, index) => (
            <article className="experience-card" key={item.title}>
              <div className="experience-card-top">
                <span className="experience-number">0{index + 1}</span>
                <time>{item.period}</time>
              </div>
              <h3>{item.title}</h3>
              <span className="experience-role">{item.role}</span>
              <p>{item.description}</p>
              <strong>{item.proof}</strong>
            </article>
          ))}
        </div>
        <div className="availability-strip" aria-label="实习到岗信息">
          <span>INTERNSHIP AVAILABILITY</span>
          {availabilityFacts.map((fact) => <strong key={fact}>{fact}</strong>)}
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-intro">
          <span className="section-index">/ 05</span>
          <span className="availability"><i /> OPEN TO OPPORTUNITIES</span>
          <h2>一起把 Agent<br />做成真正可用的产品。</h2>
          <p>我希望加入愿意认真打磨 AI 产品的团队，把模型能力转化为稳定、可验证的用户体验。</p>
        </div>
        <div className="contact-panel">
          <div className="contact-panel-top">
            <span>WORK WITH ME</span>
            <strong>Agent 应用开发</strong>
            <p>2027 届 · 重庆 · 可实习 / 可合作</p>
          </div>
          <div className="contact-actions">
            <a href="mailto:lwxiaoye@163.com">
              <span><EnvelopeSimple />邮箱</span>
              <strong>lwxiaoye@163.com</strong>
              <ArrowUpRight />
            </a>
            <a href="https://github.com/lwxiaoye" target="_blank" rel="noreferrer" aria-label="GitHub">
              <span><GithubLogo />代码与项目</span>
              <strong>github.com/lwxiaoye</strong>
              <ArrowUpRight />
            </a>
          </div>
          <div className="contact-facts">
            <span><MapPin /> Chongqing, China</span>
            <span>Agent / RAG / Full Stack</span>
          </div>
        </div>
        <div className="footer-meta"><span>LIANG WEIYE</span><span>Agent Application Developer · 2026</span></div>
      </footer>
    </main>
  );
}
