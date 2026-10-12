/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ScrollToTopButton from "../ScrollToTopButton";

describe("ScrollToTopButton", () => {
	const mockScrollTo = vi.fn();

	beforeEach(() => {
		// Mock window.scrollTo
		window.scrollTo = mockScrollTo;

		// Mock window.scrollY - start at 0
		Object.defineProperty(window, "scrollY", {
			value: 0,
			writable: true,
			configurable: true,
		});
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	function getButton() {
		// Button may be hidden, so use { hidden: true } to find it
		return screen.getByRole("button", { hidden: true });
	}

	it("renders a button element", () => {
		render(<ScrollToTopButton />);
		const button = getButton();
		expect(button).toBeInTheDocument();
	});

	it("is initially hidden when scroll position is 0", () => {
		render(<ScrollToTopButton />);
		const button = getButton();
		expect(button).toHaveStyle({ display: "none" });
	});

	it("becomes visible when scroll position exceeds 300px", () => {
		render(<ScrollToTopButton />);
		const button = getButton();

		// Simulate scroll beyond 300px
		Object.defineProperty(window, "scrollY", {
			value: 350,
			configurable: true,
		});
		fireEvent.scroll(window);

		expect(button).toHaveStyle({ display: "block" });
	});

	it("remains hidden when scroll position is exactly 300px", () => {
		render(<ScrollToTopButton />);
		const button = getButton();

		// Simulate scroll to exactly 300px
		Object.defineProperty(window, "scrollY", {
			value: 300,
			configurable: true,
		});
		fireEvent.scroll(window);

		expect(button).toHaveStyle({ display: "none" });
	});

	it("hides when scroll position goes back below 300px", () => {
		render(<ScrollToTopButton />);
		const button = getButton();

		// First scroll beyond 300px
		Object.defineProperty(window, "scrollY", {
			value: 500,
			configurable: true,
		});
		fireEvent.scroll(window);
		expect(button).toHaveStyle({ display: "block" });

		// Then scroll back below 300px
		Object.defineProperty(window, "scrollY", {
			value: 100,
			configurable: true,
		});
		fireEvent.scroll(window);
		expect(button).toHaveStyle({ display: "none" });
	});

	it("calls window.scrollTo with smooth behavior when clicked", () => {
		// Set scroll position above threshold
		Object.defineProperty(window, "scrollY", {
			value: 500,
			configurable: true,
		});

		render(<ScrollToTopButton />);
		fireEvent.scroll(window);

		const button = getButton();
		fireEvent.click(button);

		expect(mockScrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});

	it("applies custom className when provided", () => {
		render(<ScrollToTopButton className="custom-scroll-btn" />);
		const button = getButton();
		expect(button).toHaveClass("custom-scroll-btn");
	});

	it("removes scroll event listener on unmount", () => {
		const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

		const { unmount } = render(<ScrollToTopButton />);
		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"scroll",
			expect.any(Function),
		);

		removeEventListenerSpy.mockRestore();
	});

	it("adds scroll event listener on mount", () => {
		const addEventListenerSpy = vi.spyOn(window, "addEventListener");

		render(<ScrollToTopButton />);

		expect(addEventListenerSpy).toHaveBeenCalledWith(
			"scroll",
			expect.any(Function),
		);

		addEventListenerSpy.mockRestore();
	});

	it("handles rapid scroll changes", () => {
		render(<ScrollToTopButton />);
		const button = getButton();

		// Rapid scroll changes
		Object.defineProperty(window, "scrollY", {
			value: 400,
			configurable: true,
		});
		fireEvent.scroll(window);
		expect(button).toHaveStyle({ display: "block" });

		Object.defineProperty(window, "scrollY", {
			value: 200,
			configurable: true,
		});
		fireEvent.scroll(window);
		expect(button).toHaveStyle({ display: "none" });

		Object.defineProperty(window, "scrollY", {
			value: 600,
			configurable: true,
		});
		fireEvent.scroll(window);
		expect(button).toHaveStyle({ display: "block" });
	});

	it("handles very large scroll values", () => {
		render(<ScrollToTopButton />);
		const button = getButton();

		Object.defineProperty(window, "scrollY", {
			value: 10000,
			configurable: true,
		});
		fireEvent.scroll(window);

		expect(button).toHaveStyle({ display: "block" });
	});
});
