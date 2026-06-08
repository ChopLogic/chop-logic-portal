/** biome-ignore-all lint/complexity/useLiteralKeys: Access to unknown keys */
import { isRecord } from "./checkers";

export function resolveMediaUrl(
	baseUrl: string,
	media: unknown,
): string | null {
	if (media == null) {
		return null;
	}
	if (typeof media === "object" && "data" in (media as object)) {
		const wrapped = media as { data: unknown };
		return resolveMediaUrl(baseUrl, wrapped.data);
	}
	if (Array.isArray(media)) {
		const first = media[0];
		return resolveMediaUrl(baseUrl, first);
	}
	if (!isRecord(media)) {
		return null;
	}
	const url = media["url"];
	if (typeof url !== "string" || url.length === 0) {
		return null;
	}
	if (url.startsWith("http://") || url.startsWith("https://")) {
		return url;
	}
	return new URL(url, `${baseUrl}/`).toString();
}
