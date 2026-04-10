export function normalizeOptionalString(
	value: unknown,
	defaultValue?: string,
): string | undefined {
	if (!value || typeof value === "object") {
		return defaultValue;
	}

	return String(value).trim();
}

export function normalizeRequiredString(
	value: unknown,
	defaultValue?: string,
): string {
	if (typeof value === "string") {
		return String(value).trim();
	}

	if (!defaultValue) {
		throw new Error(
			`Value ${JSON.stringify(value)} is not a string and no default value was provided`,
		);
	}

	return defaultValue;
}

export function normalizeRequiredNumber(
	value: unknown,
	defaultValue?: number,
): number {
	const v = Number(value);

	if (Number.isNaN(v) && defaultValue === undefined) {
		throw new Error(
			`Value ${JSON.stringify(value)} is not a number and no default value was provided`,
		);
	} else if (Number.isNaN(v) && defaultValue !== undefined) {
		return defaultValue;
	}

	return v;
}
