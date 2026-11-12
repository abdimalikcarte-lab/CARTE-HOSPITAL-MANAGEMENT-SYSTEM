import { Router } from 'express';
import { query } from '../db.js';
import { auth, wrap } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', wrap(async (req, res) => {
  const role = req.user.role;
  const out = {};
  out.patients = +(await query('SELECT COUNT(*) FROM patients')).rows[0].count;
  out.appointmentsToday = +(await query(
    "SELECT COUNT(*) FROM appointments WHERE scheduled_at::date = CURRENT_DATE AND status='scheduled'")).rows[0].count;
  if (role === 'super_admin' || role === 'cashier') {
    const r = (await query(
      `SELECT COALESCE(SUM(amount) FILTER (WHERE status='unpaid'),0) AS unpaid,
              COALESCE(SUM(amount) FILTER (WHERE status='paid'),0) AS paid FROM invoices`)).rows[0];
    out.unpaid = Number(r.unpaid);
    out.paid = Number(r.paid);
  }
  if (role === 'super_admin') {
    out.users = +(await query('SELECT COUNT(*) FROM users WHERE active')).rows[0].count;
  }
  res.json(out);
}));

export default router;

