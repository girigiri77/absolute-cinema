export const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled";
};

export const generateMovieSlug = (title: string, year?: number): string => {
  const baseSlug = slugify(title);
  if (year) {
    return `${baseSlug}-${year}`;
  }
  return baseSlug;
};
