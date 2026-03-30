function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Maps Strapi GraphQL `__typename` on dynamic-zone blocks to REST-style `__component`. */
const graphQlTypenameToComponent: Record<string, string> = {
	ComponentSectionsParagraph: "sections.paragraph",
	ComponentSectionsPicture: "sections.picture",
	ComponentSectionsCallToAction: "sections.call-to-action",
	ComponentSectionsReferenceList: "sections.reference-list",
	ComponentSectionsEmbeddedVideo: "sections.embedded-video",
	ComponentSectionsGallery: "sections.gallery",
	ComponentSectionsInternalVideo: "sections.internal-video",
};

function stripTypename(value: unknown): unknown {
	if (!isRecord(value)) {
		return value;
	}
	const next: Record<string, unknown> = { ...value };
	delete next["__typename"];
	return next;
}

function normalizeDzBlock(block: unknown): unknown {
	if (!isRecord(block)) {
		return block;
	}
	const out: Record<string, unknown> = { ...block };
	const tn = out["__typename"];
	if (typeof tn === "string" && graphQlTypenameToComponent[tn]) {
		out["__component"] = graphQlTypenameToComponent[tn];
	}
	delete out["__typename"];

	const component =
		typeof out["__component"] === "string" ? out["__component"] : "";

	if (component === "sections.gallery" && Array.isArray(out["images"])) {
		out["images"] = out["images"].map(stripTypename);
	}
	if (component === "sections.picture" && out["pictureImage"] != null) {
		out["image"] = out["pictureImage"];
		delete out["pictureImage"];
	}
	if (component === "sections.call-to-action" && out["image"] != null) {
		out["image"] = stripTypename(out["image"]);
	}

	return out;
}

/** Normalizes a dynamic zone array from GraphQL so existing `dynamic-zone.ts` can render it. */
export function normalizeDynamicZoneFromGraphql(zone: unknown): unknown {
	if (!Array.isArray(zone)) {
		return zone;
	}
	return zone.map(normalizeDzBlock);
}
