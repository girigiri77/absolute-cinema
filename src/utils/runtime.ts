export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

export function formatMovieRuntime(runtime?: number): string {
  if (!runtime) return "";
  return formatRuntime(runtime);
}

export function formatSeriesInfo(currentSeason?: number, currentSeasonEpisodeCount?: number, episodeRuntime?: number): string {
  const parts: string[] = [];
  
  if (currentSeason) {
    parts.push(`Season ${currentSeason}`);
  }
  
  if (currentSeasonEpisodeCount) {
    parts.push(`${currentSeasonEpisodeCount} Episodes`);
  }
  
  if (episodeRuntime) {
    parts.push(formatRuntime(episodeRuntime));
  }
  
  return parts.join(' • ');
}

export function formatReleaseDate(dateString: string): string {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}
