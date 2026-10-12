/**
 * Test fixtures for Strapi CMS tag responses
 */

export interface MockTagResponse {
	documentId: string;
	name: string;
	slug: string;
	description?: string | null;
	color?: string | null;
	publishedAt?: string | null;
	updatedAt?: string | null;
}

/**
 * Creates a complete mock tag response matching Strapi GraphQL structure
 */
export function createMockTagResponse(
	overrides: Partial<MockTagResponse> = {},
): MockTagResponse {
	return {
		documentId: "tag-doc-123",
		name: "JavaScript",
		slug: "javascript",
		description: "Articles about JavaScript programming",
		color: "#f7df1e",
		publishedAt: "2024-01-15T10:00:00.000Z",
		updatedAt: "2024-01-20T15:30:00.000Z",
		...overrides,
	};
}

/**
 * Creates a minimal valid tag response (only required fields)
 */
export function createMinimalTagResponse(
	overrides: Partial<MockTagResponse> = {},
): MockTagResponse {
	return {
		documentId: "tag-minimal-123",
		name: "Minimal Tag",
		slug: "minimal-tag",
		...overrides,
	};
}

/**
 * Creates an array of tag responses
 */
export function createMockTagsArray(
	count = 3,
	overrides: Partial<MockTagResponse>[] = [],
): MockTagResponse[] {
	const defaultTags = [
		{ name: "JavaScript", slug: "javascript", color: "#f7df1e" },
		{ name: "TypeScript", slug: "typescript", color: "#3178c6" },
		{ name: "React", slug: "react", color: "#61dafb" },
		{ name: "Node.js", slug: "nodejs", color: "#339933" },
		{ name: "CSS", slug: "css", color: "#1572b6" },
	];

	return Array.from({ length: count }, (_, i) =>
		createMockTagResponse({
			documentId: `tag-${i + 1}`,
			name: defaultTags[i]?.name ?? `Tag ${i + 1}`,
			slug: defaultTags[i]?.slug ?? `tag-${i + 1}`,
			color: defaultTags[i]?.color ?? "#808080",
			...overrides[i],
		}),
	);
}

/**
 * Creates a tag without optional fields
 */
export function createTagWithoutOptionalFields(): MockTagResponse {
	return {
		documentId: "tag-bare-123",
		name: "Bare Tag",
		slug: "bare-tag",
	};
}
