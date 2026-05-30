export type Movie = {
  id: string;
  title: string;
  slug: string;
  description: string;
  rating: number; // 0-10
  year: number;
  releaseDate?: string; // YYYY-MM-DD
  runtime: number; // minutes
  genres: string[];
  moods: string[];
  platforms: string[]; // Netflix, Prime, etc.
  trailerUrl: string; // youtube embed url or watch url
  poster: string; // url or base64
  backdrop: string; // url or base64
  language?: string;
  type: "Movie" | "Series";
  isTelugu?: boolean;
  isTeluguPick?: boolean;
  isTrending?: boolean;
  isWeeklyRelease?: boolean;
  isHeroFeatured?: boolean;
  createdAt: number;
};

export type MoodCategory = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
  glowColor: string;
  bannerImage?: string;
  linkedMovieIds: string[];
  autoIncludeByTag: boolean;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

export type SectionToggles = {
  weeklyReleases: boolean;
  moodDiscovery: boolean;
  trending: boolean;
  teluguPicks: boolean;
};

export const PLATFORMS = [
  "Netflix",
  "Prime Video",
  "JioHotstar",
  "SonyLIV",
  "Aha",
  "Zee5",
  "JioCinema",
  "SunNXT",
];

export const GENRES = [
  "Action", "Drama", "Romance", "Thriller", "Sci-Fi", "Comedy",
  "Horror", "Mystery", "Crime", "Fantasy", "Adventure", "Biography",
  "Animation", "Documentary", "Family", "Musical",
];
