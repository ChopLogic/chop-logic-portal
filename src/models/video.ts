export type EmbedVideoProvider = "youtube" | "vimeo";

export interface EmbedVideoSource {
	readonly embedUrl: string;
	readonly provider: EmbedVideoProvider;
}
