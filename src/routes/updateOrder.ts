
import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

router.put('/:session_id', async (req: Request, res: Response) => {
  const sessionId = req.params.session_id;

  try {
    await db.promise().query(
      'UPDATE orders SET payment_status = ?, order_status = ? WHERE payment_id = ?',
      ['Paid', 'Received', sessionId]
    );

    res.json({ message: 'Order uppdaterad!' });
  } catch (err) {
    console.error('Fel vid uppdatering:', err);
    res.status(500).json({ error: 'Misslyckades att uppdatera order' });
  }
});

export default router;
