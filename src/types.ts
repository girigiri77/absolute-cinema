export type Movie = {
  id: string;
  title: string;
  slug: string;
  description: string;
  rating: number; // 0-10
  year: number;
  releaseDate?: string; // YYYY-MM-DD
  runtime?: number; // minutes (for movies)
  totalSeasons?: number; // for series
  totalEpisodes?: number; // for series
  episodeRuntime?: number; // minutes (for series)
  seriesStatus?: 'Ongoing' | 'Completed'; // for series
  firstAirDate?: string; // YYYY-MM-DD (for series)
  lastAirDate?: string; // YYYY-MM-DD (for series, optional)
  genres: string[];
  moods: string[];
  platforms: string[]; // Netflix, Prime, etc.
  trailerUrl: string; // youtube embed url or watch url
  watchUrl?: string; // OTT platform direct watch URL (e.g., Netflix, Prime Video)
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

export const PLATFORM_LOGOS: Record<string, string> = {
  Netflix: "/platforms/netflix.png",
  "Prime Video": "/platforms/prime-video.png",
  JioHotstar: "/platforms/jiohotstar.png",
  Hotstar: "/platforms/jiohotstar.png",
  "Disney+ Hotstar": "/platforms/jiohotstar.png",
  SonyLIV: "/platforms/sonyliv.png",
  Zee5: "/platforms/zee5.png",
  ZEE5: "/platforms/zee5.png",
  Aha: "/platforms/aha.png",
  JioCinema: "/platforms/jiocinema.png",
  SunNXT: "/platforms/sunnxt.png",
};

export const PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
  Netflix: { bg: "#E50914", text: "#FFFFFF" },
  "Prime Video": { bg: "#00A8E1", text: "#FFFFFF" },
  JioHotstar: { bg: "#0F2D52", text: "#FFFFFF" },
  SonyLIV: { bg: "#0066FF", text: "#FFFFFF" },
  Zee5: { bg: "#FF0095", text: "#FFFFFF" },
  Aha: { bg: "#FF4D00", text: "#FFFFFF" },
  JioCinema: { bg: "#00BFFF", text: "#FFFFFF" },
  SunNXT: { bg: "#FF6600", text: "#FFFFFF" },
};

export const GENRES = [
  "Action", "Drama", "Romance", "Thriller", "Sci-Fi", "Comedy",
  "Horror", "Mystery", "Crime", "Fantasy", "Adventure", "Biography",
  "Animation", "Documentary", "Family", "Musical",
];
