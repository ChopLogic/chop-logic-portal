/**
 * Strapi 5 REST populate query params for dynamic zones and nested components.
 * @see https://docs.strapi.io/cms/api/rest/guides/populate-dynamic-zones
 */
export function appendDynamicZonePopulate(params: URLSearchParams): void {
	params.set("populate[content][on][sections.paragraph]", "true");
	params.set(
		"populate[content][on][sections.picture][populate][image]",
		"true",
	);
	params.set(
		"populate[content][on][sections.call-to-action][populate][link]",
		"true",
	);
	params.set(
		"populate[content][on][sections.call-to-action][populate][image][populate][image]",
		"true",
	);
	params.set(
		"populate[content][on][sections.reference-list][populate][links]",
		"true",
	);
	params.set(
		"populate[content][on][sections.embedded-video][populate][link]",
		"true",
	);
	params.set(
		"populate[content][on][sections.gallery][populate][images][populate][image]",
		"true",
	);
	params.set("populate[content][on][sections.internal-video]", "true");
}

export function appendArticleListPopulate(params: URLSearchParams): void {
	params.set("populate[preview]", "true");
	params.set("populate[metaData]", "true");
}

export function appendArticleDetailPopulate(params: URLSearchParams): void {
	appendArticleListPopulate(params);
	params.set("populate[authors]", "true");
	appendDynamicZonePopulate(params);
}
