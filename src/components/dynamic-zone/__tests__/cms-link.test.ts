import { describe, expect, it } from "vitest";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
} from "../../../lib/content/models/link";
import { buildCmsLinkRel, isExternalLink } from "../cms-link";

function testLink(overrides: Partial<Link> = {}): Link {
	return {
		id: "1",
		url: "https://example.com",
		text: "Example",
		target: LinkTarget.Blank,
		type: LinkType.External,
		referrerpolicy: ReferrerPolicy.StrictOriginWhenCrossOrigin,
		...overrides,
	};
}

describe("buildCmsLinkRel", () => {
	it("returns noopener noreferrer for _blank targets", () => {
		expect(buildCmsLinkRel(testLink({ target: LinkTarget.Blank }))).toBe(
			"noopener noreferrer",
		);
	});

	it("returns undefined for same-tab targets", () => {
		expect(
			buildCmsLinkRel(testLink({ target: LinkTarget.Self })),
		).toBeUndefined();
	});
});

describe("isExternalLink", () => {
	it("detects external links", () => {
		expect(isExternalLink(testLink({ type: LinkType.External }))).toBe(true);
		expect(isExternalLink(testLink({ type: LinkType.Internal }))).toBe(false);
	});
});
