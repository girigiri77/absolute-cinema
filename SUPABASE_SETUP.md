# Supabase Migration Setup Guide

This guide will help you migrate the Watchly project from localStorage to Supabase PostgreSQL.

## Prerequisites

- A Supabase account (free tier works)
- Node.js installed
- Your project already set up with Vite + React

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `watchly-cinema` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Environment Variables

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (scroll down to find this)

4. Update your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important**: The service_role key is required for the seed script to bypass RLS policies during initial data population.

## Step 3: Run SQL Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click "New Query"
4. Copy the contents of `supabase/migration.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

This will create:
- `movies` table with all fields
- `moods` table for mood categories
- `section_toggles` table for homepage section visibility
- `admin_users` table for admin management
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for updated_at timestamps

## Step 4: Seed the Database

### Option A: Run the seed script (Recommended)

1. Install ts-node if not already installed:
```bash
npm install -D ts-node
```

2. Run the seed script:
```bash
npx ts-node scripts/seed-database.ts
```

### Option B: Manual seed via Supabase Dashboard

If the script doesn't work, you can manually seed the data using the SQL Editor with the seed data from `src/data/seed.ts`.

## Step 5: Add Admin Users

### Option A: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click "Add User" → "Create New User"
3. Enter email and password for your admin
4. After creating the user, go to **SQL Editor**
5. Run this query to add them as admin:

```sql
INSERT INTO admin_users (email)
VALUES ('your-admin-email@example.com');
```

### Option B: Via Supabase Auth + Admin Table

1. First, sign up a user through your app's login page
2. Then add their email to the admin_users table:

```sql
INSERT INTO admin_users (email)
VALUES ('the-email-they-used@example.com');
```

## Step 6: Verify the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the Studio page (`/studio`)
3. Try logging in with your admin credentials
4. Verify you can:
   - Add a new movie
   - Edit an existing movie
   - Delete a movie
   - Toggle trending/featured status
   - Manage moods
   - Update section toggles

## Step 7: Test Real-time Updates

1. Open your app in two different browser tabs
2. Make changes in the Studio tab
3. Verify changes appear instantly in the Home tab
4. This confirms real-time subscriptions are working

## Database Schema

### movies
- `id` (UUID, primary key)
- `title`, `description`, `rating`, `year`
- `release_date`, `runtime`
- `genres` (text array), `moods` (text array), `platforms` (text array)
- `trailer_url`, `poster`, `backdrop`
- `language`, `type` (Movie/Series)
- Boolean flags: `is_telugu`, `is_telugu_pick`, `is_trending`, `is_weekly_release`, `is_hero_featured`
- `created_at`, `updated_at`

### moods
- `id` (text, primary key)
- `label`, `emoji`, `description`
- `color`, `glow_color`, `banner_image`
- `linked_movie_ids` (text array)
- `auto_include_by_tag`, `featured`, `visible`
- `sort_order`
- `created_at`, `updated_at`

### section_toggles
- `id` (UUID, primary key)
- `weekly_releases`, `mood_discovery`, `trending`, `telugu_picks` (booleans)
- `updated_at`

### admin_users
- `id` (UUID, primary key)
- `email` (unique)
- `created_at`

## Security Features

### Row Level Security (RLS)

- **Public Read**: All users can read movies, moods, and section toggles
- **Admin Write**: Only authenticated admin users can insert/update/delete data
- **Admin Check**: RLS policies verify user email exists in `admin_users` table

### Authentication

- Uses Supabase Auth for user authentication
- Admin users must be in the `admin_users` table to perform write operations
- Regular users can only view content (read-only)

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env`

### "Failed to load data"
- Check Supabase project is active (not paused)
- Verify RLS policies are correctly applied
- Check browser console for specific error messages
- Ensure your user email is in `admin_users` table for write operations

### Real-time updates not working
- Verify Realtime is enabled in Supabase project
- Check that tables have Realtime enabled in Supabase dashboard
- Go to Database → Replication → Select tables → Enable Realtime

### Permission denied errors
- Verify your email is in the `admin_users` table
- Check that you're logged in with the correct email
- Ensure RLS policies are correctly configured

## Production Considerations

1. **Environment Variables**: Never commit `.env` file. Use environment-specific variables in production.
2. **Database Backups**: Enable automatic backups in Supabase settings.
3. **Rate Limiting**: Consider implementing rate limiting for API calls.
4. **CORS**: Configure CORS settings in Supabase if needed.
5. **Service Role Key**: For server-side operations, use the service role key (never expose to client).

## Migration Notes

- **localStorage is completely replaced**: All data now lives in Supabase
- **Real-time sync**: Changes in Studio appear instantly across all tabs
- **Admin protection**: Only users in `admin_users` table can modify data
- **Data persistence**: Data persists across browsers and devices
- **Scalability**: Supabase handles scaling automatically

## Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Review browser console errors
3. Verify RLS policies in SQL Editor
4. Check that Realtime is enabled for all tables

## Next Steps

- Add image upload functionality (Supabase Storage)
- Implement user preferences/watchlist
- Add analytics tracking
- Set up CI/CD for database migrations
- Add more admin features (bulk operations, etc.)
