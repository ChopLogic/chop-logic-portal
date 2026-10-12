import { describe, expect, it } from "vitest";
import { resolveEmbedVideoSource } from "../video";

describe("resolveEmbedVideoSource", () => {
	describe("YouTube URL handling", () => {
		describe("standard watch URLs", () => {
			it("resolves YouTube watch URLs to privacy-enhanced embed URLs", () => {
				expect(
					resolveEmbedVideoSource(
						"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
					),
				).toEqual({
					embedUrl:
						"https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1",
					provider: "youtube",
				});
			});

			it("handles watch URL without www prefix", () => {
				const result = resolveEmbedVideoSource(
					"https://youtube.com/watch?v=abc123XYZ",
				);
				expect(result?.embedUrl).toContain("/embed/abc123XYZ");
				expect(result?.provider).toBe("youtube");
			});

			it("handles watch URL with additional query parameters", () => {
				const result = resolveEmbedVideoSource(
					"https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120&list=PLxyz",
				);
				expect(result?.embedUrl).toContain("/embed/dQw4w9WgXcQ");
			});

			it("handles mobile YouTube URLs", () => {
				const result = resolveEmbedVideoSource(
					"https://m.youtube.com/watch?v=test123456",
				);
				expect(result?.embedUrl).toContain("/embed/test123456");
			});
		});

		describe("youtu.be short links", () => {
			it("resolves youtu.be short links", () => {
				expect(
					resolveEmbedVideoSource(
						"https://youtu.be/ZXnEJJu3IHQ?si=g6sYcWxaMmmtS8Ss",
					)?.embedUrl,
				).toBe(
					"https://www.youtube-nocookie.com/embed/ZXnEJJu3IHQ?rel=0&modestbranding=1",
				);
			});

			it("resolves youtu.be without query params", () => {
				const result = resolveEmbedVideoSource("https://youtu.be/abc123XYZ_-");
				expect(result?.embedUrl).toContain("/embed/abc123XYZ_-");
			});

			it("resolves youtu.be with timestamp", () => {
				const result = resolveEmbedVideoSource(
					"https://youtu.be/abc123XYZ?t=60",
				);
				expect(result?.embedUrl).toContain("/embed/abc123XYZ");
			});
		});

		describe("YouTube shorts", () => {
			it("resolves YouTube shorts", () => {
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/shorts/abc123XY_z")
						?.embedUrl,
				).toContain("/embed/abc123XY_z");
			});

			it("resolves shorts without www", () => {
				const result = resolveEmbedVideoSource(
					"https://youtube.com/shorts/shortVideo1",
				);
				expect(result?.embedUrl).toContain("/embed/shortVideo1");
			});
		});

		describe("YouTube embed URLs", () => {
			it("handles already-embedded URLs", () => {
				const result = resolveEmbedVideoSource(
					"https://www.youtube.com/embed/existingEmbed",
				);
				expect(result?.embedUrl).toContain("/embed/existingEmbed");
			});

			it("handles youtube-nocookie embed URLs", () => {
				const result = resolveEmbedVideoSource(
					"https://www.youtube-nocookie.com/embed/nocookieVideo",
				);
				expect(result?.embedUrl).toContain("/embed/nocookieVideo");
			});
		});

		describe("invalid YouTube URLs", () => {
			it("returns null for channel homepages without a video id", () => {
				expect(resolveEmbedVideoSource("https://www.youtube.com/")).toBeNull();
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/feed"),
				).toBeNull();
			});

			it("returns null for channel URLs", () => {
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/@channelname"),
				).toBeNull();
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/c/channelname"),
				).toBeNull();
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/channel/UC123"),
				).toBeNull();
			});

			it("returns null for playlist URLs without video", () => {
				expect(
					resolveEmbedVideoSource(
						"https://www.youtube.com/playlist?list=PLxyz123",
					),
				).toBeNull();
			});

			it("returns null for watch URL without video ID", () => {
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/watch"),
				).toBeNull();
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/watch?"),
				).toBeNull();
			});

			it("returns null for invalid video ID format (too short)", () => {
				expect(
					resolveEmbedVideoSource("https://www.youtube.com/watch?v=abc"),
				).toBeNull();
			});
		});
	});

	describe("Vimeo URL handling", () => {
		describe("standard Vimeo URLs", () => {
			it("resolves Vimeo page URLs", () => {
				expect(resolveEmbedVideoSource("https://vimeo.com/123456789")).toEqual({
					embedUrl: "https://player.vimeo.com/video/123456789",
					provider: "vimeo",
				});
			});

			it("handles Vimeo with www prefix", () => {
				const result = resolveEmbedVideoSource(
					"https://www.vimeo.com/987654321",
				);
				expect(result?.embedUrl).toBe(
					"https://player.vimeo.com/video/987654321",
				);
				expect(result?.provider).toBe("vimeo");
			});
		});

		describe("Vimeo player URLs", () => {
			it("handles player.vimeo.com URLs", () => {
				const result = resolveEmbedVideoSource(
					"https://player.vimeo.com/video/555666777",
				);
				expect(result?.embedUrl).toBe(
					"https://player.vimeo.com/video/555666777",
				);
			});
		});

		describe("invalid Vimeo URLs", () => {
			it("returns null for non-numeric video IDs", () => {
				expect(
					resolveEmbedVideoSource("https://vimeo.com/channelname"),
				).toBeNull();
				expect(resolveEmbedVideoSource("https://vimeo.com/abc123")).toBeNull();
			});

			it("returns null for Vimeo homepage", () => {
				expect(resolveEmbedVideoSource("https://vimeo.com/")).toBeNull();
			});

			it("returns null for Vimeo channels", () => {
				expect(
					resolveEmbedVideoSource("https://vimeo.com/channels/staffpicks"),
				).toBeNull();
			});
		});
	});

	describe("unsupported and invalid URLs", () => {
		it("returns null for unsupported or unsafe protocols", () => {
			expect(resolveEmbedVideoSource("javascript:alert(1)")).toBeNull();
			expect(resolveEmbedVideoSource("https://evil.example/video")).toBeNull();
			expect(resolveEmbedVideoSource("not-a-url")).toBeNull();
		});

		it("returns null for ftp protocol", () => {
			expect(
				resolveEmbedVideoSource("ftp://youtube.com/watch?v=abc123"),
			).toBeNull();
		});

		it("returns null for file protocol", () => {
			expect(resolveEmbedVideoSource("file:///path/to/video.mp4")).toBeNull();
		});

		it("returns null for data URLs", () => {
			expect(resolveEmbedVideoSource("data:video/mp4;base64,abc")).toBeNull();
		});

		it("returns null for other video platforms", () => {
			expect(
				resolveEmbedVideoSource("https://dailymotion.com/video/x123"),
			).toBeNull();
			expect(
				resolveEmbedVideoSource("https://twitch.tv/videos/123"),
			).toBeNull();
			expect(
				resolveEmbedVideoSource("https://tiktok.com/@user/video/123"),
			).toBeNull();
		});

		it("returns null for empty string", () => {
			expect(resolveEmbedVideoSource("")).toBeNull();
		});

		it("returns null for whitespace-only string", () => {
			expect(resolveEmbedVideoSource("   ")).toBeNull();
		});

		it("returns null for malformed URLs", () => {
			expect(resolveEmbedVideoSource("http://")).toBeNull();
			expect(resolveEmbedVideoSource("://youtube.com")).toBeNull();
		});
	});

	describe("edge cases", () => {
		it("handles HTTP URLs (not just HTTPS)", () => {
			const result = resolveEmbedVideoSource(
				"http://www.youtube.com/watch?v=abc123XYZ",
			);
			expect(result?.embedUrl).toContain("/embed/abc123XYZ");
		});

		it("handles URLs with port numbers (implementation accepts them)", () => {
			// The implementation extracts hostname and checks against known hosts
			// Port number is stripped from hostname comparison
			const result = resolveEmbedVideoSource(
				"https://youtube.com:8080/watch?v=abc123456",
			);
			expect(result?.embedUrl).toContain("/embed/abc123456");
		});

		it("handles URLs with authentication (implementation accepts them)", () => {
			// URL parsing handles auth info, hostname still matches
			const result = resolveEmbedVideoSource(
				"https://user:pass@youtube.com/watch?v=abc123456",
			);
			expect(result?.embedUrl).toContain("/embed/abc123456");
		});

		it("is case-insensitive for hostnames", () => {
			const result = resolveEmbedVideoSource(
				"https://WWW.YOUTUBE.COM/watch?v=abc123XYZ",
			);
			expect(result?.embedUrl).toContain("/embed/abc123XYZ");
		});

		it("handles video IDs with underscores and hyphens", () => {
			const result = resolveEmbedVideoSource(
				"https://youtube.com/watch?v=a_b-c123XYZ",
			);
			expect(result?.embedUrl).toContain("/embed/a_b-c123XYZ");
		});

		it("generates privacy-enhanced embed URL with modestbranding", () => {
			const result = resolveEmbedVideoSource(
				"https://youtube.com/watch?v=testVideo1",
			);
			expect(result?.embedUrl).toContain("youtube-nocookie.com");
			expect(result?.embedUrl).toContain("modestbranding=1");
			expect(result?.embedUrl).toContain("rel=0");
		});
	});

	describe("provider identification", () => {
		it("correctly identifies YouTube provider", () => {
			const result = resolveEmbedVideoSource(
				"https://youtube.com/watch?v=abc123456",
			);
			expect(result?.provider).toBe("youtube");
		});

		it("correctly identifies Vimeo provider", () => {
			const result = resolveEmbedVideoSource("https://vimeo.com/123456789");
			expect(result?.provider).toBe("vimeo");
		});
	});
});
