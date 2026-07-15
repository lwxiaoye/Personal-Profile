import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { App } from "./App.jsx";

afterEach(cleanup);

describe("Liang Weiye Agent landing page", () => {
  it("presents the approved recruiter-facing identity", () => {
    render(<App />);

    expect(document.title).toBe("梁伟业｜Agent 应用开发");
    expect(screen.getByRole("heading", { level: 1, name: "梁伟业" })).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: "把 Agent 从 Demo 做到可交付产品" }),
    ).toBeVisible();
    expect(screen.getByText("AGENT APPLICATION ENGINEER")).toBeVisible();
    expect(screen.getByText("Agent 应用开发 · LangGraph · RAG · Harness Engineering")).toBeVisible();
    expect(screen.getByText(/构建可追踪、可恢复、可评测的 Agent 系统/)).toBeVisible();
  });

  it("starts with the specified Plan step active and synchronized", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Plan 生成或更新计划" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("synchronizes the hover insight with the agent star map", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.hover(screen.getByTestId("hero-title-zone"));

    expect(screen.getByRole("button", { name: "Plan 生成或更新计划" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("lets visitors lock an agent node by clicking it", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tools 调用外部能力" }));

    expect(screen.getByRole("button", { name: "Tools 调用外部能力" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(document.querySelector('[data-from="tools"]')).toHaveAttribute(
      "id",
      "active-runtime-signal-path",
    );
  });

  it("renders all runtime geometry in one accessible SVG coordinate system", () => {
    const { container } = render(<App />);

    const svg = screen.getByRole("img", { name: "Agent 执行循环：Intent、Plan、Decide、Tools、Observe、Verify，并连接 Output、RAG 与 Harness" });
    expect(svg).toHaveAttribute("viewBox", "0 0 1000 590");
    expect(container.querySelector(".agent-canvas")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".runtime-stage-node")).toHaveLength(6);
    expect(container.querySelectorAll(".runtime-segment")).toHaveLength(5);
  });

  it("maps the runtime stages and knowledge edges to the approved solar-system themes", () => {
    const { container } = render(<App />);

    expect(container.querySelectorAll(".planet-gradient")).toHaveLength(6);
    expect(container.querySelector('[data-node-id="intent"]')).toHaveAttribute("data-planet", "mercury");
    expect(container.querySelector('[data-node-id="plan"]')).toHaveAttribute("data-planet", "venus");
    expect(container.querySelector('[data-node-id="decide"]')).toHaveAttribute("data-planet", "earth");
    expect(container.querySelector('[data-node-id="tools"]')).toHaveAttribute("data-planet", "mars");
    expect(container.querySelector('[data-node-id="observe"]')).toHaveAttribute("data-planet", "jupiter");
    expect(container.querySelector('[data-node-id="verify"]')).toHaveAttribute("data-planet", "saturn");
    expect(container.querySelector("#uranus-gradient")).toBeInTheDocument();
    expect(container.querySelector("#neptune-gradient")).toBeInTheDocument();
  });

  it("provides planet materials on hover or focus without mutating the execution state", () => {
    const { container } = render(<App />);
    const tools = screen.getByRole("button", { name: "Tools 调用外部能力" });

    expect(container.querySelectorAll(".planet-surface")).toHaveLength(6);
    expect(container.querySelector('[data-node-id="observe"] .planet-bands')).toBeInTheDocument();
    expect(container.querySelector('[data-node-id="verify"] .saturn-ring')).toBeInTheDocument();

    fireEvent.mouseEnter(tools);
    expect(screen.getByRole("button", { name: "Plan 生成或更新计划" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(tools).toHaveAttribute("tabindex", "0");
  });

  it("shows the reached stage in its original planet material instead of black", () => {
    const { container } = render(<App />);
    const css = readFileSync("src/styles.css", "utf8");
    const activePlanetRule = css.slice(
      css.indexOf(".runtime-stage-node.is-active .planet-surface"),
      css.indexOf(".runtime-node-hit"),
    );

    expect(container.querySelector('[data-node-id="plan"]')).toHaveClass("is-active");
    expect(activePlanetRule).toContain("opacity: 1");
    expect(activePlanetRule).toContain("transition: none");
    expect(activePlanetRule).toContain(".runtime-stage-node.is-active .runtime-node-circle");
    expect(activePlanetRule).toContain("opacity: 0");
    expect(activePlanetRule).toContain(".runtime-stage-node.is-active .planet-texture-spin");
    expect(activePlanetRule).toContain("animation-play-state: running");
    expect(activePlanetRule).toContain("transform: scale(1.24)");
  });

  it("renders independent orbital motion layers and keeps the execution signal on the active red segment", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(container.querySelector(".harness-motion-main")).toBeInTheDocument();
    expect(container.querySelector(".harness-motion-vertical")).toBeInTheDocument();
    expect(container.querySelector(".harness-motion-context")).toBeInTheDocument();
    expect(container.querySelector(".task-core-etched-layer")).toBeInTheDocument();
    expect(container.querySelector(".rag-node-planet")).toHaveAttribute("fill", "url(#uranus-gradient)");
    expect(container.querySelector(".context-node-planet")).toHaveAttribute("fill", "url(#neptune-gradient)");
    expect(container.querySelector('[data-from="plan"]')).toHaveAttribute("id", "active-runtime-signal-path");
    expect(container.querySelector('.execution-signal animateMotion')).toHaveAttribute("dur", "2.4s");
    expect(container.querySelector('.execution-signal mpath')).toHaveAttribute("href", "#active-runtime-signal-path");

    await user.click(screen.getByRole("button", { name: "Tools 调用外部能力" }));

    expect(container.querySelector('[data-from="tools"]')).toHaveAttribute("id", "active-runtime-signal-path");
    expect(container.querySelector('[data-from="plan"]')).not.toHaveAttribute("id");
  });

  it("stops every continuous star-map motion under reduced-motion preferences", () => {
    const css = readFileSync("src/styles.css", "utf8");
    const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

    for (const selector of [
      ".harness-motion-main",
      ".harness-motion-vertical",
      ".harness-motion-context",
      ".runtime-task-core-float",
      ".task-core-etched-layer",
      ".planet-texture-spin",
      ".rag-node-motion",
      ".execution-signal",
    ]) {
      expect(reducedMotion).toContain(selector);
    }
  });

  it("uses the specification coordinates for both segment endpoints and node centers", () => {
    const { container } = render(<App />);
    const expected = {
      intent: [500, 120],
      plan: [730, 155],
      decide: [850, 275],
      tools: [700, 420],
      observe: [300, 420],
      verify: [150, 275],
    };

    for (const [id, [x, y]] of Object.entries(expected)) {
      const node = container.querySelector(`[data-node-id="${id}"]`);
      expect(node).toHaveAttribute("transform", `translate(${x} ${y})`);
      expect(node.querySelector("circle")).toHaveAttribute("cx", "0");
      expect(node.querySelector("circle")).toHaveAttribute("cy", "0");
    }

    for (const segment of container.querySelectorAll(".runtime-segment")) {
      const from = expected[segment.getAttribute("data-from")];
      const to = expected[segment.getAttribute("data-to")];
      expect(segment.getAttribute("d")).toMatch(new RegExp(`^M ${from[0]} ${from[1]}`));
      expect(segment.getAttribute("d")).toMatch(new RegExp(`${to[0]} ${to[1]}$`));
    }
  });

  it("renders output, retry, context and precision-core layers in the SVG", () => {
    const { container } = render(<App />);

    expect(container.querySelector('[data-branch="output"]')).toHaveAttribute("marker-end", "url(#arrow-dark)");
    expect(container.querySelector('[data-branch="retry"]')).toHaveClass("runtime-return-path");
    expect(container.querySelector('[data-context-edge="rag-context"]')).toHaveAttribute("marker-end", "url(#arrow-blue)");
    expect(container.querySelector('[data-context-edge="context-plan"]')).toHaveAttribute("marker-end", "url(#arrow-blue)");
    expect(container.querySelector(".task-core-halo")).toBeInTheDocument();
    expect(container.querySelector(".task-core-metal")).toBeInTheDocument();
    expect(container.querySelector(".task-core-ceramic")).toBeInTheDocument();
    expect(container.querySelector(".task-core-etched")).toBeInTheDocument();
    expect(container.querySelector(".task-core-status")).not.toBeInTheDocument();
  });

  it("states a delivery-focused working style in the hero transition", () => {
    render(<App />);

    expect(screen.getByText("把复杂问题拆成可执行路径，用工程确定性兑现可验证结果")).toBeInTheDocument();
  });

  it("renders the six-step agent loop with RAG outside the numbered sequence", () => {
    const { container } = render(<App />);
    const map = screen.getByLabelText("Agent 运行星图");

    expect(within(map).getByText("AGENT RUNTIME MAP")).toBeVisible();
    expect(within(map).getByText("EXECUTION LOOP")).toBeVisible();
    for (const label of [
      "Intent 目标与约束",
      "Plan 生成或更新计划",
      "Decide 决定下一步动作",
      "Tools 调用外部能力",
      "Observe 读取执行结果",
      "Verify 验证目标是否完成",
    ]) {
      expect(within(map).getByRole("button", { name: label })).toBeVisible();
    }
    expect(container.querySelectorAll(".runtime-stage-node .runtime-node-circle")).toHaveLength(6);
    expect(within(map).getByText("RAG / MEMORY")).toBeVisible();
    expect(within(map).getByText("知识与上下文")).toBeVisible();
    expect(within(map).getByText("OUTPUT")).toBeVisible();
    expect(within(map).getByText("结果交付")).toBeVisible();
    expect(within(map).getByText(/HARNESS · CONTEXT · STATE · PERMISSIONS · TOOL REGISTRY · TRACE · EVALUATION/)).toBeVisible();
  });

  it("exposes the three recruiter CTAs with correct link semantics", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /查看 Agent 项目/ })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: /下载 PDF 简历/ })).toHaveAttribute("download");
    expect(screen.getByRole("link", { name: /联系我/ })).toHaveAttribute("href", "#contact");
  });

  it("replaces ambiguous metrics with evidence-oriented capabilities", () => {
    render(<App />);

    expect(screen.getByText("意图路由")).toBeVisible();
    expect(screen.getByText("多场景任务分类")).toBeVisible();
    expect(screen.getByText("知识检索")).toBeVisible();
    expect(screen.getByText("混合检索与重排")).toBeVisible();
    expect(screen.getByText("工具编排")).toBeVisible();
    expect(screen.getByText("可追踪、可恢复、可评测")).toBeVisible();
  });

  it("uses engineering status labels instead of fake live-task state", () => {
    render(<App />);
    const map = screen.getByLabelText("Agent 运行星图");

    expect(within(map).getByText("STATEFUL EXECUTION")).toBeVisible();
    expect(within(map).getByText("LIVE TRACE")).toBeVisible();
    expect(within(map).getByText("EVALUATION")).toBeVisible();
    expect(within(map).queryByText("任务执行中")).not.toBeInTheDocument();
  });

  it("expands project details inline", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));

    expect(screen.getByText("简历助手与 AI 面试官的完整 Agentic Loop")).toBeVisible();
    expect(screen.getByRole("link", { name: "查看 CareerForge-AI 源码" })).toBeVisible();
  });

  it("shows concrete responsibility and team contribution in project details", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));

    expect(screen.getByText(/我负责 AI 面试官核心模块/)).toBeVisible();
    expect(screen.getByText(/能独立接住一条 AI 功能链路/)).toBeVisible();
    expect(screen.getByText(/6 维评分/)).toBeVisible();

    await user.click(screen.getByRole("button", { name: "展开 多智能体客服 项目详情" }));
    expect(screen.getByText(/我负责 AI 面试官核心模块/)).not.toBeVisible();
    expect(screen.getByText(/约 70% 提升到约 95%/)).toBeVisible();
  });

  describe("routes project experience and source actions to their configured destinations", () => {
    it("routes CareerForge experience internally and source externally", async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));

      const experience = screen.getByRole("link", { name: "前往体验 CareerForge-AI" });
      expect(experience).toHaveAttribute("href", "/career/");
      expect(experience).not.toHaveAttribute("target");

      const source = screen.getByRole("link", { name: "查看 CareerForge-AI 源码" });
      expect(source).toHaveAttribute("href", "https://github.com/Dloading666/CareerForge-AI");
      expect(source).toHaveAttribute("target", "_blank");
      expect((source.getAttribute("rel") ?? "").split(/\s+/)).toContain("noreferrer");
    });

    it.each([
      {
        project: "多智能体客服",
        action: "前往体验",
        accessibleName: "前往体验 多智能体客服",
        href: "https://github.com/lwxiaoye/Agent-",
      },
      {
        project: "多智能体客服",
        action: "查看源码",
        accessibleName: "查看 多智能体客服 源码",
        href: "https://github.com/lwxiaoye/Agent-",
      },
      {
        project: "医疗 RAG",
        action: "前往体验",
        accessibleName: "前往体验 医疗 RAG",
        href: "https://github.com/lwxiaoye/medical-RAG-",
      },
      {
        project: "医疗 RAG",
        action: "查看源码",
        accessibleName: "查看 医疗 RAG 源码",
        href: "https://github.com/lwxiaoye/medical-RAG-",
      },
    ])("routes $project $action to its configured external destination", async (testCase) => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(
        screen.getByRole("button", { name: `展开 ${testCase.project} 项目详情` }),
      );

      const action = screen.getByRole("link", { name: testCase.accessibleName });
      expect(action).toHaveAttribute("href", testCase.href);
      expect(action).toHaveAttribute("target", "_blank");
      expect((action.getAttribute("rel") ?? "").split(/\s+/)).toContain("noreferrer");
    });
  });

  it("tracks the insight mask directly inside the left hero area", () => {
    render(<App />);
    const heroCopy = screen.getByTestId("hero-copy");
    const insightMask = screen.getByTestId("insight-mask");
    heroCopy.getBoundingClientRect = () => ({
      left: 100,
      top: 100,
      width: 600,
      height: 700,
      right: 700,
      bottom: 800,
    });

    expect(insightMask).toHaveAttribute("aria-hidden", "true");

    fireEvent.pointerMove(heroCopy, { clientX: 400, clientY: 450 });

    expect(insightMask).toHaveStyle({
      "--mask-x": "400px",
      "--mask-y": "450px",
    });
    expect(screen.queryByTestId("hero-custom-cursor")).not.toBeInTheDocument();
    expect(insightMask).toHaveAttribute("aria-hidden", "false");

    fireEvent.scroll(window);
    expect(insightMask).toHaveAttribute("aria-hidden", "true");

    fireEvent.pointerMove(window, { clientX: 1000, clientY: 450 });
    expect(insightMask).toHaveAttribute("aria-hidden", "true");

    fireEvent.pointerMove(heroCopy, { clientX: 400, clientY: 450 });
    fireEvent.pointerLeave(heroCopy);
    expect(insightMask).toHaveAttribute("aria-hidden", "true");
  });

  it("presents four evidence-led delivery capabilities", () => {
    render(<App />);
    const skills = screen.getByRole("heading", { level: 2, name: "技术能力" }).closest("section");

    expect(within(skills).getAllByRole("button", { name: /能力详情/ })).toHaveLength(4);
    expect(
      within(skills).getByText(
        "我擅长的不只是接入模型，而是把 Agent 链路做到可编排、可评估、可恢复、可交付。",
      ),
    ).toBeVisible();
    expect(
      within(skills).getByRole("button", { name: "收起 Agent 工作流与路由 能力详情" }),
    ).toHaveAttribute("aria-expanded", "true");

    for (const title of [
      "Agent 工作流与路由",
      "RAG 检索与评估",
      "受控工具执行与异常恢复",
      "Agent 应用全栈交付",
    ]) {
      expect(within(skills).getByText(title)).toBeVisible();
    }

    expect(
      within(skills).queryByText(/MCP|GraphRAG|Neo4j|Prompt Injection Defense|毫秒级首字反馈/),
    ).not.toBeInTheDocument();
  });

  it("opens the matching project from capability evidence", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "查看项目：多智能体客服" }));
    expect(
      screen.getByRole("button", { name: "收起 多智能体客服 项目详情" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(scrollIntoView).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "查看 Agent 应用全栈交付 能力详情" }));
    expect(screen.getByRole("button", { name: "查看项目：CareerForge-AI" })).toBeVisible();
    expect(screen.getByRole("button", { name: "查看项目：多智能体客服" })).toBeVisible();
  });

  it("keeps capability evidence readable across breakpoints", () => {
    const { container } = render(<App />);
    const css = readFileSync("src/styles.css", "utf8");

    expect(container.querySelectorAll(".capability-summary")).toHaveLength(4);
    expect(container.querySelectorAll(".capability-stack")).toHaveLength(4);
    expect(container.querySelector(".capability-project-link")).toBeInTheDocument();
    expect(css).toContain(".capability-summary {");
    expect(css).toContain(".capability-project-link {");
    expect(css).toContain("grid-row: 1 / 5;");
  });

  it("opens an accessible mobile navigation menu", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "打开导航" }));

    expect(screen.getByRole("navigation", { name: "移动导航" })).toBeVisible();
    expect(screen.getByRole("button", { name: "关闭导航" })).toHaveAttribute("aria-expanded", "true");
  });

  it("uses the canonical GitHub profile and clearer availability copy", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/lwxiaoye",
    );
    expect(screen.getByText("2027 届 · 重庆 · 可实习 / 可合作")).toBeVisible();
  });

  it("downloads the bundled resume without opening a fragile preview tab", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /下载 PDF 简历/ })).toHaveAttribute(
      "href",
      "/梁伟业简历_Agent开发.pdf",
    );
    expect(screen.getByRole("link", { name: /下载 PDF 简历/ })).toHaveAttribute(
      "download",
      "梁伟业简历_Agent开发.pdf",
    );
    expect(screen.getByRole("link", { name: /下载 PDF 简历/ })).not.toHaveAttribute("target");
  });

  it("shows the two confirmed school-enterprise projects and internship availability", () => {
    render(<App />);

    const experience = screen.getByRole("heading", { level: 2, name: "经历" }).closest("section");
    expect(within(experience).getByText("青竹数智科技校企合作基地")).toBeVisible();
    expect(within(experience).getByRole("heading", { name: "CareerForge-AI" })).toBeVisible();
    expect(within(experience).getByText("2026.05.01 — 2026.06.04")).toBeVisible();
    expect(within(experience).getByRole("heading", { name: "多智能体客服" })).toBeVisible();
    expect(within(experience).getByText("2026.02.15 — 2026.04.29")).toBeVisible();
    expect(within(experience).getByText("每周可出勤 5 天")).toBeVisible();
    expect(within(experience).getByText("可实习 6 个月以上")).toBeVisible();
    expect(within(experience).getByText("一周内到岗")).toBeVisible();
  });

  it("keeps the cursor insight mask empty, inverse, and smaller than the previous version", () => {
    render(<App />);
    const insightMask = screen.getByTestId("insight-mask");
    const css = readFileSync("src/styles.css", "utf8");

    expect(insightMask).toBeEmptyDOMElement();
    expect(insightMask).not.toHaveAttribute("aria-live");
    expect(css).toContain("--mask-size: clamp(180px, 16vw, 240px)");
    expect(css).toContain("--mask-size: 210px");
    expect(css).not.toContain("--mask-size: 280px");
    expect(css).toContain("backdrop-filter: invert(1)");
    expect(css).toContain("-webkit-backdrop-filter: invert(1)");
    const maskRule = css.slice(css.indexOf(".insight-mask {"), css.indexOf(".insight-mask[aria-hidden"));
    expect(maskRule).toContain("transition: none");
    expect(css).not.toContain(".hero-custom-cursor");
    expect(css).not.toContain(".hero-cursor-ring");
    expect(css).not.toContain(".hero-cursor-dot");
  });

  it("reveals lower modules once as they enter the viewport", () => {
    const observed = [];
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    window.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe(element) {
        observed.push({ element, callback: this.callback });
      }
      unobserve = unobserve;
      disconnect = disconnect;
    };

    render(<App />);

    expect(observed).toHaveLength(5);
    expect(observed.map(({ element }) => element.id)).toEqual([
      "projects",
      "about",
      "skills",
      "experience",
      "contact",
    ]);
    observed[0].callback([{ target: observed[0].element, isIntersecting: true }]);
    expect(observed[0].element).toHaveClass("is-visible");
    expect(unobserve).toHaveBeenCalledWith(observed[0].element);

    cleanup();
    expect(disconnect).toHaveBeenCalled();
    delete window.IntersectionObserver;
  });

  it("keeps lower modules visible when IntersectionObserver is unavailable", () => {
    delete window.IntersectionObserver;
    render(<App />);

    for (const element of document.querySelectorAll(".section, .contact")) {
      expect(element).toHaveClass("scroll-reveal", "is-visible");
    }

    const css = readFileSync("src/styles.css", "utf8");
    const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reducedMotion).toContain(".scroll-reveal");
    expect(reducedMotion).toContain("transform: none");
    expect(reducedMotion).toContain("transition: none !important");
  });

  it("keeps both contact action rows full-width and border-symmetric", () => {
    render(<App />);
    const css = readFileSync("src/styles.css", "utf8");
    const actionRule = css.slice(
      css.indexOf(".contact-actions a,"),
      css.indexOf(".contact-actions a:hover"),
    );

    expect(screen.getByRole("button", { name: /lwxiaoye@163.com/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
    expect(actionRule).toContain("width: 100%");
    expect(actionRule).toContain("border: 0");
    expect(actionRule).toContain("border-bottom: 1px solid");
  });

  it("copies the email address and confirms success without navigating", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<App />);

    expect(screen.queryByRole("link", { name: /邮箱/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "复制邮箱 lwxiaoye@163.com" }));

    expect(writeText).toHaveBeenCalledWith("lwxiaoye@163.com");
    expect(screen.getByRole("button", { name: "邮箱已复制" })).toHaveTextContent("复制成功");
  });
});
