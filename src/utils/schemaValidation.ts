import { supabase } from './supabase';

const REQUIRED_SERIES_COLUMNS = [
  'total_seasons',
  'total_episodes',
  'episode_runtime',
  'series_status',
  'first_air_date',
  'last_air_date',
] as const;

export async function validateSeriesSchema(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: 'movies' });

    if (error) {
      console.error('Schema validation - Error fetching table columns:', error);
      return false;
    }

    if (!data) {
      console.warn('Schema validation - Could not fetch table columns');
      return false;
    }

    const existingColumns = data.map((col: any) => col.column_name);
    const missingColumns = REQUIRED_SERIES_COLUMNS.filter(col => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.error('Schema validation - Missing Supabase columns:', missingColumns.join(', '));
      console.error('Schema validation - Please run the latest migration to add these columns.');
      return false;
    }

    console.log('Schema validation - All required series columns exist');
    return true;
  } catch (err) {
    console.error('Schema validation - Unexpected error:', err);
    return false;
  }
}

export function isPGRST204Error(error: any): boolean {
  return error?.code === 'PGRST204' || 
         error?.message?.includes('PGRST204') ||
         error?.message?.includes('Could not find the') && 
         error?.message?.includes('column');
}
