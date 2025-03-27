import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Fel vid hämtning av produkter:', err);
      return res.status(500).json({ error: 'Något gick fel' });
    }

    res.json(results);
  });
});

export default router;
