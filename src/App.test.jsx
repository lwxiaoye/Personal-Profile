import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App.jsx";

afterEach(cleanup);

describe("Liang Weiye Agent landing page", () => {
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

  it("expands project details inline", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));

    expect(screen.getByText("简历助手与 AI 面试官的完整 Agentic Loop")).toBeVisible();
    expect(screen.getByRole("link", { name: "查看 CareerForge-AI 源码" })).toBeVisible();
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
});
