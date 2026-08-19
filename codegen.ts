import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

dotenv.config({ path: [".env"], override: true });

// biome-ignore lint/complexity/useLiteralKeys: Access to .env variable
const baseUrl = process.env["STRAPI_URL"];
const graphqlEndpoint = `${baseUrl}/graphql`;

const config: CodegenConfig = {
	schema: graphqlEndpoint,
	generates: {
		"./src/api/types/generated.ts": {
			plugins: ["typescript", "typescript-operations"],
			config: {
				enumType: "native",
			},
		},
	},
	ignoreNoDocuments: false,
};

export default config;
