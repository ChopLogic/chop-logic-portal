/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import { isRecord } from "../../checks";
import { type Link, LinkTarget, LinkType, ReferrerPolicy } from "../models";

export function mapLink(raw: unknown): Link | null {
	if (!isRecord(raw)) {
		return null;
	}

	return {
		id: typeof raw["id"] === "number" ? String(raw["id"]) : "",
		url: typeof raw["url"] === "string" ? raw["url"] : "",
		text: typeof raw["text"] === "string" ? raw["text"] : "",
		target:
			typeof raw["target"] === "string"
				? (raw["target"] as LinkTarget)
				: LinkTarget.Blank,
		type:
			typeof raw["type"] === "string"
				? (raw["type"] as LinkType)
				: LinkType.External,
		referrerpolicy:
			typeof raw["referrerpolicy"] === "string"
				? (raw["referrerpolicy"] as ReferrerPolicy)
				: ReferrerPolicy.NoReferrer,
	};
}

export function mapLinks(raw: unknown[]): Link[] {
	return raw.map(mapLink).filter((link): link is Link => link !== null);
}
