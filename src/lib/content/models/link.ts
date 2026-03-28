export interface Link {
	id: string;
	url: string;
	text: string;
	target: LinkTarget;
	type: LinkType;
	referrerpolicy: ReferrerPolicy;
	platform?: SocialPlatform;
}

export enum SocialPlatform {
	LinkedIn = "LinkedIn",
	Facebook = "Facebook",
	Telegram = "Telegram",
	YouTube = "YouTube",
	WhatsApp = "WhatsApp",
	Instagram = "Instagram",
	TikTok = "TikTok",
	Reddit = "Reddit",
	Pinterest = "Pinterest",
	XTwitter = "X/Twitter",
	Medium = "Medium",
	Discord = "Discord",
	GitHub = "GitHub",
}

export enum LinkTarget {
	Blank = "_blank",
	Self = "_self",
	Parent = "_parent",
	Top = "_top",
}

export enum ReferrerPolicy {
	NoReferrer = "no-referrer",
	NoReferrerWhenDowngrade = "no-referrer-when-downgrade",
	Origin = "origin",
	OriginWhenCrossOrigin = "origin-when-cross-origin",
	UnsafeURL = "unsafe-url",
	SameOrigin = "same-origin",
	StrictOrigin = "strict-origin",
	StrictOriginWhenCrossOrigin = "strict-origin-when-cross-origin",
}

export enum LinkType {
	Internal = "internal",
	External = "external",
}
