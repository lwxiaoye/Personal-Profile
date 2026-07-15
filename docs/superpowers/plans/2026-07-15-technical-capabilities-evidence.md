# Technical Capabilities Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the keyword-led five-row skills list with four evidence-led delivery capabilities and connect each proof to the corresponding inline project detail.

**Architecture:** Keep capability content in `src/portfolio-data.js`, render it through the existing `CapabilityRow` in `src/App.jsx`, and reuse the existing `openProject` state plus `scrollToSection` helper for project evidence links. Preserve the current editorial accordion and responsive layout while adding distinct capability summaries, secondary stacks, Chinese detail labels, and project-link actions.

**Tech Stack:** React 19, Vite, Vitest, Testing Library, CSS

---

### Task 1: Lock the evidence-led content contract

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/portfolio-data.js`

- [ ] **Step 1: Write the failing content test**

Replace the existing five-row capability test with assertions that the section renders four rows, defaults to the first row open, shows the recruiter-focused section statement, and exposes the four approved titles and capability sentences. Assert that `MCP`, `GraphRAG`, `Neo4j`, `Prompt Injection Defense`, and `毫秒级首字反馈` are absent from the skills section.

```jsx
it("presents four evidence-led delivery capabilities", () => {
  render(<App />);
  const skills = screen.getByRole("heading", { level: 2, name: "技术能力" }).closest("section");

  expect(within(skills).getAllByRole("button", { name: /能力详情/ })).toHaveLength(4);
  expect(within(skills).getByText("我擅长的不只是接入模型，而是把 Agent 链路做到可编排、可评估、可恢复、可交付。")).toBeVisible();
  expect(within(skills).getByRole("button", { name: "收起 Agent 工作流与路由 能力详情" })).toHaveAttribute("aria-expanded", "true");
  for (const title of ["Agent 工作流与路由", "RAG 检索与评估", "受控工具执行与异常恢复", "Agent 应用全栈交付"]) {
    expect(within(skills).getByText(title)).toBeVisible();
  }
  expect(within(skills).queryByText(/MCP|GraphRAG|Neo4j|Prompt Injection Defense|毫秒级首字反馈/)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run src/App.test.jsx -t "presents four evidence-led delivery capabilities"`

Expected: FAIL because the UI still renders five rows and the old titles/content.

- [ ] **Step 3: Implement the four capability records**

Update `capabilities` so every item contains `id`, `index`, `eyebrow`, `title`, `summary`, `stack`, `description`, `methods`, `proof`, and `projectIds`. Use the exact approved content from `docs/superpowers/specs/2026-07-15-technical-capabilities-evidence-design.md`.

```js
{
  id: "orchestration",
  index: "01",
  eyebrow: "ORCHESTRATION",
  title: "Agent 工作流与路由",
  summary: "用显式状态图组织意图识别、条件路由与专业 Agent 调度",
  stack: "LangGraph · LangChain · SSE",
  description: "把意图分类、业务路由、专业 Agent 调用和回复生成拆成显式节点，避免一条 Prompt 承担整条流程。",
  methods: ["StateGraph 条件路由", "分类结果规范化", "Checkpoint 会话恢复"],
  proof: "多智能体客服｜意图识别由约 70% 提升至约 95%，完成“分类—路由—专业 Agent—SSE 回传”链路。",
  projectIds: ["service"],
}
```

- [ ] **Step 4: Render summary separately from the secondary stack**

Update `CapabilityRow` so the collapsed row renders `capability.summary` as the main line and `capability.stack` as secondary metadata. Change detail labels to `工程问题`, `关键实现`, and `项目证据`. Initialize `openCapability` to `"orchestration"`.

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `npm test -- --run src/App.test.jsx -t "presents four evidence-led delivery capabilities"`

Expected: PASS.

### Task 2: Connect proof to inline projects

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write the failing navigation test**

Add a test that clicks `查看项目：多智能体客服`, expects the corresponding project detail to open, and verifies `scrollIntoView` is called for the projects section. Add a second assertion that the full-stack capability exposes both CareerForge-AI and 多智能体客服 project actions.

```jsx
it("opens the matching project from capability evidence", async () => {
  const user = userEvent.setup();
  const scrollIntoView = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoView;
  render(<App />);

  await user.click(screen.getByRole("button", { name: "查看项目：多智能体客服" }));
  expect(screen.getByRole("button", { name: "收起 多智能体客服 项目详情" })).toHaveAttribute("aria-expanded", "true");
  expect(scrollIntoView).toHaveBeenCalled();

  await user.click(screen.getByRole("button", { name: "查看 Agent 应用全栈交付 能力详情" }));
  expect(screen.getByRole("button", { name: "查看项目：CareerForge-AI" })).toBeVisible();
  expect(screen.getByRole("button", { name: "查看项目：多智能体客服" })).toBeVisible();
});
```

- [ ] **Step 2: Run the focused navigation test to verify it fails**

Run: `npm test -- --run src/App.test.jsx -t "opens the matching project from capability evidence"`

Expected: FAIL because capability evidence has no project actions.

- [ ] **Step 3: Implement project evidence actions**

Pass an `onOpenProject` callback into `CapabilityRow`. Render one button per `projectIds` entry with the accessible name `查看项目：{project.title}`. In `App`, set `openProject`, call `scrollToSection("projects")`, and preserve the one-open-project behavior.

- [ ] **Step 4: Run the focused navigation test to verify it passes**

Run: `npm test -- --run src/App.test.jsx -t "opens the matching project from capability evidence"`

Expected: PASS.

### Task 3: Preserve the editorial hierarchy responsively

**Files:**
- Modify: `src/styles.css`
- Modify: `src/App.test.jsx`

- [ ] **Step 1: Write the failing structure/style test**

Assert that the collapsed capability row contains `.capability-summary` and `.capability-stack`, that project evidence actions use `.capability-project-link`, and that the stylesheet contains mobile rules which keep the detail in one column.

```jsx
it("keeps capability evidence readable across breakpoints", () => {
  const { container } = render(<App />);
  const css = readFileSync("src/styles.css", "utf8");

  expect(container.querySelectorAll(".capability-summary")).toHaveLength(4);
  expect(container.querySelectorAll(".capability-stack")).toHaveLength(4);
  expect(container.querySelector(".capability-project-link")).toBeInTheDocument();
  expect(css).toContain(".capability-summary");
  expect(css).toContain("grid-template-columns: 1fr;");
});
```

- [ ] **Step 2: Run the focused style test to verify it fails**

Run: `npm test -- --run src/App.test.jsx -t "keeps capability evidence readable across breakpoints"`

Expected: FAIL because the new classes and action styles do not exist.

- [ ] **Step 3: Implement desktop and mobile styling**

Use a five-column desktop trigger for code, title, summary, stack, and toggle. Keep the summary visually stronger than the stack, style project actions as restrained underlined editorial links, and stack code/title/summary/stack into the first mobile column while the toggle spans all four rows.

- [ ] **Step 4: Run the focused style test to verify it passes**

Run: `npm test -- --run src/App.test.jsx -t "keeps capability evidence readable across breakpoints"`

Expected: PASS.

### Task 4: Verify only the authorized surface and inspect it visually

**Files:**
- Verify: `src/App.test.jsx`
- Verify: `src/portfolio-data.js`
- Verify: `src/App.jsx`
- Verify: `src/styles.css`

- [ ] **Step 1: Run all capability-focused tests**

Run: `npm test -- --run src/App.test.jsx -t "capabilit|能力|matching project"`

Expected: all capability-focused tests PASS.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 3: Run the complete test suite and separate the known baseline failure**

Run: `npm test`

Expected: capability tests PASS; the pre-existing star-map assertion for `TOOL CALL / EXECUTING` may remain the only failure and must not be edited as part of this work.

- [ ] **Step 4: Start the Vite server and inspect the skills section**

Run: `npm run dev -- --host 127.0.0.1`

Open the local page in the in-app browser. Verify desktop collapsed/open states, the default first row, each proof link opening the correct project, keyboard focus, and mobile reflow without horizontal overflow.
