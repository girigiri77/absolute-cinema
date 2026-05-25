import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { SEED_MOVIES, DEFAULT_MOODS, DEFAULT_TOGGLES } from '../src/data/seed';
import type { Movie, MoodCategory } from '../src/types';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.');
}

// Use service role key for seed script to bypass RLS
const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const PLATFORM_ALIASES: Record<string, string> = {
  "Disney+ Hotstar": "Hotstar",
  JioHotstar: "Hotstar",
  ZEE5: "Zee5",
  "Apple TV+": "JioCinema",
};

const normalizeMovie = (movie: Movie): any => ({
  title: movie.title,
  description: movie.description,
  rating: movie.rating,
  year: movie.year,
  release_date: movie.releaseDate || `${movie.year}-01-01`,
  runtime: movie.runtime,
  genres: movie.genres,
  moods: movie.moods,
  platforms: Array.from(new Set((movie.platforms || []).map(p => PLATFORM_ALIASES[p] || p))),
  trailer_url: movie.trailerUrl,
  poster: movie.poster,
  backdrop: movie.backdrop || movie.poster,
  language: movie.language,
  type: movie.type,
  is_telugu: movie.isTelugu ?? movie.isTeluguPick ?? false,
  is_telugu_pick: movie.isTeluguPick ?? movie.isTelugu ?? false,
  is_trending: movie.isTrending ?? false,
  is_weekly_release: movie.isWeeklyRelease ?? false,
  is_hero_featured: movie.isHeroFeatured ?? false,
});

const normalizeMood = (mood: MoodCategory, movieIdMap: Record<string, string>): any => ({
  id: crypto.randomUUID(),
  label: mood.label,
  emoji: mood.emoji,
  description: mood.description,
  color: mood.color,
  glow_color: mood.glowColor,
  banner_image: mood.bannerImage,
  linked_movie_ids: mood.linkedMovieIds.map(fakeId => movieIdMap[fakeId]).filter(Boolean),
  auto_include_by_tag: mood.autoIncludeByTag,
  featured: mood.featured,
  visible: mood.visible,
  sort_order: mood.sortOrder,
});

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Check if data already exists
    const { count: moviesCount } = await supabase
      .from('movies')
      .select('*', { count: 'exact', head: true });
    
    if (moviesCount && moviesCount > 0) {
      console.log('⚠️  Database already contains data. Clearing and re-seeding...');
      console.log(`   Found ${moviesCount} movies in the database.`);
      
      // Clear existing data
      await supabase.from('moods').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('movies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log('✅ Cleared existing data');
    }

    // Seed movies
    console.log('📽️  Seeding movies...');
    const moviesData = SEED_MOVIES.map(normalizeMovie);
    const { data: insertedMovies, error: moviesError } = await supabase
      .from('movies')
      .insert(moviesData)
      .select('id, title');
    
    if (moviesError) {
      throw new Error(`Failed to seed movies: ${moviesError.message}`);
    }
    console.log(`✅ Seeded ${insertedMovies?.length || 0} movies`);

    // Create a mapping from fake IDs to real UUIDs
    const movieIdMap: Record<string, string> = {};
    SEED_MOVIES.forEach((movie, index) => {
      if (insertedMovies && insertedMovies[index]) {
        movieIdMap[movie.id] = insertedMovies[index].id;
      }
    });

    // Seed moods
    console.log('🎭 Seeding moods...');
    const moodsData = DEFAULT_MOODS.map(mood => normalizeMood(mood, movieIdMap));
    const { error: moodsError } = await supabase
      .from('moods')
      .insert(moodsData);
    
    if (moodsError) {
      throw new Error(`Failed to seed moods: ${moodsError.message}`);
    }
    console.log(`✅ Seeded ${moodsData.length} moods`);

    // Update section toggles (already inserted by migration)
    console.log('⚙️  Updating section toggles...');
    const { data: togglesData } = await supabase
      .from('section_toggles')
      .select('id')
      .limit(1)
      .single();
    
    if (!togglesData) {
      throw new Error('No section toggles found in database');
    }

    const { error: togglesError } = await supabase
      .from('section_toggles')
      .update({
        weekly_releases: DEFAULT_TOGGLES.weeklyReleases,
        mood_discovery: DEFAULT_TOGGLES.moodDiscovery,
        trending: DEFAULT_TOGGLES.trending,
        telugu_picks: DEFAULT_TOGGLES.teluguPicks,
      })
      .eq('id', togglesData.id);
    
    if (togglesError) {
      throw new Error(`Failed to update toggles: ${togglesError.message}`);
    }
    console.log('✅ Updated section toggles');

    console.log('🎉 Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();
