import { useEffect, useState } from 'react';

type Customer = {
  name: string;
  email: string;
};

type Product = {
  name: string;
  price: number | string;
};

type Order = {
  id: number;
  payment_id: string;
  order_status: string;
  payment_status: string;
  created_at: string;
  customer: Customer;
  items: Product[];
};

function Confirmation() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      fetch(`http://localhost:3000/orders/payment/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);

       
          localStorage.removeItem('cart');
          localStorage.removeItem('customer');

        
          return fetch(`http://localhost:3000/orders/payment/${sessionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        })
        .then(() => {
          console.log('Order uppdaterad till Paid/Received');

          
          setOrder((prev) =>
            prev
              ? {
                  ...prev,
                  payment_status: 'Paid',
                  order_status: 'Received',
                }
              : prev
          );
        })
        .catch((err) => {
          console.error('Kunde inte hämta eller uppdatera ordern:', err);
        });
    }
  }, []);

  if (!order) {
    return <p>Laddar orderinformation...</p>;
  }

  const total = order.items.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tack för din beställning!</h1>
      <p><strong>Order-ID:</strong> {order.id}</p>
      <p><strong>Kund:</strong> {order.customer.name} ({order.customer.email})</p>
      <p><strong>Status:</strong> {order.payment_status} / {order.order_status}</p>

      <h2>Produkter:</h2>
      <ul>
        {order.items.map((item, i) => (
          <li key={i}>
            {item.name} – {Number(item.price).toFixed(2)} kr
          </li>
        ))}
      </ul>
      <p><strong>Totalt:</strong> {total.toFixed(2)} kr</p>
    </div>
  );
}

export default Confirmation;
