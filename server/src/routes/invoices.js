import { Router } from 'express';
import { query } from '../db.js';
import { auth, allow, wrap } from '../middleware/auth.js';

const router = Router();
router.use(auth, allow('super_admin', 'cashier'));

router.get('/', wrap(async (_req, res) => {
  const { rows } = await query(
    `SELECT i.id, i.description, i.amount, i.status, i.created_at, p.full_name AS patient_name
     FROM invoices i JOIN patients p ON p.id = i.patient_id ORDER BY i.id DESC`);
  res.json(rows);
}));

router.post('/', wrap(async (req, res) => {
  const { patient_id, description, amount } = req.body;
  if (!patient_id || !description || !(Number(amount) >= 0))
    return res.status(400).json({ message: 'Xogta biilka waa khalad' });
  const { rows } = await query(
    'INSERT INTO invoices (patient_id, description, amount) VALUES ($1,$2,$3) RETURNING *',
    [patient_id, description, amount]);
  res.status(201).json(rows[0]);
}));

router.patch('/:id/pay', wrap(async (req, res) => {
  const { rows } = await query("UPDATE invoices SET status='paid' WHERE id=$1 RETURNING *", [req.params.id]);
  res.json(rows[0]);
}));

router.delete('/:id', allow('super_admin'), wrap(async (req, res) => {
  await query('DELETE FROM invoices WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
}));

export default router;

