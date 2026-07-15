import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChatCircleDots,
  CopySimple,
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
  planetThemes,
  projects,
  runtimeMapAux,
  runtimeSegments,
  stages,
} from "./portfolio-data.js";

const EMAIL = "lwxiaoye@163.com";
const ORBIT_SIGNAL_COLOR = "#e54e37";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand?.("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard copy failed");
}

function PlanetTexture({ stage }) {
  const clipPath = `url(#planet-${stage.id}-clip)`;

  return (
    <g className="planet-surface" aria-hidden="true">
      <circle className="planet-halo" r="27" />
      {stage.planet === "saturn" && <ellipse className="saturn-ring" rx="31" ry="9" transform="rotate(-18)" />}
      <g className="planet-texture-spin">
        <circle className="planet-body" r="21" fill={`url(#planet-${stage.planet}-gradient)`} />
        <g clipPath={clipPath}>
          {stage.planet === "mercury" && (
            <g className="planet-craters">
              <circle cx="-7" cy="-5" r="3.2" /><circle cx="7" cy="5" r="2.2" /><circle cx="4" cy="-10" r="1.5" />
            </g>
          )}
          {stage.planet === "venus" && (
            <g className="planet-clouds">
              <path d="M -24 -7 C -10 -13 6 -10 24 -5" /><path d="M -22 5 C -7 -1 8 1 24 8" />
            </g>
          )}
          {stage.planet === "earth" && (
            <g className="planet-continents">
              <path d="M -16 -7 C -10 -14 0 -12 3 -6 C 7 -2 3 2 -3 2 C -8 5 -14 1 -16 -7 Z" />
              <path d="M 5 5 C 11 1 17 5 16 11 C 12 15 6 13 5 5 Z" />
            </g>
          )}
          {stage.planet === "mars" && (
            <g className="planet-minerals">
              <path d="M -18 7 C -8 1 2 3 18 -4" /><circle cx="8" cy="-8" r="2.4" /><circle cx="-9" cy="-5" r="1.6" />
            </g>
          )}
          {stage.planet === "jupiter" && (
            <g className="planet-bands">
              <path d="M -24 -10 C -8 -6 8 -13 24 -8" /><path d="M -24 -2 C -6 3 8 -4 24 1" />
              <path d="M -24 7 C -8 11 8 5 24 9" /><ellipse cx="8" cy="5" rx="4" ry="2.2" />
            </g>
          )}
          {stage.planet === "saturn" && <path className="planet-latitude" d="M -20 4 C -7 8 8 7 20 2" />}
        </g>
        <ellipse className="planet-specular" cx="-7" cy="-9" rx="7" ry="4" />
      </g>
    </g>
  );
}

function AgentMap({ activeStage, onStageChange }) {
  const nodes = Object.fromEntries(stages.map((stage) => [stage.id, stage]));
  const segmentPath = ({ from, to, controls }) => {
    const start = nodes[from];
    const end = nodes[to];
    return `M ${start.x} ${start.y} C ${controls.join(" ")} ${end.x} ${end.y}`;
  };
  const activateStage = (event, stageId) => {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    if (event.type === "keydown") event.preventDefault();
    onStageChange(stageId);
  };
  const verify = nodes.verify;
  const plan = nodes.plan;
  const { output, context, rag, core } = runtimeMapAux;
  return (
    <div
      className="agent-map"
      aria-label="Agent 运行星图"
      data-orbit-signal-color={ORBIT_SIGNAL_COLOR}
    >
      <div className="map-header">
        <div>
          <span className="eyebrow">AGENT RUNTIME MAP</span>
          <h2>Agent 运行星图</h2>
        </div>
        <span className="map-status">EXECUTION LOOP</span>
      </div>
      <div className="map-stage">
        <svg
          className="runtime-map-svg"
          viewBox="0 0 1000 590"
          role="img"
          aria-label="Agent 执行循环：Intent、Plan、Decide、Tools、Observe、Verify，并连接 Output、RAG 与 Harness"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="arrow-dark" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="11" markerHeight="11" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <linearGradient id="metal-edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFDF6" />
              <stop offset="0.42" stopColor="#D8BE83" />
              <stop offset="0.72" stopColor="#8D816C" />
              <stop offset="1" stopColor="#575048" />
            </linearGradient>
            <radialGradient id="ceramic-core" cx="34%" cy="27%" r="78%">
              <stop offset="0" stopColor="#FFFDF6" />
              <stop offset="0.5" stopColor="#F5EEDC" />
              <stop offset="0.8" stopColor="#D8BE83" />
              <stop offset="1" stopColor="#8D816C" />
            </radialGradient>
            <linearGradient id="rag-context-path" x1="920" y1="470" x2="900" y2="94" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={planetThemes.uranus.base} />
              <stop offset="1" stopColor={planetThemes.neptune.base} />
            </linearGradient>
            <filter id="core-shadow" x="-40%" y="-40%" width="180%" height="200%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#121210" floodOpacity="0.13" />
            </filter>
            <filter id="node-shadow" x="-60%" y="-60%" width="220%" height="240%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#121210" floodOpacity="0.16" />
            </filter>
            {stages.map((stage) => {
              const theme = planetThemes[stage.planet];
              return (
                <radialGradient key={stage.planet} className="planet-gradient" id={`planet-${stage.planet}-gradient`} cx="32%" cy="25%" r="78%">
                  <stop offset="0" stopColor={theme.highlight} />
                  <stop offset="0.42" stopColor={theme.base} />
                  <stop offset="0.72" stopColor={theme.mid} />
                  <stop offset="1" stopColor={theme.shadow} />
                </radialGradient>
              );
            })}
            {stages.map((stage) => (
              <clipPath key={stage.id} id={`planet-${stage.id}-clip`}>
                <circle className="planet-clip" r="21" />
              </clipPath>
            ))}
            {(["uranus", "neptune"]).map((planet) => {
              const theme = planetThemes[planet];
              return (
                <radialGradient key={planet} id={`${planet}-gradient`} cx="32%" cy="25%" r="78%">
                  <stop offset="0" stopColor={theme.highlight} />
                  <stop offset="0.5" stopColor={theme.base} />
                  <stop offset="1" stopColor={theme.shadow} />
                </radialGradient>
              );
            })}
          </defs>

          <g className="harness-motion-main" aria-hidden="true">
            <ellipse className="harness-orbit harness-orbit-main" cx="500" cy="295" rx="455" ry="252" />
          </g>
          <g className="harness-motion-vertical" aria-hidden="true">
            <ellipse className="harness-orbit harness-orbit-vertical" cx="500" cy="295" rx="143" ry="248" />
          </g>
          <g className="harness-motion-context" aria-hidden="true">
            <ellipse className="context-orbit" cx="500" cy="300" rx="385" ry="138" transform="rotate(14 500 300)" />
          </g>

          <g className="runtime-paths" fill="none">
            {runtimeSegments.map((segment) => {
              const active = segment.from === activeStage;
              return (
                <path
                  key={`${segment.from}-${segment.to}`}
                  id={active ? "active-runtime-signal-path" : undefined}
                  className={`runtime-segment ${active ? "is-active" : ""}`}
                  data-from={segment.from}
                  data-to={segment.to}
                  d={segmentPath(segment)}
                  markerEnd={active ? "url(#arrow-red)" : "url(#arrow-dark)"}
                />
              );
            })}
            <path
              id={activeStage === "verify" ? "active-runtime-signal-path" : undefined}
              className={`runtime-output-path ${activeStage === "verify" ? "is-active" : ""}`}
              data-branch="output"
              d={`M ${verify.x} ${verify.y} C 108 255 80 220 ${output.x} ${output.y}`}
              markerEnd="url(#arrow-dark)"
            />
            <path
              className="runtime-return-path"
              data-branch="retry"
              d={`M ${verify.x} ${verify.y} C 150 86 500 50 ${plan.x} ${plan.y}`}
              markerEnd="url(#arrow-dark)"
            />
            <path
              className="context-link rag-context-link"
              data-context-edge="rag-context"
              d={`M ${rag.x} ${rag.y} C 938 330 930 188 ${context.x} ${context.y}`}
              markerEnd="url(#arrow-blue)"
            />
            <path
              className="context-link context-plan-link"
              data-context-edge="context-plan"
              d={`M ${context.x} ${context.y} C 842 108 780 130 ${plan.x} ${plan.y}`}
              markerEnd="url(#arrow-blue)"
            />
          </g>

          <circle key={activeStage} className="execution-signal" r="4.5" aria-hidden="true">
            <animateMotion dur="2.4s" repeatCount="indefinite" calcMode="linear">
              <mpath href="#active-runtime-signal-path" />
            </animateMotion>
          </circle>

          <g className="runtime-task-core" transform={`translate(${core.x} ${core.y})`} filter="url(#core-shadow)" aria-hidden="true">
            <g className="runtime-task-core-float">
              <circle className="task-core-halo" r="86" />
              <circle className="task-core-metal" r="73" />
              <circle className="task-core-shell" r="67" />
              <circle className="task-core-ceramic" r="61" />
              <g className="task-core-etched-layer">
                <circle className="task-core-etched" r="48" />
                <path className="task-core-arc" d="M -36 30 A 47 47 0 0 0 39 24" />
              </g>
              <ellipse className="task-core-highlight" cx="-22" cy="-27" rx="26" ry="13" />
              <text className="task-core-en" x="0" y="-9" textAnchor="middle">TASK CORE</text>
              <text className="task-core-cn" x="0" y="17" textAnchor="middle">任务核心</text>
            </g>
          </g>

          <g className="output-endpoint">
            <circle cx={output.x} cy={output.y} r="3.5" />
            <text className="map-label-en" x={output.labelX} y={output.labelY}>OUTPUT</text>
            <text className="map-label-cn" x={output.labelX} y={output.labelY + 20}>结果交付</text>
          </g>

          <g className="context-input">
            <circle className="context-node-planet" cx={context.x} cy={context.y} r="5" fill="url(#neptune-gradient)" />
            <text className="map-label-en" x={context.labelX} y={context.labelY} textAnchor="middle">CONTEXT INPUT</text>
          </g>

          <g className="rag-memory">
            <g transform={`translate(${rag.x} ${rag.y})`}>
              <g className="rag-node-motion">
                <circle className="rag-node-planet" r="19" fill="url(#uranus-gradient)" />
                <path className="rag-node-band" d="M -17 2 C -6 -2 7 -2 17 1" />
                <circle className="rag-node-highlight" cx="-5" cy="-6" r="6" />
              </g>
            </g>
            <text className="map-label-en" x={rag.labelX} y={rag.labelY} textAnchor="end">RAG / MEMORY</text>
            <text className="map-label-cn" x={rag.labelX} y={rag.labelY + 20} textAnchor="end">知识与上下文</text>
          </g>

          <text className="return-path-label" x="215" y="108">未通过 / RETURN TO PLAN</text>
          <text className="harness-copy" x="42" y="555">HARNESS · CONTEXT · STATE · PERMISSIONS · TOOL REGISTRY · TRACE · EVALUATION</text>

          {stages.map((stage) => (
            <g
              key={stage.id}
              className={`runtime-stage-node ${activeStage === stage.id ? "is-active" : ""}`}
              data-node-id={stage.id}
              data-planet={stage.planet}
              transform={`translate(${stage.x} ${stage.y})`}
              role="button"
              tabIndex="0"
              aria-label={`${stage.name} ${stage.detail}`}
              aria-pressed={activeStage === stage.id}
              style={{ "--planet-shadow": planetThemes[stage.planet].shadow, "--planet-glow": planetThemes[stage.planet].glow }}
              onClick={(event) => activateStage(event, stage.id)}
              onKeyDown={(event) => activateStage(event, stage.id)}
            >
              <circle className="runtime-node-hit" cx="0" cy="0" r="30" />
              <PlanetTexture stage={stage} />
              <circle className="runtime-node-circle" cx="0" cy="0" r="21" filter="url(#node-shadow)" />
              <text className="runtime-node-index" x="0" y="4" textAnchor="middle">{stage.index}</text>
              <text className="runtime-node-name" x={stage.labelX - stage.x} y={stage.labelY - stage.y} textAnchor={stage.anchor}>{stage.name}</text>
              <text className="runtime-node-detail" x={stage.labelX - stage.x} y={stage.labelY - stage.y + 20} textAnchor={stage.anchor}>{stage.detail}</text>
            </g>
          ))}
        </svg>
        <p className="sr-only runtime-map-text">Intent 进入 Plan，Plan 进入 Decide，Decide 调用 Tools，Tools 的结果进入 Observe，Observe 进入 Verify。Verify 通过后输出结果，未通过则返回 Plan。RAG / Memory 通过 Context Input 为 Plan 提供知识与上下文；Harness 提供状态、权限、工具注册、追踪与评测。</p>
      </div>
      <div className="map-footer">
        <span>STATEFUL EXECUTION</span>
        <span>LIVE TRACE</span>
        <span>EVALUATION</span>
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

function CapabilityRow({ capability, open, onToggle, onOpenProject }) {
  const evidenceProjects = capability.projectIds
    .map((projectId) => projects.find((project) => project.id === projectId))
    .filter(Boolean);

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
        <span className="capability-summary">{capability.summary}</span>
        <span className="capability-stack">{capability.stack}</span>
        <span className="capability-toggle" aria-hidden="true">{open ? <Minus /> : <Plus />}</span>
      </button>
      <div className="capability-detail" hidden={!open}>
        <div>
          <span>工程问题</span>
          <p>{capability.description}</p>
        </div>
        <div>
          <span>关键实现</span>
          <ul>{capability.methods.map((method) => <li key={method}>{method}</li>)}</ul>
        </div>
        <div>
          <span>项目证据</span>
          <strong>{capability.proof}</strong>
          <div className="capability-project-links">
            {evidenceProjects.map((project) => (
              <button
                type="button"
                className="capability-project-link"
                key={project.id}
                aria-label={`查看项目：${project.title}`}
                onClick={() => onOpenProject(project.id)}
              >
                查看项目 <ArrowRight weight="bold" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function App() {
  const [activeStage, setActiveStage] = useState("plan");
  const [openProject, setOpenProject] = useState("");
  const [openCapability, setOpenCapability] = useState("orchestration");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const heroCopyRef = useRef(null);
  const insightMaskRef = useRef(null);
  const maskFrameRef = useRef(0);
  const stageLockUntilRef = useRef(0);
  const emailResetRef = useRef(0);

  useEffect(() => {
    document.title = "梁伟业｜Agent 应用开发";
  }, []);

  const selectStage = (stage, lockMs = 0) => {
    if (lockMs) stageLockUntilRef.current = Date.now() + lockMs;
    setActiveStage(stage);
  };
  const updateMaskPosition = (x, y) => {
    const mask = insightMaskRef.current;
    mask?.style.setProperty("--mask-x", `${x}px`);
    mask?.style.setProperty("--mask-y", `${y}px`);
  };
  const setMaskVisible = (visible) => {
    insightMaskRef.current?.setAttribute("aria-hidden", visible ? "false" : "true");
  };
  const handlePointerMove = (event) => {
    const { clientX, clientY } = event;
    window.cancelAnimationFrame(maskFrameRef.current);
    maskFrameRef.current = window.requestAnimationFrame(() => {
      updateMaskPosition(clientX, clientY);
      setMaskVisible(window.scrollY <= 1);
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
  const handleCopyEmail = async () => {
    try {
      await copyText(EMAIL);
      setEmailCopied(true);
      window.clearTimeout(emailResetRef.current);
      emailResetRef.current = window.setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      setEmailCopied(false);
    }
  };
  const handleOpenEvidenceProject = (projectId) => {
    setOpenProject(projectId);
    scrollToSection("projects");
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
      window.clearTimeout(emailResetRef.current);
      window.removeEventListener("pointermove", hideOutsideHero);
    };
  }, []);

  useEffect(() => {
    const hideMaskOnScroll = () => setMaskVisible(false);
    window.addEventListener("scroll", hideMaskOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", hideMaskOnScroll);
  }, []);

  useEffect(() => {
    const elements = [...document.querySelectorAll(".section, .contact")];
    elements.forEach((element) => element.classList.add("scroll-reveal"));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
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
            <span className="eyebrow">AGENT APPLICATION ENGINEER</span>
            <h1>梁伟业</h1>
          </div>
          <div className="hero-zone hero-title-zone" data-testid="hero-title-zone" onMouseEnter={() => selectStage("plan", 2600)}>
            <span className="red-rule" />
            <h2 aria-label="把 Agent 从 Demo 做到可交付产品"><span>把 Agent 从 Demo</span><span>做到可交付产品</span></h2>
          </div>
          <div className="hero-zone hero-stack" onMouseEnter={() => selectStage("decide", 2600)}>
            <p>Agent 应用开发 · LangGraph · RAG · Harness Engineering</p>
            <small>从意图路由、知识检索到工具编排，构建可追踪、可恢复、可评测的 Agent 系统。</small>
          </div>
          <div className="hero-actions" onMouseEnter={() => selectStage("tools", 2600)}>
            <a className="primary-button" href="#projects">
              查看 Agent 项目 <ArrowRight weight="bold" />
            </a>
            <a
              className="secondary-button"
              href="/梁伟业简历_Agent开发.pdf"
              download="梁伟业简历_Agent开发.pdf"
            >
              下载 PDF 简历 <DownloadSimple weight="bold" />
            </a>
            <a className="tertiary-button" href="#contact">
              联系我 <ChatCircleDots weight="bold" />
            </a>
          </div>
          <div className="hero-metrics" onMouseEnter={() => selectStage("verify", 2600)}>
            <div><strong>意图路由</strong><span>多场景任务分类</span></div>
            <div><strong>知识检索</strong><span>混合检索与重排</span></div>
            <div><strong>工具编排</strong><span>可追踪、可恢复、可评测</span></div>
          </div>
          <div
            ref={insightMaskRef}
            className="insight-mask"
            data-testid="insight-mask"
            aria-hidden="true"
            style={{ "--mask-x": "0px", "--mask-y": "0px" }}
          />
        </div>

        <AgentMap
          activeStage={activeStage}
          onStageChange={(stage) => selectStage(stage, 5000)}
        />
        <div className="hero-next-band" aria-hidden="true">
          <span />
          <p>把复杂问题拆成可执行路径，用工程确定性兑现可验证结果</p>
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
          <p>我擅长的不只是接入模型，而是把 Agent 链路做到可编排、可评估、可恢复、可交付。</p>
        </div>
        <div className="capability-list">
          {capabilities.map((capability) => (
            <CapabilityRow
              key={capability.id}
              capability={capability}
              open={openCapability === capability.id}
              onToggle={() => setOpenCapability(openCapability === capability.id ? "" : capability.id)}
              onOpenProject={handleOpenEvidenceProject}
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
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={emailCopied ? "邮箱已复制" : `复制邮箱 ${EMAIL}`}
            >
              <span><EnvelopeSimple />邮箱</span>
              <strong aria-live="polite">{emailCopied ? "复制成功" : EMAIL}</strong>
              {emailCopied ? <Check /> : <CopySimple />}
            </button>
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
