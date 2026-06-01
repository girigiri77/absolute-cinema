export interface NotificationTemplate {
  title: string;
  message: string;
}

export const notificationTemplates: Record<string, NotificationTemplate> = {
  fridayOTTReleases: {
    title: '🎬 This Week OTT Releases',
    message: 'Discover all new OTT releases streaming this week.',
  },
  saturdayWeekendPicks: {
    title: '🍿 Weekend Binge Picks',
    message: 'Your weekend watchlist is ready.',
  },
  trendingMovies: {
    title: '🔥 Trending Now',
    message: 'Check out the hottest movies and series everyone is watching.',
  },
  newReleaseAlert: {
    title: '🎉 New Release Alert',
    message: 'A new movie or series is now available for streaming.',
  },
  weeklyRoundup: {
    title: '📅 Weekly Roundup',
    message: 'Here\'s what you missed this week in OTT releases.',
  },
};

export const getTemplate = (key: string): NotificationTemplate | null => {
  return notificationTemplates[key] || null;
};

export const getAllTemplates = (): NotificationTemplate[] => {
  return Object.values(notificationTemplates);
};
