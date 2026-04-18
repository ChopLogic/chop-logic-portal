export type StrapiClientConfig = {
	baseUrl: string;
	apiToken?: string;
};

export function strapiFetch(
	config: StrapiClientConfig,
	apiPath: string,
	searchParams?: URLSearchParams,
): Promise<Response> {
	const url = new URL(apiPath, `${config.baseUrl}/`);
	if (searchParams) {
		url.search = searchParams.toString();
	}
	const headers = new Headers();
	if (config.apiToken) {
		headers.set("Authorization", `Bearer ${config.apiToken}`);
	}
	return fetch(url, { headers });
}
