import { fetchArticleBySlug } from "../../../lib/strapi";

type Props = { params: { slug: string } };

export default async function ArticlePage({ params }: Props) {
  const slug = params.slug;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return (
      <>
        <h1>Article not found</h1>
        <p>
          No article found for <strong>{slug}</strong>. Make sure Strapi is
          configured and the slug is correct.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>{article.title}</h1>
      <p>
        <em>By {article.author ?? "Unknown"}</em>
      </p>
      <article>
        <div>{article.content}</div>
      </article>
    </>
  );
}
