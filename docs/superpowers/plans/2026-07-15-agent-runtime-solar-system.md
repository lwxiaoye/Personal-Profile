# Agent Runtime Solar System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade only the existing Agent runtime map into a restrained solar-system-inspired SVG motion system while preserving its `0 0 1000 590` geometry and Agent flow semantics.

**Architecture:** Extend the existing stage data with one reusable planet theme per numbered node, then generate all SVG gradients, texture layers, node surfaces, paths, and labels from the same data. CSS controls hover/focus material reveal, independent Harness/Core motion, responsive simplification, and reduced-motion fallback; no image, Canvas replacement, Three.js, route, or modal is added.

**Tech Stack:** React 19, SVG, CSS animations, Vitest, Testing Library, Vite

---

### Task 1: Planet theme data contract

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/portfolio-data.js`

- [ ] **Step 1: Add a failing test for the six planet mappings and RAG/Context themes**

```jsx
expect(container.querySelectorAll(".planet-gradient")).toHaveLength(6);
expect(container.querySelector('[data-node-id="intent"]')).toHaveAttribute("data-planet", "mercury");
expect(container.querySelector('[data-node-id="verify"]')).toHaveAttribute("data-planet", "saturn");
expect(container.querySelector("#uranus-gradient")).toBeInTheDocument();
expect(container.querySelector("#neptune-gradient")).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused suite and confirm RED**

Run the existing bundled-Node Vitest command. Expected: the planet gradients and `data-planet` attributes are missing.

- [ ] **Step 3: Export `planetThemes` and attach planet keys to `stages`**

Use the exact palettes from `agent-runtime-map-solar-system-design-spec.md`; keep every existing stage coordinate and label coordinate unchanged.

- [ ] **Step 4: Generate SVG `<defs>` gradients and confirm GREEN**

Generate `mercury` through `saturn`, plus `uranus` and `neptune`, from the data source rather than duplicating stop values in JSX.

### Task 2: Planet surfaces and interaction priority

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing tests for one surface per stage, Jupiter bands, Saturn ring, accessible focus, and hover restoration**

```jsx
expect(container.querySelectorAll(".planet-surface")).toHaveLength(6);
expect(container.querySelector('[data-node-id="observe"] .planet-bands')).toBeInTheDocument();
expect(container.querySelector('[data-node-id="verify"] .saturn-ring')).toBeInTheDocument();
fireEvent.mouseEnter(screen.getByRole("button", { name: "Tools 调用外部能力" }));
expect(screen.getByRole("button", { name: "Plan 生成或更新计划" })).toHaveAttribute("aria-pressed", "true");
```

- [ ] **Step 2: Run Vitest and confirm RED**

Expected: material layers do not exist and mouse enter still mutates the execution state.

- [ ] **Step 3: Render data-driven abstract texture layers**

Use clipped SVG circles/arcs/bands only. Keep the existing warm-white/black node circle as the default layer and reveal the planet layer only through `:hover` and `:focus-visible`.

- [ ] **Step 4: Remove hover-driven React state mutation while retaining click/keyboard activation**

Delete `onMouseEnter` from the stage group. Preserve the existing accessible name, `tabIndex="0"`, Enter/Space activation, and `aria-pressed` execution state.

- [ ] **Step 5: Add CSS state priority and responsive scaling**

Desktop material scale: `1.24`; tablet: `1.17`; mobile: `1.1` with decorative texture/halo hidden. Hover/focus must override `.is-active` and restore automatically when interaction ends.

### Task 3: Harness, Core, RAG/Context, and execution motion

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing tests for independent Harness layers, etched Core rotation layer, semantic RAG/Context themes, and execution signal**

```jsx
expect(container.querySelector(".harness-motion-main")).toBeInTheDocument();
expect(container.querySelector(".harness-motion-vertical")).toBeInTheDocument();
expect(container.querySelector(".harness-motion-context")).toBeInTheDocument();
expect(container.querySelector(".task-core-etched-layer")).toBeInTheDocument();
expect(container.querySelector(".execution-signal animateMotion")).toHaveAttribute("dur", "9.6s");
```

- [ ] **Step 2: Run Vitest and confirm RED**

Expected: independent motion wrappers and the signal do not exist.

- [ ] **Step 3: Implement the motion layers without moving semantic geometry**

Keep all stage groups and main paths outside the animated Harness wrappers. Animate the outer ring around ±3°/20s, vertical gyro around 30s, Context ring around ±12°/27s, Core float around 4.8s, and etched ring around 9s.

- [ ] **Step 4: Add the 9.6s SVG execution signal**

Build one continuous route from `runtimeSegments`; render the signal behind node groups; hold at Verify for the final 12% of the cycle before restarting.

- [ ] **Step 5: Apply Uranus and Neptune semantics**

RAG uses the ice-cyan Uranus gradient. The RAG-to-Context edge transitions from cyan to Neptune blue; Context-to-Plan and the Context point use Neptune blue. Output remains unchanged.

### Task 4: Reduced motion and visual verification

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/styles.css`
- Modify: `design-qa.md`

- [ ] **Step 1: Add a source-level assertion for the reduced-motion selectors**

Assert that `.harness-motion-main`, `.harness-motion-vertical`, `.harness-motion-context`, `.runtime-task-core-float`, `.task-core-etched-layer`, `.planet-texture-spin`, and `.execution-signal` are disabled or hidden under `prefers-reduced-motion: reduce`.

- [ ] **Step 2: Run all tests and production build**

Expected: complete Vitest suite passes; Vite exits 0; `git diff --check` reports no errors.

- [ ] **Step 3: Verify Chrome interactions and responsive geometry**

Capture default, hover, and focus states. Check 1920, 1440, 1366, 1024, and 390 widths; compute node-center projection deltas from the SVG viewBox; verify no visible SVG text or halo is clipped and console logs are empty.

- [ ] **Step 4: Verify reduced-motion contract in Chrome**

Inspect the loaded stylesheet's `prefers-reduced-motion` rule in Chrome and confirm it targets every continuous-motion class while keeping planet surfaces and semantic labels rendered.

- [ ] **Step 5: Create side-by-side QA evidence**

Combine `artifacts/agent-map-solar-before-1440.png` with the final 1440 screenshot, inspect the combined image, and record the evidence and any acceptable deviations in `design-qa.md`.

- [ ] **Step 6: Preserve the shared worktree**

Do not stage, commit, merge, push, or clean the existing dirty worktree unless the user explicitly requests it.
