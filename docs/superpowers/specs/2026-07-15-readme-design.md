# Personal Profile README Design

## Goal

Create a recruiter-first README for the public `lwxiaoye/Personal-Profile` repository. It should explain Liang Weiye's positioning and the portfolio's engineering value before presenting developer setup details.

## Audience

1. Recruiters and technical interviewers scanning the repository quickly.
2. Engineers who want to run, review, or extend the portfolio locally.

## Content order

1. Project title and one-sentence capability statement: turning Agent demos into deliverable products.
2. Short positioning paragraph covering Agent application development, LangGraph, RAG, and Harness Engineering.
3. Portfolio highlights:
   - recruiter-focused hero and proof points;
   - SVG Agent runtime map with the six-step execution loop;
   - RAG / Memory and Harness semantics;
   - responsive behavior, accessibility, reduced motion, and section reveals.
4. Runtime flow in plain text: Intent → Plan → Decide → Tools → Observe → Verify → Output, with retry to Plan.
5. Technical stack based strictly on `package.json` and current source.
6. Local setup, development, test, production build, and preview commands.
7. Compact repository structure containing only public runtime files.
8. Contact links for GitHub and email.

## Public screenshots

Create and publish three clean browser screenshots under `docs/images/`:

1. `portfolio-hero-desktop.png` — 1440px desktop hero showing the positioning and complete Agent runtime map, with no hover mask or annotation.
2. `portfolio-projects-desktop.png` — 1440px representative-project section showing CareerForge-AI, multi-agent customer service, and Medical RAG.
3. `portfolio-hero-mobile.png` — 390px mobile hero showing responsive positioning, CTAs, and proof points.

The README places the desktop hero first, then uses a two-column Markdown table for the projects and mobile screenshots. Do not publish debug captures, red-box annotations, hover-only states, or internal QA comparison images.

## Writing style

- Write the README in Chinese. Keep existing English engineering terms only where they improve precision, such as Agent, LangGraph, RAG, Harness Engineering, SVG, React, Vite, and Vitest.
- Concise and evidence-led; no inflated metrics or generic AI claims.
- No badges, decorative emoji, deployment claims, license claims, or unavailable live URLs.
- Do not mention Codex, internal design specifications, QA artifacts, or unpublished project routes.

## Publishing

- Add `README.md` to the local feature branch and create a local commit.
- Add the three approved screenshots to the clean public snapshot.
- Update the clean public `main` snapshot with a new commit whose parent is the existing remote `main` commit.
- Push over the verified SSH remote.
- Verify the remote branch SHA and confirm `README.md` is present in the remote tree.

## Acceptance criteria

- A recruiter can understand the positioning and portfolio purpose from the first two sections.
- Every command matches `package.json`.
- The README describes only functionality currently present in the repository.
- All three screenshots are newly captured, readable, unannotated, and referenced with relative repository paths.
- The public commit contains the README and approved screenshots without adding internal documents or QA artifacts.
