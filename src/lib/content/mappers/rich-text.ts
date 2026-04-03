import { blocksToHtml, blocksToPlainText } from "../../cms/strapi/blocks";
import {
	type RichTextDocument,
	richTextDocumentSchema,
} from "../schemas/rich-text";

export function parseRichTextDocument(raw: unknown): RichTextDocument | null {
	const parsed = richTextDocumentSchema.safeParse(raw);
	return parsed.success ? parsed.data : null;
}

export function richTextToHtml(doc: RichTextDocument): string {
	return blocksToHtml(doc);
}

export function richTextToPlainText(doc: RichTextDocument): string {
	return blocksToPlainText(doc);
}
