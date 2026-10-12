import {
	type RichTextContent,
	RichTextContentType,
	type RichTextHeading,
	type RichTextInlineNode,
	type RichTextLink,
	type RichTextList,
	RichTextListFormat,
	type RichTextListItem,
	type RichTextNode,
	type RichTextParagraph,
} from "@models";

export function createTextNode(
	text: string,
	flags?: Partial<Omit<RichTextNode, "text" | "type">>,
): RichTextNode {
	return {
		type: RichTextContentType.Text,
		text,
		...flags,
	};
}

export function createRichTextLink(
	props: Omit<RichTextLink, "type">,
): RichTextLink {
	return {
		type: RichTextContentType.Link,
		...props,
	};
}

export function createSimpleLink(
	url: string,
	text: string,
	target?: string,
): RichTextLink {
	return createRichTextLink({
		url,
		target,
		children: [createTextNode(text)],
	});
}

export function createListItem(
	children: RichTextListItem["children"],
): RichTextListItem {
	return {
		type: RichTextContentType.ListItem,
		children,
	};
}

export function createSimpleListItem(text: string): RichTextListItem {
	return createListItem([createTextNode(text)]);
}

export function createRichTextList(
	format: RichTextListFormat,
	children: RichTextList["children"],
	indentLevel?: number,
): RichTextList {
	return {
		type: RichTextContentType.List,
		format,
		children,
		...(indentLevel !== undefined ? { indentLevel } : {}),
	};
}

export function createUnorderedList(items: string[]): RichTextList {
	return createRichTextList(
		RichTextListFormat.Unordered,
		items.map((text) => createSimpleListItem(text)),
	);
}

export function createOrderedList(items: string[]): RichTextList {
	return createRichTextList(
		RichTextListFormat.Ordered,
		items.map((text) => createSimpleListItem(text)),
	);
}

export function createRichTextParagraph(
	children: readonly RichTextInlineNode[],
): RichTextParagraph {
	return {
		type: RichTextContentType.Paragraph,
		children,
	};
}

export function createSimpleParagraph(text: string): RichTextParagraph {
	return createRichTextParagraph([createTextNode(text)]);
}

export function createRichTextHeading(
	level: number,
	children: readonly RichTextNode[],
): RichTextHeading {
	return {
		type: RichTextContentType.Heading,
		level,
		children,
	};
}

export function createSimpleHeading(
	level: number,
	text: string,
): RichTextHeading {
	return createRichTextHeading(level, [createTextNode(text)]);
}

export function createRichTextContent(
	text = "Sample content",
): RichTextContent {
	return [createSimpleParagraph(text)];
}

export function createEmptyRichTextContent(): RichTextContent {
	return [];
}

export function createComplexRichTextContent(): RichTextContent {
	return [
		createSimpleHeading(2, "Section Title"),
		createSimpleParagraph("Introduction paragraph with some text."),
		createUnorderedList(["First item", "Second item", "Third item"]),
	];
}
