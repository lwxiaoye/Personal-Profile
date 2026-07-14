# Design QA

- Source visual truth: `reference.png`
- Desktop implementation screenshot: `qa-desktop-final-aligned.png`
- Mobile implementation screenshot: `qa-mobile-final.png`
- Side-by-side comparison: `qa-side-by-side-final.png`
- Desktop viewport: 1536 x 1024
- Mobile viewport: 390 x 844
- Compared state: title insight mask visible, Plan node active, Agent animation running

## Full-View Comparison Evidence

The final side-by-side comparison preserves the selected concept's two-column editorial composition, warm-white surface, oversized name, black insight circle, compact orbital Agent visualization, restrained metric row, and bottom transition band. The implementation intentionally gives the diagram slightly more breathing room so its real clickable node labels remain legible.

## Focused Region Evidence

The hero interaction region was checked in the source and implementation at matching desktop dimensions. The final difference-blend mask reverses the underlying name and headline inside the circle, while the active Plan state exposes the Agent loop microcopy. The orbital diagram uses a live Canvas layer with accessible HTML buttons positioned over the same five visual nodes.

## Required Fidelity Surfaces

- Fonts and typography: Noto Sans SC and IBM Plex Mono reproduce the modern Chinese sans-serif and technical annotation contrast. Display type, body copy, labels, and mobile wrapping were checked in-browser.
- Spacing and layout rhythm: the desktop grid, header inset, hero proportions, metric band, and next-section cue match the source hierarchy. Mobile collapses cleanly to one column without horizontal overflow.
- Colors and visual tokens: warm white, ink black, graphite, vermilion, cyan, green, and amber match the intended restrained palette. No gradients or purple accents remain.
- Image quality and asset fidelity: there are no raster placeholders. The primary visual is an actual animated Canvas system with live node states, not a static approximation.
- Copy and content: the hero, proof points, project names, technical stack, resume link, email, and GitHub links use Liang Weiye's supplied resume content.

## Comparison History

### Iteration 1

- P2: the black circle covered the source typography instead of reversing it.
- Fix: changed the circle to a difference-blend mask so intersecting black typography becomes light inside the circle.
- P2: the first viewport ended without the source's transition cue.
- Fix: added a full-width bottom transition band with fine rules, red signal dot, and the Agent lifecycle statement.
- Post-fix evidence: `qa-desktop-final-aligned.png` and `qa-side-by-side-final.png`.

### Iteration 2

- Feedback sources: the user's annotated hero, technical-capability, and contact screenshots.
- P1: the insight circle could visually cross from the left hero into the Agent map and pointer movement was softened by React state plus a CSS transition.
- Fix: clipped the circle to `.hero-copy`, moved pointer coordinates through `requestAnimationFrame` directly into CSS variables, and removed positional transition lag.
- P2: the capability section listed tools but did not demonstrate depth or outcomes.
- Fix: expanded it to five evidence-backed rows covering orchestration, retrieval, Harness constraints, reliability, and full-stack delivery. Each row exposes approach, methods, and a resume-grounded proof point.
- P2: the contact section was visually sparse and the GitHub URL was incorrect.
- Fix: rebuilt it as a full-width availability and contact split, added 2027 graduation/location/opportunity context, and corrected GitHub to `https://github.com/lwxiaoye`.
- P2: mobile navigation disappeared entirely.
- Fix: added an accessible menu button and mobile navigation panel.
- Post-fix evidence: `qa-v2-hero-comparison.png`, `qa-v2-skills-comparison.png`, `qa-v2-contact-comparison.png`, `qa-v2-mobile-menu.png`, `qa-v2-mobile-skills.png`, and `qa-v2-mobile-contact.png`.

### Iteration 3

- P2: the insight mask was visible before pointer interaction and could remain visible after an unusually fast jump into the right column.
- Fix: defaulted the mask to `aria-hidden=true`, show it only during left-column pointer movement, hide it on pointer leave, and added a window-level geometric boundary check for fast exits. Touch layouts do not render the mask.
- Post-fix browser evidence: initial state `true`, left-column hover `false`, right-column exit `true`; browser console remained empty.

## Primary Interactions Tested

- Star-map node click updates `aria-pressed`, the active path, task packet color, and insight content.
- Hero hover-zone behavior is covered by an interaction test and synchronizes the title zone with Plan.
- CareerForge-AI expands inline and exposes its description, stack, and source link.
- Navigation and primary project CTA use smooth in-page navigation.
- Resume CTA opens the supplied PDF.
- Mobile width check: viewport 390px, document scroll width 375px, no horizontal overflow.
- Pointer-follow check: moving to desktop coordinates `(220, 260)` immediately updated the mask to `23.94% / 19.40%`; no transition lag remained.
- Capability rows expose five unique accessible buttons and one expanded detail region at a time.
- Mobile navigation opens, closes, and routes to all five page sections.
- Canonical GitHub link resolves to `https://github.com/lwxiaoye`.
- Browser console: no warnings or errors.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up Polish

- P3: external web-font loading can fall back to the included system font stack on restricted networks; layout remains stable.

final result: passed
