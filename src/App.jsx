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

const stages = [
  { id: "intent", name: "Intent", detail: "意图识别", color: "#2db9c7", x: 50, y: 14 },
  { id: "plan", name: "Plan", detail: "任务规划", color: "#d7a24a", x: 82, y: 43 },
  { id: "rag", name: "RAG", detail: "知识检索", color: "#69ac69", x: 69, y: 81 },
  { id: "tools", name: "Tools", detail: "工具执行", color: "#e54e37", x: 27, y: 78 },
  { id: "verify", name: "Verify", detail: "结果校验", color: "#2db9c7", x: 17, y: 43 },
];

const insights = {
  intent: {
    kicker: "AGENT BUILDER",
    primary: "梁伟业",
    secondary: "CHONGQING / 2026",
  },
  plan: {
    kicker: "AGENT LOOP / RUNNING",
    primary: "理解 → 规划 → 检索 → 执行 → 校验",
    secondary: "把复杂任务拆成可验证的步骤",
  },
  rag: {
    kicker: "KNOWLEDGE / GROUNDED",
    primary: "LangGraph / RAG / Harness / SSE",
    secondary: "让答案有依据，让流程可追踪",
  },
  tools: {
    kicker: "TOOL CALL / EXECUTING",
    primary: "读取 · 检索 · 更新 · 导出",
    secondary: "Agent 不只回答，更能完成动作",
  },
  verify: {
    kicker: "RESULT / VERIFIED",
    primary: "3 项目 / 95% 意图识别 / 91.3% 召回",
    secondary: "用工程约束换取稳定交付",
  },
};

const projects = [
  {
    id: "careerforge",
    index: "01",
    title: "CareerForge-AI",
    label: "高校学生就业辅助平台",
    summary: "简历助手与 AI 面试官的完整 Agentic Loop",
    description:
      "基于 Function Calling 与 Harness Engineering，让 Agent 可以读取、生成、局部更新和撤销简历，并围绕目标岗位完成多轮模拟面试与质量校验。",
    stack: "React / TypeScript / FastAPI / MySQL / Redis / SSE",
    href: "https://github.com/Dloading666/CareerForge-AI",
  },
  {
    id: "service",
    index: "02",
    title: "多智能体客服",
    label: "调度中心 + 专业 Agent",
    summary: "意图分类、动态路由、知识检索与安全护栏",
    description:
      "以 LangGraph 显式状态图组织分类、路由和回复生成。标签规范化把意图识别准确率从约 70% 提升至约 95%，并用 SSE 改善等待反馈。",
    stack: "Python / LangGraph / LangChain / Flask / SSE / Docker",
    href: "https://lwxiaoye.top",
  },
  {
    id: "medical",
    index: "03",
    title: "医疗 RAG",
    label: "检索增强与事实核验",
    summary: "混合检索、查询改写、主动追问与自纠错闭环",
    description:
      "将稠密与稀疏检索通过 RRF 融合，结合检索质量评估、联网补充和事实核验，使 RAG 召回率达到 91.3%，精确率达到 92.1%。",
    stack: "FastAPI / LangGraph / Milvus / BM25 / PostgreSQL / Docker",
    href: "https://lwxiaoye.top",
  },
];

const capabilities = [
  {
    id: "orchestration",
    index: "01",
    eyebrow: "ORCHESTRATION",
    title: "Agent 编排",
    stack: "LangGraph · LangChain · ReAct · Function Calling · MCP · Skills",
    description: "用显式状态图组织分类、路由、工具调用与结果回收",
    proof: "多智能体客服意图识别约 95%",
    methods: ["StateGraph 条件边", "多 Agent 动态路由", "Checkpoint 会话持久化"],
  },
  {
    id: "knowledge",
    index: "02",
    eyebrow: "KNOWLEDGE",
    title: "检索增强",
    stack: "RAG · GraphRAG · Embedding · Milvus · BM25 · Neo4j",
    description: "组合查询改写、混合召回、RRF 融合与事实核验，避免只做单路向量搜索",
    proof: "医疗 RAG 召回率 91.3% · 精确率 92.1%",
    methods: ["Dense + Sparse 混合检索", "Graph 社区发现", "查询改写与并行子问题"],
  },
  {
    id: "harness",
    index: "03",
    eyebrow: "HARNESS",
    title: "工具与约束",
    stack: "Agentic Loop · JSON Schema · Tool Calling · Result Validation",
    description: "把模型输出放进可验证的 Harness，让工具调用、写入和回滚都有边界",
    proof: "简历读取、生成、局部更新、撤销与 PDF 导出闭环",
    methods: ["写前快照与撤销恢复", "字段级输出校验", "工具权限与参数约束"],
  },
  {
    id: "reliability",
    index: "04",
    eyebrow: "RELIABILITY",
    title: "可靠性与安全",
    stack: "Guardrails · Fallback · Prompt Injection Defense · Evaluation",
    description: "围绕异常输出、越界意图与检索失败设计短路、回退和质量评估节点",
    proof: "字段缺失、分数异常、报告为空时不中断主流程",
    methods: ["Out-of-scope 安全短路", "失败自动回退重试", "6 维 Rubric 评分"],
  },
  {
    id: "engineering",
    index: "05",
    eyebrow: "ENGINEERING",
    title: "全栈交付",
    stack: "FastAPI · React · TypeScript · PostgreSQL · Redis · Docker · SSE",
    description: "从模型接入、状态存储和流式接口，到前端反馈与生产异常路径完整交付",
    proof: "SSE 将同步等待升级为毫秒级首字反馈",
    methods: ["前后端类型化契约", "多服务会话隔离", "Docker 化部署"],
  },
];

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
      const ratio = window.devicePixelRatio || 1;
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

      ctx.lineWidth = 0.8;
      [0.56, 0.78, 1].forEach((size, index) => {
        ctx.strokeStyle = index === 1 ? "rgba(20,20,18,.25)" : "rgba(20,20,18,.12)";
        ctx.setLineDash(index === 1 ? [3, 5] : []);
        ctx.beginPath();
        ctx.ellipse(cx, cy, scale * size * 1.08, scale * size * 0.72, index * 0.44, 0, Math.PI * 2);
        ctx.stroke();
      });

      stages.forEach((stage, index) => {
        const next = stages[(index + 1) % stages.length];
        const x1 = (stage.x / 100) * width;
        const y1 = (stage.y / 100) * height;
        const x2 = (next.x / 100) * width;
        const y2 = (next.y / 100) * height;
        ctx.setLineDash([]);
        ctx.strokeStyle = index === activeIndex ? "rgba(20,20,18,.68)" : "rgba(20,20,18,.19)";
        ctx.lineWidth = index === activeIndex ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx + Math.sin(index) * 32, cy + Math.cos(index) * 24, x2, y2);
        ctx.stroke();
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
        <p>{project.description}</p>
        <div>
          <span>{project.stack}</span>
          <a href={project.href} target="_blank" rel="noreferrer" aria-label={`查看 ${project.title} 源码`}>
            查看项目 <ArrowUpRight weight="bold" />
          </a>
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

  const setInsight = (stage) => setActiveStage(stage);
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
          <div className="hero-zone hero-name-zone" onMouseEnter={() => setInsight("intent")}>
            <span className="eyebrow">AGENT APPLICATION DEVELOPER</span>
            <h1>梁伟业</h1>
          </div>
          <div className="hero-zone hero-title-zone" data-testid="hero-title-zone" onMouseEnter={() => setInsight("plan")}>
            <span className="red-rule" />
            <h2>构建真正完成任务的 Agent</h2>
          </div>
          <div className="hero-zone hero-stack" onMouseEnter={() => setInsight("rag")}>
            <p>Agent 应用开发 / LangGraph / RAG / Harness Engineering</p>
          </div>
          <div className="hero-actions" onMouseEnter={() => setInsight("tools")}>
            <button type="button" className="primary-button" onClick={() => scrollToSection("projects")}>
              查看项目 <ArrowRight weight="bold" />
            </button>
            <a className="secondary-button" href="/梁伟业简历_Agent开发.pdf" target="_blank">
              下载简历 <DownloadSimple weight="bold" />
            </a>
          </div>
          <div className="hero-statement" onMouseEnter={() => setInsight("plan")}>
            <span />
            <p>从意图识别，到工具执行，再到结果校验</p>
          </div>
          <div className="hero-metrics" onMouseEnter={() => setInsight("verify")}>
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

        <AgentMap activeStage={activeStage} onStageChange={setInsight} />
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
        <div className="section-heading compact">
          <div><span className="section-index">/ 04</span><h2>经历</h2></div>
        </div>
        <div className="timeline">
          <div><time>2023.09 — 2027.06</time><h3>重庆工程学院</h3><p>软件工程 · 全日制本科</p></div>
          <div><time>NOW</time><h3>Agent 应用开发</h3><p>持续构建智能体、知识检索与 AI 增强开发项目</p></div>
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
