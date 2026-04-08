import { describe, expect, it } from "vitest";
import {
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	SocialPlatform,
} from "../../models";
import { mapLink, mapLinks } from "../link";

function minimalRaw(overrides: Record<string, unknown> = {}) {
	return {
		id: "1",
		url: "https://example.com",
		text: "Example",
		target: "_blank",
		type: "external",
		referrerpolicy: "strict-origin-when-cross-origin",
		platform: undefined,
		...overrides,
	};
}

describe("mapLink", () => {
	it("returns null when input is not a plain object", () => {
		expect(mapLink(null)).toBeNull();
		expect(mapLink(undefined)).toBeNull();
		expect(mapLink("link")).toBeNull();
		expect(mapLink(42)).toBeNull();
		expect(mapLink(true)).toBeNull();
		expect(mapLink([])).toBeNull();
		expect(mapLink(() => {})).toBeNull();
	});

	it("maps a complete raw record to a Link", () => {
		const raw = minimalRaw({
			id: "99",
			url: "/path",
			text: "Label",
			target: "_self",
			type: "internal",
			referrerpolicy: "no-referrer",
			platform: "GitHub",
		});

		expect(mapLink(raw)).toEqual({
			id: "99",
			url: "/path",
			text: "Label",
			target: LinkTarget.Self,
			type: LinkType.Internal,
			referrerpolicy: ReferrerPolicy.NoReferrer,
			platform: SocialPlatform.GitHub,
		});
	});

	it("trims id, url, and text", () => {
		const result = mapLink(
			minimalRaw({
				id: "  a  ",
				url: "  /p  ",
				text: "  t  ",
			}),
		);
		expect(result).toEqual({
			id: "a",
			url: "/p",
			text: "t",
			target: LinkTarget.Blank,
			type: LinkType.External,
			referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
			platform: undefined,
		});
	});

	it.each([
		["id", { id: null }],
		["id", { id: 99 }],
		["url", { url: undefined }],
		["url", { url: 1 }],
		["text", { text: null }],
		["text", { text: false }],
	] as const)("throws when %s is not a string", (_field, overrides) => {
		expect(() => mapLink(minimalRaw(overrides))).toThrow(
			/is not a string and no default value was provided/,
		);
	});

	it("throws when required string fields are missing on an otherwise valid record", () => {
		expect(() => mapLink({})).toThrow(
			/is not a string and no default value was provided/,
		);
	});

	describe("target normalization", () => {
		it.each([
			["_self", LinkTarget.Self],
			["self", LinkTarget.Self],
			["parent", LinkTarget.Parent],
			["_parent", LinkTarget.Parent],
			["top", LinkTarget.Top],
			["_top", LinkTarget.Top],
		] as const)("maps %s to %s", (rawTarget, expected) => {
			expect(mapLink(minimalRaw({ target: rawTarget }))?.target).toBe(expected);
		});

		it("defaults target to blank for unknown values", () => {
			expect(mapLink(minimalRaw({ target: "_blank" }))?.target).toBe(
				LinkTarget.Blank,
			);
			expect(mapLink(minimalRaw({ target: "other" }))?.target).toBe(
				LinkTarget.Blank,
			);
			expect(mapLink(minimalRaw({ target: undefined }))?.target).toBe(
				LinkTarget.Blank,
			);
		});
	});

	describe("type normalization", () => {
		it("maps internal to Internal", () => {
			expect(mapLink(minimalRaw({ type: "internal" }))?.type).toBe(
				LinkType.Internal,
			);
		});

		it("maps any non-internal value to External", () => {
			expect(mapLink(minimalRaw({ type: "external" }))?.type).toBe(
				LinkType.External,
			);
			expect(mapLink(minimalRaw({ type: "EXTERNAL" }))?.type).toBe(
				LinkType.External,
			);
			expect(mapLink(minimalRaw({ type: undefined }))?.type).toBe(
				LinkType.External,
			);
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
		] as const)("maps %s", (raw, expected) => {
			expect(mapLink(minimalRaw({ referrerpolicy: raw }))?.referrerpolicy).toBe(
				expected,
			);
		});

		it("defaults unknown referrerpolicy to StrictOriginWhenCrossOrigin", () => {
			expect(
				mapLink(minimalRaw({ referrerpolicy: "unknown" }))?.referrerpolicy,
			).toBe(ReferrerPolicy.StrictOriginWhenCrossOrigin);
			expect(
				mapLink(minimalRaw({ referrerpolicy: undefined }))?.referrerpolicy,
			).toBe(ReferrerPolicy.StrictOriginWhenCrossOrigin);
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
		] as const)("maps platform %s", (raw, expected) => {
			expect(mapLink(minimalRaw({ platform: raw }))?.platform).toBe(expected);
		});

		it("omits platform when value is unknown or missing", () => {
			expect(
				mapLink(minimalRaw({ platform: "UnknownNetwork" }))?.platform,
			).toBeUndefined();
			expect(mapLink(minimalRaw({ platform: undefined }))?.platform).toBe(
				undefined,
			);
			const { platform: _p, ...withoutPlatform } = minimalRaw();
			expect(mapLink(withoutPlatform)?.platform).toBeUndefined();
		});
	});

	it("allows empty string for id, url, and text", () => {
		const result = mapLink(minimalRaw({ id: "", url: "", text: "   " }));
		expect(result).toEqual({
			id: "",
			url: "",
			text: "",
			target: LinkTarget.Blank,
			type: LinkType.External,
			referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
			platform: undefined,
		});
	});
});

describe("mapLinks", () => {
	it("returns an empty array for an empty input array", () => {
		expect(mapLinks([])).toEqual([]);
	});

	it("maps each element and preserves order", () => {
		const a = minimalRaw({ id: "a", text: "First" });
		const b = minimalRaw({ id: "b", text: "Second" });
		expect(mapLinks([a, b])).toEqual([mapLink(a), mapLink(b)]);
	});

	it("filters out entries that mapLink rejects", () => {
		const valid = minimalRaw({ id: "ok" });
		expect(mapLinks([null, valid, [], "x", valid] as unknown[])).toEqual([
			mapLink(valid),
			mapLink(valid),
		]);
	});

	it("returns an empty array when every entry is invalid", () => {
		expect(mapLinks([null, [], undefined] as unknown[])).toEqual([]);
	});

	it("propagates errors when a record is an object but lacks required strings", () => {
		expect(() => mapLinks([minimalRaw({ id: "ok" }), {}] as unknown[])).toThrow(
			/is not a string and no default value was provided/,
		);
	});
});
