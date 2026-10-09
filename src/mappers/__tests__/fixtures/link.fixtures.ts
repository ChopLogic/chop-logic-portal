/**
 * Test fixtures for Strapi CMS link responses
 */

export interface MockLinkResponse {
	id: string;
	text: string;
	url: string;
	type?: string | null;
	target?: string | null;
	referrerPolicy?: string | null;
	platform?: string | null;
}

/**
 * Creates a complete mock link response matching Strapi GraphQL structure
 */
export function createMockLinkResponse(
	overrides: Partial<MockLinkResponse> = {},
): MockLinkResponse {
	return {
		id: "link-123",
		text: "Test Link",
		url: "https://example.com",
		type: "external",
		target: "_blank",
		referrerPolicy: "strict-origin-when-cross-origin",
		...overrides,
	};
}

/**
 * Creates an internal link response
 */
export function createInternalLinkResponse(
	overrides: Partial<MockLinkResponse> = {},
): MockLinkResponse {
	return createMockLinkResponse({
		id: "link-internal-123",
		text: "Internal Page",
		url: "/about",
		type: "internal",
		target: "_self",
		...overrides,
	});
}

/**
 * Creates a social media link response
 */
export function createSocialLinkResponse(
	platform: string,
	overrides: Partial<MockLinkResponse> = {},
): MockLinkResponse {
	const platformUrls: Record<string, string> = {
		LinkedIn: "https://linkedin.com/in/username",
		Facebook: "https://facebook.com/username",
		Telegram: "https://t.me/username",
		YouTube: "https://youtube.com/@channel",
		WhatsApp: "https://wa.me/1234567890",
		Instagram: "https://instagram.com/username",
		TikTok: "https://tiktok.com/@username",
		Reddit: "https://reddit.com/u/username",
		Pinterest: "https://pinterest.com/username",
		XTwitter: "https://x.com/username",
		Medium: "https://medium.com/@username",
		Discord: "https://discord.gg/invite",
		GitHub: "https://github.com/username",
	};

	return createMockLinkResponse({
		id: `link-${platform.toLowerCase()}-123`,
		text: platform,
		url: platformUrls[platform] ?? "https://example.com",
		platform,
		...overrides,
	});
}

/**
 * Creates an array of link responses
 */
export function createMockLinksArray(
	count = 3,
	overrides: Partial<MockLinkResponse>[] = [],
): MockLinkResponse[] {
	return Array.from({ length: count }, (_, i) =>
		createMockLinkResponse({
			id: `link-${i + 1}`,
			text: `Link ${i + 1}`,
			url: `https://example.com/link-${i + 1}`,
			...overrides[i],
		}),
	);
}

/**
 * All valid target values for testing
 */
export const ALL_TARGET_VALUES = [
	"_blank",
	"_self",
	"self",
	"_parent",
	"parent",
	"_top",
	"top",
] as const;

/**
 * All valid referrer policy values for testing
 */
export const ALL_REFERRER_POLICY_VALUES = [
	"no-referrer",
	"no-referrer-when-downgrade",
	"origin",
	"origin-when-cross-origin",
	"unsafe-url",
	"same-origin",
	"strict-origin",
	"strict-origin-when-cross-origin",
] as const;

/**
 * All valid social platform values for testing
 */
export const ALL_SOCIAL_PLATFORMS = [
	"LinkedIn",
	"Facebook",
	"Telegram",
	"YouTube",
	"WhatsApp",
	"Instagram",
	"TikTok",
	"Reddit",
	"Pinterest",
	"XTwitter",
	"Medium",
	"Discord",
	"GitHub",
] as const;
