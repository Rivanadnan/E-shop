import { Router } from 'express';
import db from '../db';

const router = Router();

router.put('/payment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query(
      `UPDATE orders 
       SET payment_status = ?, order_status = ? 
       WHERE payment_id = ?`,
      ['Paid', 'Received', id]
    );

    res.json({ message: 'Order uppdaterad' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte uppdatera ordern' });
  }
});

export default router;
