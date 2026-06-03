import { supabase } from '../utils/supabase';
import type { Movie, MoodCategory, SectionToggles } from '../types';
import { isPGRST204Error } from '../utils/schemaValidation';

// Movie API functions
export const moviesApi = {
  async getAll(): Promise<Movie[]> {
    console.log('moviesApi.getAll - Fetching all movies');
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('moviesApi.getAll - Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('moviesApi.getAll - Successfully fetched movies:', data?.length || 0);
    return data.map(this.transformFromDb);
  },

  async getById(id: string): Promise<Movie | null> {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return this.transformFromDb(data);
  },

  async getBySlug(slug: string): Promise<Movie | null> {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) return null;

    return this.transformFromDb(data);
  },

  async create(movie: Omit<Movie, 'id' | 'createdAt'>): Promise<Movie> {
    const dbMovie = this.transformToDb(movie);
    console.log('Supabase insert - Attempting to insert movie:', dbMovie);
    
    const { data, error } = await supabase
      .from('movies')
      .insert(dbMovie)
      .select()
      .single();
    
    if (error) {
      if (isPGRST204Error(error)) {
        const errorMsg = 'Database schema is missing required Series columns. Run the latest migration to add: total_seasons, total_episodes, episode_runtime, series_status, first_air_date, last_air_date';
        console.error('Supabase insert - Schema error:', errorMsg);
        throw new Error(errorMsg);
      }
      console.error('Supabase insert error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('Supabase insert - Successfully inserted movie:', data);
    return this.transformFromDb(data);
  },

  async update(id: string, movie: Partial<Movie>): Promise<Movie> {
    const dbMovie = this.transformToDb(movie as Omit<Movie, 'id' | 'createdAt'>);
    console.log('moviesApi.update - Updating movie:', id, dbMovie);
    
    const { data, error } = await supabase
      .from('movies')
      .update(dbMovie)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (isPGRST204Error(error)) {
        const errorMsg = 'Database schema is missing required Series columns. Run the latest migration to add: total_seasons, total_episodes, episode_runtime, series_status, first_air_date, last_air_date';
        console.error('moviesApi.update - Schema error:', errorMsg);
        throw new Error(errorMsg);
      }
      console.error('moviesApi.update - Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('moviesApi.update - Successfully updated movie:', data);
    return this.transformFromDb(data);
  },

  async delete(id: string): Promise<void> {
    console.log('Supabase delete - Attempting to delete movie with id:', id);
    
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase delete error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('Supabase delete - Successfully deleted movie with id:', id);
  },

  transformFromDb(data: any): Movie {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      rating: data.rating,
      year: data.year,
      releaseDate: data.release_date,
      runtime: data.runtime,
      currentSeason: data.current_season,
      currentSeasonEpisodeCount: data.current_season_episode_count,
      episodeRuntime: data.episode_runtime,
      seriesStatus: data.series_status,
      firstAirDate: data.first_air_date,
      lastAirDate: data.last_air_date,
      genres: data.genres,
      moods: data.moods,
      platforms: data.platforms,
      trailerUrl: data.trailer_url,
      watchUrl: data.watch_url,
      poster: data.poster,
      backdrop: data.backdrop,
      language: data.language,
      type: data.type,
      isTelugu: data.is_telugu,
      isTeluguPick: data.is_telugu_pick,
      isTrending: data.is_trending,
      isWeeklyRelease: data.is_weekly_release,
      isHeroFeatured: data.is_hero_featured,
      createdAt: new Date(data.created_at).getTime(),
    };
  },

  transformToDb(movie: Omit<Movie, 'id' | 'createdAt'>): any {
    const dbMovie = {
      title: movie.title,
      slug: movie.slug,
      description: movie.description,
      rating: movie.rating,
      year: movie.year,
      release_date: movie.releaseDate || null,
      runtime: movie.runtime || null,
      current_season: movie.currentSeason || null,
      current_season_episode_count: movie.currentSeasonEpisodeCount || null,
      episode_runtime: movie.episodeRuntime || null,
      series_status: movie.seriesStatus || null,
      first_air_date: movie.firstAirDate || null,
      last_air_date: movie.lastAirDate || null,
      genres: movie.genres || [],
      moods: movie.moods || [],
      platforms: movie.platforms || [],
      trailer_url: movie.trailerUrl || '',
      watch_url: movie.watchUrl || null,
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      language: movie.language || null,
      type: movie.type || 'Movie',
      is_telugu: movie.isTelugu || false,
      is_telugu_pick: movie.isTeluguPick || false,
      is_trending: movie.isTrending || false,
      is_weekly_release: movie.isWeeklyRelease || false,
      is_hero_featured: movie.isHeroFeatured || false,
    };
    console.log('transformToDb - Transformed movie to DB format:', dbMovie);
    return dbMovie;
  },
};

// Moods API functions
export const moodsApi = {
  async getAll(): Promise<MoodCategory[]> {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    return data.map(this.transformFromDb);
  },

  async getById(id: string): Promise<MoodCategory | null> {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return this.transformFromDb(data);
  },

  async create(mood: Omit<MoodCategory, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<MoodCategory> {
    const dbMood = this.transformToDb(mood);
    console.log('moodsApi.create - Creating mood:', dbMood);
    
    const { data, error } = await supabase
      .from('moods')
      .insert(dbMood)
      .select()
      .single();
    
    if (error) {
      console.error('moodsApi.create - Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('moodsApi.create - Successfully created mood:', data);
    return this.transformFromDb(data);
  },

  async update(id: string, mood: Partial<MoodCategory>): Promise<MoodCategory> {
    const dbMood = this.transformToDb(mood as Omit<MoodCategory, 'id' | 'createdAt' | 'updatedAt'>);
    console.log('moodsApi.update - Updating mood:', id, dbMood);
    
    const { data, error } = await supabase
      .from('moods')
      .update(dbMood)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('moodsApi.update - Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('moodsApi.update - Successfully updated mood:', data);
    return this.transformFromDb(data);
  },

  async delete(id: string): Promise<void> {
    console.log('moodsApi.delete - Deleting mood:', id);
    
    const { error } = await supabase
      .from('moods')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('moodsApi.delete - Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('moodsApi.delete - Successfully deleted mood:', id);
  },

  async reorder(ids: string[]): Promise<void> {
    const updates = ids.map((id, index) => ({
      id,
      sort_order: index + 1,
    }));

    const { error } = await supabase
      .from('moods')
      .upsert(updates);
    
    if (error) throw error;
  },

  transformFromDb(data: any): MoodCategory {
    return {
      id: data.id,
      label: data.label,
      emoji: data.emoji,
      description: data.description,
      color: data.color,
      glowColor: data.glow_color,
      bannerImage: data.banner_image,
      linkedMovieIds: data.linked_movie_ids,
      autoIncludeByTag: data.auto_include_by_tag,
      featured: data.featured,
      visible: data.visible,
      sortOrder: data.sort_order,
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
    };
  },

  transformToDb(mood: Omit<MoodCategory, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): any {
    const dbMood = {
      id: mood.id,
      label: mood.label,
      emoji: mood.emoji,
      description: mood.description,
      color: mood.color,
      glow_color: mood.glowColor,
      banner_image: mood.bannerImage || null,
      linked_movie_ids: mood.linkedMovieIds || [],
      auto_include_by_tag: mood.autoIncludeByTag ?? true,
      featured: mood.featured ?? false,
      visible: mood.visible ?? true,
      sort_order: mood.sortOrder,
    };
    console.log('moodsApi.transformToDb - Transformed mood to DB format:', dbMood);
    return dbMood;
  },
};

// Section Toggles API functions
export const sectionTogglesApi = {
  async get(): Promise<SectionToggles> {
    const { data, error } = await supabase
      .from('section_toggles')
      .select('*')
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return this.transformFromDb(data);
  },

  async update(toggles: SectionToggles): Promise<SectionToggles> {
    const { data, error } = await supabase
      .from('section_toggles')
      .update(this.transformToDb(toggles))
      .select()
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return this.transformFromDb(data);
  },

  transformFromDb(data: any): SectionToggles {
    return {
      weeklyReleases: data.weekly_releases,
      moodDiscovery: data.mood_discovery,
      trending: data.trending,
      teluguPicks: data.telugu_picks,
    };
  },

  transformToDb(toggles: SectionToggles): any {
    return {
      weekly_releases: toggles.weeklyReleases,
      mood_discovery: toggles.moodDiscovery,
      trending: toggles.trending,
      telugu_picks: toggles.teluguPicks,
    };
  },
};

// Admin Users API functions
export const adminUsersApi = {
  async getAll(): Promise<string[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email');
    
    if (error) throw error;
    
    return data.map(u => u.email);
  },

  async add(email: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .insert({ email });
    
    if (error) throw error;
  },

  async remove(email: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('email', email);
    
    if (error) throw error;
  },

  async isAdmin(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (error) return false;
    return !!data;
  },
};

// Real-time subscription helpers
export const subscribeToMovies = (callback: (movie: Movie) => void) => {
  return supabase
    .channel('movies-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'movies',
      },
      (payload) => {
        if (payload.new) {
          callback(moviesApi.transformFromDb(payload.new));
        }
      }
    )
    .subscribe();
};

export const subscribeToMoods = (callback: (mood: MoodCategory) => void) => {
  return supabase
    .channel('moods-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'moods',
      },
      (payload) => {
        if (payload.new) {
          callback(moodsApi.transformFromDb(payload.new));
        }
      }
    )
    .subscribe();
};

export const subscribeToSectionToggles = (callback: (toggles: SectionToggles) => void) => {
  return supabase
    .channel('section-toggles-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'section_toggles',
      },
      (payload) => {
        if (payload.new) {
          callback(sectionTogglesApi.transformFromDb(payload.new));
        }
      }
    )
    .subscribe();
};
