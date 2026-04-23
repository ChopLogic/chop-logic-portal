/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import {
	type RichTextBlock,
	RichTextContentType,
	type RichTextDocument,
	type RichTextHeading,
	type RichTextInlineNode,
	type RichTextLink,
	type RichTextList,
	RichTextListFormat,
	type RichTextListItem,
	type RichTextNode,
	type RichTextParagraph,
} from "../models/rich-text-document";
import { isRecord } from "./checkers";

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

	if (typeof value["url"] !== "string" || !Array.isArray(value["children"])) {
		return null;
	}

	const children: RichTextNode[] = [];
	for (const child of value["children"]) {
		const textNode = parseTextNode(child);
		if (!textNode) {
			return null;
		}
		children.push(textNode);
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

function parseParagraphBlock(value: unknown): RichTextParagraph | null {
	if (!isRecord(value) || value["type"] !== RichTextContentType.Paragraph) {
		return null;
	}

	if (!Array.isArray(value["children"])) {
		return null;
	}

	const children: RichTextInlineNode[] = [];
	for (const child of value["children"]) {
		const inlineNode = parseInlineNode(child);
		if (!inlineNode) {
			return null;
		}
		children.push(inlineNode);
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

	const children: RichTextNode[] = [];
	for (const child of value["children"]) {
		const textNode = parseTextNode(child);
		if (!textNode) {
			return null;
		}
		children.push(textNode);
	}

	return {
		type: RichTextContentType.Heading,
		level: value["level"],
		children,
	};
}

function parseListItemBlock(value: unknown): RichTextListItem | null {
	if (!isRecord(value) || value["type"] !== RichTextContentType.ListItem) {
		return null;
	}

	if (!Array.isArray(value["children"])) {
		return null;
	}

	const children: RichTextInlineNode[] = [];
	for (const child of value["children"]) {
		const inlineNode = parseInlineNode(child);
		if (!inlineNode) {
			return null;
		}
		children.push(inlineNode);
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

	const children: Array<RichTextListItem | RichTextList> = [];
	for (const child of value["children"]) {
		const parsedChild = parseListItemBlock(child) ?? parseListBlock(child);
		if (!parsedChild) {
			return null;
		}
		children.push(parsedChild);
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

function parseBlock(value: unknown): RichTextBlock | null {
	return (
		parseHeadingBlock(value) ??
		parseParagraphBlock(value) ??
		parseListBlock(value)
	);
}

function parseDocument(value: unknown): RichTextDocument | null {
	if (!Array.isArray(value)) {
		return null;
	}

	const blocks: RichTextBlock[] = [];
	for (const item of value) {
		const block = parseBlock(item);
		if (!block) {
			return null;
		}
		blocks.push(block);
	}

	return blocks;
}

/**
 * Parses a JSON string into an array of rich-text documents.
 * Returns an empty array when JSON is malformed or shape is invalid.
 */
export function mapJsonStringToRichTextDocument(
	jsonString: string,
): RichTextDocument[] {
	try {
		const parsed = JSON.parse(jsonString) as unknown;
		if (!Array.isArray(parsed)) {
			return [];
		}

		const documents: RichTextDocument[] = [];
		for (const item of parsed) {
			const document = parseDocument(item);
			if (!document) {
				return [];
			}
			documents.push(document);
		}

		return documents;
	} catch {
		return [];
	}
}
