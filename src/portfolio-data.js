export const planetThemes = {
  mercury: { highlight: "#F2F4F4", base: "#A9AFB1", mid: "#71797C", shadow: "#343A3D", glow: "#9CA9AF", texture: "rock" },
  venus: { highlight: "#FFF3CF", base: "#D9B66E", mid: "#B48A45", shadow: "#66502F", glow: "#D8B874", texture: "cloud" },
  earth: { highlight: "#EAF6F5", base: "#315E75", mid: "#668B7A", shadow: "#173542", glow: "#6E9FB2", texture: "ocean" },
  mars: { highlight: "#F3D3BF", base: "#B9684F", mid: "#8E493A", shadow: "#4F2D29", glow: "#B96A54", texture: "mineral" },
  jupiter: { highlight: "#F5E8D3", base: "#C8AA82", mid: "#8F7058", shadow: "#58473D", glow: "#A86F58", texture: "bands" },
  saturn: { highlight: "#FAF1D9", base: "#D8C292", mid: "#A98F64", shadow: "#675B49", glow: "#CBB991", texture: "ring" },
  uranus: { highlight: "#E6F8F5", base: "#86BDB6", mid: "#8CCBC4", shadow: "#467875", glow: "#8CCBC4", texture: "ice" },
  neptune: { highlight: "#DCE7FA", base: "#496B9D", mid: "#575079", shadow: "#253A64", glow: "#5478AD", texture: "current" },
};

export const stages = [
  { id: "intent", index: 1, name: "Intent", detail: "目标与约束", x: 500, y: 120, labelX: 538, labelY: 112, anchor: "start", planet: "mercury" },
  { id: "plan", index: 2, name: "Plan", detail: "生成或更新计划", x: 730, y: 155, labelX: 770, labelY: 148, anchor: "start", planet: "venus" },
  { id: "decide", index: 3, name: "Decide", detail: "决定下一步动作", x: 850, y: 275, labelX: 824, labelY: 268, anchor: "end", planet: "earth" },
  { id: "tools", index: 4, name: "Tools", detail: "调用外部能力", x: 700, y: 420, labelX: 742, labelY: 414, anchor: "start", planet: "mars" },
  { id: "observe", index: 5, name: "Observe", detail: "读取执行结果", x: 300, y: 420, labelX: 258, labelY: 414, anchor: "end", planet: "jupiter" },
  { id: "verify", index: 6, name: "Verify", detail: "验证目标是否完成", x: 150, y: 275, labelX: 176, labelY: 268, anchor: "start", planet: "saturn" },
];

export const runtimeSegments = [
  { from: "intent", to: "plan", controls: [585, 116, 665, 128] },
  { from: "plan", to: "decide", controls: [795, 172, 840, 220] },
  { from: "decide", to: "tools", controls: [844, 344, 785, 398] },
  { from: "tools", to: "observe", controls: [585, 462, 415, 462] },
  { from: "observe", to: "verify", controls: [215, 398, 156, 344] },
];

export const runtimeMapAux = {
  output: { x: 58, y: 182, labelX: 32, labelY: 145 },
  context: { x: 900, y: 94, labelX: 900, labelY: 69 },
  rag: { x: 920, y: 470, labelX: 890, labelY: 463 },
  core: { x: 500, y: 295 },
};

export const insights = {
  intent: {
    kicker: "AGENT BUILDER",
    primary: "持续项目协作 · 稳定交付节奏",
    secondary: "可快速进入项目 · 重庆",
  },
  plan: {
    kicker: "AGENT LOOP / ENGINEERED",
    primary: "持续项目协作 · 稳定交付节奏",
    secondary: "可快速进入项目 · 重庆 · Intent → Plan → Decide → Tools → Observe → Verify",
  },
  decide: {
    kicker: "DECISION / CONTROLLED",
    primary: "明确下一步动作与工具边界",
    secondary: "状态驱动 · 条件路由 · 权限约束",
  },
  tools: {
    kicker: "TOOL CALL / EXECUTING",
    primary: "把模型输出接进真实业务动作",
    secondary: "工具约束 · 写前快照 · 异常兜底",
  },
  observe: {
    kicker: "OBSERVATION / TRACED",
    primary: "读取结果，保留完整执行轨迹",
    secondary: "状态回收 · 错误识别 · 上下文更新",
  },
  verify: {
    kicker: "RESULT / VERIFIED",
    primary: "Agent 链路闭环 · 团队交付",
    secondary: "能独立接住一条 Agent 功能链路",
  },
};

export const internship = {
  company: "重庆独小漾服装有限公司",
  role: "AI 工程师 · 实习",
  period: "2026.06.07 — 2026.09.09",
  summary: "负责服装业务 AI 应用开发与运行环境建设：前 1–2 周搭建并迭代出图工作流，第 3 周启动 Agent 工作台，随后建设共享能力中枢，持续推进执行治理。",
  achievements: [
    {
      title: "出图提效",
      text: "为 12 名美编搭建并迭代 ComfyUI 工作流与图像 API 调用链路，支撑团队日均约 200 张图的生成需求；在同显卡、4K 场景下，将典型单次出图耗时由约 180 秒缩短至约 60 秒，降低约 67%。",
    },
    {
      title: "业务 Agent",
      text: "建设服装业务 Agent 工作台，以显式路由连接 ComfyUI 与图像 API；实现任务持久化、终态保护、已有任务恢复与账号级资产归档，处理长耗时生成任务的状态衔接。",
    },
    {
      title: "能力中枢",
      text: "为工作台建设共享能力中枢，统一管理工具、连接器、技能、数据与工作流 5 类能力；将部门知识检索、调用权限、风险确认与执行记录集中到服务端。",
    },
    {
      title: "沙箱治理 · 持续推进",
      text: "围绕 Agent 代码执行的资源争抢、任务隔离与产物可信性，推进用户 / 会话级容器分配、额度账本、超额准入排队与产物哈希校验回执，持续完善并发恢复和容器生命周期治理。",
    },
    {
      title: "部署交付",
      text: "搭建公司服务器与 AI 应用运行环境，完成 Docker Compose 服务编排、ComfyUI 模型与节点配置、MySQL / Redis 持久化和内网访问，沉淀部署与维护文档。",
    },
  ],
};

export const experienceProjects = [
  {
    title: "CareerForge-AI",
    period: "2026.05.01 — 2026.06.04",
    role: "Agent 应用开发 · 团队项目",
    description:
      "负责 AI 面试官核心模块，并补齐简历助手关键链路。把简历读取、局部修改、撤销与 PDF 导出做成受约束工具，完成多轮面试、结构化评分和异常兜底。",
    proof: "简历 Agent / AI 面试闭环 / 全栈联调",
  },
  {
    title: "多智能体客服",
    period: "2026.02.15 — 2026.04.29",
    role: "Agent 应用开发 · 团队项目",
    description:
      "从零搭建 LangGraph 工作流，负责意图分类、动态路由、专业 Agent 调度与 SSE 流式输出；为多行、夹标点和中英文混排的分类结果增加规范化与兜底处理。",
    proof: "LangGraph 路由 / RAG / SSE / 团队协作",
  },
];

export const collaborationFacts = ["可持续参与项目协作", "保持稳定交付节奏", "可快速进入项目"];

export const projects = [
  {
    id: "duxy-agent",
    index: "01",
    title: "独小漾服装 AI 工作台",
    label: "企业实习 · 12 名美编 · 日均约 200 张图",
    summary: "出图提效与异步任务管理：从生成需求到结果归档",
    caseStudy: true,
    responsibility: "美编需要频繁完成换色、改款与高清处理，生成等待和跨工具操作影响交付节奏。负责出图工作流优化、Agent 接入、任务与资产管理，以及前后端联调和服务器部署。",
    delivery: "前 1–2 周完成工作流搭建与迭代；第 3 周启动 Agent，将上传、调用、任务跟踪与结果归档接入同一工作台。",
    highlights: [
      "统一调用入口：通过显式路由匹配技能与工作流，将 ComfyUI 和图像 API 接入业务任务流程。",
      "保护任务状态：持久化任务与外部任务标识，限制取消后的状态回写，支持恢复已有生成任务。",
      "归档生成资产：关联账号、会话与任务，管理输入素材和生成结果；沉淀 14 份工具配置与 25 份镜头模板。",
    ],
    contribution: "缩短典型出图等待，并将生成任务的执行状态与产物接入统一工作台，支持从需求发起到结果归档的业务流程。",
    metricsTitle: "业务规模与出图效果",
    metricNote: "耗时为同显卡、4K 典型任务的前后对比；人数与日出图量描述团队出图业务规模。",
    metrics: [
      { value: "180 → 60 秒", label: "同显卡 · 4K 典型任务" },
      { value: "12 名", label: "美编使用出图工具" },
      { value: "约 200 张", label: "团队日均出图量" },
    ],
    stack: "Python / LangGraph / FastAPI / React / ComfyUI / MySQL / Redis / Docker",
    livePath: null,
    showcaseHref: "/showcase/duxy-agent/",
    sourceHref: null,
    accessLabel: "企业内部应用",
  },
  {
    id: "duxy-hub",
    index: "02",
    title: "独小漾能力中枢",
    label: "企业实习 · 能力治理 · 知识检索 · 执行沙箱",
    summary: "工作台的共享能力层：知识权限、调用控制与产物回执",
    caseStudy: true,
    responsibility: "工具与部门资料持续增加，需要统一能力接入、知识范围和执行记录。负责建设独立能力中枢：工作台承接用户任务，中枢提供能力目录、知识检索与调用治理。",
    delivery: "先打通能力发现与知识检索，再接入审核、风险确认和审计；沙箱治理继续推进资源准入、产物提交与生命周期管理。",
    highlights: [
      "集中管理能力：统一工具、连接器、技能、数据与工作流的发现、审核及调用入口。",
      "限定知识范围：按部门与个人空间组织资料，将权限过滤接入关键词、向量与混合检索流程。",
      "控制工具执行：将身份、版本、风险确认和调用预算接入执行链，关联请求与任务保留审计记录。",
    ],
    contribution: "让工作台通过统一接口发现和消费企业能力，将调用约束与执行记录集中管理，支持后续接入新的业务工具。",
    metricsTitle: "能力与知识建设规模",
    metricNote: "知识空间包含 11 个部门与 1 个通用空间，另支持个人知识库；以上为功能与配置规模。",
    metrics: [
      { value: "5 类", label: "统一管理的能力类型" },
      { value: "12 个", label: "部门与通用知识空间配置" },
      { value: "3 种", label: "关键词 / 向量 / 混合检索" },
    ],
    ongoing: {
      title: "沙箱执行治理 · 持续推进",
      text: "已实现用户 / 会话级容器、额度账本与准入排队；以产物哈希和提交回执核对保存结果，持续完善并发恢复与生命周期管理。",
    },
    stack: "FastAPI / MCP / RAG / BGE-M3 / Qdrant / Docker Sandbox / Python",
    livePath: null,
    showcaseHref: "/showcase/duxy-hub/",
    sourceHref: null,
    accessLabel: "企业内部应用",
  },
  {
    id: "careerforge",
    index: "03",
    title: "CareerForge-AI",
    label: "高校学生就业辅助平台",
    summary: "简历助手与 AI 面试官的完整 Agentic Loop",
    responsibility:
      "我负责 AI 面试官核心模块，也补齐了简历助手的关键链路。目标不是让模型“给建议”，而是让它能读取、修改、撤销和导出真实简历，并围绕目标岗位完成多轮面试。",
    userFeedback:
      "一位同学的原简历因表格化布局、信息缺失和重点不清，被辅导员指出存在较大问题。使用 CareerForge 补充关键信息并重新组织内容后，他反馈填写过程方便，生成的简历更加完整、重点更清晰；随后通过辅导员内部推荐进入公司实习。",
    highlights: [
      "把简历读取、局部更新、写前快照和 PDF 导出封装成受约束工具，由后端 Harness 统一校验。",
      "设计简历驱动提问、逐轮追问、6 维评分和报告生成；模型异常时走兜底，不让一次错误中断面试。",
      "接入岗位与技术知识检索，让提问和追问有材料依据，而不是只靠通用 Prompt。",
    ],
    contribution:
      "能独立接住一条 AI 功能链路，从需求、架构和 Prompt，一直做到接口、前端反馈与异常处理。",
    stack: "React / TypeScript / FastAPI / MySQL / Redis / SSE",
    livePath: "/career/",
    liveLabel: "查看案例",
    sourceHref: "https://github.com/lwxiaoye/CareerForge-AI",
  },
  {
    id: "service",
    index: "04",
    title: "多智能体客服",
    label: "调度中心 + 专业 Agent",
    summary: "把不稳定的分类输出变成可维护、可扩展的业务路由",
    responsibility:
      "我从零搭建工作流，用显式状态图组织分类、路由和回复生成。针对分类结果多行、夹标点和中英文混排的问题补了规范化层，让分类结果能稳定进入后续路由。",
    highlights: [
      "用 StateGraph 和条件边完成“分类—路由—专业 Agent—SSE 回传”闭环。",
      "越界、闲聊和违法意图直接短路，不进入业务 Agent。",
      "把同步等待改为 SSE 流式输出，并补齐移动端和前端容灾边界。",
    ],
    contribution:
      "能设计可读、可调试、可增量扩展的 Agent 工作流，并处理真实生产边界。",
    stack: "Python / LangGraph / LangChain / Flask / SSE / Docker",
    livePath: "/service/",
    liveLabel: "部署说明",
    sourceHref: "https://github.com/lwxiaoye/Agent-",
  },
  {
    id: "medical",
    index: "05",
    title: "医疗 RAG",
    label: "混合检索与自纠错闭环",
    summary: "从数据入库、召回融合到事实核验的完整检索链路",
    responsibility:
      "负责数据入库、Milvus 混合检索与 RRF 融合，将检索质量评估、补充搜索和事实核验接入工作流，处理召回材料不足时的查询回退。",
    highlights: [
      "同一文档维护稠密和稀疏向量，多路召回后使用 RRF 融合排序。",
      "把线性 RAG 改成检索评估、联网补充和事实核验组成的自纠错闭环。",
      "实现 Token 预算、摘要压缩、主动追问和并行子查询。",
    ],
    contribution: "能把检索、评测、回退和业务接口组成完整闭环。",
    stack: "FastAPI / LangGraph / Milvus / BM25 / PostgreSQL / Docker",
    livePath: "/medical/",
    liveLabel: "部署说明",
    sourceHref: "https://github.com/lwxiaoye/medical-RAG-",
  },
];

export const deploymentPages = {
  "/service": {
    index: "02",
    title: "多智能体客服",
    statusTitle: "多智能体客服正在部署中",
    description:
      "项目功能与源码已经完成，目前正在进行线上环境配置与稳定性验证。正式体验入口上线后，这里会第一时间更新。",
    stack: "Python / LangGraph / LangChain / Flask / SSE / Docker",
    sourceHref: "https://github.com/lwxiaoye/Agent-",
  },
  "/medical": {
    index: "03",
    title: "医疗 RAG",
    statusTitle: "医疗 RAG 正在部署中",
    description:
      "项目功能与源码已经完成，目前正在进行线上环境配置与稳定性验证。正式体验入口上线后，这里会第一时间更新。",
    stack: "RAG / Hybrid Search / RRF / Milvus / FastAPI",
    sourceHref: "https://github.com/lwxiaoye/medical-RAG-",
  },
};

export const capabilities = [
  {
    id: "orchestration",
    index: "01",
    eyebrow: "ORCHESTRATION",
    title: "Agent 工作流与路由",
    summary: "将意图路由、生成任务和结果回收分开组织",
    stack: "LangGraph · LangChain · SSE",
    description: "把意图分类、业务路由、专业 Agent 调用和回复生成拆成显式节点，避免一条 Prompt 承担整条流程。",
    methods: ["StateGraph 条件路由", "分类结果规范化", "应用层任务持久化与状态恢复"],
    proof: "工作台以持久化任务衔接生成服务；多智能体客服通过分类规范化处理多行、标点和中英文混排带来的路由偏差。",
    projectIds: ["duxy-agent", "service"],
  },
  {
    id: "knowledge",
    index: "02",
    eyebrow: "KNOWLEDGE",
    title: "RAG 检索与评估",
    summary: "围绕知识范围、召回排序与材料不足时的回退组织检索",
    stack: "Milvus · BM25 · FastAPI",
    description: "完成从数据入库、混合召回、结果融合到检索评估的完整链路，并为低质量召回设计补充搜索和重试路径。",
    methods: ["Dense + Sparse 混合召回", "RRF 结果融合", "查询改写与并行子查询", "检索失败补充与事实核验"],
    proof: "中枢实现部门权限过滤与混合检索；医疗 RAG 实现 RRF 融合、检索评估与补充搜索。",
    projectIds: ["duxy-hub", "medical"],
  },
  {
    id: "controlled-execution",
    index: "03",
    eyebrow: "HARNESS",
    title: "受控工具执行与异常恢复",
    summary: "将权限、风险确认与产物校验落实到执行层",
    stack: "Tool Calling · JSON Schema · Result Validation",
    description: "业务写入和代码执行需要明确的权限与结果依据：工具调用由执行层约束，文件保存通过提交回执核对。",
    methods: ["工具权限与参数约束", "风险确认与调用预算", "产物哈希校验与提交回执", "简历写前快照与撤销"],
    proof: "中枢提供受控调用，沙箱校验产物并生成回执；CareerForge 通过写前快照支持简历修改后的撤销。",
    projectIds: ["duxy-hub", "careerforge"],
  },
  {
    id: "engineering",
    index: "04",
    eyebrow: "ENGINEERING",
    title: "Agent 应用全栈交付",
    summary: "从后端工作流、状态存储到流式接口与前端反馈",
    stack: "FastAPI · React · TypeScript · Docker",
    description: "从 Agent 工作流、状态存储和流式接口，一直交付到前端反馈、异常展示与部署运行。",
    methods: ["FastAPI 接口与状态管理", "SSE 流式结果回传", "前后端数据契约", "Docker 化部署"],
    proof: "企业实习负责工作台前后端联调与公司服务器部署；CareerForge 和多智能体客服补充流式交互与应用集成经验。",
    projectIds: ["duxy-agent", "careerforge", "service"],
  },
];
