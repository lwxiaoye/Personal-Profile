# Recruiter Evidence Visual Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen recruiter-facing evidence, repair resume downloading, remove the distracting orbit marker, expand verified experience, and compact the contact section.

**Architecture:** Keep the existing single-page React structure and centralized portfolio data. Add semantic experience data and render it as a base header, two project cards, and an availability strip; keep the star map geometry but remove its pseudo-marker and use only the canvas stage signal.

**Tech Stack:** React, Vitest, Testing Library, Vite, CSS 3D, Canvas.

---

### Task 1: Lock content and download behavior with tests

**Files:**
- Modify: `src/App.test.jsx`

- [ ] Add a test that expects the resume link to use `/梁伟业简历_Agent开发.pdf` with the `download` attribute and no new-tab target.
- [ ] Add a test that expects 青竹数智科技、CareerForge-AI、多智能体客服、both date ranges, and all three availability facts.
- [ ] Add a test that expects recruiter-facing evidence in the insight mask.
- [ ] Run the focused test file and confirm the new assertions fail for missing behavior.

### Task 2: Implement recruiter evidence and experience structure

**Files:**
- Modify: `src/portfolio-data.js`
- Modify: `src/App.jsx`

- [ ] Replace generic insight copy with internship availability, engineering responsibilities, team delivery, and verified project evidence.
- [ ] Add centralized experience and availability data.
- [ ] Change the resume link to a same-origin direct download.
- [ ] Render a compact base heading, two dated project cards, education meta, and an availability strip.
- [ ] Run the focused tests and confirm they pass.

### Task 3: Refine the star map and section proportions

**Files:**
- Modify: `src/styles.css`

- [ ] Remove `.orbit-plane::after` so no perspective-flattened black marker is rendered.
- [ ] Preserve the colored canvas stage signal and three restrained orbit planes.
- [ ] Style the experience cards as a dense editorial grid with responsive stacking.
- [ ] Reduce contact height, padding, heading scale, action-row height, and mobile minimum heights.
- [ ] Run the full test suite.

### Task 4: Verify, preview, and commit

**Files:**
- Modify: `AGENTS.md`

- [ ] Record the approved durable design decisions.
- [ ] Run the full test suite and production build with the bundled Node runtime.
- [ ] Start the Vite preview on port 4173 and verify the PDF responds successfully.
- [ ] Inspect the git diff and commit the complete visual revision on `feat/landing-redesign`.
