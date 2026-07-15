# Hero Balance and Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebalance the desktop hero's left column, remove the Task Core center dot, and replace the transition copy without changing navigation, CTA behavior, or the runtime-map flow.

**Architecture:** Keep the existing React component anatomy and design tokens. Express the desktop top/bottom rhythm only through `.hero-copy` and `.hero-metrics`; preserve the current mobile natural flow with the existing breakpoint. Make the SVG and copy changes directly in `App.jsx` and lock the visible contract with focused component tests.

**Tech Stack:** React, SVG, CSS, Vitest, Testing Library, Vite

---

### Task 1: Lock the visible contract with failing tests

**Files:**
- Modify: `src/App.test.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Add tests for the new transition copy and removed core status dot**

```jsx
expect(screen.getByText("把复杂问题拆成可执行路径，用工程确定性兑现可验证结果")).toBeInTheDocument();
expect(container.querySelector(".task-core-status")).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\vitest\vitest.mjs run src\App.test.jsx --pool=forks --maxWorkers=1 --reporter=dot --testTimeout=5000
```

Expected: failure because the old sentence and `.task-core-status` still exist.

### Task 2: Apply the minimal component and layout changes

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Remove the Task Core status circle and replace the transition sentence**

```jsx
<p>把复杂问题拆成可执行路径，用工程确定性兑现可验证结果</p>
```

- [ ] **Step 2: Anchor proof points to the desktop lower edge**

```css
@media (min-width: 821px) {
  .hero-copy {
    display: flex;
    flex-direction: column;
  }

  .hero-metrics {
    margin-top: auto;
    margin-bottom: clamp(12px, 2vh, 24px);
  }
}
```

Retain the existing low-height desktop override so compact screens reduce the proof-row spacing, and retain the mobile breakpoint's natural flow.

- [ ] **Step 3: Run the focused tests and verify GREEN**

Run the Task 1 Vitest command.

Expected: 22 existing tests plus the new assertions pass.

### Task 3: Browser and production verification

**Files:**
- Modify: `design-qa.md`
- Evidence: `artifacts/hero-balance-1440.png`
- Evidence: `artifacts/hero-balance-390.png`

- [ ] **Step 1: Capture 1440 x 900 and 390 x 844 in the in-app browser**

Verify the desktop proof row is lower without collision, the mobile order is unchanged, the Task Core has no red dot, and the new sentence does not overflow.

- [ ] **Step 2: Check browser geometry and console**

Expected: document horizontal overflow is `0`; the hero content stays within the first viewport on desktop; browser console contains no new warnings or errors.

- [ ] **Step 3: Run the full test and production build commands**

```powershell
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\vitest\vitest.mjs run src\App.test.jsx --pool=forks --maxWorkers=1 --reporter=dot --testTimeout=5000
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\vite\bin\vite.js build
git diff --check
```

Expected: all tests pass, Vite exits 0, and the diff check reports no whitespace errors.

- [ ] **Step 4: Commit only after confirming the shared worktree scope**

The worktree already contains uncommitted prototype changes, so do not stage or commit implementation files unless the user explicitly requests a combined commit.
