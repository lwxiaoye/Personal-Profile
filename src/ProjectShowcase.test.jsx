import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { App } from "./App.jsx";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

it("opens each internship showcase in its own destination without exposing an internal service URL", () => {
  render(<App />);
  for (const [title, slug] of [["独小漾服装 AI 工作台", "duxy-agent"], ["独小漾能力中枢", "duxy-hub"]]) {
    const toggle = screen.getByRole("button", { name: new RegExp(`${title} 项目详情`) });
    if (toggle.getAttribute("aria-expanded") !== "true") fireEvent.click(toggle);
    const link = screen.getByRole("link", { name: `效果展示：${title}（新标签页）` });
    expect(link).toHaveAttribute("href", `/showcase/${slug}/`);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

it.each([
  ["/showcase/duxy-agent/", "从一句出图需求，到可追踪的生成任务。"],
  ["/showcase/duxy-hub", "让 Agent 调用有入口，执行有边界，结果有依据。"],
])("supports directly loading %s and returning to the portfolio", (path, heading) => {
  window.history.replaceState({}, "", path);
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  expect(screen.getByText("项目界面与工程案例 · 实际运行截图")).toBeVisible();
  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  expect(screen.getByRole("link", { name: /返回代表项目/ })).toHaveAttribute("href", "/#projects");
  expect(screen.getByRole("link", { name: /查看实习经历/ })).toHaveAttribute("href", "/#experience");
});

it.each([
  ["/showcase/duxy-agent/", "业务技能", "/showcase/real/agent-skills.png"],
  ["/showcase/duxy-hub/", "能力中央库", "/showcase/real/hub-catalog.png"],
])("switches screenshot and its explanation together at %s", (path, tab, image) => {
  window.history.replaceState({}, "", path);
  render(<App />);
  const button = screen.getByRole("button", { name: new RegExp(tab) });
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-pressed", "true");
  const original = screen.getByRole("link", { name: /查看原图：/ });
  expect(original).toHaveAttribute("href", image);
  expect(original).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.getByRole("heading", { name: "我负责的部分" })).toBeVisible();
  expect(screen.getByText(/贡献数包含 GitHub/)).toBeVisible();
});

it("renders the CareerForge case at the destination advertised by its project link", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));
  const destination = screen.getByRole("link", { name: "查看案例 CareerForge-AI" }).getAttribute("href");
  cleanup();
  window.history.replaceState({}, "", destination);
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: "让简历修改成为可执行、可撤销的操作。" })).toBeVisible();
  expect(screen.queryByRole("heading", { level: 1, name: "梁伟业" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "查看源码" })).toHaveAttribute("href", "https://github.com/lwxiaoye/CareerForge-AI");
  expect(screen.getByText("项目案例 · 核心实现说明")).toBeVisible();
});

it("keeps evaluation scope next to reported RAG results", () => {
  window.history.replaceState({}, "", "/showcase/duxy-hub/");
  render(<App />);
  expect(screen.getByText("93.3%（140/150）")).toBeVisible();
  expect(screen.getByText("82.2%（534/650）")).toBeVisible();
  expect(screen.getByText(/并非人工回答正确率/)).toBeVisible();
  expect(screen.getByText(/不能视为权限隔离验收通过/)).toBeVisible();
});

it("labels scenario checks and removes editorial screenshot notes", () => {
  window.history.replaceState({}, "", "/showcase/duxy-agent/");
  render(<App />);
  expect(screen.getByText("84.4%（38/45）")).toBeVisible();
  expect(screen.getByText(/未验收最终图片或分析质量/)).toBeVisible();
  expect(screen.queryByText(/直接使用本人提供的资产库截图/)).not.toBeInTheDocument();
});
