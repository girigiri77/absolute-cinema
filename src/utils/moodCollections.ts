import type { MoodCategory, Movie } from "../types";

export const getMoviesForMood = (mood: MoodCategory | undefined | null, movies: Movie[]) => {
  if (!mood) return [];
  const byId = new Map(movies.map(movie => [movie.id, movie]));
  const linked = (mood.linkedMovieIds || [])
    .map(id => byId.get(id))
    .filter(Boolean) as Movie[];
  const linkedIds = new Set(linked.map(movie => movie.id));

  if (!mood.autoIncludeByTag) return linked;

  const tagged = movies.filter(movie => movie.moods?.includes(mood.id) && !linkedIds.has(movie.id));
  return [...linked, ...tagged];
};

export const getMoodMovieCount = (mood: MoodCategory, movies: Movie[]) =>
  getMoviesForMood(mood, movies).length;