import express from 'express';
import productsRouter from './routes/products';
import db from './db';
import cors from 'cors';
import checkoutRouter from './routes/checkout';
import ordersRouter from './routes/orders';






const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);


app.use('/products', productsRouter);

app.get('/', (req, res) => {
  res.send('Ecommerce API is running...');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


db.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected! Result:', results[0].result);
  }
});
