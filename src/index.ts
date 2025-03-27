import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ecommerce API is running...');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import db from './db';

db.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected! Result:', results[0].result);
  }
});
