import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type Product = {
  product_name: string;
  unit_price: number;
  quantity: number;
};

type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
};

type Order = {
  id: number;
  total_price: number;
  payment_status: string;
  order_status: string;
  customer: Customer;
  order_items: Product[];
};

function Confirmation() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      const fetchOrder = async () => {
        try {
          const res = await fetch(`https://ecommerce-api-delta-three.vercel.app/orders/payment/${sessionId}`);
          const data = await res.json();
          setOrder(data);

          // ✅ Uppdatera orderstatus till "Paid" och "Received"
          await fetch(`https://ecommerce-api-delta-three.vercel.app/orders/payment/${sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });

          // ✅ Rensa kund- och varukorg från localStorage
          localStorage.removeItem('cart');
          localStorage.removeItem('customer');
        } catch (err) {
          console.error('Fel vid hämtning av order:', err);
        }
      };

      fetchOrder();
    }
  }, [searchParams]);

  if (!order) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Hämtar orderinformation...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Tack för din beställning! 🎉</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>🧾 Orderinformation</h2>
        <p><strong>Order-ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.order_status}</p>
        <p><strong>Betalning:</strong> {order.payment_status}</p>
        <p><strong>Totalt pris:</strong> {order.total_price} kr</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>📦 Produkter</h2>
        <ul>
          {order.order_items.map((item, index) => (
            <li key={index}>
              {item.product_name} – {item.unit_price} kr x {item.quantity}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>👤 Kunduppgifter</h2>
        <p>{order.customer.firstname} {order.customer.lastname}</p>
        <p>{order.customer.email}</p>
        <p>{order.customer.phone}</p>
        <p>{order.customer.street_address}, {order.customer.postal_code} {order.customer.city}, {order.customer.country}</p>
      </section>
    </div>
  );
}

export default Confirmation;
