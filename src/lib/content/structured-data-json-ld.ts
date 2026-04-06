import type { JsonValue } from "./models/json";

/**
 * Produces safe inner HTML for `<script type="application/ld+json">`.
 * Returns `null` when there is nothing valid to emit.
 */
export function structuredDataToJsonLdHtml(
	structuredData: JsonValue | undefined,
): string | null {
	if (structuredData === undefined || structuredData === null) {
		return null;
	}

	let graph: unknown = structuredData;
	if (typeof structuredData === "string") {
		const t = structuredData.trim();
		if (t.length === 0) {
			return null;
		}
		try {
			graph = JSON.parse(t) as unknown;
		} catch {
			return null;
		}
	}

	if (typeof graph !== "object" || graph === null) {
		return null;
	}

	return JSON.stringify(graph).replace(/</g, "\\u003c");
}
