import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.jsx";

afterEach(cleanup);

describe("Liang Weiye Agent landing page", () => {
  it("presents the approved recruiter-facing identity", () => {
    render(<App />);

    expect(document.title).toBe("梁伟业｜Agent 应用开发");
    expect(screen.getByRole("heading", { level: 1, name: "梁伟业" })).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: "把 Agent 做成真正能交付的产品" }),
    ).toBeVisible();
  });

  it("starts with the identity insight and intent node active", () => {
    render(<App />);

    expect(screen.getByText("AGENT BUILDER")).toBeVisible();
    expect(screen.getByRole("button", { name: "Intent 意图识别" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("synchronizes the hover insight with the agent star map", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.hover(screen.getByTestId("hero-title-zone"));

    expect(screen.getByText("理解 → 规划 → 检索 → 执行 → 校验")).toBeVisible();
    expect(screen.getByRole("button", { name: "Plan 任务规划" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("lets visitors lock an agent node by clicking it", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tools 工具执行" }));

    expect(screen.getByRole("button", { name: "Tools 工具执行" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("TOOL CALL / EXECUTING")).toBeVisible();
  });

  it("renders three restrained 3D orbit planes around the agent core", () => {
    const { container } = render(<App />);

    expect(container.querySelectorAll(".orbit-plane")).toHaveLength(3);
    expect(screen.getByLabelText("Agent 运行星图")).toHaveAttribute(
      "data-orbit-signal-color",
      "#e54e37",
    );
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

  it("does not expose fake live links before deployment paths are supplied", async () => {
    const user = userEvent.setup();
    render(<App />);

    const trigger = screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" });
    await user.click(trigger);

    expect(within(trigger.closest("article")).getByText("部署地址待提供")).toBeVisible();
    expect(screen.queryByRole("link", { name: /在线体验 CareerForge-AI/ })).not.toBeInTheDocument();
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
      "--mask-x": "50%",
      "--mask-y": "50%",
    });
    expect(insightMask).toHaveAttribute("aria-hidden", "false");

    fireEvent.pointerMove(window, { clientX: 1000, clientY: 450 });
    expect(insightMask).toHaveAttribute("aria-hidden", "true");

    fireEvent.pointerMove(heroCopy, { clientX: 400, clientY: 450 });
    fireEvent.pointerLeave(heroCopy);
    expect(insightMask).toHaveAttribute("aria-hidden", "true");
  });

  it("provides five evidence-backed technical capability rows", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getAllByRole("button", { name: /查看.+能力详情/ })).toHaveLength(5);
    await user.click(screen.getByRole("button", { name: "查看 Agent 编排 能力详情" }));

    expect(screen.getByText("用显式状态图组织分类、路由、工具调用与结果回收")).toBeVisible();
    expect(screen.getByText("多智能体客服意图识别约 95%")).toBeVisible();
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

    expect(screen.getByRole("link", { name: /下载简历/ })).toHaveAttribute(
      "href",
      "/梁伟业简历_Agent开发.pdf",
    );
    expect(screen.getByRole("link", { name: /下载简历/ })).toHaveAttribute(
      "download",
      "梁伟业简历_Agent开发.pdf",
    );
    expect(screen.getByRole("link", { name: /下载简历/ })).not.toHaveAttribute("target");
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

  it("prioritizes recruiter evidence inside the synchronized insight mask", () => {
    render(<App />);

    expect(screen.getByText("每周 5 天 · 6 个月以上")).toBeVisible();
    expect(screen.getByText("一周内到岗 · 重庆")).toBeVisible();
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
