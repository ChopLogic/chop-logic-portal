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
	ComponentSectionsMedia: "sections.media",
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

	if (component === "sections.gallery") {
		if (Array.isArray(out["items"])) {
			out["images"] = out["items"].map((item) => {
				const media = stripTypename(item);
				if (!isRecord(media)) {
					return media;
				}
				return {
					altText:
						typeof media["alternativeText"] === "string"
							? media["alternativeText"]
							: "",
					caption: typeof media["caption"] === "string" ? media["caption"] : "",
					image: media,
				};
			});
		} else if (Array.isArray(out["images"])) {
			out["images"] = out["images"].map(stripTypename);
		}
	}
	if (component === "sections.picture" && out["pictureImage"] != null) {
		out["image"] = out["pictureImage"];
		delete out["pictureImage"];
	}
	if (component === "sections.call-to-action") {
		if (out["picture"] != null) {
			const pic = stripTypename(out["picture"]);
			out["image"] = {
				altText: "",
				caption: "",
				image: pic,
			};
			delete out["picture"];
		} else if (out["image"] != null) {
			out["image"] = stripTypename(out["image"]);
		}
		const sub = out["subHeading"];
		if (typeof sub === "string" && out["subheading"] == null) {
			out["subheading"] = sub;
		}
	}
	if (component === "sections.paragraph" && out["content"] != null) {
		if (out["text"] == null) {
			out["text"] = out["content"];
		}
		const sub = out["subHeading"];
		if (typeof sub === "string" && out["subheading"] == null) {
			out["subheading"] = sub;
		}
	}
	if (component === "sections.embedded-video") {
		const sub = out["subHeading"];
		if (typeof sub === "string" && out["subheading"] == null) {
			out["subheading"] = sub;
		}
	}
	if (component === "sections.reference-list") {
		const sub = out["subHeading"];
		if (typeof sub === "string" && out["subheading"] == null) {
			out["subheading"] = sub;
		}
	}
	if (component === "sections.media") {
		const sub = out["subHeading"];
		if (typeof sub === "string" && out["subheading"] == null) {
			out["subheading"] = sub;
		}
		if (out["item"] != null) {
			out["mediaItem"] = stripTypename(out["item"]);
		}
	}

	return out;
}

/** Normalizes a dynamic zone array from GraphQL so `dynamic-zone.ts` can render it. */
export function normalizeDynamicZoneFromGraphql(zone: unknown): unknown {
	if (!Array.isArray(zone)) {
		return zone;
	}
	return zone.map(normalizeDzBlock);
}
