import rss from "@astrojs/rss";
import {
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_TITLE,
} from "../constants/defaults";
import { createContentProvider } from "../lib/content/provider";

export async function GET(context) {
	const content = createContentProvider();
	const { articles, siteConfig } = await content.getBlogIndexContent();
	const sorted = [...articles].sort(
		(a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
	);
	const title = siteConfig.siteTitle || DEFAULT_SITE_TITLE;
	const description =
		siteConfig.description.trim() !== ""
			? siteConfig.description
			: DEFAULT_SITE_DESCRIPTION;
	return rss({
		title,
		description,
		site: context.site,
		items: sorted.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: post.pubDate,
			link: `/blog/${post.slug}/`,
		})),
	});
}
