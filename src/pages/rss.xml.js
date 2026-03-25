import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { createContentProvider } from "../lib/content/provider";

export async function GET(context) {
	const content = createContentProvider();
	const posts = await content.listArticles();
	const sorted = [...posts].sort(
		(a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: sorted.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: post.pubDate,
			link: `/blog/${post.slug}/`,
		})),
	});
}
