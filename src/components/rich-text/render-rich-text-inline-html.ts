import {
	RichTextContentType,
	type RichTextInlineNode,
	type RichTextLink,
	type RichTextListItem,
	type RichTextNode,
} from "../../lib/content/models/rich-text-block";

export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export function renderRichTextNodeHtml(node: RichTextNode): string {
	let html = escapeHtml(node.text);
	if (node.code === true) {
		html = `<code>${html}</code>`;
	}
	if (node.strikethrough === true) {
		html = `<del>${html}</del>`;
	}
	if (node.underline === true) {
		html = `<u>${html}</u>`;
	}
	if (node.italic === true) {
		html = `<em>${html}</em>`;
	}
	if (node.bold === true) {
		html = `<strong>${html}</strong>`;
	}
	return html;
}

export function renderRichTextLinkHtml(link: RichTextLink): string {
	const inner = link.children.map(renderRichTextNodeHtml).join("");
	const href = escapeHtml(link.url);
	const targetAttr =
		typeof link.target === "string" && link.target.length > 0
			? ` target="${escapeHtml(link.target)}"`
			: "";
	const rel =
		link.target === "_blank" || link.target === "blank"
			? ' rel="noopener noreferrer"'
			: "";
	return `<a href="${href}"${targetAttr}${rel}>${inner}</a>`;
}

export function renderRichTextInlineHtml(node: RichTextInlineNode): string {
	if (node.type === RichTextContentType.Text) {
		return renderRichTextNodeHtml(node);
	}
	if (node.type === RichTextContentType.Link) {
		return renderRichTextLinkHtml(node);
	}
	return "";
}

export function renderListItemInnerHtml(item: RichTextListItem): string {
	return item.children.map(renderRichTextInlineHtml).join("");
}
