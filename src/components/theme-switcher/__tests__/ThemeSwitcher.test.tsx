/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
	CL_DARK_THEME_CLASS,
	CL_LIGHT_THEME_CLASS,
} from "chop-logic-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ThemeSwitcher from "../ThemeSwitcher";

describe("ThemeSwitcher", () => {
	let mockClassList: {
		contains: ReturnType<typeof vi.fn>;
		add: ReturnType<typeof vi.fn>;
		remove: ReturnType<typeof vi.fn>;
	};
	let mockLocalStorage: { [key: string]: string };

	beforeEach(() => {
		// Mock classList
		mockClassList = {
			contains: vi.fn((cls: string) => cls === CL_DARK_THEME_CLASS),
			add: vi.fn(),
			remove: vi.fn(),
		};

		Object.defineProperty(document.documentElement, "classList", {
			value: mockClassList,
			configurable: true,
		});

		// Mock localStorage
		mockLocalStorage = {};
		const localStorageMock = {
			getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
			setItem: vi.fn((key: string, value: string) => {
				mockLocalStorage[key] = value;
			}),
			removeItem: vi.fn((key: string) => {
				delete mockLocalStorage[key];
			}),
			clear: vi.fn(() => {
				mockLocalStorage = {};
			}),
		};
		Object.defineProperty(window, "localStorage", {
			value: localStorageMock,
			configurable: true,
		});
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("renders a switch component", () => {
		render(<ThemeSwitcher />);
		// The Switch component renders with cl-switch class
		const switchElement = document.querySelector(".cl-switch");
		expect(switchElement).toBeInTheDocument();
	});

	it("displays Dark Theme label", () => {
		render(<ThemeSwitcher />);
		expect(screen.getByText("Dark Theme")).toBeInTheDocument();
	});

	it("renders with cl-switch__input for interaction", () => {
		render(<ThemeSwitcher />);
		const input = document.querySelector(".cl-switch__input");
		expect(input).toBeInTheDocument();
	});

	it("applies custom className when provided", () => {
		render(<ThemeSwitcher className="custom-switcher" />);
		const switchContainer = document.querySelector(".custom-switcher");
		expect(switchContainer).toBeInTheDocument();
	});

	it("toggles theme classes on document when clicked", () => {
		mockClassList.contains.mockImplementation(
			(cls: string) => cls === CL_DARK_THEME_CLASS,
		);

		render(<ThemeSwitcher />);
		const switchInput = document.querySelector(".cl-switch__input");

		if (switchInput) {
			fireEvent.click(switchInput);
		}

		expect(mockClassList.remove).toHaveBeenCalledWith(
			CL_LIGHT_THEME_CLASS,
			CL_DARK_THEME_CLASS,
		);
		expect(mockClassList.add).toHaveBeenCalled();
	});

	it("persists theme preference to localStorage when toggled", () => {
		mockClassList.contains.mockImplementation(
			(cls: string) => cls === CL_DARK_THEME_CLASS,
		);

		render(<ThemeSwitcher />);
		const switchInput = document.querySelector(".cl-switch__input");

		if (switchInput) {
			fireEvent.click(switchInput);
		}

		// localStorage.setItem should be called - exact value depends on implementation
		expect(window.localStorage.setItem).toHaveBeenCalled();
	});

	it("renders track and thumb elements", () => {
		render(<ThemeSwitcher />);
		expect(document.querySelector(".cl-switch__track")).toBeInTheDocument();
		expect(document.querySelector(".cl-switch__thumb")).toBeInTheDocument();
	});

	it("renders label element", () => {
		render(<ThemeSwitcher />);
		expect(document.querySelector(".cl-switch__label")).toBeInTheDocument();
	});
});
