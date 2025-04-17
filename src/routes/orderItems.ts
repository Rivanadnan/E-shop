import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// ✅ Ändra kvantitet: PATCH /order-items/:id
router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: 'Ogiltig kvantitet' });
  }

  try {
    await db.promise().query(
      'UPDATE order_items SET quantity = ? WHERE id = ?',
      [quantity, id]
    );
    res.json({ message: 'Order item updated' });
  } catch (err) {
    console.error('Fel vid uppdatering av order item:', err);
    res.status(500).json({ error: 'Kunde inte uppdatera order item' });
  }
});

// ✅ Ta bort produkt: DELETE /order-items/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.promise().query('DELETE FROM order_items WHERE id = ?', [id]);
    res.json({ message: 'Order item deleted' });
  } catch (err) {
    console.error('Fel vid borttagning av order item:', err);
    res.status(500).json({ error: 'Kunde inte radera order item' });
  }
});

export default router;
