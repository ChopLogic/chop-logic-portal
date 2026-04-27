import {
	RichTextContentType,
	type RichTextInlineNode,
	type RichTextLink,
	type RichTextList,
	RichTextListFormat,
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

/**
 * Strapi nests sub-lists as siblings after the parent `list-item` (not inside it).
 * Merge those trailing `list` nodes into the preceding `<li>` so markup matches HTML list semantics.
 */
function buildRichTextListItemsHtml(
	children: readonly (RichTextListItem | RichTextList)[],
): string {
	const parts: string[] = [];
	let i = 0;
	while (i < children.length) {
		const c = children[i];
		if (!c) {
			break;
		}
		if (c.type === RichTextContentType.ListItem) {
			i++;
			const nestedLists: RichTextList[] = [];
			while (i < children.length) {
				const next = children[i];
				if (next?.type === RichTextContentType.List) {
					nestedLists.push(next);
					i++;
				} else {
					break;
				}
			}
			const itemHtml = renderListItemInnerHtml(c);
			const nestedHtml = nestedLists.map(renderRichTextListHtml).join("");
			parts.push(`<li>${itemHtml}${nestedHtml}</li>`);
		} else if (c.type === RichTextContentType.List) {
			parts.push(`<li>${renderRichTextListHtml(c)}</li>`);
			i++;
		} else {
			i++;
		}
	}
	return parts.join("");
}

export function renderRichTextListHtml(list: RichTextList): string {
	const tag = list.format === RichTextListFormat.Ordered ? "ol" : "ul";
	const indentAttr =
		typeof list.indentLevel === "number" && Number.isFinite(list.indentLevel)
			? ` data-indent-level="${list.indentLevel}"`
			: "";
	return `<${tag}${indentAttr}>${buildRichTextListItemsHtml(list.children)}</${tag}>`;
}

/** Inner `<li>…</li>` sequence only (for `set:html` on the root `<ol>` / `<ul>`). */
export function renderRichTextListBodyHtml(list: RichTextList): string {
	return buildRichTextListItemsHtml(list.children);
}
