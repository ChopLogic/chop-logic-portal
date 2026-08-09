/** JSON-serializable value (e.g. Strapi structuredData). */
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| readonly JsonValue[]
	| { readonly [key: string]: JsonValue };
