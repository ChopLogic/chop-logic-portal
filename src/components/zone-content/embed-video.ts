export type EmbedVideoProvider = "youtube" | "vimeo";

export interface EmbedVideoSource {
	readonly embedUrl: string;
	readonly provider: EmbedVideoProvider;
}

const YOUTUBE_HOSTS = new Set([
	"youtube.com",
	"www.youtube.com",
	"m.youtube.com",
	"youtu.be",
	"www.youtube-nocookie.com",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

function parseHttpUrl(raw: string): URL | null {
	try {
		const parsed = new URL(raw);
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

function resolveYouTubeEmbed(parsed: URL): EmbedVideoSource | null {
	const host = parsed.hostname.replace(/^www\./, "");
	if (!YOUTUBE_HOSTS.has(parsed.hostname) && host !== "youtu.be") {
		return null;
	}

	let videoId: string | null = null;

	if (parsed.hostname === "youtu.be") {
		videoId = parsed.pathname.slice(1).split("/")[0] || null;
	} else if (parsed.pathname.startsWith("/embed/")) {
		videoId = parsed.pathname.slice("/embed/".length).split("/")[0] || null;
	} else if (parsed.pathname.startsWith("/shorts/")) {
		videoId = parsed.pathname.slice("/shorts/".length).split("/")[0] || null;
	} else {
		videoId = parsed.searchParams.get("v");
	}

	if (!videoId || !/^[a-zA-Z0-9_-]{6,}$/.test(videoId)) {
		return null;
	}

	const embed = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
	embed.searchParams.set("rel", "0");
	embed.searchParams.set("modestbranding", "1");

	return {
		embedUrl: embed.toString(),
		provider: "youtube",
	};
}

function resolveVimeoEmbed(parsed: URL): EmbedVideoSource | null {
	const host = parsed.hostname.replace(/^www\./, "");
	if (!VIMEO_HOSTS.has(parsed.hostname) && host !== "vimeo.com") {
		return null;
	}

	let videoId: string | null = null;

	if (parsed.hostname === "player.vimeo.com") {
		const match = /^\/video\/(\d+)/.exec(parsed.pathname);
		videoId = match?.[1] ?? null;
	} else {
		videoId = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
	}

	if (!videoId || !/^\d+$/.test(videoId)) {
		return null;
	}

	return {
		embedUrl: `https://player.vimeo.com/video/${videoId}`,
		provider: "vimeo",
	};
}

/**
 * Converts a supported watch/share URL into a provider embed URL.
 * Returns null when the URL is not a recognized YouTube or Vimeo video link.
 */
export function resolveEmbedVideoSource(url: string): EmbedVideoSource | null {
	const parsed = parseHttpUrl(url);
	if (!parsed) {
		return null;
	}

	const host = parsed.hostname.toLowerCase();

	if (
		YOUTUBE_HOSTS.has(host) ||
		host === "youtu.be" ||
		host.endsWith(".youtube.com")
	) {
		return resolveYouTubeEmbed(parsed);
	}

	if (VIMEO_HOSTS.has(host) || host.endsWith(".vimeo.com")) {
		return resolveVimeoEmbed(parsed);
	}

	return null;
}
