/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Menu from "../Menu";

// Mock chop-logic-components to avoid complex Dialog rendering
vi.mock("chop-logic-components", async () => {
	const actual = await vi.importActual("chop-logic-components");
	return {
		...actual,
		Dialog: ({
			isOpened,
			onClose,
			title,
			children,
			className,
			bodyClassName,
		}: {
			isOpened: boolean;
			onClose: () => void;
			title: string;
			children: React.ReactNode;
			className?: string;
			bodyClassName?: string;
		}) => {
			if (!isOpened) return null;
			return (
				<div
					data-testid="dialog"
					className={className}
					role="dialog"
					aria-label={title}
				>
					<div className={bodyClassName}>
						<h2>{title}</h2>
						{children}
						<button type="button" onClick={onClose} data-testid="close-dialog">
							Close
						</button>
					</div>
				</div>
			);
		},
	};
});

describe("Menu", () => {
	beforeEach(() => {
		// Mock classList for ThemeSwitcher
		const mockClassList = {
			contains: vi.fn(() => false),
			add: vi.fn(),
			remove: vi.fn(),
		};
		Object.defineProperty(document.documentElement, "classList", {
			value: mockClassList,
			configurable: true,
		});

		// Mock localStorage
		const mockLocalStorage = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
		};
		Object.defineProperty(window, "localStorage", {
			value: mockLocalStorage,
			configurable: true,
		});
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("renders a menu button", () => {
		render(<Menu />);
		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBeGreaterThan(0);
	});

	it("applies menu__button class to the button", () => {
		render(<Menu />);
		const menuButton = document.querySelector(".menu__button");
		expect(menuButton).toBeInTheDocument();
	});

	it("does not show dialog initially", () => {
		render(<Menu />);
		const dialog = screen.queryByRole("dialog");
		expect(dialog).not.toBeInTheDocument();
	});

	it("opens dialog when button is clicked", () => {
		render(<Menu />);
		const menuButton = document.querySelector(".menu__button");

		if (menuButton) {
			fireEvent.click(menuButton);
		}

		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
	});

	it("dialog has correct title", () => {
		render(<Menu />);
		const menuButton = document.querySelector(".menu__button");

		if (menuButton) {
			fireEvent.click(menuButton);
		}

		expect(screen.getByText("Menu")).toBeInTheDocument();
	});

	it("dialog has menu__dialog class", () => {
		render(<Menu />);
		const menuButton = document.querySelector(".menu__button");

		if (menuButton) {
			fireEvent.click(menuButton);
		}

		const dialog = screen.getByTestId("dialog");
		expect(dialog).toHaveClass("menu__dialog");
	});

	it("closes dialog when close action is triggered", () => {
		render(<Menu />);
		const menuButton = document.querySelector(".menu__button");

		// Open dialog
		if (menuButton) {
			fireEvent.click(menuButton);
		}
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		// Close dialog
		const closeButton = screen.getByTestId("close-dialog");
		fireEvent.click(closeButton);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("renders MenuContent inside the dialog", () => {
		render(<Menu />);
		const menuButton = document.querySelector(".menu__button");

		if (menuButton) {
			fireEvent.click(menuButton);
		}

		// MenuContent renders navigation items and ThemeSwitcher
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Blog")).toBeInTheDocument();
		expect(screen.getByText("About")).toBeInTheDocument();
	});
});
