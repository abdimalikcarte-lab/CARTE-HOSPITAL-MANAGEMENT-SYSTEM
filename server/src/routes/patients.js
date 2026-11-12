import { Router } from 'express';
import { query } from '../db.js';
import { auth, allow, wrap } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', wrap(async (req, res) => {
  const q = `%${req.query.search || ''}%`;
  const { rows } = await query(
    'SELECT * FROM patients WHERE full_name ILIKE $1 OR phone ILIKE $1 ORDER BY id DESC', [q]);
  res.json(rows);
}));

router.post('/', allow('super_admin', 'receptionist', 'doctor'), wrap(async (req, res) => {
  const { full_name, gender, phone, dob, address } = req.body;
  if (!full_name || !gender) return res.status(400).json({ message: 'Magaca iyo jinsiga waa loo baahan yahay' });
  const { rows } = await query(
    `INSERT INTO patients (full_name, gender, phone, dob, address, created_by)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [full_name, gender, phone || null, dob || null, address || null, req.user.id]);
  res.status(201).json(rows[0]);
}));

router.delete('/:id', allow('super_admin'), wrap(async (req, res) => {
  await query('DELETE FROM patients WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
}));

export default router;

