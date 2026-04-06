import { z } from "zod";

/** Strapi Blocks node (recursive); matches fields we validate and render. */
export interface RichTextNode {
	readonly type: string;
	readonly children?: readonly RichTextNode[];
	readonly text?: string;
	readonly level?: number;
	readonly format?: string;
	readonly url?: string;
	readonly plainText?: string;
	readonly bold?: boolean;
	readonly italic?: boolean;
	readonly strikethrough?: boolean;
	readonly underline?: boolean;
	readonly code?: boolean;
}

const richTextBlockSchema: z.ZodType<RichTextNode> = z.lazy(() =>
	z
		.object({
			type: z.string(),
			children: z.array(richTextBlockSchema).optional(),
			text: z.string().optional(),
			level: z.number().optional(),
			format: z.string().optional(),
			url: z.string().optional(),
			plainText: z.string().optional(),
			bold: z.boolean().optional(),
			italic: z.boolean().optional(),
			strikethrough: z.boolean().optional(),
			underline: z.boolean().optional(),
			code: z.boolean().optional(),
		})
		.passthrough(),
);

export const richTextDocumentSchema = z.array(richTextBlockSchema);

export type RichTextDocument = z.infer<typeof richTextDocumentSchema>;
