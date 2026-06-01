import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import {
	DynamicZoneComponentType,
	type DynamicZoneReferenceList,
} from "../../../lib/content/models/dynamic-zone";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
} from "../../../lib/content/models/link";
import ZoneReferenceList from "../ZoneReferenceList.astro";

function testLink(id: string, overrides: Partial<Link> = {}): Link {
	return {
		id,
		url: `https://example.com/${id}`,
		text: `Reference ${id}`,
		target: LinkTarget.Blank,
		type: LinkType.External,
		referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
		...overrides,
	};
}

function testReferenceList(
	overrides: Partial<DynamicZoneReferenceList> = {},
): DynamicZoneReferenceList {
	return {
		type: DynamicZoneComponentType.ReferenceList,
		id: "refs-1",
		heading: "References",
		subHeading: "Sources cited in this article",
		links: [testLink("44"), testLink("45"), testLink("46")],
		...overrides,
	};
}

describe("ZoneReferenceList.astro", () => {
	let container: Awaited<ReturnType<typeof AstroContainer.create>>;

	beforeAll(async () => {
		container = await AstroContainer.create();
	});

	async function render(referenceList: DynamicZoneReferenceList) {
		return container.renderToString(ZoneReferenceList, {
			props: { referenceList },
		});
	}

	it("renders a bibliography section with ordered references", async () => {
		const html = await render(testReferenceList());
		expect(html).toContain('<section class="zone-references"');
		expect(html).toContain('role="region"');
		expect(html).toContain('aria-labelledby="zone-references-heading-refs-1"');
		expect(html).toContain('id="zone-references-heading-refs-1"');
		expect(html).toContain("References");
		expect(html).toContain("Sources cited in this article");
		expect(html).toContain('<ol class="zone-references-list"');
		expect(html).toContain("<cite");
		expect(html).toContain('href="https://example.com/44"');
		expect(html).toContain("Reference 44");
		expect(html).toContain('id="ref-refs-1-1"');
		expect(html).toContain('id="ref-refs-1-3"');
	});

	it("uses secure link attributes for external references", async () => {
		const html = await render(testReferenceList());
		expect(html).toContain('target="_blank"');
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it("omits h3 when subHeading is not set", async () => {
		const html = await render(testReferenceList({ subHeading: undefined }));
		expect(html).not.toContain("<h3");
	});

	it("renders an empty state when there are no links", async () => {
		const html = await render(testReferenceList({ links: [] }));
		expect(html).toContain("zone-references-empty");
		expect(html).not.toContain("<ol");
	});

	it("escapes dangerous characters in headings and link text", async () => {
		const html = await render(
			testReferenceList({
				heading: "<script>",
				subHeading: "<img onerror>",
				links: [testLink("1", { text: "<evil>" })],
			}),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).toContain("&lt;img onerror&gt;");
		expect(html).toContain("&lt;evil&gt;");
		expect(html).not.toContain("<script>");
	});
});
