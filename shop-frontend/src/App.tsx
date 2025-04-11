// shop-frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Checkout from './Checkout';
import Confirmation from './Confirmation';
import GoogleSearch from './GoogleSearch'; 
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
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/products?search=${searchTerm}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Fel vid hämtning:', err);
    }
  };

  useEffect(() => {
    fetchProducts();

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product: Product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', gap: '2rem' }}>
        <Link to="/">Start</Link>
        <Link to="/checkout">Gå till kassan ({cart.length})</Link>
        <Link to="/search">🔎 Sök</Link> {/* ✅ NY */}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Produkter</h1>

              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Sök produkt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchProducts}>Sök</button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      border: '1px solid #ccc',
                      padding: '1rem',
                      width: '200px',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px' }}
                    />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <strong>{product.price} kr</strong>
                    <br />
                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Lägg till i varukorg
                    </button>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/search" element={<GoogleSearch />} /> {/* ✅ NY */}
      </Routes>
    </Router>
  );
}

export default App;
