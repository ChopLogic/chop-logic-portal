/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	type RichTextBlock,
	RichTextContentType,
	type RichTextHeading,
	type RichTextInlineNode,
	type RichTextItem,
	type RichTextLink,
	type RichTextList,
	RichTextListFormat,
	type RichTextListItem,
	type RichTextNode,
	type RichTextParagraph,
} from "../models/rich-text-block";
import { isRecord } from "./checkers";

function parseArrayItems<T>(
	value: unknown,
	mapper: (item: unknown) => T | null,
): T[] | null {
	if (!Array.isArray(value)) {
		return null;
	}

	const items: T[] = [];
	for (const item of value) {
		const mapped = mapper(item);
		if (!mapped) {
			return null;
		}
		items.push(mapped);
	}

	return items;
}

function parseTextNode(value: unknown): RichTextNode | null {
	if (!isRecord(value) || value["type"] !== RichTextContentType.Text) {
		return null;
	}

	if (typeof value["text"] !== "string") {
		return null;
	}

	return {
		type: RichTextContentType.Text,
		text: value["text"],
		bold: value["bold"] === true ? true : undefined,
		italic: value["italic"] === true ? true : undefined,
		underline: value["underline"] === true ? true : undefined,
		strikethrough: value["strikethrough"] === true ? true : undefined,
		code: value["code"] === true ? true : undefined,
	};
}

function parseLinkNode(value: unknown): RichTextLink | null {
	if (!isRecord(value) || value["type"] !== RichTextContentType.Link) {
		return null;
	}

	if (typeof value["url"] !== "string") {
		return null;
	}

	const children = parseArrayItems(value["children"], parseTextNode);
	if (!children) {
		return null;
	}

	return {
		type: RichTextContentType.Link,
		url: value["url"],
		target: typeof value["target"] === "string" ? value["target"] : undefined,
		children,
	};
}

function parseInlineNode(value: unknown): RichTextInlineNode | null {
	const textNode = parseTextNode(value);
	if (textNode) {
		return textNode;
	}

	return parseLinkNode(value);
}

function parseInlineContainer(
	value: unknown,
	type: RichTextContentType.Paragraph | RichTextContentType.ListItem,
): RichTextInlineNode[] | null {
	if (!isRecord(value) || value["type"] !== type) {
		return null;
	}

	const children = parseArrayItems(value["children"], parseInlineNode);
	if (!children) {
		return null;
	}

	return children;
}

function parseParagraphBlock(value: unknown): RichTextParagraph | null {
	const children = parseInlineContainer(value, RichTextContentType.Paragraph);
	if (!children) {
		return null;
	}

	return {
		type: RichTextContentType.Paragraph,
		children,
	};
}

function parseHeadingBlock(value: unknown): RichTextHeading | null {
	if (!isRecord(value) || value["type"] !== RichTextContentType.Heading) {
		return null;
	}

	if (typeof value["level"] !== "number" || !Array.isArray(value["children"])) {
		return null;
	}

	const children = parseArrayItems(value["children"], parseTextNode);
	if (!children) {
		return null;
	}

	return {
		type: RichTextContentType.Heading,
		level: value["level"],
		children,
	};
}

function parseListItemBlock(value: unknown): RichTextListItem | null {
	const children = parseInlineContainer(value, RichTextContentType.ListItem);
	if (!children) {
		return null;
	}

	return {
		type: RichTextContentType.ListItem,
		children,
	};
}

function parseListBlock(value: unknown): RichTextList | null {
	if (!isRecord(value) || value["type"] !== RichTextContentType.List) {
		return null;
	}

	const format = value["format"];
	if (
		format !== RichTextListFormat.Ordered &&
		format !== RichTextListFormat.Unordered
	) {
		return null;
	}

	if (!Array.isArray(value["children"])) {
		return null;
	}

	const children = parseArrayItems(
		value["children"],
		(child): RichTextListItem | RichTextList | null =>
			parseListItemBlock(child) ?? parseListBlock(child),
	);
	if (!children) {
		return null;
	}

	return {
		type: RichTextContentType.List,
		format,
		indentLevel:
			typeof value["indentLevel"] === "number"
				? value["indentLevel"]
				: undefined,
		children,
	};
}

function parseItem(value: unknown): RichTextItem | null {
	return (
		parseHeadingBlock(value) ??
		parseParagraphBlock(value) ??
		parseListBlock(value)
	);
}

function parseBlock(value: unknown): RichTextBlock | null {
	return parseArrayItems(value, parseItem);
}

/**
 * Parses a JSON string into an array of rich-text blocks.
 * Returns an empty array when JSON is malformed or shape is invalid.
 */
export function mapJsonStringToRichTextBlock(
	jsonString: string,
): RichTextBlock[] {
	try {
		const parsed = JSON.parse(jsonString) as unknown;
		return parseArrayItems(parsed, parseBlock) ?? [];
	} catch {
		return [];
	}
}
