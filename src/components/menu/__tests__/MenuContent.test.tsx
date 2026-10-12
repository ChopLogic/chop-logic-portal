/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MenuContent } from "../MenuContent";

describe("MenuContent", () => {
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

	it("renders Menu component with navigation items", () => {
		render(<MenuContent />);

		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Blog")).toBeInTheDocument();
		expect(screen.getByText("About")).toBeInTheDocument();
		expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
	});

	it("renders Home link pointing to root", () => {
		render(<MenuContent />);
		const homeLink = screen.getByText("Home").closest("a");
		expect(homeLink).toHaveAttribute("href", "/");
	});

	it("renders Blog link pointing to /blog", () => {
		render(<MenuContent />);
		const blogLink = screen.getByText("Blog").closest("a");
		expect(blogLink).toHaveAttribute("href", "/blog");
	});

	it("renders About link pointing to /about", () => {
		render(<MenuContent />);
		const aboutLink = screen.getByText("About").closest("a");
		expect(aboutLink).toHaveAttribute("href", "/about");
	});

	it("renders Privacy Policy link pointing to /privacy-policy", () => {
		render(<MenuContent />);
		const privacyLink = screen.getByText("Privacy Policy").closest("a");
		expect(privacyLink).toHaveAttribute("href", "/privacy-policy");
	});

	it("renders ThemeSwitcher component", () => {
		render(<MenuContent />);
		expect(screen.getByText("Dark Theme")).toBeInTheDocument();
	});

	it("applies menu__links class to Menu component", () => {
		render(<MenuContent />);
		const menuContainer = document.querySelector(".menu__links");
		expect(menuContainer).toBeInTheDocument();
	});

	it("applies menu__settings class to settings container", () => {
		render(<MenuContent />);
		const settingsContainer = document.querySelector(".menu__settings");
		expect(settingsContainer).toBeInTheDocument();
	});

	it("applies menu__item class to ThemeSwitcher", () => {
		render(<MenuContent />);
		const themeItem = document.querySelector(".menu__item");
		expect(themeItem).toBeInTheDocument();
	});

	it("all navigation links have _self target", () => {
		render(<MenuContent />);

		const links = [
			screen.getByText("Home").closest("a"),
			screen.getByText("Blog").closest("a"),
			screen.getByText("About").closest("a"),
			screen.getByText("Privacy Policy").closest("a"),
		];

		for (const link of links) {
			expect(link).toHaveAttribute("target", "_self");
		}
	});
});
