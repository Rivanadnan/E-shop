import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Checkout from './Checkout';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Fel vid hämtning:', err));
  }, []);

  const addToCart = (product: Product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Start</Link> | <Link to="/checkout">Gå till kassan ({cart.length})</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: '2rem' }}>
              <h1>Produkter</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {products.map((product) => (
                  <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
                    <img src={product.image_url} alt={product.name} style={{ width: '100%' }} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <strong>{product.price} kr</strong>
                    <br />
                    <button onClick={() => addToCart(product)}>Lägg till i varukorg</button>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
