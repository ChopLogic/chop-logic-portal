/**
 * Test fixtures for Strapi CMS author responses
 */

import {
	createMockCmsImageResponse,
	createMockImageFormats,
	type MockCmsImageResponse,
} from "./image.fixtures";

export interface MockAuthorConnectionResponse {
	documentId: string;
	name: string;
	email: string;
	role?: string | null;
	avatar?: MockCmsImageResponse | null;
}

export interface MockAuthorsConnectionWrapper {
	nodes: MockAuthorConnectionResponse[];
}

/**
 * Creates a complete mock author connection response
 */
export function createMockAuthorConnection(
	overrides: Partial<MockAuthorConnectionResponse> = {},
): MockAuthorConnectionResponse {
	return {
		documentId: "author-doc-123",
		name: "John Doe",
		email: "john.doe@example.com",
		role: "Senior Developer",
		avatar: createMockCmsImageResponse({
			documentId: "avatar-123",
			name: "john-avatar.jpg",
			alternativeText: "John Doe profile picture",
			width: 400,
			height: 400,
			url: "/uploads/john_avatar.jpg",
			formats: createMockImageFormats({
				thumbnail: {
					url: "/uploads/john_avatar_thumbnail.jpg",
					width: 150,
					height: 150,
				},
				small: {
					url: "/uploads/john_avatar_small.jpg",
					width: 300,
					height: 300,
				},
				medium: null,
				large: null,
			}),
		}),
		...overrides,
	};
}

/**
 * Creates a minimal author connection (required fields only)
 */
export function createMinimalAuthorConnection(
	overrides: Partial<MockAuthorConnectionResponse> = {},
): MockAuthorConnectionResponse {
	return {
		documentId: "author-minimal-123",
		name: "Jane Smith",
		email: "jane.smith@example.com",
		...overrides,
	};
}

/**
 * Creates an author connection without avatar
 */
export function createAuthorWithoutAvatar(
	overrides: Partial<MockAuthorConnectionResponse> = {},
): MockAuthorConnectionResponse {
	return {
		documentId: "author-no-avatar-123",
		name: "Bob Wilson",
		email: "bob.wilson@example.com",
		role: "Contributor",
		avatar: null,
		...overrides,
	};
}

/**
 * Creates an array of author connection responses
 */
export function createMockAuthorsArray(
	count = 2,
	overrides: Partial<MockAuthorConnectionResponse>[] = [],
): MockAuthorConnectionResponse[] {
	const defaultAuthors = [
		{ name: "John Doe", email: "john@example.com", role: "Lead Author" },
		{ name: "Jane Smith", email: "jane@example.com", role: "Editor" },
		{ name: "Bob Wilson", email: "bob@example.com", role: "Contributor" },
	];

	return Array.from({ length: count }, (_, i) =>
		createMockAuthorConnection({
			documentId: `author-${i + 1}`,
			name: defaultAuthors[i]?.name ?? `Author ${i + 1}`,
			email: defaultAuthors[i]?.email ?? `author${i + 1}@example.com`,
			role: defaultAuthors[i]?.role ?? "Writer",
			...overrides[i],
		}),
	);
}

/**
 * Creates a wrapper with authors_connection.nodes structure
 */
export function createAuthorsConnectionWrapper(
	authors: MockAuthorConnectionResponse[],
): MockAuthorsConnectionWrapper {
	return {
		nodes: authors,
	};
}
