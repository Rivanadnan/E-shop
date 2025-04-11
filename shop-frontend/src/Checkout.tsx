import { useEffect, useState } from 'react';
import './index.css';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

type Customer = {
  name: string;
  email: string;
};

function Checkout() {
  const [cart, setCart] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: '', email: '' });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCustomer = localStorage.getItem('customer');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem('customer', JSON.stringify({ ...customer, [name]: value }));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, cart }),
      });

      const data = await res.json();
      console.log('Svar från checkout:', data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Något gick fel vid betalningen.');
      }
    } catch (error) {
      console.error('Checkout-fel:', error);
      alert('Kunde inte genomföra betalning.');
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
    alert('Varukorgen är nu tömd.');
    window.location.reload();
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Kassa</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: 'center' }}>🛒 Din varukorg är tom.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Vänster – produkter */}
          <div>
            <h2>Varukorg</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cart.map((item, index) => (
                <li
                  key={index}
                  style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  <strong>{item.name}</strong> – {item.price} kr
                </li>
              ))}
            </ul>
            <p style={{ fontWeight: 'bold' }}>Totalt: {total.toFixed(2)} kr</p>
          </div>

          {/* Höger – formulär */}
          <div>
            <h2>Kunduppgifter</h2>
            <form
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Ditt namn"
                value={customer.name}
                onChange={handleChange}
                required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="email"
                name="email"
                placeholder="Din e-post"
                value={customer.email}
                onChange={handleChange}
                required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <button
                type="button"
                onClick={handleCheckout}
                style={{
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                💳 Gå till betalning
              </button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '10px',
                  border: '1px solid #007bff',
                  borderRadius: '5px',
                  background: 'white',
                  color: '#007bff',
                  cursor: 'pointer',
                }}
              >
                🏠 Till startsidan
              </button>
              <button
                onClick={clearCart}
                style={{
                  padding: '10px',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                🗑️ Töm varukorg
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
