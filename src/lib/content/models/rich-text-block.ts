export enum RichTextContentType {
	Heading = "heading",
	Paragraph = "paragraph",
	List = "list",
	ListItem = "list-item",
	Link = "link",
	Text = "text",
}

export enum RichTextListFormat {
	Ordered = "ordered",
	Unordered = "unordered",
}

interface RichTextBaseNode {
	readonly type: RichTextContentType;
}

export interface RichTextNode extends RichTextBaseNode {
	readonly type: RichTextContentType.Text;
	readonly text: string;
	readonly bold?: boolean;
	readonly italic?: boolean;
	readonly underline?: boolean;
	readonly strikethrough?: boolean;
	readonly code?: boolean;
}

export interface RichTextLink extends RichTextBaseNode {
	readonly type: RichTextContentType.Link;
	readonly url: string;
	readonly target?: string;
	readonly children: readonly RichTextNode[];
}

export type RichTextInlineNode = RichTextNode | RichTextLink;

export interface RichTextParagraph extends RichTextBaseNode {
	readonly type: RichTextContentType.Paragraph;
	readonly children: readonly RichTextInlineNode[];
}

export interface RichTextHeading extends RichTextBaseNode {
	readonly type: RichTextContentType.Heading;
	readonly level: number;
	readonly children: readonly RichTextNode[];
}

export interface RichTextListItem extends RichTextBaseNode {
	readonly type: RichTextContentType.ListItem;
	readonly children: readonly RichTextInlineNode[];
}

export interface RichTextList extends RichTextBaseNode {
	readonly type: RichTextContentType.List;
	readonly format: RichTextListFormat;
	readonly indentLevel?: number;
	readonly children: readonly (RichTextListItem | RichTextList)[];
}

export type RichTextItem = RichTextHeading | RichTextParagraph | RichTextList;

export type RichTextContent = readonly RichTextItem[];
