import { createAstroContainer } from "@test/helpers";
import { beforeAll, describe, expect, it } from "vitest";
import FormattedDate from "../FormattedDate.astro";

describe("FormattedDate.astro", () => {
	let container: Awaited<ReturnType<typeof createAstroContainer>>;

	beforeAll(async () => {
		container = await createAstroContainer();
	});

	async function render(date: Date, className?: string) {
		return container.renderToString(FormattedDate, {
			props: { date, className },
		});
	}

	it("renders a time element", async () => {
		const html = await render(new Date("2024-06-15"));
		expect(html).toContain("<time");
		expect(html).toContain("</time>");
	});

	it("includes datetime attribute with ISO string", async () => {
		const date = new Date("2024-06-15T10:30:00.000Z");
		const html = await render(date);
		expect(html).toContain('datetime="2024-06-15T10:30:00.000Z"');
	});

	it("formats the date in human-readable format", async () => {
		const date = new Date("2024-06-15T10:30:00.000Z");
		const html = await render(date);
		// Should contain formatted date like "Jun 15, 2024"
		expect(html).toContain("Jun");
		expect(html).toContain("15");
		expect(html).toContain("2024");
	});

	it("applies optional className to the time element", async () => {
		const html = await render(new Date("2024-01-01"), "custom-date-class");
		expect(html).toContain('class="custom-date-class"');
	});

	it("does not add class attribute when className is not provided", async () => {
		const html = await render(new Date("2024-01-01"));
		expect(html).not.toContain('class=""');
	});

	it("handles different months correctly", async () => {
		const january = await render(new Date("2024-01-15"));
		const july = await render(new Date("2024-07-20"));
		const december = await render(new Date("2024-12-25"));

		expect(january).toContain("Jan");
		expect(july).toContain("Jul");
		expect(december).toContain("Dec");
	});

	it("handles different years", async () => {
		const past = await render(new Date("2020-03-10"));
		const future = await render(new Date("2030-08-22"));

		expect(past).toContain("2020");
		expect(future).toContain("2030");
	});

	it("handles single-digit days", async () => {
		const date = new Date("2024-03-05");
		const html = await render(date);
		// Should contain the day number
		expect(html).toContain("5");
		expect(html).toContain("Mar");
	});

	it("handles dates at midnight UTC", async () => {
		const date = new Date("2024-06-15T00:00:00.000Z");
		const html = await render(date);
		expect(html).toContain('datetime="2024-06-15T00:00:00.000Z"');
	});

	it("handles dates at end of day UTC", async () => {
		const date = new Date("2024-06-15T23:59:59.999Z");
		const html = await render(date);
		expect(html).toContain('datetime="2024-06-15T23:59:59.999Z"');
	});

	it("preserves time precision in ISO string", async () => {
		const date = new Date("2024-06-15T14:30:45.123Z");
		const html = await render(date);
		expect(html).toContain('datetime="2024-06-15T14:30:45.123Z"');
	});
});
