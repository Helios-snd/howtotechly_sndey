import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Production databases (Neon, Supabase) require SSL
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/howtotechly',
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

export const query = async <T = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (!isProduction) {
      console.log('executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    console.error('database query error', err);
    throw err;
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export default pool;