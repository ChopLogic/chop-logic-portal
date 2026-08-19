import type { Author, ImageProps, TagData } from "chop-logic-components";
import type { CmsImage } from "./image";

export interface ArticleAuthorConnection {
	readonly id: string;
	readonly name: string;
	readonly email: string;
	readonly avatar: CmsImage | null;
	readonly role?: string;
}

export interface ArticlePreview {
	readonly id: string;
	readonly slug: string;
	readonly title: string;
	readonly image: ImageProps;
	readonly authors: Author[];
	readonly tags: TagData[];
	readonly summary?: string;
}
