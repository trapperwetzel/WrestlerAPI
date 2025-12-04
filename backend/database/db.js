import pkg from 'pg';
const { Pool } = pkg;

/**
 * Postgres connection pool.
 * 
 * Connection settings are read from environment variables:
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 * 
 * Provide reasonable defaults so the application can still
 * start when variables are not set. Adjust these values to
 * match your local Postgres installation.
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'wrestlerdb',
});

export default pool;
