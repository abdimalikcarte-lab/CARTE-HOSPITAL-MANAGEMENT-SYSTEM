import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { auth, wrap } from '../middleware/auth.js';

const router = Router();

router.post('/login', wrap(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Gali username iyo password' });
  const { rows } = await query('SELECT * FROM users WHERE username = $1', [username]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ message: 'Username ama password waa khalad' });
  if (!user.active) return res.status(403).json({ message: 'Akoonkan waa la xiray' });

  const payload = { id: user.id, role: user.role, full_name: user.full_name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: payload });
}));

router.get('/me', auth, (req, res) => res.json({ user: req.user }));

router.post('/change-password', auth, wrap(async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ message: 'Buuxi dhammaan meelaha' });
  if (new_password.length < 6)
    return res.status(400).json({ message: 'Password cusub ugu yaraan 6 xaraf' });
  const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  if (!rows[0] || !(await bcrypt.compare(current_password, rows[0].password_hash)))
    return res.status(400).json({ message: 'Password-ka hadda jira waa khalad' });
  const hash = await bcrypt.hash(new_password, 10);
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
  res.json({ ok: true });
}));

export default router;

