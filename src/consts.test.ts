import { describe, expect, it } from "vitest";
import { SITE_DESCRIPTION, SITE_TITLE } from "./consts";

describe("consts", () => {
	it("exports site title and description", () => {
		expect(SITE_TITLE).toBe("Astro Blog");
		expect(SITE_DESCRIPTION).toBe("Welcome to my website!");
	});
});
