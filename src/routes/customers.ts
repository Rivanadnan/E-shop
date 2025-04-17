import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// ✅ Hämta alla kunder
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Misslyckades att hämta kunder' });
  }
});

// ✅ Hämta kund med ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM customers WHERE id = ?',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Kund hittades inte' });
  }
});

// ✅ Hämta kund med e-post
router.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM customers WHERE email = ?',
      [req.params.email]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Kund hittades inte' });
  }
});

// ✅ Skapa kund
router.post('/', async (req: Request, res: Response) => {
  const {
    firstname,
    lastname,
    email,
    password,
    phone,
    street_address,
    postal_code,
    city,
    country,
  } = req.body;

  try {
    const [result] = await db.promise().query(
      `INSERT INTO customers 
      (firstname, lastname, email, password, phone, street_address, postal_code, city, country) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, email, password, phone, street_address, postal_code, city, country]
    );

    res.status(201).json({ message: 'Customer created', id: (result as any).insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte skapa kund' });
  }
});

export default router;
