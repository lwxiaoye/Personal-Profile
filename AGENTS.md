# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Validated Design Decisions

- The hero targets recruiters and technical interviewers first.
- Preserve the warm-white, black editorial layout from `reference.png`.
- Replace the tall workflow with a compact animated Agent star map using Intent, Plan, RAG, Tools, and Verify nodes.
- The left hero uses a cursor-following black insight mask. Its content changes by hover zone and synchronizes with the active star-map node.
- Navigation scrolls within one landing page. Project rows expand inline; no new project routes are required for this prototype.
- The insight mask must be clipped to the left hero column and track pointer movement without CSS lag.
- Technical skills should show methods and project evidence, not only tool-name lists.
- The canonical GitHub profile is `https://github.com/lwxiaoye`.
- The contact section should clearly communicate 2027 graduation, Chongqing location, internship availability, and collaboration interest.
- Use the main domain as a path-based portfolio hub: `lwxiaoye.top` for the personal landing page, with future project locations under `/career`, `/service`, and `/medical`. Final project targets will be supplied separately.
- Use the browser title `梁伟业｜Agent 应用开发`; keep the hero focused on the capability statement `把 Agent 做成真正能交付的产品`.
- On desktop, the fixed-height header plus hero must equal one viewport (`100svh`), so the next section is not visible at 100% zoom. Other primary sections should target one viewport in their default collapsed state. Mobile uses natural-height scrolling.
- Project details should lead with the business problem and personal responsibility, then show concrete implementation decisions, verified results, and the contribution Liang can make to a team. Avoid inflated or generic AI-style wording.
- Use the original 3D Agent star-map direction: three orbit planes rotate slowly on different axes, the task core floats subtly, stages activate in sequence, and the active trajectory synchronizes with the left insight mask. Preserve warm white, black hairlines, and one restrained stage color; provide reduced-motion and low-performance fallbacks.
