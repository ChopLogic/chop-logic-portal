import type { ArticlePreview, Tag } from "@models";
import type { Author, TagData } from "chop-logic-components";
import { createImageProps } from "./dynamic-zone.factory";

let articleIdCounter = 0;
let tagIdCounter = 0;

export function resetArticleCounters(): void {
	articleIdCounter = 0;
	tagIdCounter = 0;
}

export function createTag(overrides: Partial<Tag> = {}): Tag {
	const id = overrides.id ?? `tag-${++tagIdCounter}`;
	const name = overrides.name ?? `Tag ${tagIdCounter}`;
	return {
		id,
		name,
		slug: overrides.slug ?? name.toLowerCase().replace(/\s+/g, "-"),
		...overrides,
	};
}

export function createTags(names: string[]): Tag[] {
	return names.map((name) => createTag({ name }));
}

export function createAuthor(overrides: Partial<Author> = {}): Author {
	const id = overrides.id ?? `author-${++articleIdCounter}`;
	return {
		id,
		name: overrides.name ?? "Test Author",
		imageUrl: overrides.imageUrl ?? "https://example.com/author.jpg",
		...overrides,
	};
}

export function createTagData(overrides: Partial<TagData> = {}): TagData {
	const id = overrides.id ?? `tagdata-${++tagIdCounter}`;
	return {
		id,
		name: overrides.name ?? `Tag ${tagIdCounter}`,
		...overrides,
	};
}

export function createArticlePreview(
	overrides: Partial<ArticlePreview> = {},
): ArticlePreview {
	const id = overrides.id ?? `article-${++articleIdCounter}`;
	return {
		id,
		slug: overrides.slug ?? `article-slug-${articleIdCounter}`,
		title: overrides.title ?? `Article Title ${articleIdCounter}`,
		image: overrides.image ?? createImageProps({ alt: "Article image" }),
		authors: overrides.authors ?? [createAuthor()],
		tags: overrides.tags ?? [createTagData()],
		...overrides,
	};
}

export function createArticlePreviews(count: number): ArticlePreview[] {
	return Array.from({ length: count }, () => createArticlePreview());
}

export function createCompleteArticlePreview(
	overrides: Partial<ArticlePreview> = {},
): ArticlePreview {
	return createArticlePreview({
		summary: "This is a brief summary of the article content.",
		tags: [createTagData(), createTagData(), createTagData()],
		authors: [createAuthor(), createAuthor()],
		...overrides,
	});
}
