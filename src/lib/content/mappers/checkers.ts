import { type CmsImageFormatName, IMAGE_FORMAT_NAMES } from "../models";

export function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function isImageFormatName(k: string): k is CmsImageFormatName {
	return (IMAGE_FORMAT_NAMES as readonly string[]).includes(k);
}
