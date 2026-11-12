import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './db.js';
dotenv.config();

const name = process.env.SEED_ADMIN_NAME || 'Super Admin';
const user = process.env.SEED_ADMIN_USER || 'superadmin';
const pass = process.env.SEED_ADMIN_PASS || 'Admin@12345';

const hash = await bcrypt.hash(pass, 10);
await pool.query(
  `INSERT INTO users (full_name, username, password_hash, role)
   VALUES ($1,$2,$3,'super_admin') ON CONFLICT (username) DO NOTHING`,
  [name, user, hash]);
console.log(`Super Admin diyaar: ${user}`);
await pool.end();

