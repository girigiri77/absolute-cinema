-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  year INTEGER NOT NULL,
  release_date DATE,
  runtime INTEGER NOT NULL,
  genres TEXT[] NOT NULL,
  moods TEXT[] NOT NULL,
  platforms TEXT[] NOT NULL,
  trailer_url TEXT NOT NULL,
  poster TEXT NOT NULL,
  backdrop TEXT NOT NULL,
  language TEXT,
  type TEXT NOT NULL CHECK (type IN ('Movie', 'Series')),
  is_telugu BOOLEAN DEFAULT FALSE,
  is_telugu_pick BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_weekly_release BOOLEAN DEFAULT FALSE,
  is_hero_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  glow_color TEXT NOT NULL,
  banner_image TEXT,
  linked_movie_ids TEXT[] NOT NULL,
  auto_include_by_tag BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  visible BOOLEAN DEFAULT TRUE,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create section_toggles table
CREATE TABLE IF NOT EXISTS section_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekly_releases BOOLEAN DEFAULT TRUE,
  mood_discovery BOOLEAN DEFAULT TRUE,
  trending BOOLEAN DEFAULT TRUE,
  telugu_picks BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default section toggles
INSERT INTO section_toggles (weekly_releases, mood_discovery, trending, telugu_picks)
VALUES (TRUE, TRUE, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movies_trending ON movies(is_trending) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_movies_telugu ON movies(is_telugu_pick) WHERE is_telugu_pick = TRUE;
CREATE INDEX IF NOT EXISTS idx_movies_weekly ON movies(is_weekly_release) WHERE is_weekly_release = TRUE;
CREATE INDEX IF NOT EXISTS idx_movies_hero ON movies(is_hero_featured) WHERE is_hero_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_movies_moods ON movies USING GIN(moods);
CREATE INDEX IF NOT EXISTS idx_movies_genres ON movies USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_movies_platforms ON movies USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_moods_sort ON moods(sort_order);
CREATE INDEX IF NOT EXISTS idx_moods_visible ON moods(visible) WHERE visible = TRUE;
CREATE INDEX IF NOT EXISTS idx_moods_featured ON moods(featured) WHERE featured = TRUE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moods_updated_at
  BEFORE UPDATE ON moods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_section_toggles_updated_at
  BEFORE UPDATE ON section_toggles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_toggles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for movies (public read, admin write)
CREATE POLICY "Movies are viewable by everyone"
  ON movies FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert movies"
  ON movies FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can insert movies"
  ON movies FOR INSERT
  WITH CHECK (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Service role can update movies"
  ON movies FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can update movies"
  ON movies FOR UPDATE
  USING (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Service role can delete movies"
  ON movies FOR DELETE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can delete movies"
  ON movies FOR DELETE
  USING (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

-- RLS Policies for moods (public read, admin write)
CREATE POLICY "Moods are viewable by everyone"
  ON moods FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert moods"
  ON moods FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can insert moods"
  ON moods FOR INSERT
  WITH CHECK (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Service role can update moods"
  ON moods FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can update moods"
  ON moods FOR UPDATE
  USING (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Service role can delete moods"
  ON moods FOR DELETE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can delete moods"
  ON moods FOR DELETE
  USING (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

-- RLS Policies for section_toggles (public read, admin write)
CREATE POLICY "Section toggles are viewable by everyone"
  ON section_toggles FOR SELECT
  USING (true);

CREATE POLICY "Service role can update section toggles"
  ON section_toggles FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can update section toggles"
  ON section_toggles FOR UPDATE
  USING (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

-- RLS Policies for admin_users (admin management)
CREATE POLICY "Service role can manage admin users"
  ON admin_users FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  WITH CHECK (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admins can delete admin users"
  ON admin_users FOR DELETE
  USING (
    auth.role() != 'service_role' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.email()
    )
  );
