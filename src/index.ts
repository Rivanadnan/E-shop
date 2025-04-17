import express from 'express';
import cors from 'cors';
import db from './db';

import productsRouter from './routes/products';
import checkoutRouter from './routes/checkout';
import ordersRouter from './routes/orders';
import orderItemsRouter from './routes/orderItems';
import customersRouter from './routes/customers';
import authRouter from './routes/auth';

const app = express();
const port = 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://e-shop-nu-two.vercel.app' // 🔁 ändra till din frontend-URL om den är annorlunda
  ],
  credentials: true
}));

app.use(express.json());

// Routers
app.use('/products', productsRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);
app.use('/order-items', orderItemsRouter);
app.use('/customers', customersRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Ecommerce API is running...');
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

db.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected! Result:', results[0].result);
  }
});
