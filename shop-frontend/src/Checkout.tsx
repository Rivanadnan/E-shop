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

  // Ladda varukorg och kund från localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCustomer = localStorage.getItem('customer');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
  }, []);

  // Hantera formulärändringar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem('customer', JSON.stringify({ ...customer, [name]: value }));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
          <button onClick={() => alert("Här ska Stripe-betalning ske!")}>
            Gå till betalning
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
