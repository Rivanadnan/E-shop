import { Router } from 'express';
import db from '../models/db';

const router = Router();


router.get('/payment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [orders] = await db.promise().query(
      'SELECT * FROM orders WHERE payment_id = ?',
      [id]
    );

    if ((orders as any).length === 0) {
      return res.status(404).json({ error: 'Order hittades inte' });
    }

    const order = (orders as any)[0];

    const [customerResult] = await db.promise().query(
      'SELECT * FROM customers WHERE id = ?',
      [order.customer_id]
    );

    const customer = (customerResult as any)[0];

    const [itemsResult] = await db.promise().query(
      `SELECT p.name, p.price 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({
      ...order,
      customer,
      items: itemsResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Något gick fel vid hämtning av order' });
  }
});


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
