/**
 * Vitest global setup file
 * Mocks static asset imports (images) for testing
 */

import { vi } from "vitest";

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
