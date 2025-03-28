import { Router } from 'express';
import db from '../db';
import Stripe from 'stripe';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

router.post('/', async (req, res) => {
  const { customer, cart } = req.body;

  if (!customer || !cart || cart.length === 0) {
    return res.status(400).json({ error: 'Kund och varukorg krävs' });
  }

  try {
    // Kolla om kunden redan finns
    const [existing] = await db.promise().query(
      'SELECT * FROM customers WHERE email = ?',
      [customer.email]
    );

    let customerId;

    if ((existing as any).length > 0) {
      customerId = (existing as any)[0].id;
    } else {
      const [result] = await db.promise().query(
        'INSERT INTO customers (name, email) VALUES (?, ?)',
        [customer.name, customer.email]
      );
      customerId = (result as any).insertId;
    }

    // Skapa order
    const [orderResult] = await db.promise().query(
      'INSERT INTO orders (customer_id, payment_status, payment_id, order_status) VALUES (?, ?, ?, ?)',
      [customerId, 'Unpaid', '', 'Pending']
    );

    const orderId = (orderResult as any).insertId;

    // Lägg till order_items
    for (const item of cart) {
      await db.promise().query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.id, 1]
      );
    }

    // Skapa Stripe Checkout-session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cart.map((item: any) => ({
        price_data: {
          currency: 'sek',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      success_url: `http://localhost:5173/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:5173/checkout',
      metadata: {
        order_id: orderId.toString(),
      },
    });

    // Uppdatera order med Stripe-session
    await db.promise().query(
      'UPDATE orders SET payment_id = ?, payment_status = ?, order_status = ? WHERE id = ?',
      [session.id, 'Unpaid', 'Pending', orderId]
    );

    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Något gick fel vid checkout' });
  }
});

export default router;
