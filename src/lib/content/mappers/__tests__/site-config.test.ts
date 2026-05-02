import { describe, expect, it } from "vitest";
import {
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
} from "../../../../constants/defaults";
import { LinkTarget, LinkType, ReferrerPolicy } from "../../models";
import { RichTextContentType } from "../../models/rich-text-block";
import { mapSiteConfig } from "../site-config";

const baseUrl = "https://cms.example.com";

function minimalEntity(
	overrides: Partial<{
		title: string;
		description: string;
		footer: unknown;
		links: unknown[];
		logo: unknown;
	}> = {},
) {
	return {
		title: "  My Site  ",
		description: "  Site tagline  ",
		footer: [
			{
				type: RichTextContentType.Paragraph,
				children: [{ type: RichTextContentType.Text, text: "Footer copy" }],
			},
		],
		links: [
			{
				id: "1",
				url: "https://example.com",
				text: "Example",
				target: "_blank",
				type: "external",
				referrerpolicy: "strict-origin-when-cross-origin",
			},
		],
		logo: {
			documentId: "doc-1",
			name: "logo.png",
			url: "/uploads/logo.png",
			width: 100,
			height: 50,
		},
		...overrides,
	};
}

describe("mapSiteConfig", () => {
	it("maps title, description, footer, links, and logo using baseUrl for media", () => {
		const out = mapSiteConfig(minimalEntity(), baseUrl);

		expect(out.siteTitle).toBe("My Site");
		expect(out.description).toBe("Site tagline");
		expect(out.footer).toHaveLength(1);
		expect(out.footer[0]?.type).toBe(RichTextContentType.Paragraph);
		expect(out.links).toHaveLength(1);
		expect(out.links[0]).toEqual({
			id: "1",
			url: "https://example.com",
			text: "Example",
			target: LinkTarget.Blank,
			type: LinkType.External,
			referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
			platform: undefined,
		});
		expect(out.logo).toEqual({
			documentId: "doc-1",
			name: "logo.png",
			url: "https://cms.example.com/uploads/logo.png",
			width: 100,
			height: 50,
			alternativeText: undefined,
			caption: undefined,
			formats: {},
		});
	});

	it("uses default title when title is not a string", () => {
		const out = mapSiteConfig(
			minimalEntity({ title: null as unknown as string }),
			baseUrl,
		);
		expect(out.siteTitle).toBe(DEFAULT_SITE_TITLE);
	});

	it("uses default description when description is not a string", () => {
		const out = mapSiteConfig(
			minimalEntity({ description: undefined as unknown as string }),
			baseUrl,
		);
		expect(out.description).toBe(DEFAULT_SITE_DESCRIPTION);
	});

	it("maps footer to empty rich text when footer cannot be parsed", () => {
		const out = mapSiteConfig(minimalEntity({ footer: null }), baseUrl);
		expect(out.footer).toEqual([]);
	});

	it("delegates links to mapLinks (skips non-objects; same rules as mapLink)", () => {
		const first = {
			id: "1",
			url: "/a",
			text: "A",
			type: "internal",
			target: "_self",
			referrerpolicy: "strict-origin-when-cross-origin",
		};
		const second = {
			id: "2",
			url: "/b",
			text: "B",
			type: "external",
			target: "_blank",
			referrerpolicy: "strict-origin-when-cross-origin",
		};
		const out = mapSiteConfig(
			minimalEntity({
				links: [null, first, [], "skip", second] as unknown[],
			}),
			baseUrl,
		);
		expect(out.links).toHaveLength(2);
		expect(out.links[0]?.id).toBe("1");
		expect(out.links[0]?.type).toBe(LinkType.Internal);
		expect(out.links[1]?.id).toBe("2");
	});

	it("returns null logo when logo is missing or invalid", () => {
		expect(
			mapSiteConfig(minimalEntity({ logo: undefined }), baseUrl).logo,
		).toBeNull();
		expect(
			mapSiteConfig(minimalEntity({ logo: null }), baseUrl).logo,
		).toBeNull();
		expect(
			mapSiteConfig(minimalEntity({ logo: { url: "/only" } }), baseUrl).logo,
		).toBeNull();
	});
});
