import { LinkTarget, LinkType, ReferrerPolicy, SocialPlatform } from "@models";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mapLink, mapLinks } from "../link";
import {
	createInternalLinkResponse,
	createMockLinkResponse,
	createMockLinksArray,
	createSocialLinkResponse,
} from "./fixtures";

// Mock dependencies
vi.mock("../checkers", () => ({
	isRecord: vi.fn(
		(v) => typeof v === "object" && v !== null && !Array.isArray(v),
	),
}));

vi.mock("../normalizers", () => ({
	normalizeRequiredString: vi.fn((v, d) => {
		if (typeof v === "string") return String(v).trim();
		if (!d) throw new Error(`Value ${JSON.stringify(v)} is not a string`);
		return d;
	}),
}));

describe("mapLink", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("with valid link data", () => {
		it("maps complete link response", () => {
			const raw = createMockLinkResponse();
			const result = mapLink(raw);

			expect(result).not.toBeNull();
			expect(result?.id).toBe("link-123");
			expect(result?.text).toBe("Test Link");
			expect(result?.url).toBe("https://example.com");
		});

		it("maps internal link correctly", () => {
			const raw = createInternalLinkResponse();
			const result = mapLink(raw);

			expect(result?.type).toBe(LinkType.Internal);
			expect(result?.target).toBe(LinkTarget.Self);
		});
	});

	describe("with invalid inputs", () => {
		it("returns null for non-object input", () => {
			expect(mapLink("string")).toBeNull();
			expect(mapLink(123)).toBeNull();
			expect(mapLink(true)).toBeNull();
		});

		it("returns null for null input", () => {
			expect(mapLink(null)).toBeNull();
		});

		it("returns null for undefined input", () => {
			expect(mapLink(undefined)).toBeNull();
		});

		it("returns null for array input", () => {
			expect(mapLink([])).toBeNull();
			expect(mapLink([1, 2, 3])).toBeNull();
		});
	});

	describe("target normalization", () => {
		it.each([
			["_blank", LinkTarget.Blank],
			["_self", LinkTarget.Self],
			["self", LinkTarget.Self],
			["_parent", LinkTarget.Parent],
			["parent", LinkTarget.Parent],
			["_top", LinkTarget.Top],
			["top", LinkTarget.Top],
		])("normalizes target '%s' to %s", (input, expected) => {
			const raw = createMockLinkResponse({ target: input });
			const result = mapLink(raw);

			expect(result?.target).toBe(expected);
		});

		it("defaults to _blank for unknown target", () => {
			const raw = createMockLinkResponse({ target: "unknown" });
			const result = mapLink(raw);

			expect(result?.target).toBe(LinkTarget.Blank);
		});

		it("defaults to _blank for null target", () => {
			const raw = createMockLinkResponse({ target: null });
			const result = mapLink(raw);

			expect(result?.target).toBe(LinkTarget.Blank);
		});
	});

	describe("type normalization", () => {
		it("normalizes 'internal' to Internal", () => {
			const raw = createMockLinkResponse({ type: "internal" });
			const result = mapLink(raw);

			expect(result?.type).toBe(LinkType.Internal);
		});

		it("normalizes 'external' to External", () => {
			const raw = createMockLinkResponse({ type: "external" });
			const result = mapLink(raw);

			expect(result?.type).toBe(LinkType.External);
		});

		it("defaults to External for unknown type", () => {
			const raw = createMockLinkResponse({ type: "unknown" });
			const result = mapLink(raw);

			expect(result?.type).toBe(LinkType.External);
		});

		it("defaults to External for null type", () => {
			const raw = createMockLinkResponse({ type: null });
			const result = mapLink(raw);

			expect(result?.type).toBe(LinkType.External);
		});
	});

	describe("referrer policy normalization", () => {
		it.each([
			["no-referrer", ReferrerPolicy.NoReferrer],
			["no-referrer-when-downgrade", ReferrerPolicy.NoReferrerWhenDowngrade],
			["origin", ReferrerPolicy.Origin],
			["origin-when-cross-origin", ReferrerPolicy.OriginWhenCrossOrigin],
			["unsafe-url", ReferrerPolicy.UnsafeURL],
			["same-origin", ReferrerPolicy.SameOrigin],
			["strict-origin", ReferrerPolicy.StrictOrigin],
			[
				"strict-origin-when-cross-origin",
				ReferrerPolicy.StrictOriginWhenCrossOrigin,
			],
		])("normalizes referrerPolicy '%s' to %s", (input, expected) => {
			const raw = createMockLinkResponse({ referrerPolicy: input });
			const result = mapLink(raw);

			expect(result?.referrerPolicy).toBe(expected);
		});

		it("defaults to StrictOriginWhenCrossOrigin for unknown policy", () => {
			const raw = createMockLinkResponse({ referrerPolicy: "unknown" });
			const result = mapLink(raw);

			expect(result?.referrerPolicy).toBe(
				ReferrerPolicy.StrictOriginWhenCrossOrigin,
			);
		});

		it("defaults to StrictOriginWhenCrossOrigin for null policy", () => {
			const raw = createMockLinkResponse({ referrerPolicy: null });
			const result = mapLink(raw);

			expect(result?.referrerPolicy).toBe(
				ReferrerPolicy.StrictOriginWhenCrossOrigin,
			);
		});
	});

	describe("social platform normalization", () => {
		it.each([
			["LinkedIn", SocialPlatform.LinkedIn],
			["Facebook", SocialPlatform.Facebook],
			["Telegram", SocialPlatform.Telegram],
			["YouTube", SocialPlatform.YouTube],
			["WhatsApp", SocialPlatform.WhatsApp],
			["Instagram", SocialPlatform.Instagram],
			["TikTok", SocialPlatform.TikTok],
			["Reddit", SocialPlatform.Reddit],
			["Pinterest", SocialPlatform.Pinterest],
			["XTwitter", SocialPlatform.XTwitter],
			["Medium", SocialPlatform.Medium],
			["Discord", SocialPlatform.Discord],
			["GitHub", SocialPlatform.GitHub],
		])("normalizes platform '%s' to %s", (input, expected) => {
			const raw = createSocialLinkResponse(input);
			const result = mapLink(raw);

			expect(result?.platform).toBe(expected);
		});

		it("returns undefined for unknown platform", () => {
			const raw = createMockLinkResponse({ platform: "Unknown" });
			const result = mapLink(raw);

			expect(result?.platform).toBeUndefined();
		});

		it("returns undefined for null platform", () => {
			const raw = createMockLinkResponse({ platform: null });
			const result = mapLink(raw);

			expect(result?.platform).toBeUndefined();
		});
	});

	describe("rel attribute generation", () => {
		it("adds noopener noreferrer for _blank target", () => {
			const raw = createMockLinkResponse({ target: "_blank" });
			const result = mapLink(raw);

			expect(result?.rel).toBe("noopener noreferrer");
		});

		it("does not add rel for _self target", () => {
			const raw = createMockLinkResponse({ target: "_self" });
			const result = mapLink(raw);

			expect(result?.rel).toBeUndefined();
		});

		it("does not add rel for _parent target", () => {
			const raw = createMockLinkResponse({ target: "_parent" });
			const result = mapLink(raw);

			expect(result?.rel).toBeUndefined();
		});

		it("does not add rel for _top target", () => {
			const raw = createMockLinkResponse({ target: "_top" });
			const result = mapLink(raw);

			expect(result?.rel).toBeUndefined();
		});
	});
});

describe("mapLinks", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("maps array of valid links", () => {
		const raw = createMockLinksArray(3);
		const result = mapLinks(raw);

		expect(result).toHaveLength(3);
		expect(result[0]?.id).toBe("link-1");
		expect(result[1]?.id).toBe("link-2");
		expect(result[2]?.id).toBe("link-3");
	});

	it("filters out null results from invalid items", () => {
		const raw = [
			createMockLinkResponse(),
			null,
			createMockLinkResponse({ id: "link-2" }),
		];
		const result = mapLinks(raw);

		expect(result).toHaveLength(2);
	});

	it("returns empty array for empty input", () => {
		const result = mapLinks([]);

		expect(result).toHaveLength(0);
	});

	it("filters out non-object items", () => {
		const raw = [
			createMockLinkResponse(),
			"string",
			123,
			createMockLinkResponse({ id: "link-2" }),
		];
		const result = mapLinks(raw);

		expect(result).toHaveLength(2);
	});

	it("handles array with only invalid items", () => {
		const raw = [null, undefined, "string", 123];
		const result = mapLinks(raw);

		expect(result).toHaveLength(0);
	});
});
