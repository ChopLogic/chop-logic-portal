/**
 * Pre-commit: format/lint staged files with Biome, then run project-wide checks.
 * Biome `--staged` only touches supported file types in the git index.
 */
export default function lintStagedConfig(stagedFiles) {
	if (stagedFiles.length === 0) {
		return [];
	}

	return [
		"biome check --write --no-errors-on-unmatched --staged",
		"npm run typecheck",
		"npm run astro:check",
		"npm run test:ci",
	];
}
