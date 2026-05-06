import { describe, expect, it } from "vitest";
import { resolveEmbedVideoSource } from "../embed-video";

describe("resolveEmbedVideoSource", () => {
	it("resolves YouTube watch URLs to privacy-enhanced embed URLs", () => {
		expect(
			resolveEmbedVideoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
		).toEqual({
			embedUrl:
				"https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1",
			provider: "youtube",
		});
	});

	it("resolves youtu.be short links", () => {
		expect(
			resolveEmbedVideoSource(
				"https://youtu.be/ZXnEJJu3IHQ?si=g6sYcWxaMmmtS8Ss",
			)?.embedUrl,
		).toBe(
			"https://www.youtube-nocookie.com/embed/ZXnEJJu3IHQ?rel=0&modestbranding=1",
		);
	});

	it("resolves YouTube shorts", () => {
		expect(
			resolveEmbedVideoSource("https://www.youtube.com/shorts/abc123XY_z")
				?.embedUrl,
		).toContain("/embed/abc123XY_z");
	});

	it("resolves Vimeo page URLs", () => {
		expect(resolveEmbedVideoSource("https://vimeo.com/123456789")).toEqual({
			embedUrl: "https://player.vimeo.com/video/123456789",
			provider: "vimeo",
		});
	});

	it("returns null for channel homepages without a video id", () => {
		expect(resolveEmbedVideoSource("https://www.youtube.com/")).toBeNull();
		expect(resolveEmbedVideoSource("https://www.youtube.com/feed")).toBeNull();
	});

	it("returns null for unsupported or unsafe protocols", () => {
		expect(resolveEmbedVideoSource("javascript:alert(1)")).toBeNull();
		expect(resolveEmbedVideoSource("https://evil.example/video")).toBeNull();
		expect(resolveEmbedVideoSource("not-a-url")).toBeNull();
	});
});
