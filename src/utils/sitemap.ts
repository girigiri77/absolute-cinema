import type { Movie } from "../types";

const BASE_URL = "https://www.absolutecinema.live";

type SitemapPage = {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
};

export const generateSitemap = (movies: Movie[]): string => {
  const staticPages: SitemapPage[] = [
    { url: "/", priority: "1.0", changefreq: "daily" },
  ];

  const moviePages: SitemapPage[] = movies.map((movie) => ({
    url: `/movie/${movie.slug}`,
    priority: "0.8",
    changefreq: "weekly",
    lastmod: new Date(movie.createdAt).toISOString(),
  }));

  const allPages = [...staticPages, ...moviePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
};
