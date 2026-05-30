import React from "react";
import { useMovies } from "../context/MoviesContext";
import { generateSitemap } from "../utils/sitemap";

const Sitemap: React.FC = () => {
  const { movies } = useMovies();
  const sitemapXml = generateSitemap(movies);

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
      {sitemapXml}
    </pre>
  );
};

export default Sitemap;
