import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

dotenv.config({ path: [".env"], override: true });

// biome-ignore lint/complexity/useLiteralKeys: Access to .env variable
const baseUrl = process.env["STRAPI_URL"];
const graphqlEndpoint = `${baseUrl}/graphql`;

const config: CodegenConfig = {
	schema: graphqlEndpoint,
	documents: ["src/api/queries/**/*.graphql"], // Look for .graphql files
	generates: {
		"./src/api/types/generated.ts": {
			plugins: ["typescript-operations"],
			config: {
				// Extract nested field types to named types (matches apollo-tooling naming)
				extractAllFieldsToTypesCompact: true,
				// Keep original naming as-is (no camelCase conversion)
				namingConvention: "keep",
				// Print each field on its own line for readability
				printFieldsOnNewLines: true,
				// Use native TypeScript enums (matches apollo-tooling enum output)
				enumType: "native",
				// Always include __typename in result types
				nonOptionalTypename: true,
				// Don't add __typename to root query/mutation/subscription types
				skipTypeNameForRoot: true,
				// Don't add 'Query'/'Mutation'/'Subscription' suffixes to operation result types
				omitOperationSuffix: true,
				// Don't add 'Fragment' suffix to fragment result types
				fragmentSuffix: "",
				// Default is 'unknown'; to match apollo-tooling we need to put 'any'
				defaultScalarType: "any",
			},
		},
		// './src/schemas/generated.ts': {
		//   plugins: [
		//     'typescript',
		//     'typescript-operations',
		//     'typescript-zod',
		//   ],
		//   config: {
		//     addUnderscoreToArgsType: true,
		//     zodSchema: 'zod',
		//     scalars: {
		//       DateTime: 'z.string().datetime()',
		//       JSON: 'z.record(z.unknown())',
		//     },
		//   },
		// },
	},
	ignoreNoDocuments: false,
};

export default config;
