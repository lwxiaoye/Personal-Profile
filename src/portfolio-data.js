export const stages = [
  { id: "intent", name: "Intent", detail: "意图识别", color: "#2db9c7", x: 50, y: 14 },
  { id: "plan", name: "Plan", detail: "任务规划", color: "#d7a24a", x: 82, y: 43 },
  { id: "rag", name: "RAG", detail: "知识检索", color: "#69ac69", x: 69, y: 81 },
  { id: "tools", name: "Tools", detail: "工具执行", color: "#e54e37", x: 27, y: 78 },
  { id: "verify", name: "Verify", detail: "结果校验", color: "#2db9c7", x: 17, y: 43 },
];

export const insights = {
  intent: {
    kicker: "AGENT BUILDER",
    primary: "每周 5 天 · 6 个月以上",
    secondary: "一周内到岗 · 重庆",
  },
  plan: {
    kicker: "AGENT LOOP / RUNNING",
    primary: "需求拆解 · 架构设计 · 团队联调",
    secondary: "理解 → 规划 → 检索 → 执行 → 校验",
  },
  rag: {
    kicker: "KNOWLEDGE / GROUNDED",
    primary: "91.3% 召回 · 92.1% 精确",
    secondary: "混合检索 · 质量评估 · 事实核验",
  },
  tools: {
    kicker: "TOOL CALL / EXECUTING",
    primary: "把模型输出接进真实业务动作",
    secondary: "工具约束 · 写前快照 · 异常兜底",
  },
  verify: {
    kicker: "RESULT / VERIFIED",
    primary: "约 95% 意图识别 · 团队交付",
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
      "从零搭建 LangGraph 工作流，负责意图分类、动态路由、专业 Agent 调度与 SSE 流式输出；针对不稳定分类结果增加规范化处理，最终将意图识别稳定在约 95%。",
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
    highlights: [
      "把简历读取、局部更新、写前快照和 PDF 导出封装成受约束工具，由后端 Harness 统一校验。",
      "设计简历驱动提问、逐轮追问、6 维评分和报告生成；模型异常时走兜底，不让一次错误中断面试。",
      "接入岗位与技术知识检索，让提问和追问有材料依据，而不是只靠通用 Prompt。",
    ],
    contribution:
      "能独立接住一条 AI 功能链路，从需求、架构和 Prompt，一直做到接口、前端反馈与异常处理。",
    stack: "React / TypeScript / FastAPI / MySQL / Redis / SSE",
    livePath: null,
    sourceHref: "https://github.com/Dloading666/CareerForge-AI",
  },
  {
    id: "service",
    index: "02",
    title: "多智能体客服",
    label: "调度中心 + 专业 Agent",
    summary: "把不稳定的分类输出变成可维护、可扩展的业务路由",
    responsibility:
      "我从零搭建工作流，用显式状态图组织分类、路由和回复生成。针对分类结果多行、夹标点和中英混排的问题补了规范化层，把意图识别从约 70% 提升到约 95%。",
    highlights: [
      "用 StateGraph 和条件边组织分类、路由、专业 Agent 处理与回复生成。",
      "越界、闲聊和违法意图直接短路，不进入业务 Agent。",
      "把同步等待改为 SSE 流式输出，并补齐移动端和前端容灾边界。",
    ],
    contribution:
      "能设计可读、可调试、可增量扩展的 Agent 工作流，并处理真实生产边界。",
    stack: "Python / LangGraph / LangChain / Flask / SSE / Docker",
    livePath: null,
    sourceHref: null,
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
    livePath: null,
    sourceHref: null,
  },
];

export const capabilities = [
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
