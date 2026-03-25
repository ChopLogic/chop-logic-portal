/**
 * Strapi Blocks (rich text) → HTML / plain text.
 * @see https://docs.strapi.io/cms/features/blocks
 */

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function blocksToPlainText(blocks: unknown): string {
	if (!Array.isArray(blocks)) {
		return "";
	}
	const parts: string[] = [];
	for (const block of blocks) {
		collectPlainText(block, parts);
	}
	return parts.join(" ").replace(/\s+/g, " ").trim();
}

function collectPlainText(node: unknown, out: string[]): void {
	if (!isRecord(node)) {
		return;
	}
	if (node["type"] === "text" && typeof node["text"] === "string") {
		out.push(node["text"]);
		return;
	}
	const children = node["children"];
	if (Array.isArray(children)) {
		for (const c of children) {
			collectPlainText(c, out);
		}
	}
}

export function blocksToHtml(blocks: unknown): string {
	if (!Array.isArray(blocks)) {
		return "";
	}
	return blocks.map((b) => blockToHtml(b)).join("");
}

function blockToHtml(node: unknown): string {
	if (!isRecord(node)) {
		return "";
	}
	const type = node["type"];
	switch (type) {
		case "paragraph":
			return `<p>${childrenToHtml(node["children"])}</p>`;
		case "heading": {
			const levelRaw = node["level"];
			const level =
				typeof levelRaw === "number" && levelRaw >= 1 && levelRaw <= 6
					? levelRaw
					: 2;
			return `<h${level}>${childrenToHtml(node["children"])}</h${level}>`;
		}
		case "quote":
			return `<blockquote>${childrenToHtml(node["children"])}</blockquote>`;
		case "code": {
			const plain = node["plainText"];
			return `<pre><code>${escapeHtml(
				typeof plain === "string" ? plain : "",
			)}</code></pre>`;
		}
		case "list": {
			const format = node["format"] === "ordered" ? "ol" : "ul";
			const ch = node["children"];
			const items = Array.isArray(ch)
				? ch.map((li) => blockToHtml(li)).join("")
				: "";
			return `<${format}>${items}</${format}>`;
		}
		case "list-item":
			return `<li>${childrenToHtml(node["children"])}</li>`;
		default:
			return childrenToHtml(node["children"]);
	}
}

function childrenToHtml(children: unknown): string {
	if (!Array.isArray(children)) {
		return "";
	}
	return children.map((c) => inlineToHtml(c)).join("");
}

function inlineToHtml(node: unknown): string {
	if (!isRecord(node)) {
		return "";
	}
	if (node["type"] === "text") {
		let text = escapeHtml(typeof node["text"] === "string" ? node["text"] : "");
		if (node["code"] === true) {
			text = `<code>${text}</code>`;
		}
		if (node["strikethrough"] === true) {
			text = `<del>${text}</del>`;
		}
		if (node["underline"] === true) {
			text = `<u>${text}</u>`;
		}
		if (node["italic"] === true) {
			text = `<em>${text}</em>`;
		}
		if (node["bold"] === true) {
			text = `<strong>${text}</strong>`;
		}
		return text;
	}
	if (node["type"] === "link") {
		const url = typeof node["url"] === "string" ? node["url"] : "#";
		const inner = childrenToHtml(node["children"]);
		return `<a href="${escapeHtml(url)}">${inner}</a>`;
	}
	return childrenToHtml(node["children"]);
}
