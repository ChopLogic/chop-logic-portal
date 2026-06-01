import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DynamicZoneComponentType } from "../../models/dynamic-zone";
import { mapHomePage } from "../home-page";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mocksDir = join(__dirname, "../../../strapi/__mocks__");
const baseUrl = "https://cms.example.com";

describe("mapHomePage", () => {
	beforeEach(() => {
		vi.stubEnv("STRAPI_URL", baseUrl);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("maps the home page mock to a HomePage model", () => {
		const raw = JSON.parse(
			readFileSync(join(mocksDir, "fetch-home-page-response.json"), "utf8"),
		) as Record<string, unknown>;
		const home = (raw["data"] as Record<string, unknown>)["home"] as Record<
			string,
			unknown
		>;

		const page = mapHomePage(
			{
				documentId: home["documentId"] as string,
				title: home["title"] as string,
				subTitle: home["subTitle"] as string,
				slug: home["slug"] as string,
				updatedAt: home["updatedAt"] as string,
				content: home["content"],
				metaData: home["metaData"],
			},
			baseUrl,
		);

		expect(page.slug).toBe("home");
		expect(page.title).toBe("Chop Logic Home");
		expect(page.subTitle).toBe("A place where logic works!");
		expect(page.updatedAt.toISOString()).toBe("2026-04-01T16:29:29.301Z");
		expect(page.content).toHaveLength(4);
		expect(page.content[0]?.type).toBe(DynamicZoneComponentType.Paragraph);
		expect(page.metaData.metaTitle).toBe("Chop Logic Portal Home");
	});
});
