/// <reference types="astro/client" />

declare module "chop-logic-components/styles/main";

declare module "*.astro" {
	const Component: import("astro/runtime/server").AstroComponentFactory;
	export default Component;
}

interface ImportMetaEnv {
	readonly STRAPI_URL: string;
	readonly STRAPI_API_TOKEN: string;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
