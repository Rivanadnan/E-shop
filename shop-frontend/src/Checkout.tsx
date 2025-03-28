import { useEffect, useState } from 'react';

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
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: ''
  });

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

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer, cart }),
      });

      const data = await res.json();
      console.log('Svar från checkout:', data); // 👈 HÄR SER DU SVARET

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
    <div style={{ padding: '2rem' }}>
      <h1>Checkout</h1>

      {cart.length === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          <h2>Produkter i varukorgen:</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} – {item.price} kr
              </li>
            ))}
          </ul>
          <p><strong>Totalt:</strong> {total} kr</p>

          <h2>Kunduppgifter</h2>
          <form>
            <label>
              Namn:
              <input type="text" name="name" value={customer.name} onChange={handleChange} required />
            </label>
            <br />
            <label>
              E-post:
              <input type="email" name="email" value={customer.email} onChange={handleChange} required />
            </label>
          </form>

          <br />
          <button onClick={handleCheckout}>
            Gå till betalning
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
