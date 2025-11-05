import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error', error);
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  client.query = (...args: any[]) => {
    clearTimeout(timeout);
    return query(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    return release();
  };

  return client;
};

export default pool;

