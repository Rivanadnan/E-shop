import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// ✅ GET /products?search=namn
router.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    let query = 'SELECT * FROM products';
    const values: any[] = [];

    if (search && search.trim() !== '') {
      query += ' WHERE name LIKE ? OR description LIKE ?';
      const likeSearch = `%${search}%`;
      values.push(likeSearch, likeSearch);
    }

    const [rows] = await db.promise().query(query, values);
    res.json(rows);
  } catch (err) {
    console.error('Fel vid hämtning av produkter:', err);
    res.status(500).json({ error: 'Något gick fel' });
  }
});

export default router;
