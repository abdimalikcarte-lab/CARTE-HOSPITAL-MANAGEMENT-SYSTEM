import { Router } from 'express';
import { query } from '../db.js';
import { auth, allow, wrap } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', wrap(async (req, res) => {
  // Dhakhtarku wuxuu arkaa ballamihiisa oo keliya
  const onlyMine = req.user.role === 'doctor';
  const { rows } = await query(
    `SELECT a.id, a.scheduled_at, a.reason, a.status,
            p.full_name AS patient_name, d.full_name AS doctor_name
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN users d ON d.id = a.doctor_id
     ${onlyMine ? 'WHERE a.doctor_id = $1' : ''}
     ORDER BY a.scheduled_at DESC`,
    onlyMine ? [req.user.id] : []);
  res.json(rows);
}));

router.post('/', allow('super_admin', 'receptionist'), wrap(async (req, res) => {
  const { patient_id, doctor_id, scheduled_at, reason } = req.body;
  if (!patient_id || !doctor_id || !scheduled_at)
    return res.status(400).json({ message: 'Bukaan, dhakhtar iyo waqti dooro' });
  const { rows } = await query(
    `INSERT INTO appointments (patient_id, doctor_id, scheduled_at, reason)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [patient_id, doctor_id, scheduled_at, reason || null]);
  res.status(201).json(rows[0]);
}));

router.patch('/:id/status', allow('super_admin', 'receptionist', 'doctor'), wrap(async (req, res) => {
  const { status } = req.body;
  if (!['scheduled', 'completed', 'cancelled'].includes(status))
    return res.status(400).json({ message: 'Xaalad khalad ah' });
  const { rows } = await query('UPDATE appointments SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
  res.json(rows[0]);
}));

router.delete('/:id', allow('super_admin'), wrap(async (req, res) => {
  await query('DELETE FROM appointments WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
}));

export default router;

