import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/howtotechly',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing database...');

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'editor')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Posts Table
    // Changed featured_image to TEXT to support Base64 strings
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image TEXT,
        category_id UUID REFERENCES categories(id),
        author_id UUID REFERENCES users(id),
        tags TEXT[], -- Array of strings
        seo_title VARCHAR(255),
        seo_description TEXT,
        views INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // MIGRATION FIX: Ensure existing tables have featured_image as TEXT
    // This allows users with existing DBs to upgrade without dropping tables
    try {
      await client.query('ALTER TABLE posts ALTER COLUMN featured_image TYPE TEXT');
      console.log('Verified schema: featured_image is TEXT');
    } catch (e) {
      console.log('Schema migration note:', e);
    }

    // Indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published)');

    // Seed Admin User (if not exists)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@howtotechly.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'password123';
    
    const userRes = await client.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (userRes.rowCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(adminPass, salt);
      
      await client.query(`
        INSERT INTO users (email, password_hash, username, role)
        VALUES ($1, $2, $3, 'admin')
      `, [adminEmail, hash, 'Super Admin']);
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Error initializing database:', err);
    (process as any).exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

initDb();



