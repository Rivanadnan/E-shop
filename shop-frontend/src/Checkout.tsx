import { useEffect, useState } from 'react';
import './index.css';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity?: number; // 👈 kvantitet per produkt
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

function Checkout() {
  const [cart, setCart] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max((newCart[index].quantity || 1) + delta, 1);
    setCart(newCart);
  };

  const handleRemoveItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch('https://ecommerce-api-delta-three.vercel.app/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, cart }),
      });

      const data = await res.json();
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

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Kassa</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: 'center' }}>🛒 Din varukorg är tom.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div>
            <h2>Varukorg</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cart.map((item, index) => (
                <li key={index} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <strong>{item.name}</strong> – {item.price} kr<br />
                  Kvantitet:
                  <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                  <span style={{ margin: '0 8px' }}>{item.quantity || 1}</span>
                  <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                  <br />
                  <button onClick={() => handleRemoveItem(index)} style={{ marginTop: '5px', color: 'red' }}>
                    Ta bort
                  </button>
                </li>
              ))}
            </ul>
            <p style={{ fontWeight: 'bold' }}>Totalt: {total.toFixed(2)} kr</p>
          </div>

          <div>
            <h2>Kunduppgifter</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input name="firstname" placeholder="Förnamn" value={customer.firstname} onChange={handleChange} />
              <input name="lastname" placeholder="Efternamn" value={customer.lastname} onChange={handleChange} />
              <input name="email" placeholder="E-post" type="email" value={customer.email} onChange={handleChange} />
              <input name="phone" placeholder="Telefon" value={customer.phone} onChange={handleChange} />
              <input name="street_address" placeholder="Adress" value={customer.street_address} onChange={handleChange} />
              <input name="postal_code" placeholder="Postnummer" value={customer.postal_code} onChange={handleChange} />
              <input name="city" placeholder="Stad" value={customer.city} onChange={handleChange} />
              <input name="country" placeholder="Land" value={customer.country} onChange={handleChange} />
              <button type="button" onClick={handleCheckout} style={{ marginTop: '1rem' }}>
                💳 Gå till betalning
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
