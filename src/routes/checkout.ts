import { Router, Request, Response } from 'express';
import db from '../db';
import Stripe from 'stripe';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

router.post('/', async (req: Request, res: Response) => {
  const { customer, cart } = req.body;

  if (!customer || !cart || cart.length === 0) {
    return res.status(400).json({ error: 'Kund och varukorg krävs' });
  }

  try {
    const [existing] = await db
      .promise()
      .query('SELECT * FROM customers WHERE email = ?', [customer.email]);

    let customerId;

    if ((existing as any[]).length > 0) {
      customerId = (existing as any[])[0].id;
    } else {
      const [result] = await db.promise().query(
        'INSERT INTO customers (firstname, lastname, email, phone, street_address, postal_code, city, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          customer.firstname || '',
          customer.lastname || '',
          customer.email,
          customer.phone || '',
          customer.street_address || '',
          customer.postal_code || '',
          customer.city || '',
          customer.country || '',
        ]
      );
      customerId = (result as any).insertId;
    }

    const totalPrice = cart.reduce((sum: number, item: any) => sum + Number(item.price), 0);

    const [orderResult] = await db
      .promise()
      .query(
        'INSERT INTO orders (customer_id, total_price, payment_status, payment_id, order_status) VALUES (?, ?, ?, ?, ?)',
        [customerId, totalPrice, 'unpaid', '', 'pending']
      );

    const orderId = (orderResult as any).insertId;

    for (const item of cart) {
      await db.promise().query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.name, item.quantity || 1, item.price]
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cart.map((item: any) => ({
        price_data: {
          currency: 'sek',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity || 1,
      })),
      success_url: 'http://localhost:5173/confirmation?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/checkout',
      metadata: {
        order_id: orderId.toString(),
      },
    });

    await db.promise().query(
      'UPDATE orders SET payment_id = ?, payment_status = ?, order_status = ? WHERE id = ?',
      [session.id, 'unpaid', 'pending', orderId]
    );

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout-fel:', err.message);
    res.status(500).json({ error: 'Något gick fel vid checkout', details: err.message });
  }
});

export default router;
