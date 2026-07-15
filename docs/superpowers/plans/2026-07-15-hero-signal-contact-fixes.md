# Hero Signal and Contact Alignment Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the cursor mask, execution signal synchronization, and contact action symmetry without altering unrelated page content.

**Architecture:** Keep the existing React/SVG/CSS structure. Derive the signal path from the same active segment data that controls the red path, make the mask decorative-only, and normalize the two contact action row boxes in CSS.

**Tech Stack:** React 19, SVG/SMIL, CSS, Vitest, Testing Library, Chrome.

---

### Task 1: Add regression coverage

**Files:**
- Modify: `src/App.test.jsx`

- [ ] Add a test asserting `insight-mask` has no text children and the stylesheet defines the smaller `180–240px` range.
- [ ] Add a test asserting the execution signal references the active segment path, uses `2.4s`, and remounts when the active stage changes.
- [ ] Add a test asserting the active node exposes its planet surface and hides the black fallback circle.
- [ ] Add tests asserting the active planet runs the same texture animation as hover, the mask uses inverse blending without child copy, the custom cursor contains a ring and dot, and scroll updates the mask progress variable.
- [ ] Add a test asserting both contact rows exist and the stylesheet applies `width: 100%` and `border: 0` before the shared bottom border.
- [ ] Run `npm test -- --run` and confirm the new assertions fail for the three reported defects.

### Task 2: Implement the minimal fixes

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] Remove the three insight-mask text elements and `aria-live`; keep the decorative element and pointer tracking.
- [ ] Change `--mask-size` to `clamp(180px, 16vw, 240px)` and remove obsolete mask text/padding rules.
- [ ] Compute `activeExecutionPath` from `runtimeSegments` or Verify-to-Output, render a keyed signal with a `2.4s` motion on that exact path, and remove the independent full-loop route.
- [ ] Reuse the hover/focus planet material state for `.runtime-stage-node.is-active`, keeping the stage index legible without a black node fill.
- [ ] Include `.is-active` in the existing planet scale and texture-spin selectors at desktop, tablet, and mobile breakpoints.
- [ ] Restore inverse blending on the empty mask, change it to fixed client coordinates, add the 30px ring/6px dot cursor, and update both from the existing requestAnimationFrame pointer loop.
- [ ] Add a passive scroll loop that writes a bounded hero progress variable so content scrolls beneath the fixed mask before the mask scales down and fades.
- [ ] Give both contact action elements `width: 100%`, reset the default border, and retain the shared bottom hairline.
- [ ] Run `npm test -- --run` and confirm all tests pass.

### Task 3: Browser and build verification

**Files:**
- Update: `design-qa.md`
- Create: `artifacts/hero-signal-contact-fixes-1440.png`
- Create: `artifacts/hero-signal-contact-fixes-contact-1440.png`
- Create: `artifacts/hero-signal-contact-fixes-390.png`

- [ ] In Chrome verify the empty smaller mask at 1440px.
- [ ] Observe at least two consecutive stages and confirm the dot remains on the red segment.
- [ ] Verify equal contact-row left/right bounds and capture the desktop contact screenshot.
- [ ] Verify 390px has no overflow or regression.
- [ ] Run `npm test -- --run`, the production Vite build, and `git diff --check`.
