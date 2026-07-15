# Design QA — Hero pointer cleanup and section reveal

## Evidence

- User bug reference: `C:\Users\31898\AppData\Local\Temp\codex-clipboard-d980149f-deb0-4aee-9265-c5fade277157.png`
- Unwanted cursor reference: `C:\Users\31898\AppData\Local\Temp\codex-clipboard-d701065b-4c9b-4352-8b82-230a8f56b4c8.png`
- Corrected desktop hero: `artifacts/hero-pointer-cleanup-1440.png`
- Desktop section entry: `artifacts/section-reveal-1440.png`
- Mobile default state: `artifacts/section-reveal-390.png`
- Viewports: 1440 × 900 desktop; 390 × 844 mobile
- States: hero pointer hover, immediate post-scroll, Projects reveal, mobile top

## Findings

- No remaining P0/P1/P2 issue in the requested scope.
- The ring-dot cursor is absent from DOM and CSS; the browser pointer remains standard.
- The inverse circle is visible only during desktop hero hover and becomes `visibility: hidden; opacity: 0` on the first scroll event.
- Projects, About, Skills, Experience, and Contact share one restrained 24px fade-up reveal and remain visible after intersection.
- Typography, warm-white/ink/red/green tokens, editorial spacing, star-map assets, and page copy are unchanged.
- The 390px layout has no horizontal overflow and both pointer-only layers are disabled.
- The reduced-motion stylesheet makes reveal sections static and removes transition/translation.
- Browser console inspection returned no warning or error.

## Comparison history

1. P1 — The previous scroll-progress effect intentionally re-opened the inverse circle while scrolling.
   - Root cause: `maskActivatedRef` and the scroll-progress effect set `aria-hidden="false"` after the pointer had activated the mask.
   - Fix: removed scroll progress and replaced it with an immediate hide-only scroll listener.
2. P1 — The hidden `backdrop-filter` layer could remain visible during the mask opacity transition.
   - Root cause: the 140ms mask transition retained the compositor layer after scrolling began.
   - Fix: removed the mask transition so the inversion layer closes immediately.
3. P2 — Lower modules had no independent entry behavior after removing the hero scroll effect.
   - Fix: added a one-time `IntersectionObserver` reveal with unsupported-browser and reduced-motion fallbacks.

## Primary interactions tested

- Hero pointer enter/move/leave.
- First scroll event after hero hover.
- Scroll cue navigation into Projects and one-time reveal completion.
- Mobile top state and horizontal overflow.
- Reduced-motion CSS rule presence.

## Residual test gap

- The browser host reports `prefers-reduced-motion: reduce` as false. The loaded media rule and automated regression are verified; the operating-system preference was not toggled.

final result: passed
