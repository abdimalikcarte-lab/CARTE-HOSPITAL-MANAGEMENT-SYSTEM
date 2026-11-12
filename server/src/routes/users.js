import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { auth, allow, wrap } from '../middleware/auth.js';

const router = Router();
const ROLES = ['super_admin', 'receptionist', 'doctor', 'cashier'];
const cols = 'id, full_name, username, role, active, created_at';

// Dhammaan users-ka (doctor list waa loo oggol yahay receptionist si ballan loo sameeyo)
router.get('/doctors', auth, wrap(async (_req, res) => {
  const { rows } = await query("SELECT id, full_name FROM users WHERE role='doctor' AND active ORDER BY full_name");
  res.json(rows);
}));

router.use(auth, allow('super_admin'));

router.get('/', wrap(async (_req, res) => {
  const { rows } = await query(`SELECT ${cols} FROM users ORDER BY id DESC`);
  res.json(rows);
}));

router.post('/', wrap(async (req, res) => {
  const { full_name, username, password, role } = req.body;
  if (!full_name || !username || !password || !ROLES.includes(role))
    return res.status(400).json({ message: 'Xogta lama buuxin' });
  if (password.length < 6) return res.status(400).json({ message: 'Password-ku ugu yaraan 6 xaraf' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await query(
      `INSERT INTO users (full_name, username, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING ${cols}`,
      [full_name, username, hash, role]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ message: 'Username horey ayuu u jiray' });
    throw e;
  }
}));

router.patch('/:id/toggle', wrap(async (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'Akoonkaaga ma xiri kartid' });
  const { rows } = await query(`UPDATE users SET active = NOT active WHERE id=$1 RETURNING ${cols}`, [req.params.id]);
  res.json(rows[0]);
}));

router.delete('/:id', wrap(async (req, res) => {
