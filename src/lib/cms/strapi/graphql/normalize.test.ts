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
});
