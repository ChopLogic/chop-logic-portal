import { blocksToHtml } from "./blocks";
import { resolveMediaUrl } from "./media";

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

function renderPictureComponent(baseUrl: string, picture: unknown): string {
	if (!isRecord(picture)) {
		return "";
	}
	const alt = typeof picture["altText"] === "string" ? picture["altText"] : "";
	const caption =
		typeof picture["caption"] === "string" ? picture["caption"] : "";
	const src = resolveMediaUrl(baseUrl, picture["image"]);
	if (!src) {
		return "";
	}
	const cap = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
	return `<figure class="cms-picture"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />${cap}</figure>`;
}

function renderLink(link: unknown): string {
	if (!isRecord(link)) {
		return "";
	}
	const text = typeof link["text"] === "string" ? link["text"] : "";
	const url = typeof link["url"] === "string" ? link["url"] : "#";
	const target = typeof link["target"] === "string" ? link["target"] : "_blank";
	return `<a href="${escapeHtml(url)}" target="${escapeHtml(target)}" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
}

/**
 * Renders Strapi dynamic zone blocks (flattened v5 entries) to HTML.
 */
export function dynamicZoneToHtml(baseUrl: string, zone: unknown): string {
	if (!Array.isArray(zone)) {
		return "";
	}
	return zone.map((block) => blockToHtml(baseUrl, block)).join("\n");
}

function blockToHtml(baseUrl: string, block: unknown): string {
	if (!isRecord(block)) {
		return "";
	}
	const kind =
		typeof block["__component"] === "string" ? block["__component"] : "";

	switch (kind) {
		case "sections.paragraph": {
			const align =
				typeof block["alignment"] === "string" ? block["alignment"] : "left";
			const hd = block["heading"];
			const heading =
				typeof hd === "string" && hd.length > 0
					? `<h3>${escapeHtml(hd)}</h3>`
					: "";
			const body = blocksToHtml(block["text"]);
			return `<section class="cms-paragraph" style="text-align:${escapeHtml(align)}">${heading}${body}</section>`;
		}
		case "sections.picture":
			return renderPictureComponent(baseUrl, block);
		case "sections.call-to-action": {
			const hRaw = block["heading"];
			const h =
				typeof hRaw === "string" && hRaw.length > 0
					? `<h3>${escapeHtml(hRaw)}</h3>`
					: "";
			const subRaw = block["subheading"];
			const sub =
				typeof subRaw === "string" && subRaw.length > 0
					? `<p>${escapeHtml(subRaw)}</p>`
					: "";
			const linkHtml = renderLink(block["link"]);
			const img =
				block["image"] != null
					? renderPictureComponent(baseUrl, block["image"])
					: "";
			return `<section class="cms-cta">${h}${sub}${linkHtml}${img}</section>`;
		}
		case "sections.reference-list": {
			const hd = block["heading"];
			const heading =
				typeof hd === "string" && hd.length > 0
					? `<h3>${escapeHtml(hd)}</h3>`
					: "";
			const linksArr = block["links"];
			const links = Array.isArray(linksArr)
				? `<ul>${linksArr.map((l) => `<li>${renderLink(l)}</li>`).join("")}</ul>`
				: "";
			return `<section class="cms-ref-list">${heading}${links}</section>`;
		}
		case "sections.embedded-video": {
			const hd = block["heading"];
			const heading =
				typeof hd === "string" && hd.length > 0
					? `<h3>${escapeHtml(hd)}</h3>`
					: "";
			const platform =
				typeof block["platform"] === "string" ? block["platform"] : "";
			const linkHtml = renderLink(block["link"]);
			return `<section class="cms-embed"><p>${escapeHtml(platform)}</p>${heading}<p>${linkHtml}</p></section>`;
		}
		case "sections.gallery": {
			const hd = block["heading"];
			const heading =
				typeof hd === "string" && hd.length > 0
					? `<h3>${escapeHtml(hd)}</h3>`
					: "";
			const imgs = block["images"];
			const images = Array.isArray(imgs)
				? imgs.map((pic) => renderPictureComponent(baseUrl, pic)).join("")
				: "";
			return `<section class="cms-gallery">${heading}<div class="cms-gallery-grid">${images}</div></section>`;
		}
		case "sections.internal-video":
			return `<section class="cms-internal-video"><p>Video</p></section>`;
		default:
			return "";
	}
}
