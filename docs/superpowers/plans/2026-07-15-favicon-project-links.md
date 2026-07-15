# Agent Favicon and Project Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the browser icon with a legible Agent-orbit mark and expose working source and temporary experience links for the service and medical projects.

**Architecture:** Keep project destinations in `src/portfolio-data.js` as the single source of truth, and let `ProjectRow` derive whether a live destination is external before applying new-tab attributes. Use the user-selected square three-orbit master image, derive deterministic 32×32 and 16×16 PNG favicons, and declare both in `index.html`.

**Tech Stack:** React 19, Vite 6, Vitest, Testing Library, PNG favicon assets.

---

> **Implementation deviation / final selection:** The user-selected three-orbit attachment overrides the original favicon proposal. The selected asset and its 32×32 and 16×16 reductions were committed in `8143378e07cf545ca77841e5c4890c720bf10a50`. The canonical source for all reproduction and verification is now `public/agent-orbit-favicon-master.png`; no temporary attachment path is required.

### Task 1: Adopt and prepare the selected Agent-orbit favicon

**Files:**
- Final source: `public/agent-orbit-favicon-master.png`
- Generated: `public/favicon-32.png`
- Generated: `public/favicon-16.png`

- [x] **Step 1: Adopt the user-selected master icon**

Use `public/agent-orbit-favicon-master.png`, the repository copy of the image explicitly selected by the user, as the source of truth. It retains the warm-white background, centered black precision core, three black orbital paths, exactly one small circular warm-red `#e54e37` signal, and no text. Do not regenerate it or replace unrelated assets, and preserve a silhouette that remains recognizable at 16×16 pixels.

- [x] **Step 2: Derive browser-sized files**

Use the bundled Python runtime and Pillow with LANCZOS resampling to produce exact 32×32 and 16×16 RGBA PNGs from the square master:

```powershell
@'
from pathlib import Path
from PIL import Image

public = Path("public")
source = Image.open(public / "agent-orbit-favicon-master.png").convert("RGBA")
side = min(source.size)
left = (source.width - side) // 2
top = (source.height - side) // 2
square = source.crop((left, top, left + side, top + side))
for size in (32, 16):
    square.resize((size, size), Image.Resampling.LANCZOS).save(public / f"favicon-{size}.png")
'@ | & 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -
```

Expected: `favicon-32.png` is 32×32 and `favicon-16.png` is 16×16.

- [x] **Step 3: Visually inspect all three assets**

Open the master and both reductions. Confirm the icon matches the user-selected three-orbit source: one `#e54e37` warm-red signal, a centered black core, three readable black orbit lines, and no unintended text or extra decoration. Confirm the 16×16 reduction remains legible.

- [x] **Step 4: Commit the icon assets**

```powershell
git show --stat --oneline 8143378e07cf545ca77841e5c4890c720bf10a50 -- public/agent-orbit-favicon-master.png public/favicon-32.png public/favicon-16.png
```

### Task 2: Declare the new favicons

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add explicit favicon declarations**

Add these entries after the viewport meta element:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
```

- [ ] **Step 2: Run a production build**

```powershell
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/vite/bin/vite.js build
```

Expected: Vite exits with code 0 and both favicon files appear in `dist`.

- [ ] **Step 3: Commit the favicon declaration**

```powershell
git add index.html
git commit -m "feat: use Agent orbit browser icon"
```

### Task 3: Specify project-link behavior with failing tests

**Files:**
- Modify: `src/App.test.jsx`

- [ ] **Step 1: Replace the deployed-only test with destination assertions**

Test CareerForge as an internal current-tab destination, then assert both actions for service and medical use their GitHub repository and open a new tab:

```jsx
it("routes project experience and source actions to their configured destinations", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));
  expect(screen.getByRole("link", { name: "前往体验 CareerForge-AI" })).toHaveAttribute("href", "/career/");
  expect(screen.getByRole("link", { name: "前往体验 CareerForge-AI" })).not.toHaveAttribute("target");

  await user.click(screen.getByRole("button", { name: "展开 多智能体客服 项目详情" }));
  for (const name of ["前往体验 多智能体客服", "查看 多智能体客服 源码"]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", "https://github.com/lwxiaoye/Agent-");
    expect(screen.getByRole("link", { name })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name })).toHaveAttribute("rel", "noreferrer");
  }

  await user.click(screen.getByRole("button", { name: "展开 医疗 RAG 项目详情" }));
  for (const name of ["前往体验 医疗 RAG", "查看 医疗 RAG 源码"]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", "https://github.com/lwxiaoye/medical-RAG-");
    expect(screen.getByRole("link", { name })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name })).toHaveAttribute("rel", "noreferrer");
  }
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

```powershell
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/vitest/vitest.mjs run src/App.test.jsx -t "routes project experience"
```

Expected: FAIL because service and medical do not yet render experience/source links.

- [ ] **Step 3: Commit the failing test**

```powershell
git add src/App.test.jsx
git commit -m "test: specify portfolio project destinations"
```

### Task 4: Implement external project destinations

**Files:**
- Modify: `src/portfolio-data.js`
- Modify: `src/App.jsx`

- [ ] **Step 1: Configure the service and medical destinations**

Set both fields for each undeployed project:

```js
// service
livePath: "https://github.com/lwxiaoye/Agent-",
sourceHref: "https://github.com/lwxiaoye/Agent-",

// medical
livePath: "https://github.com/lwxiaoye/medical-RAG-",
sourceHref: "https://github.com/lwxiaoye/medical-RAG-",
```

- [ ] **Step 2: Apply external-link attributes to live destinations**

Inside `ProjectRow`, derive external status and conditionally spread the safe new-tab attributes:

```jsx
const liveIsExternal = /^https?:\/\//.test(project.livePath ?? "");

<a
  href={project.livePath}
  {...(liveIsExternal ? { target: "_blank", rel: "noreferrer" } : {})}
  aria-label={`前往体验 ${project.title}`}
>
  前往体验 <ArrowUpRight weight="bold" />
</a>
```

- [ ] **Step 3: Run the focused test to verify it passes**

```powershell
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/vitest/vitest.mjs run src/App.test.jsx -t "routes project experience"
```

Expected: one passing test and no failures.

- [ ] **Step 4: Run the complete test suite**

```powershell
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/vitest/vitest.mjs run
```

Expected: all tests pass.

- [ ] **Step 5: Commit the implementation**

```powershell
git add src/portfolio-data.js src/App.jsx
git commit -m "feat: add service and medical project links"
```

### Task 5: Verify the production experience

**Files:**
- Verify: `dist/index.html`
- Verify: `dist/favicon-32.png`
- Verify: `dist/favicon-16.png`

- [ ] **Step 1: Build from a clean production output**

```powershell
Remove-Item -Recurse -Force -LiteralPath (Resolve-Path dist)
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/vite/bin/vite.js build
```

Expected: build exits with code 0 and recreates `dist` inside the worktree.

- [ ] **Step 2: Run the local preview**

```powershell
& 'C:\Users\31898\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/vite/bin/vite.js preview --host 127.0.0.1
```

Expected: preview serves the built site locally.

- [ ] **Step 3: Verify in the browser**

Open the preview and confirm:

- The browser tab uses the new Agent-orbit favicon.
- CareerForge “前往体验” remains `/career/`.
- Service shows both actions and both point to `https://github.com/lwxiaoye/Agent-`.
- Medical shows both actions and both point to `https://github.com/lwxiaoye/medical-RAG-`.
- The expanded cards remain aligned at desktop and 390px mobile widths.

- [ ] **Step 4: Check the final diff**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors and no unexplained files.

### Task 6: Deploy, smoke-test, and publish the branch

**Files:**
- Deploy: local `dist/` to server landing-page document root
- Publish: branch `codex/path-deployment`

- [ ] **Step 1: Back up and atomically replace the landing build**

Copy `dist` to a timestamped server staging directory, back up the current landing document root, then rename the staging directory into `/opt/1panel/www/sites/lwxiaoye.top/index` without modifying `/career/` services.

- [ ] **Step 2: Smoke-test public endpoints**

Verify:

```text
https://lwxiaoye.top/                  -> 200
https://lwxiaoye.top/favicon-32.png    -> 200 image/png
https://lwxiaoye.top/favicon-16.png    -> 200 image/png
https://lwxiaoye.top/career/           -> 200
```

Expected: landing and favicon assets are public while CareerForge remains healthy.

- [ ] **Step 3: Confirm GitHub CLI authentication**

```powershell
gh auth status
```

Expected: authenticated to `github.com` with permission to push the repository.

- [ ] **Step 4: Push and create the draft Pull Request**

```powershell
git push -u origin codex/path-deployment
gh pr create --draft --base feat/landing-redesign --head codex/path-deployment --title "feat: add path deployment links and Agent favicon" --body-file docs/superpowers/specs/2026-07-15-favicon-project-links-design.md
```

Expected: branch push succeeds and GitHub returns the new Pull Request URL.
