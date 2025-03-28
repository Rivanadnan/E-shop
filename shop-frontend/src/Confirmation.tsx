import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type Order = {
  id: number;
  payment_status: string;
  order_status: string;
  total: number;
  customer: {
    name: string;
    email: string;
  };
  order_items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
};

function Confirmation() {
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const session_id = params.get('session_id');
    if (!session_id) return;

    fetch(`http://localhost:3000/orders/payment/${session_id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        localStorage.removeItem('cart');
        localStorage.removeItem('customer');
      })
      .catch((err) => {
        console.error('Kunde inte hämta order:', err);
      });
  }, [params]);

  if (!order) return <p>Laddar orderinformation...</p>;

  const total = order.order_items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tack för din beställning! 🎉</h1>
      <p><strong>Namn:</strong> {order.customer.name}</p>
      <p><strong>E-post:</strong> {order.customer.email}</p>

      <h2>Produkter</h2>
      <ul>
        {order.order_items.map((item, index) => (
          <li key={index}>
            {item.product.name} – {item.product.price} kr × {item.quantity}
          </li>
        ))}
      </ul>

      <h3>Totalt: {total} kr</h3>
      <p>Status: {order.payment_status} / {order.order_status}</p>
    </div>
  );
}

export default Confirmation;
