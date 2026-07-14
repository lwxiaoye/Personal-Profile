# Portfolio Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the personal landing page so the desktop hero occupies exactly one viewport, the projects present concrete team value, and the Agent star map gains the approved restrained 3D mechanical motion.

**Architecture:** Keep the existing React/Vite single-page architecture and its inline expandable rows. Move portfolio copy and link state into a focused data module, keep orchestration in `App.jsx`, and enhance the existing Canvas renderer rather than adding a 3D dependency. CSS owns viewport sizing, perspective, responsive fallbacks, and reduced-motion behavior.

**Tech Stack:** React 19, Vite 6, Vitest, Testing Library, Canvas 2D, CSS 3D transforms

---

## File map

- Create `src/portfolio-data.js`: stages, insights, project copy, capability copy, and future path metadata.
- Modify `src/App.jsx`: consume portfolio data, set page title, enforce one-open-project behavior, render unavailable live links honestly, and coordinate star-map animation state.
- Modify `src/styles.css`: exact viewport sizing, denser project detail layout, 3D map layers, responsive fallbacks, and reduced-motion rules.
- Modify `src/App.test.jsx`: test the approved copy, title, project behavior, unavailable link state, and star-map accessibility.
- Modify `index.html`: set Chinese document language and static browser title.
- Verify `AGENTS.md`: retain the approved durable decisions already recorded.

The workspace is not a Git repository. Commit steps are intentionally omitted; each task ends with a test/build checkpoint instead.

### Task 1: Lock approved identity and project behavior in tests

**Files:**
- Modify: `src/App.test.jsx`

- [ ] **Step 1: Replace the old identity assertions with the approved title and hero copy**

Add this test near the top of the suite:

```jsx
it("presents the approved recruiter-facing identity", () => {
  render(<App />);

  expect(document.title).toBe("梁伟业｜Agent 应用开发");
  expect(screen.getByRole("heading", { level: 1, name: "梁伟业" })).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "把 Agent 做成真正能交付的产品" }),
  ).toBeVisible();
});
```

- [ ] **Step 2: Add tests for humanized project content and one-open behavior**

```jsx
it("shows concrete responsibility and team contribution in project details", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));

  expect(screen.getByText(/我负责 AI 面试官核心模块/)).toBeVisible();
  expect(screen.getByText(/能独立接住一条 AI 功能链路/)).toBeVisible();
  expect(screen.getByText(/6 维评分/)).toBeVisible();

  await user.click(screen.getByRole("button", { name: "展开 多智能体客服 项目详情" }));
  expect(screen.queryByText(/我负责 AI 面试官核心模块/)).not.toBeVisible();
  expect(screen.getByText(/约 70% 提升到约 95%/)).toBeVisible();
});
```

- [ ] **Step 3: Add a test for unavailable deployment paths**

```jsx
it("does not expose fake live links before deployment paths are supplied", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));

  expect(screen.getByText("部署地址待提供")).toBeVisible();
  expect(screen.queryByRole("link", { name: /在线体验 CareerForge-AI/ })).not.toBeInTheDocument();
});
```

- [ ] **Step 4: Run the focused tests and confirm they fail for the intended reasons**

Run: `npm test -- --run src/App.test.jsx`

Expected: FAIL because the old title/copy remains, multiple project behavior has not been asserted, and the deployment-state label does not exist.

### Task 2: Centralize approved portfolio copy and metadata

**Files:**
- Create: `src/portfolio-data.js`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create the data module with exact approved project fields**

Create `src/portfolio-data.js` with exported `stages`, `insights`, `projects`, and `capabilities`. Preserve the current capability data and use this project shape:

```js
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
    contribution:
      "能把检索、评测、回退和业务接口组成完整闭环。",
    stack: "FastAPI / LangGraph / Milvus / BM25 / PostgreSQL / Docker",
    livePath: null,
    sourceHref: null,
  },
];
```

- [ ] **Step 2: Import the centralized data in `App.jsx`**

Remove the local `stages`, `insights`, `projects`, and `capabilities` declarations and add:

```jsx
import { capabilities, insights, projects, stages } from "./portfolio-data.js";
```

- [ ] **Step 3: Set the approved document title from the app**

Add this effect at the start of `App`:

```jsx
useEffect(() => {
  document.title = "梁伟业｜Agent 应用开发";
}, []);
```

Change the hero heading to:

```jsx
<h2>把 Agent 做成真正能交付的产品</h2>
```

- [ ] **Step 4: Run the identity test**

Run: `npm test -- --run src/App.test.jsx -t "approved recruiter-facing identity"`

Expected: PASS.

### Task 3: Render evidence-led project details and honest links

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Replace `ProjectRow` detail markup with three semantic columns**

Use this structure inside `.project-detail`:

```jsx
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
      <a href={project.sourceHref} target="_blank" rel="noreferrer">
        查看源码 <ArrowUpRight weight="bold" />
      </a>
    )}
  </div>
</div>
```

- [ ] **Step 2: Keep exactly one project open**

Retain one `openProject` string in `App` and use:

```jsx
onToggle={() => setOpenProject(openProject === project.id ? "" : project.id)}
```

Because only one id is stored, opening another project closes the previous one.

- [ ] **Step 3: Style the compact three-column detail**

Replace the old two-column `.project-detail` rule with:

```css
.project-detail {
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.85fr;
  gap: clamp(28px, 3vw, 56px);
  padding: 4px 70px 38px;
}

.detail-label {
  display: block;
  margin-bottom: 10px;
  color: var(--muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.project-highlights ul { margin: 0; padding-left: 18px; }
.project-highlights li { margin-bottom: 7px; line-height: 1.65; }
.project-contribution { padding-left: 22px; border-left: 1px solid var(--line); }
.project-contribution strong { display: block; line-height: 1.6; }
.project-contribution small { display: block; margin-top: 16px; color: var(--muted); line-height: 1.7; }
.project-links { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 22px; }
.link-unavailable { color: var(--muted); font-size: 12px; }
```

- [ ] **Step 4: Run the project tests**

Run: `npm test -- --run src/App.test.jsx -t "project"`

Expected: all project-focused tests PASS.

### Task 4: Make each default desktop section occupy a clean viewport

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Define viewport and header variables**

Add to `:root`:

```css
--header-height: 66px;
--viewport-height: 100svh;
```

- [ ] **Step 2: Make header plus hero equal one viewport**

Use:

```css
.site-header { height: var(--header-height); }

.hero {
  min-height: calc(var(--viewport-height) - var(--header-height));
  height: calc(var(--viewport-height) - var(--header-height));
  overflow: hidden;
}
```

Remove the current `min-height: 900px`. Keep `.hero-next-band` inside the hero and reduce it to `height: 54px` so it does not create a blank strip below the viewport.

- [ ] **Step 3: Apply viewport targets to primary collapsed sections**

```css
.section,
.about,
.contact {
  min-height: var(--viewport-height);
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: clamp(72px, 9vh, 112px);
}
```

Do not set `height: 100svh` on expandable project or capability sections; `min-height` lets them grow without clipping.

- [ ] **Step 4: Preserve natural mobile height**

Inside `@media (max-width: 820px)` add:

```css
.hero,
.section,
.about,
.contact {
  height: auto;
  min-height: auto;
}
```

- [ ] **Step 5: Build and check for CSS compilation errors**

Run: `npm run build`

Expected: Vite exits with code 0 and emits `dist/assets/*.css` and `dist/assets/*.js`.

### Task 5: Implement the approved restrained 3D mechanical star map

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.jsx`

- [ ] **Step 1: Add testable 3D layer markup around the existing canvas**

Inside `.map-stage`, render the following before the task core:

```jsx
<div className="orbit-space" aria-hidden="true">
  <span className="orbit-plane orbit-plane-a" />
  <span className="orbit-plane orbit-plane-b" />
  <span className="orbit-plane orbit-plane-c" />
</div>
```

Add a test:

```jsx
it("renders three restrained 3D orbit planes around the agent core", () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll(".orbit-plane")).toHaveLength(3);
  expect(screen.getByLabelText("Agent 运行星图")).toBeVisible();
});
```

- [ ] **Step 2: Add perspective and slow orbit transforms**

```css
.map-stage { perspective: 1000px; transform-style: preserve-3d; }

.orbit-space {
  position: absolute;
  inset: 13% 18%;
  transform-style: preserve-3d;
  animation: orbit-space-breathe 8s ease-in-out infinite;
}

.orbit-plane {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(18, 18, 16, 0.16);
  border-radius: 50%;
  transform-style: preserve-3d;
}

.orbit-plane-a { transform: rotateX(64deg) rotateZ(-14deg); animation: orbit-a 22s linear infinite; }
.orbit-plane-b { inset: 9%; border-style: dashed; transform: rotateY(66deg) rotateZ(20deg); animation: orbit-b 18s linear infinite reverse; }
.orbit-plane-c { inset: 18%; transform: rotateX(72deg) rotateY(34deg); animation: orbit-c 15s linear infinite; }

.task-core { animation: task-core-float 4.8s ease-in-out infinite; }

@keyframes orbit-space-breathe {
  50% { transform: translateY(-5px) rotateZ(2deg) scale(1.02); }
}
@keyframes orbit-a { to { transform: rotateX(64deg) rotateZ(346deg); } }
@keyframes orbit-b { to { transform: rotateY(66deg) rotateZ(380deg); } }
@keyframes orbit-c { to { transform: rotateX(72deg) rotateY(34deg) rotateZ(360deg); } }
@keyframes task-core-float {
  50% { transform: translate(-50%, calc(-50% - 5px)) scale(1.025); }
}
```

- [ ] **Step 3: Enhance Canvas depth without duplicating CSS rings**

In `AgentCanvas.draw`, remove the three flat ellipse loop and draw only active flow curves, their faint depth shadows, and the moving signal point. Draw each inactive curve twice: first at `y + 8` with alpha `.06`, then at its normal location with alpha `.18`. Keep the active curve at alpha `.68` and the moving point colored with the active stage color.

Cap rendering density so high-DPI screens do not spend unnecessary work on the decorative canvas:

```js
const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
```

Use the existing `quadraticCurveTo` control point and this helper inside `draw`:

```js
const drawFlow = (x1, y1, x2, y2, index, color, lineWidth, offsetY = 0) => {
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
```

- [ ] **Step 4: Auto-advance stages without overriding recent user interaction**

In `App`, add a ref and interval:

```jsx
const stageLockUntilRef = useRef(0);

const selectStage = (stage, lockMs = 0) => {
  if (lockMs) stageLockUntilRef.current = Date.now() + lockMs;
  setActiveStage(stage);
};

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
```

Node click and hover call `selectStage(stage.id, 5000)`. Left insight zones call `selectStage(stageId, 2600)`. This keeps the star map synchronized while allowing automatic flow to resume.

Wire the existing component without changing its public prop shape:

```jsx
<AgentMap
  activeStage={activeStage}
  onStageChange={(stage) => selectStage(stage, 5000)}
/>
```

Replace each left-zone `setInsight("stage")` call with `selectStage("stage", 2600)`.

- [ ] **Step 5: Run the star-map tests**

Run: `npm test -- --run src/App.test.jsx -t "star map|orbit|synchronizes"`

Expected: all selected tests PASS.

### Task 6: Add motion, mobile, and accessibility fallbacks

**Files:**
- Modify: `src/styles.css`
- Modify: `src/App.test.jsx`

- [ ] **Step 1: Stop all continuous 3D motion for reduced-motion users**

Extend the existing reduced-motion block:

```css
@media (prefers-reduced-motion: reduce) {
  .orbit-space,
  .orbit-plane,
  .task-core,
  .map-status i,
  .scroll-cue svg {
    animation: none !important;
  }
}
```

- [ ] **Step 2: Simplify the map on mobile**

Inside the mobile media query:

```css
.orbit-space { inset: 18% 14%; }
.orbit-plane-c { display: none; }
.map-stage { min-height: 390px; perspective: 700px; }
.task-core { width: 82px; height: 82px; }
```

- [ ] **Step 3: Ensure all project controls retain accessible names**

Keep each row button `aria-expanded`, and update its label from project data:

```jsx
aria-label={`${open ? "收起" : "展开"} ${project.title} 项目详情`}
```

Ensure star nodes retain `aria-pressed` and the full `${stage.name} ${stage.detail}` accessible name.

- [ ] **Step 4: Run the complete unit suite**

Run: `npm test`

Expected: all tests PASS with no unhandled timers. If fake-timer leakage appears, ensure every interval is cleared in its effect cleanup.

### Task 7: Update static metadata and perform visual verification

**Files:**
- Modify: `index.html`
- Verify: `AGENTS.md`
- Create screenshots only as temporary QA artifacts under the workspace root

- [ ] **Step 1: Update static HTML metadata**

Change:

```html
<html lang="zh-CN">
```

and:

```html
<title>梁伟业｜Agent 应用开发</title>
<meta
  name="description"
  content="梁伟业的 Agent 应用开发作品集，包含 CareerForge-AI、多智能体客服与医疗 RAG。"
/>
```

- [ ] **Step 2: Run full verification**

Run: `npm test && npm run build`

Expected: tests PASS, build exits 0, and `dist/index.html` contains the Chinese title.

- [ ] **Step 3: Start the local server and open it in the available browser**

Run the Vite server from this workspace with a fixed local port. On Windows, launch it hidden and capture output to `vite.out.log` and `vite.err.log`. Open `http://localhost:4173/` in the available browser.

Expected: the page loads without console-blocking errors.

- [ ] **Step 4: Verify desktop viewport behavior at three sizes**

Check 1440×900, 1920×1080, and 1366×768:

- the header and hero end exactly at the bottom of the viewport;
- no part of “代表项目” is visible before scrolling;
- the insight mask remains clipped to the left hero column;
- the original warm-white/black editorial hierarchy is preserved;
- the three 3D orbit planes move slowly and the active stage remains readable.

- [ ] **Step 5: Verify projects and mobile behavior**

At desktop width, open each project and confirm only one remains open. At 390×844, confirm natural page height, no horizontal scrolling, two orbit planes, readable node labels, and complete project detail content.

- [ ] **Step 6: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm orbit rotation, core floating, status pulsing, and scroll-cue motion stop while all content remains visible.

- [ ] **Step 7: Final evidence check**

Confirm the page contains no invented statistics, no fake live links, the GitHub profile remains `https://github.com/lwxiaoye`, the resume download still works, and the contact section still states 2027 graduation, Chongqing, internship availability, and collaboration interest.
