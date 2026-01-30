import Link from "next/link";
import { fetchArticlesList } from "../../lib/strapi";

export default async function BlogPage() {
  const articles = await fetchArticlesList();

  return (
    <>
      <h1>Blog</h1>
      <p>List of articles (fetched from Strapi when configured):</p>
      <ul>
        {articles.length > 0 ? (
          articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/blog/${encodeURIComponent(a.slug)}`}>
                {a.title}
              </Link>
            </li>
          ))
        ) : (
          <li>No articles yet — configure STRAPI_URL to fetch real content.</li>
        )}
      </ul>
    </>
  );
}
