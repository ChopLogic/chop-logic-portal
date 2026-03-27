/// <reference types="astro/client" />

declare module "*.astro" {
	const Component: import("astro/runtime/server").AstroComponentFactory;
	export default Component;
}

interface ImportMetaEnv {
	readonly STRAPI_URL?: string;
	readonly STRAPI_API_TOKEN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
