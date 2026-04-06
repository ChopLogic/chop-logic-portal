/** Thrown when a slug has no matching published article (list/detail mismatch). */
export class ArticleNotFoundError extends Error {
	constructor(public readonly slug: string) {
		super(`No article found for slug "${slug}".`);
		this.name = "ArticleNotFoundError";
	}
}
