/**
 * Vitest global setup file
 * Mocks static asset imports (images) for testing
 * Extends matchers with @testing-library/jest-dom for DOM assertions
 */

import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock window.matchMedia for components that use media queries
// This is needed for chop-logic-components which use prefers-reduced-motion
// Only apply in browser-like environments (jsdom)
if (typeof window !== "undefined") {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		configurable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // deprecated
			removeListener: vi.fn(), // deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
}

// Mock all image asset imports
vi.mock("@assets/Chop-Logic-Logo-Horizontal-612x306-white-bg.png", () => ({
	default: {
		src: "/mock-fallback-image.png",
		width: 612,
		height: 306,
	},
}));

vi.mock("@assets/Chop-Logic-Logo-Head.svg", () => ({
	default: {
		src: "/mock-logo-head.svg",
		width: 100,
		height: 100,
	},
}));

vi.mock("@assets/Chop-Logic-Logo-Horizontal.svg", () => ({
	default: {
		src: "/mock-logo-horizontal.svg",
		width: 200,
		height: 100,
	},
}));
