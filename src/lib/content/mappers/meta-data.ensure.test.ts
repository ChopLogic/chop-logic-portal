import { describe, expect, it } from "vitest";
import {
	DEFAULT_ROBOTS,
	DEFAULT_SITE_TITLE,
	OPEN_GRAPH_FALLBACK_IMAGE,
} from "../../../constants/defaults";
import { OgType } from "../models";
import { finalizePageMetaData } from "./meta-data";

describe("finalizePageMetaData", () => {
	it("fills robots when missing", () => {
		const page = finalizePageMetaData(
			{
				metaTitle: "T",
				metaDescription: "D",
			},
			"Site",
		);
		expect(page.robots).toBe(DEFAULT_ROBOTS);
	});

	it("uses fallback OG image and siteTitle as alt when CMS has no image", () => {
		const page = finalizePageMetaData(
			{
				metaTitle: "T",
				metaDescription: "D",
				openGraph: {
					ogTitle: "OG",
					ogDescription: "desc",
					ogType: OgType.WEBSITE,
				},
			},
			"My Brand",
		);
		expect(page.openGraph.ogImage.src).toBe(OPEN_GRAPH_FALLBACK_IMAGE.src);
		expect(page.openGraph.ogImage.alt).toBe("My Brand");
	});

	it("uses CMS og image and fills alt from siteTitle when CMS alt empty", () => {
		const page = finalizePageMetaData(
			{
				metaTitle: "T",
				metaDescription: "D",
				openGraph: {
					ogTitle: "OG",
					ogDescription: "desc",
					ogType: OgType.WEBSITE,
					ogImage: {
						src: "https://cdn.example.com/x.jpg",
						width: 800,
						height: 450,
					},
				},
			},
			"Fallback alt",
		);
		expect(page.openGraph.ogImage.src).toBe("https://cdn.example.com/x.jpg");
		expect(page.openGraph.ogImage.alt).toBe("Fallback alt");
	});

	it("preserves CMS og image alt when set", () => {
		const page = finalizePageMetaData(
			{
				metaTitle: "T",
				metaDescription: "D",
				openGraph: {
					ogTitle: "OG",
					ogDescription: "desc",
					ogType: OgType.WEBSITE,
					ogImage: {
						src: "https://cdn.example.com/x.jpg",
						alt: "Custom",
					},
				},
			},
			"Site",
		);
		expect(page.openGraph.ogImage.alt).toBe("Custom");
	});

	it("uses default site title when siteTitle is blank", () => {
		const page = finalizePageMetaData(
			{ metaTitle: "T", metaDescription: "D" },
			"   ",
		);
		expect(page.openGraph.ogImage.alt).toBe(DEFAULT_SITE_TITLE);
	});
});
