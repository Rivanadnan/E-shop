import { useEffect, useState } from 'react';

const BACKEND_URL = 'https://ecommerce-api-new-coral.vercel.app';

function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const fetchResults = async (page: number = 1) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setResults(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Fel vid sökning:', error);
    }
  };

  useEffect(() => {
    if (query) fetchResults(1);
  }, [query]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔍 Sök efter produkter i vårt API</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          placeholder="Sök efter produkt..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={() => fetchResults(1)}>Sök</button>
      </div>

      {results.length > 0 ? (
        <div>
          {results.map((item, index) => (
            <div
              key={index}
              style={{
                borderBottom: '1px solid #ccc',
                marginBottom: '1rem',
                paddingBottom: '1rem',
              }}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p><strong>Pris:</strong> {item.price} kr</p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '120px', borderRadius: '5px' }}
                />
              )}
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
            {currentPage > 1 && (
              <button onClick={() => fetchResults(currentPage - 1)} style={{ marginRight: '1rem' }}>
                ⬅ Föregående sida
              </button>
            )}
            {results.length === limit && (
              <button onClick={() => fetchResults(currentPage + 1)}>Nästa sida ➡</button>
            )}
          </div>
        </div>
      ) : (
        query && <p>🚫 Inga produkter hittades.</p>
      )}
    </div>
  );
}

export default ProductSearch;
