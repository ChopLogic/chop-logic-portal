import type { Config } from "@api/types/generated";
import {
	createMockCmsImageResponse,
	createMockLinksArray,
	createMockRichTextContent,
} from "../../../mappers/__tests__/fixtures";

export function createMockConfigResponse(
	overrides: Partial<Config> = {},
): Config {
	return {
		__typename: "Config",
		documentId: "config-doc-123",
		title: "Chop Logic",
		description: "A place where logic works",
		footer: createMockRichTextContent(),
		links: createMockLinksArray(3),
		logo: createMockCmsImageResponse({
			documentId: "logo-123",
			name: "site-logo.svg",
			alternativeText: "Site Logo",
			width: 200,
			height: 50,
		}),
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-06-15T10:30:00.000Z",
		publishedAt: "2024-01-01T00:00:00.000Z",
		...overrides,
	} as Config;
}

export function createMinimalConfigResponse(
	overrides: Partial<Config> = {},
): Config {
	return {
		__typename: "Config",
		documentId: "config-minimal-123",
		title: "Minimal Site",
		description: "Minimal description",
		footer: [],
		links: [],
		...overrides,
	} as Config;
}

export function createConfigWithoutOptionalFields(): Config {
	return {
		__typename: "Config",
		documentId: "config-bare-123",
		title: "Bare Site",
		description: "Bare description",
		footer: createMockRichTextContent(),
		links: [],
		logo: null,
	} as Config;
}
