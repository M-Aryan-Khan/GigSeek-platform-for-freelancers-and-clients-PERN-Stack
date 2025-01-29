import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'Aryankhan@2004',
  host: 'localhost',
  port: 5432,
  database: 'freelance_ms',
});

export default pool;