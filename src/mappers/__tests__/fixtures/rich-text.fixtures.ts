/**
 * Test fixtures for Strapi CMS rich text block responses
 */

export interface MockRichTextNode {
	type: string;
	text?: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	code?: boolean;
}

export interface MockRichTextLink {
	type: "link";
	url: string;
	target?: string;
	children: MockRichTextNode[];
}

export interface MockRichTextParagraph {
	type: "paragraph";
	children: Array<MockRichTextNode | MockRichTextLink>;
}

export interface MockRichTextHeading {
	type: "heading";
	level: number;
	children: MockRichTextNode[];
}

export interface MockRichTextListItem {
	type: "list-item";
	children: Array<MockRichTextNode | MockRichTextLink>;
}

export interface MockRichTextList {
	type: "list";
	format: "ordered" | "unordered";
	indentLevel?: number;
	children: Array<MockRichTextListItem | MockRichTextList>;
}

export type MockRichTextBlock =
	| MockRichTextParagraph
	| MockRichTextHeading
	| MockRichTextList;

/**
 * Creates a text node
 */
export function createTextNode(
	text: string,
	formatting: Partial<Omit<MockRichTextNode, "type" | "text">> = {},
): MockRichTextNode {
	return {
		type: "text",
		text,
		...formatting,
	};
}

/**
 * Creates a link node
 */
export function createLinkNode(
	url: string,
	children: MockRichTextNode[],
	target?: string,
): MockRichTextLink {
	return {
		type: "link",
		url,
		target,
		children,
	};
}

/**
 * Creates a paragraph block
 */
export function createParagraphBlock(
	children: Array<MockRichTextNode | MockRichTextLink>,
): MockRichTextParagraph {
	return {
		type: "paragraph",
		children,
	};
}

/**
 * Creates a simple paragraph with text
 */
export function createSimpleParagraph(text: string): MockRichTextParagraph {
	return createParagraphBlock([createTextNode(text)]);
}

/**
 * Creates a heading block
 */
export function createHeadingBlock(
	level: number,
	children: MockRichTextNode[],
): MockRichTextHeading {
	return {
		type: "heading",
		level,
		children,
	};
}

/**
 * Creates a simple heading with text
 */
export function createSimpleHeading(
	level: number,
	text: string,
): MockRichTextHeading {
	return createHeadingBlock(level, [createTextNode(text)]);
}

/**
 * Creates a list item
 */
export function createListItem(
	children: Array<MockRichTextNode | MockRichTextLink>,
): MockRichTextListItem {
	return {
		type: "list-item",
		children,
	};
}

/**
 * Creates a simple list item with text
 */
export function createSimpleListItem(text: string): MockRichTextListItem {
	return createListItem([createTextNode(text)]);
}

/**
 * Creates a list block
 */
export function createListBlock(
	format: "ordered" | "unordered",
	children: Array<MockRichTextListItem | MockRichTextList>,
	indentLevel?: number,
): MockRichTextList {
	const list: MockRichTextList = {
		type: "list",
		format,
		children,
	};
	if (indentLevel !== undefined) {
		list.indentLevel = indentLevel;
	}
	return list;
}

/**
 * Creates a simple list with text items
 */
export function createSimpleList(
	format: "ordered" | "unordered",
	items: string[],
): MockRichTextList {
	return createListBlock(
		format,
		items.map((text) => createSimpleListItem(text)),
	);
}

/**
 * Creates a complete rich text content array with various blocks
 */
export function createMockRichTextContent(): MockRichTextBlock[] {
	return [
		createSimpleHeading(1, "Main Heading"),
		createSimpleParagraph("This is an introductory paragraph."),
		createSimpleHeading(2, "Sub Heading"),
		createParagraphBlock([
			createTextNode("This paragraph has "),
			createTextNode("bold", { bold: true }),
			createTextNode(" and "),
			createTextNode("italic", { italic: true }),
			createTextNode(" text."),
		]),
		createSimpleList("unordered", ["First item", "Second item", "Third item"]),
		createParagraphBlock([
			createTextNode("Check out "),
			createLinkNode(
				"https://example.com",
				[createTextNode("this link")],
				"_blank",
			),
			createTextNode(" for more info."),
		]),
	];
}

/**
 * Creates a paragraph with all text formatting options
 */
export function createFullyFormattedParagraph(): MockRichTextParagraph {
	return createParagraphBlock([
		createTextNode("normal "),
		createTextNode("bold", { bold: true }),
		createTextNode(" "),
		createTextNode("italic", { italic: true }),
		createTextNode(" "),
		createTextNode("underline", { underline: true }),
		createTextNode(" "),
		createTextNode("strikethrough", { strikethrough: true }),
		createTextNode(" "),
		createTextNode("code", { code: true }),
		createTextNode(" "),
		createTextNode("bold-italic", { bold: true, italic: true }),
	]);
}

/**
 * Creates a nested list structure
 */
export function createNestedList(): MockRichTextList {
	return createListBlock("unordered", [
		createSimpleListItem("Top level item 1"),
		createListBlock(
			"ordered",
			[
				createSimpleListItem("Nested item 1.1"),
				createSimpleListItem("Nested item 1.2"),
			],
			1,
		),
		createSimpleListItem("Top level item 2"),
	]);
}
