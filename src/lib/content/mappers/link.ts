/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */

import {
	type Link,
	LinkTarget,
	LinkType,
	ReferrerPolicy,
	SocialPlatform,
} from "../models";
import { isRecord } from "./checkers";
import { normalizeRequiredString } from "./normalizers";

function normalizeLinkTarget(raw: unknown): LinkTarget {
	if (raw === "_self" || raw === "self") {
		return LinkTarget.Self;
	} else if (raw === "parent" || raw === "_parent") {
		return LinkTarget.Parent;
	} else if (raw === "top" || raw === "_top") {
		return LinkTarget.Top;
	}

	return LinkTarget.Blank;
}

function normalizeLinkType(raw: unknown): LinkType {
	if (raw === "internal") {
		return LinkType.Internal;
	}

	return LinkType.External;
}

function normalizeReferrerPolicy(raw: unknown): ReferrerPolicy {
	switch (raw) {
		case "no-referrer":
			return ReferrerPolicy.NoReferrer;
		case "no-referrer-when-downgrade":
			return ReferrerPolicy.NoReferrerWhenDowngrade;
		case "origin":
			return ReferrerPolicy.Origin;
		case "origin-when-cross-origin":
			return ReferrerPolicy.OriginWhenCrossOrigin;
		case "unsafe-url":
			return ReferrerPolicy.UnsafeURL;
		case "same-origin":
			return ReferrerPolicy.SameOrigin;
		case "strict-origin":
			return ReferrerPolicy.StrictOrigin;
		default:
			return ReferrerPolicy.StrictOriginWhenCrossOrigin;
	}
}

function normalizeSocialPlatform(raw: unknown): SocialPlatform | undefined {
	switch (raw) {
		case "LinkedIn":
			return SocialPlatform.LinkedIn;
		case "Facebook":
			return SocialPlatform.Facebook;
		case "Telegram":
			return SocialPlatform.Telegram;
		case "YouTube":
			return SocialPlatform.YouTube;
		case "WhatsApp":
			return SocialPlatform.WhatsApp;
		case "Instagram":
			return SocialPlatform.Instagram;
		case "TikTok":
			return SocialPlatform.TikTok;
		case "Reddit":
			return SocialPlatform.Reddit;
		case "Pinterest":
			return SocialPlatform.Pinterest;
		case "XTwitter":
			return SocialPlatform.XTwitter;
		case "Medium":
			return SocialPlatform.Medium;
		case "Discord":
			return SocialPlatform.Discord;
		case "GitHub":
			return SocialPlatform.GitHub;
		default:
			return undefined;
	}
}

export function mapLink(raw: unknown): Link | null {
	if (!isRecord(raw)) {
		return null;
	}

	return {
		id: normalizeRequiredString(raw["id"]),
		target: normalizeLinkTarget(raw["target"]),
		url: normalizeRequiredString(raw["url"]),
		text: normalizeRequiredString(raw["text"]),
		type: normalizeLinkType(raw["type"]),
		referrerpolicy: normalizeReferrerPolicy(raw["referrerpolicy"]),
		platform: normalizeSocialPlatform(raw["platform"]),
	};
}

export function mapLinks(raw: unknown[]): Link[] {
	return raw.map(mapLink).filter((link): link is Link => link !== null);
}
