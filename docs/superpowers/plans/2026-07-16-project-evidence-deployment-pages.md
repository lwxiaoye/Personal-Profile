# 项目证据与部署状态页实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正 CareerForge 源码与项目证据，为多智能体客服和医疗 RAG 提供与主站一致的 `/service/`、`/medical/` 部署中页面，并发布到现有主域名。

**Architecture:** 主页项目与部署状态页内容继续集中在 `portfolio-data.js`。现有主页主体提取为 `PortfolioHome`，顶层 `App` 根据规范化路径选择主页或数据驱动的 `DeploymentStatusPage`，不增加路由依赖。部署仍只替换主站静态根目录，`/career/` 反向代理保持不变。

**Tech Stack:** React 19、Vite 6、Vitest、Testing Library、CSS、1Panel OpenResty 静态站点

---

## 文件结构

- Modify: `src/portfolio-data.js` — 项目入口、源码、工程证据、真实反馈与部署页数据。
- Create: `src/DeploymentStatusPage.jsx` — 复用的部署中页面组件。
- Modify: `src/App.jsx` — 主页反馈呈现、主页组件拆分与路径选择。
- Modify: `src/App.test.jsx` — 链接、文案、真实反馈、状态页和路由回归测试。
- Modify: `src/styles.css` — 真实反馈与方案 A 状态页的桌面、移动端和减少动画样式。
- Verify: `public/agent-orbit-favicon-master.png` — 状态页使用的既有三轨道图标，不修改文件。
- Modify: `docs/superpowers/plans/2026-07-16-project-evidence-deployment-pages.md` — 实施状态与验证证据。

### Task 1：先锁定可信内容与项目目标

**Files:**
- Modify: `src/App.test.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: 在每个测试后恢复主页路径**

将现有清理逻辑改为：

```jsx
afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});
```

- [ ] **Step 2: 修改 CareerForge 源码断言并增加真实反馈断言**

将旧仓库断言替换为：

```jsx
expect(source).toHaveAttribute(
  "href",
  "https://github.com/lwxiaoye/CareerForge-AI",
);
```

在 CareerForge 展开测试中增加：

```jsx
expect(screen.getByText("真实使用反馈")).toBeVisible();
expect(
  screen.getByText(/原简历因表格化布局、信息缺失和重点不清/),
).toBeVisible();
expect(screen.getByText(/随后通过辅导员内部推荐进入公司实习/)).toBeVisible();
```

- [ ] **Step 3: 将服务与医疗体验链接改成内部路径断言**

用以下表格替换现有“体验与源码都指向 GitHub”的参数化测试：

```jsx
it.each([
  { project: "多智能体客服", experienceHref: "/service/", sourceHref: "https://github.com/lwxiaoye/Agent-" },
  { project: "医疗 RAG", experienceHref: "/medical/", sourceHref: "https://github.com/lwxiaoye/medical-RAG-" },
])("separates $project experience and source destinations", async ({ project, experienceHref, sourceHref }) => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: `展开 ${project} 项目详情` }));

  const experience = screen.getByRole("link", { name: `前往体验 ${project}` });
  expect(experience).toHaveAttribute("href", experienceHref);
  expect(experience).not.toHaveAttribute("target");

  const source = screen.getByRole("link", { name: `查看 ${project} 源码` });
  expect(source).toHaveAttribute("href", sourceHref);
  expect(source).toHaveAttribute("target", "_blank");
  expect((source.getAttribute("rel") ?? "").split(/\s+/)).toContain("noreferrer");
});
```

- [ ] **Step 4: 添加无依据数字的回归断言**

```jsx
it("uses an auditable service outcome instead of unsupported percentages", async () => {
  const user = userEvent.setup();
  const { container } = render(<App />);

  await user.click(screen.getByRole("button", { name: "展开 多智能体客服 项目详情" }));
  expect(screen.getByText(/分类—路由—专业 Agent—SSE 回传/)).toBeVisible();
  expect(container.textContent).not.toMatch(/70%|95%/);
});
```

- [ ] **Step 5: 运行聚焦测试并确认 RED**

```powershell
$node='C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node node_modules\vitest\vitest.mjs run src\App.test.jsx
```

Expected: FAIL，原因是旧 CareerForge 地址、旧百分比、服务和医疗体验仍指向 GitHub，且真实反馈尚未渲染。

- [ ] **Step 6: 提交失败测试**

```powershell
git add src/App.test.jsx
git commit -m "test: specify honest project evidence and destinations"
```

### Task 2：实现可信项目数据与真实反馈

**Files:**
- Modify: `src/portfolio-data.js`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Test: `src/App.test.jsx`

- [ ] **Step 1: 更新主页项目与能力数据**

在 `src/portfolio-data.js` 中完成以下精确修改：

```js
// insights.verify
primary: "Agent 链路闭环 · 团队交付",

// CareerForge
sourceHref: "https://github.com/lwxiaoye/CareerForge-AI",
userFeedback:
  "一位同学的原简历因表格化布局、信息缺失和重点不清，被辅导员指出存在较大问题。使用 CareerForge 补充关键信息并重新组织内容后，他反馈填写过程方便，生成的简历更加完整、重点更清晰；随后通过辅导员内部推荐进入公司实习。",

// service
responsibility:
  "我从零搭建工作流，用显式状态图组织分类、路由和回复生成。针对分类结果多行、夹标点和中英文混排的问题补了规范化层，让分类结果能稳定进入后续路由。",
livePath: "/service/",

// medical
livePath: "/medical/",

// orchestration capability
proof:
  "多智能体客服｜完成“分类—路由—专业 Agent—SSE 回传”闭环，并通过规范化层处理多行、夹标点和中英文混排导致的路由偏差。",
```

同时将 `experienceProjects` 中的客服描述改为：

```js
"从零搭建 LangGraph 工作流，负责意图分类、动态路由、专业 Agent 调度与 SSE 流式输出；为多行、夹标点和中英文混排的分类结果增加规范化与兜底处理。"
```

- [ ] **Step 2: 在 CareerForge 详情中渲染真实反馈**

在 `ProjectRow` 的职责列中加入：

```jsx
{project.userFeedback && (
  <aside className="project-feedback" aria-label={`${project.title} 真实使用反馈`}>
    <span className="detail-label">真实使用反馈</span>
    <blockquote>{project.userFeedback}</blockquote>
  </aside>
)}
```

- [ ] **Step 3: 添加与现有编辑风格一致的反馈样式**

在项目详情样式附近加入：

```css
.project-feedback {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.project-feedback blockquote {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}
```

- [ ] **Step 4: 运行聚焦测试并确认 GREEN**

```powershell
$node='C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node node_modules\vitest\vitest.mjs run src\App.test.jsx
```

Expected: 新的项目内容、链接和反馈测试通过；现有项目展开行为无回归。

- [ ] **Step 5: 提交项目证据修改**

```powershell
git add src/portfolio-data.js src/App.jsx src/styles.css
git commit -m "feat: replace unsupported metrics with project evidence"
```

### Task 3：先定义 `/service/` 与 `/medical/` 页面行为

**Files:**
- Modify: `src/App.test.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: 添加路径渲染辅助函数**

```jsx
function renderAt(pathname) {
  window.history.replaceState({}, "", pathname);
  return render(<App />);
}
```

- [ ] **Step 2: 添加两个状态页的参数化测试**

```jsx
describe("deployment status routes", () => {
  it.each([
    {
      path: "/service/",
      title: "多智能体客服正在部署中",
      stack: "Python / LangGraph / LangChain / Flask / SSE / Docker",
      source: "https://github.com/lwxiaoye/Agent-",
    },
    {
      path: "/medical/",
      title: "医疗 RAG 正在部署中",
      stack: "RAG / Hybrid Search / RRF / Milvus / FastAPI",
      source: "https://github.com/lwxiaoye/medical-RAG-",
    },
  ])("renders $path as an honest coming-soon page", ({ path, title, stack, source }) => {
    renderAt(path);

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeVisible();
    expect(screen.getByText(/线上环境配置与稳定性验证/)).toBeVisible();
    expect(screen.getByText(stack)).toBeVisible();
    expect(screen.getByRole("img", { name: /Agent 三轨道标志/ })).toHaveAttribute(
      "src",
      "/agent-orbit-favicon-master.png",
    );
    expect(screen.getByRole("link", { name: "查看源码" })).toHaveAttribute("href", source);
    expect(screen.getByRole("link", { name: "返回作品集" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("heading", { name: "代表项目" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: 运行测试并确认 RED**

```powershell
$node='C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node node_modules\vitest\vitest.mjs run src\App.test.jsx
```

Expected: FAIL，因为 `/service/` 和 `/medical/` 仍渲染主页，没有部署状态页标题和操作。

- [ ] **Step 4: 提交失败测试**

```powershell
git add src/App.test.jsx
git commit -m "test: define service and medical deployment pages"
```

### Task 4：实现数据驱动的方案 A 状态页

**Files:**
- Modify: `src/portfolio-data.js`
- Create: `src/DeploymentStatusPage.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Test: `src/App.test.jsx`

- [ ] **Step 1: 添加部署页数据**

在 `src/portfolio-data.js` 中导出：

```js
export const deploymentPages = {
  "/service": {
    title: "多智能体客服",
    statusTitle: "多智能体客服正在部署中",
    description: "完整体验正在完成线上环境配置与稳定性验证，马上上线。你可以先查看项目源码。",
    stack: "Python / LangGraph / LangChain / Flask / SSE / Docker",
    sourceHref: "https://github.com/lwxiaoye/Agent-",
    index: "02",
  },
  "/medical": {
    title: "医疗 RAG",
    statusTitle: "医疗 RAG 正在部署中",
    description: "完整体验正在完成线上环境配置与稳定性验证，马上上线。你可以先查看项目源码。",
    stack: "RAG / Hybrid Search / RRF / Milvus / FastAPI",
    sourceHref: "https://github.com/lwxiaoye/medical-RAG-",
    index: "03",
  },
};
```

- [ ] **Step 2: 创建部署状态页组件**

`src/DeploymentStatusPage.jsx` 使用以下组件边界：

```jsx
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { useEffect } from "react";

export function DeploymentStatusPage({ project }) {
  useEffect(() => {
    document.title = `${project.title}｜部署中`;
  }, [project.title]);

  return (
    <main className="deployment-page">
      <header className="deployment-header">
        <a className="deployment-wordmark" href="/">LIANG WEIYE</a>
        <a href="/" aria-label="返回作品集">返回作品集 <ArrowLeft /></a>
      </header>
      <section className="deployment-shell">
        <div className="deployment-copy">
          <span className="deployment-status"><i /> DEPLOYMENT IN PROGRESS / {project.index}</span>
          <h1>{project.statusTitle}</h1>
          <p>{project.description}</p>
          <div className="deployment-actions">
            <a className="primary-button" href={project.sourceHref} target="_blank" rel="noreferrer">
              查看源码 <ArrowUpRight weight="bold" />
            </a>
            <a className="secondary-button" href="/">返回作品集 <ArrowLeft weight="bold" /></a>
          </div>
        </div>
        <div className="deployment-visual">
          <img src="/agent-orbit-favicon-master.png" alt={`${project.title} Agent 三轨道标志`} />
        </div>
        <div className="deployment-meta">
          <span>{project.stack}</span><span>COMING SOON</span>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: 将主页主体与顶层路径选择分离**

在 `src/App.jsx`：

1. 导入 `deploymentPages` 与 `DeploymentStatusPage`。
2. 将当前 `export function App()` 改名为内部 `function PortfolioHome()`。
3. 在文件末尾新增：

```jsx
function normalizePathname(pathname) {
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
}

export function App() {
  const pathname = normalizePathname(window.location.pathname);
  const deploymentProject = deploymentPages[pathname];
  return deploymentProject
    ? <DeploymentStatusPage project={deploymentProject} />
    : <PortfolioHome />;
}
```

- [ ] **Step 4: 实现方案 A 的样式**

在 `src/styles.css` 中增加：

```css
.deployment-page { min-height: 100svh; background: var(--paper); }
.deployment-header {
  height: var(--header-height); margin: 0 3.2vw; border-bottom: 1px solid var(--line);
  display: flex; align-items: center; justify-content: space-between;
}
.deployment-header a { color: var(--ink); text-decoration: none; }
.deployment-wordmark { font-size: 15px; font-weight: 700; letter-spacing: .15em; }
.deployment-shell {
  min-height: calc(100svh - var(--header-height)); padding: clamp(48px, 8vh, 92px) 4.2vw 36px;
  display: grid; grid-template-columns: minmax(0, .9fr) minmax(360px, .72fr);
  grid-template-rows: 1fr auto; gap: 40px 6vw;
}
.deployment-copy { align-self: center; max-width: 700px; }
.deployment-status { color: var(--red); font-family: "IBM Plex Mono", monospace; font-size: 11px; letter-spacing: .1em; }
.deployment-status i { display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; background: var(--red); }
.deployment-copy h1 { margin: 24px 0; max-width: 720px; font-size: clamp(54px, 6.2vw, 100px); line-height: .98; letter-spacing: -.055em; }
.deployment-copy > p { max-width: 620px; color: var(--muted); font-size: 17px; line-height: 1.8; }
.deployment-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
.deployment-visual { display: grid; place-items: center; }
.deployment-visual img { width: min(34vw, 440px); aspect-ratio: 1; object-fit: cover; mix-blend-mode: multiply; }
.deployment-meta { grid-column: 1 / -1; display: flex; justify-content: space-between; padding-top: 22px; border-top: 1px solid var(--line); color: var(--muted); font-family: "IBM Plex Mono", monospace; font-size: 11px; }
```

在 `@media (max-width: 820px)` 中增加：

```css
.deployment-header { margin-inline: 22px; }
.deployment-shell { min-height: auto; grid-template-columns: 1fr; padding: 58px 22px 28px; }
.deployment-copy h1 { font-size: clamp(48px, 14vw, 70px); }
.deployment-visual { grid-row: 2; }
.deployment-visual img { width: min(78vw, 320px); }
.deployment-meta { grid-column: 1; align-items: flex-start; flex-direction: column; gap: 12px; }
.deployment-actions a { width: 100%; justify-content: space-between; }
```

- [ ] **Step 5: 运行聚焦与完整测试并确认 GREEN**

```powershell
$node='C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node node_modules\vitest\vitest.mjs run src\App.test.jsx
& $node node_modules\vitest\vitest.mjs run
```

Expected: 所有测试通过，状态页、项目入口、源码、真实反馈和无百分比断言均为绿色。

- [ ] **Step 6: 提交部署页实现**

```powershell
git add src/portfolio-data.js src/DeploymentStatusPage.jsx src/App.jsx src/styles.css
git commit -m "feat: add honest project deployment pages"
```

### Task 5：生产构建与浏览器视觉验收

**Files:**
- Verify: `dist/index.html`
- Verify: `dist/agent-orbit-favicon-master.png`
- Verify: local `/`, `/service/`, `/medical/`

- [ ] **Step 1: 运行生产构建**

```powershell
$node='C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node node_modules\vite\bin\vite.js build
```

Expected: Vite 构建成功，`dist` 包含主页、哈希资源、简历 PDF 与三轨道图标。

- [ ] **Step 2: 启动本地预览**

```powershell
$node='C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node node_modules\vite\bin\vite.js preview --host 127.0.0.1 --port 4175
```

Expected: 预览在 `http://127.0.0.1:4175` 可访问。

- [ ] **Step 3: 在应用内浏览器检查主页**

验证：

- CareerForge 源码为新仓库。
- CareerForge 详情显示“真实使用反馈”。
- 服务和医疗“前往体验”分别为 `/service/`、`/medical/`。
- 页面中没有 `70%` 或 `95%`。

- [ ] **Step 4: 检查两个状态页**

分别打开 `/service/`、`/medical/`，在桌面与 390×844 检查：

- 方案 A 的左右结构、暖白与黑色编辑风格、暖红状态信号正确。
- 使用现有三轨道图标，图片未裁坏或拉伸。
- 标题、说明、技术栈、源码和返回作品集均正确。
- 无横向溢出、控制台错误或焦点不可见问题。

- [ ] **Step 5: 检查最终差异**

```powershell
git diff --check
git status --short
```

Expected: 无空白错误，无未解释文件。

### Task 6：发布主站并验证公网路径

**Files:**
- Deploy: local `dist/`
- Server root: `/opt/1panel/www/sites/lwxiaoye.top/index`
- Preserve: `/career/` OpenResty proxy and backend

- [ ] **Step 1: 创建带时间戳的暂存与备份目录**

使用绝对路径检查后创建 `/opt/deploy-staging/lwxiaoye-top-<timestamp>` 与 `/opt/deploy-backups/lwxiaoye-top-<timestamp>`；不得删除现有目录。

- [ ] **Step 2: 上传并原子替换主站静态根目录**

上传 `dist` 到暂存目录，确认 `index.html`、`assets/`、三轨道图标和简历 PDF 存在；将当前 `index` 重命名到备份目录，再将暂存目录重命名为新的 `index`。不修改 `/opt/1panel/www/sites/lwxiaoye.top/proxy/root.conf`。

- [ ] **Step 3: 验证 OpenResty 与公网状态**

验证：

```text
https://lwxiaoye.top/          -> 200
https://lwxiaoye.top/service/  -> 200，显示多智能体客服部署页
https://lwxiaoye.top/medical/  -> 200，显示医疗 RAG 部署页
https://lwxiaoye.top/career    -> 308 /career/
https://lwxiaoye.top/career/   -> 200，现有 CareerForge 服务保持健康
```

同时在 OpenResty 容器内执行配置语法检查，并确认 `127.0.0.1:8080` CareerForge 后端返回 200。

- [ ] **Step 4: 推送分支**

```powershell
git push origin codex/path-deployment
```

Expected: 远端分支更新成功；保留工作树用于后续 PR 反馈。

### Task 7：记录最终证据

**Files:**
- Modify: `docs/superpowers/plans/2026-07-16-project-evidence-deployment-pages.md`

- [ ] **Step 1: 勾选实际完成的步骤并记录验证结果**

只勾选已实际执行的项目，记录测试数量、构建结果、浏览器视口与线上状态码，不提前标记未完成工作。

- [ ] **Step 2: 提交实施记录**

```powershell
git add docs/superpowers/plans/2026-07-16-project-evidence-deployment-pages.md
git commit -m "docs: record project deployment page verification"
git push origin codex/path-deployment
```

Expected: 本地与远端分支包含可审计的实现与验证记录。
