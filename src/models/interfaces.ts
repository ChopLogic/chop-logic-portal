export interface Config {
	get(key: string): string | undefined;
	getApiUrl(): string;
	getApiToken(): string | null;
	getSiteUrl(): string;
	isProduction(): boolean;
}

export interface Client {
	executeQuery<T = unknown>(
		query: string,
		variables?: Record<string, unknown> | undefined,
	): Promise<T>;
}
