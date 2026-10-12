import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	type SocialPlatform,
} from "@models";

let linkIdCounter = 0;

export function createTestLink(overrides: Partial<Link> = {}): Link {
	const id = overrides.id ?? `link-${++linkIdCounter}`;
	return {
		id,
		url: overrides.url ?? `https://example.com/${id}`,
		text: overrides.text ?? `Link ${id}`,
		target: overrides.target ?? LinkTarget.Blank,
		type: overrides.type ?? LinkType.External,
		referrerPolicy:
			overrides.referrerPolicy ?? ReferrerPolicy.StrictOriginWhenCrossOrigin,
		...overrides,
	};
}

export function createSocialLink(
	platform: SocialPlatform,
	overrides: Partial<Link> = {},
): Link {
	return createTestLink({
		platform,
		rel: "noopener noreferrer",
		...overrides,
	});
}

export function createInternalLink(overrides: Partial<Link> = {}): Link {
	return createTestLink({
		type: LinkType.Internal,
		target: LinkTarget.Self,
		url: overrides.url ?? "/internal-page",
		...overrides,
	});
}

export function resetLinkIdCounter(): void {
	linkIdCounter = 0;
}
