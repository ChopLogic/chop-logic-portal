/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import { isRecord } from "../../checks";
import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	type SocialPlatform,
} from "../models";

function normalizeLinkTarget(raw: string): LinkTarget {
	if (
		raw === LinkTarget.Blank ||
		raw === "_blank" ||
		raw === "blank" ||
		raw === ""
	) {
		return LinkTarget.Blank;
	}
	if (raw === LinkTarget.Self || raw === "_self" || raw === "self") {
		return LinkTarget.Self;
	}
	if (raw === LinkTarget.Parent || raw === "_parent") {
		return LinkTarget.Parent;
	}
	if (raw === LinkTarget.Top || raw === "_top") {
		return LinkTarget.Top;
	}
	return LinkTarget.Blank;
}

export function mapLink(raw: unknown): Link | null {
	if (!isRecord(raw)) {
		return null;
	}

	const idRaw = raw["id"];
	const id =
		typeof idRaw === "number"
			? String(idRaw)
			: typeof idRaw === "string"
				? idRaw
				: "";

	const targetRaw = typeof raw["target"] === "string" ? raw["target"] : "";
	const target = normalizeLinkTarget(targetRaw);

	return {
		id,
		url: typeof raw["url"] === "string" ? raw["url"] : "",
		text: typeof raw["text"] === "string" ? raw["text"] : "",
		target,
		type:
			typeof raw["type"] === "string"
				? (raw["type"] as LinkType)
				: LinkType.External,
		referrerpolicy:
			typeof raw["referrerpolicy"] === "string"
				? (raw["referrerpolicy"] as ReferrerPolicy)
				: ReferrerPolicy.StrictOriginWhenCrossOrigin,
		...(typeof raw["platform"] === "string" && raw["platform"].length > 0
			? { platform: raw["platform"] as SocialPlatform }
			: {}),
	};
}

export function mapLinks(raw: unknown[]): Link[] {
	return raw.map(mapLink).filter((link): link is Link => link !== null);
}
