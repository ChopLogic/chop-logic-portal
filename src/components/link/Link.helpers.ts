import { type Link, LinkTarget, LinkType } from "@models";

/** `rel` for CMS links that open in a new browsing context. */
export function buildCmsLinkRel(link: Link): string | undefined {
	if (link.target === LinkTarget.Blank) {
		return "noopener noreferrer";
	}
	return undefined;
}

export function isExternalLink(link: Link): boolean {
	return link.type === LinkType.External;
}
