import { describe, expect, it } from "vitest";
import { normalizeDynamicZoneFromGraphql } from "./normalize";

describe("normalizeDynamicZoneFromGraphql", () => {
	it("maps __typename to __component for paragraph blocks", () => {
		const raw = [
			{
				__typename: "ComponentSectionsParagraph",
				heading: "H",
				alignment: "left",
				text: [],
			},
		];
		const out = normalizeDynamicZoneFromGraphql(raw) as unknown[];
		expect(out[0]).toMatchObject({
			__component: "sections.paragraph",
			heading: "H",
		});
		expect(out[0]).not.toHaveProperty("__typename");
	});

	it("copies paragraph Blocks `content` to `text` for the HTML renderer", () => {
		const blocks = [
			{ type: "paragraph", children: [{ type: "text", text: "Hi" }] },
		];
		const raw = [
			{
				__typename: "ComponentSectionsParagraph",
				heading: "",
				alignment: "center",
				content: blocks,
			},
		];
		const out = normalizeDynamicZoneFromGraphql(raw) as Record<
			string,
			unknown
		>[];
		expect(out[0]?.["text"]).toEqual(blocks);
	});

	it("maps gallery items to picture-shaped entries", () => {
		const raw = [
			{
				__typename: "ComponentSectionsGallery",
				id: "1",
				heading: "G",
				subHeading: null,
				layout: "grid",
				items: [
					{
						__typename: "UploadFile",
						documentId: "f1",
						url: "/uploads/a.jpg",
						width: 100,
						height: 100,
						alternativeText: "Alt",
						caption: "Cap",
					},
				],
			},
		];
		const out = normalizeDynamicZoneFromGraphql(raw) as Record<
			string,
			unknown
		>[];
		const images = out[0]?.["images"] as unknown[];
		expect(Array.isArray(images)).toBe(true);
		expect(images?.[0]).toMatchObject({
			altText: "Alt",
			caption: "Cap",
		});
	});

	it("maps ComponentSectionsMedia", () => {
		const raw = [
			{
				__typename: "ComponentSectionsMedia",
				id: "m1",
				heading: "M",
				subHeading: null,
				item: {
					__typename: "UploadFile",
					documentId: "f1",
					url: "/uploads/m.jpg",
					width: 50,
					height: 50,
					alternativeText: null,
					caption: null,
				},
			},
		];
		const out = normalizeDynamicZoneFromGraphql(raw) as Record<
			string,
			unknown
		>[];
		expect(out[0]).toMatchObject({ __component: "sections.media" });
		expect(out[0]?.["mediaItem"]).toMatchObject({ url: "/uploads/m.jpg" });
	});
});
