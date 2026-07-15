# Hero Pointer Cleanup and Section Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the ring-dot cursor and scrolling black-circle bug, then reveal lower page modules with a restrained one-time fade-up transition.

**Architecture:** Keep the large inverse mask driven only by pointer events inside the desktop hero. Use one `IntersectionObserver` effect to decorate and reveal the existing page sections, with immediate visibility as the unsupported-browser and reduced-motion fallback.

**Tech Stack:** React 19, CSS, IntersectionObserver, Vitest, Testing Library, Vite, in-app Chromium browser.

---

### Task 1: Lock the corrected pointer behavior

**Files:**
- Modify: `src/App.test.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Replace the cursor and scroll-progress expectations with failing regressions**

```jsx
expect(screen.queryByTestId("hero-custom-cursor")).not.toBeInTheDocument();
expect(css).not.toContain(".hero-custom-cursor");

fireEvent.pointerMove(heroCopy, { clientX: 400, clientY: 450 });
expect(insightMask).toHaveAttribute("aria-hidden", "false");
fireEvent.scroll(window);
expect(insightMask).toHaveAttribute("aria-hidden", "true");
```

- [ ] **Step 2: Run the focused test and confirm it fails because the old cursor and scroll persistence still exist**

Run: `npm test -- --run src/App.test.jsx`

Expected: FAIL on the custom cursor query and/or scroll-hidden assertion.

### Task 2: Add section reveal behavior coverage

**Files:**
- Modify: `src/App.test.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Add a controllable IntersectionObserver test double**

```jsx
const observed = [];
const unobserve = vi.fn();
globalThis.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; }
  observe(element) { observed.push({ element, callback: this.callback }); }
  unobserve = unobserve;
  disconnect = vi.fn();
};
```

- [ ] **Step 2: Assert all five lower modules are observed and become visible once intersecting**

```jsx
render(<App />);
expect(observed).toHaveLength(5);
observed[0].callback([{ target: observed[0].element, isIntersecting: true }]);
expect(observed[0].element).toHaveClass("is-visible");
expect(unobserve).toHaveBeenCalledWith(observed[0].element);
```

- [ ] **Step 3: Assert the unsupported-browser fallback leaves modules visible**

```jsx
delete globalThis.IntersectionObserver;
render(<App />);
for (const element of document.querySelectorAll(".section, .contact")) {
  expect(element).toHaveClass("is-visible");
}
```

- [ ] **Step 4: Run the focused test and confirm it fails because reveal classes and observer wiring do not exist**

Run: `npm test -- --run src/App.test.jsx`

Expected: FAIL on missing `scroll-reveal`/`is-visible` behavior.

### Task 3: Remove the cursor and decouple the hero mask from scrolling

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Remove obsolete React state and DOM**

Remove `heroCursorRef`, `maskActivatedRef`, cursor coordinate writes, the `.hero-custom-cursor` JSX block, and the `--hero-scroll-progress` inline variable.

- [ ] **Step 2: Replace scroll progress with immediate mask hiding**

```jsx
useEffect(() => {
  const hideMaskOnScroll = () => setMaskVisible(false);
  window.addEventListener("scroll", hideMaskOnScroll, { passive: true });
  return () => window.removeEventListener("scroll", hideMaskOnScroll);
}, []);
```

- [ ] **Step 3: Remove cursor and scroll-transform CSS**

Keep `.insight-mask` fixed at the client pointer coordinates, but use only:

```css
transform: translate(-50%, -50%);
transition: opacity 140ms ease;
```

Delete `.hero-custom-cursor`, `.hero-cursor-ring`, `.hero-cursor-dot`, and all related responsive/reduced-motion selectors.

- [ ] **Step 4: Run the pointer regression tests**

Run: `npm test -- --run src/App.test.jsx`

Expected: pointer tests PASS.

### Task 4: Implement restrained one-time section reveals

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add the observer effect**

```jsx
useEffect(() => {
  const elements = [...document.querySelectorAll(".section, .contact")];
  elements.forEach((element) => element.classList.add("scroll-reveal"));

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return undefined;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8%" });

  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}, []);
```

- [ ] **Step 2: Add the restrained CSS transition**

```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 560ms ease, transform 620ms cubic-bezier(0.2, 0.72, 0.2, 1);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Add reduced-motion fallback**

```css
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .scroll-reveal.is-visible {
    opacity: 1;
    transform: none;
    transition: none !important;
  }
}
```

- [ ] **Step 4: Run the full test file**

Run: `npm test -- --run src/App.test.jsx`

Expected: all tests PASS.

### Task 5: Browser and build verification

**Files:**
- Modify: `design-qa.md`
- Create: `artifacts/hero-pointer-cleanup-1440.png`
- Create: `artifacts/section-reveal-1440.png`
- Create: `artifacts/section-reveal-390.png`

- [ ] **Step 1: Verify desktop pointer and scroll behavior**

At 1440 × 900, confirm the inverse circle appears only on hero hover, contains no ring-dot cursor, and is hidden immediately after scrolling.

- [ ] **Step 2: Verify section entry**

Scroll Projects, About, Skills, Experience, and Contact into view. Confirm each receives `is-visible`, animates once, and stays visible.

- [ ] **Step 3: Verify mobile and accessibility**

At 390 × 844, confirm no horizontal overflow and no pointer-only layer. Confirm the reduced-motion media rule makes reveal content static.

- [ ] **Step 4: Check browser logs**

Expected: no new warnings or errors.

- [ ] **Step 5: Run final verification**

Run: `npm test -- --run && npm run build && git diff --check`

Expected: zero test failures, successful Vite build, and clean diff check.

> Note: Do not create a commit from the current shared dirty worktree unless the user explicitly requests one.
