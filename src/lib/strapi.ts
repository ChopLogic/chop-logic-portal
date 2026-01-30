export type Article = {
  title: string;
  slug: string;
  content?: string;
  author?: string;
};

const BASE = process.env.STRAPI_URL || "";

type StrapiItem = {
  id?: number | string;
  attributes?: {
    title?: string;
    slug?: string;
    content?: string;
    author?: string;
  };
};

export async function fetchArticlesList(): Promise<Article[]> {
  if (!BASE) return [];

  try {
    // Example Strapi GET - adjust endpoint to your content type and fields
    const res = await fetch(
      `${BASE}/api/articles?pagination[pageSize]=100&populate=*`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    const json = await res.json();

    // Try to map common Strapi response shape
    const data: StrapiItem[] = json?.data ?? [];
    return data.map((d) => ({
      title: d.attributes?.title ?? "Untitled",
      slug: d.attributes?.slug ?? String(d.id ?? ""),
      content: d.attributes?.content ?? "",
      author: d.attributes?.author ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function fetchArticleBySlug(
  slug: string,
): Promise<Article | null> {
  if (!BASE) return null;

  try {
    // Filter by slug - adjust to your Strapi version/schema
    const res = await fetch(
      `${BASE}/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { cache: "no-store" },
    );

    if (!res.ok) return null;
    const json = await res.json();
    const item = json?.data?.[0];
    if (!item) return null;

    return {
      title: item.attributes?.title ?? "Untitled",
      slug: item.attributes?.slug ?? slug,
      content: item.attributes?.content ?? "",
      author: item.attributes?.author ?? undefined,
    };
  } catch {
    return null;
  }
}
