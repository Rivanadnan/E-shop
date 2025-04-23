// src/pages/Confirmation.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
};

type Order = {
  id: number;
  order_status: string;
  payment_status: string;
  total_price: number;
  customer_firstname: string;
  customer_lastname: string;
  customer_email: string;
  customer_phone: string;
  customer_street_address: string;
  customer_postal_code: string;
  customer_city: string;
  customer_country: string;
  order_items: OrderItem[];
};

export default function Confirmation() {
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = params.get("session_id");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(`https://ecommerce-api-d114v2eae-warmness-travels-projects.vercel.app/orders/payment/${sessionId}`);
        const data = await res.json();

        const items = data.order_items || data.order?.order_items || [];
        const merged = { ...data, order_items: items };

        setOrder(merged);
        localStorage.removeItem("cart");
        localStorage.removeItem("customer");
      } catch (err) {
        console.error("Fel vid hämtning av order:", err);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return <p className="p-4">🔄 Laddar order...</p>;
  if (!order) return <p className="p-4">❌ Ingen order hittades.</p>;

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
        <p>{order.customer_firstname} {order.customer_lastname}</p>
        <p>{order.customer_email}</p>
        <p>{order.customer_phone}</p>
        <p>
          {order.customer_street_address}, {order.customer_postal_code} {order.customer_city}, {order.customer_country}
        </p>
      </section>
    </div>
  );
}
