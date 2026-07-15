import "@testing-library/jest-dom/vitest";

Element.prototype.scrollIntoView = () => {};
HTMLCanvasElement.prototype.getContext = () => null;
globalThis.requestAnimationFrame = (callback) => callback();
globalThis.cancelAnimationFrame = () => {};
