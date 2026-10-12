import { experimental_AstroContainer as AstroContainer } from "astro/container";

export type AstroContainerInstance = Awaited<
	ReturnType<typeof AstroContainer.create>
>;

export async function createAstroContainer(): Promise<AstroContainerInstance> {
	return AstroContainer.create();
}

export async function createAstroContainerWithReact(): Promise<AstroContainerInstance> {
	// Dynamic imports to avoid loading React renderer when not needed
	const { loadRenderers } = await import("astro:container");
	const { getContainerRenderer: reactContainerRenderer } = await import(
		"@astrojs/react/container-renderer"
	);

	const renderers = await loadRenderers([reactContainerRenderer()]);
	return AstroContainer.create({ renderers });
}

export interface RenderOptions<Props> {
	props?: Props;
	slots?: Record<string, string>;
	request?: Request;
}

export function createTestRequest(path = "/"): Request {
	return new Request(`https://example.com${path}`);
}
