import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();


router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta produkter' });
  }
});


router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await db
      .promise()
      .query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Produkten hittades inte' });
    }

    res.json((rows as any)[0]);
  } catch (error) {
    res.status(500).json({ error: 'Fel vid hämtning av produkt' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  const { name, description, price, stock, category, image } = req.body;

  try {
    const [result] = await db.promise().query(
      'INSERT INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category, image]
    );

    res.status(201).json({ message: 'Product created', id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte skapa produkt' });
  }
});


router.patch('/:id', async (req: Request, res: Response) => {
  const { name, description, price, stock, category, image } = req.body;

  try {
    await db
      .promise()
      .query(
        'UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image=? WHERE id=?',
        [name, description, price, stock, category, image, req.params.id]
      );

    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte uppdatera produkt' });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await db.promise().query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte radera produkt' });
  }
});

export default router;
