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
    primary: "每周 5 天 · 6 个月以上",
    secondary: "一周内到岗 · 重庆",
  },
  plan: {
    kicker: "AGENT LOOP / ENGINEERED",
    primary: "每周 5 天 · 6 个月以上",
    secondary: "一周内到岗 · 重庆 · Intent → Plan → Decide → Tools → Observe → Verify",
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

export const availabilityFacts = ["每周可出勤 5 天", "可实习 6 个月以上", "一周内到岗"];

export const projects = [
  {
    id: "careerforge",
    index: "01",
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
    sourceHref: "https://github.com/lwxiaoye/CareerForge-AI",
  },
  {
    id: "service",
    index: "02",
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
    sourceHref: "https://github.com/lwxiaoye/Agent-",
  },
  {
    id: "medical",
    index: "03",
    title: "医疗 RAG",
    label: "混合检索与自纠错闭环",
    summary: "从数据入库、召回融合到事实核验的完整检索链路",
    responsibility:
      "我完成数据入库、Milvus 混合检索、RRF 融合、检索质量评估和事实核验。召回率达到 91.3%，精确率达到 92.1%，失败时会自动补充搜索并回退重试。",
    highlights: [
      "同一文档维护稠密和稀疏向量，多路召回后使用 RRF 融合排序。",
      "把线性 RAG 改成检索评估、联网补充和事实核验组成的自纠错闭环。",
      "实现 Token 预算、摘要压缩、主动追问和并行子查询。",
    ],
    contribution: "能把检索、评测、回退和业务接口组成完整闭环。",
    stack: "FastAPI / LangGraph / Milvus / BM25 / PostgreSQL / Docker",
    livePath: "/medical/",
    sourceHref: "https://github.com/lwxiaoye/medical-RAG-",
  },
];

export const capabilities = [
  {
    id: "orchestration",
    index: "01",
    eyebrow: "ORCHESTRATION",
    title: "Agent 工作流与路由",
    summary: "用显式状态图组织意图识别、条件路由与专业 Agent 调度",
    stack: "LangGraph · LangChain · SSE",
    description: "把意图分类、业务路由、专业 Agent 调用和回复生成拆成显式节点，避免一条 Prompt 承担整条流程。",
    methods: ["StateGraph 条件路由", "分类结果规范化", "Checkpoint 会话恢复"],
    proof: "多智能体客服｜完成“分类—路由—专业 Agent—SSE 回传”闭环，并通过规范化层处理多行、夹标点和中英文混排导致的路由偏差。",
    projectIds: ["service"],
  },
  {
    id: "knowledge",
    index: "02",
    eyebrow: "KNOWLEDGE",
    title: "RAG 检索与评估",
    summary: "从混合召回、RRF 融合到事实核验与失败补充检索",
    stack: "Milvus · BM25 · FastAPI",
    description: "完成从数据入库、混合召回、结果融合到检索评估的完整链路，并为低质量召回设计补充搜索和重试路径。",
    methods: ["Dense + Sparse 混合召回", "RRF 结果融合", "查询改写与并行子查询", "检索失败补充与事实核验"],
    proof: "医疗 RAG｜召回率 91.3%，精确率 92.1%。",
    projectIds: ["medical"],
  },
  {
    id: "controlled-execution",
    index: "03",
    eyebrow: "HARNESS",
    title: "受控工具执行与异常恢复",
    summary: "让模型写入可校验、可撤销，执行失败时可恢复",
    stack: "Tool Calling · JSON Schema · Result Validation",
    description: "把简历读写从自由文本生成改为受约束的工具调用，确保每次写入可校验、可追踪、可撤销。",
    methods: ["字段级输出校验", "工具权限与参数约束", "写入前生成快照", "失败时撤销恢复"],
    proof: "CareerForge-AI｜实现简历读取、局部更新、写前快照、撤销恢复与 PDF 导出。",
    projectIds: ["careerforge"],
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
    proof: "多智能体客服 / CareerForge-AI｜完成核心 Agent 链路、流式接口与产品界面联调。",
    projectIds: ["careerforge", "service"],
  },
];
