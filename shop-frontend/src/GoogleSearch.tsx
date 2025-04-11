
import { useState } from 'react';
import { Link } from 'react-router-dom';

type SearchResult = {
  id: number;
  title: string;
  image: string;
  link: string;
};

const mockResults: SearchResult[] = [
  {
    id: 1,
    title: 'Trådlösa hörlurar – Webbhallen Edition',
    image: 'https://cdn.webbhallen.com/product/123456/images/456xauto.jpg',
    link: '/'
  },
  {
    id: 2,
    title: 'Bluetooth Högtalare – H&M Sounds',
    image: 'https://cdn.hm.com/media/product/654321/images/456xauto.jpg',
    link: '/'
  },
  {
    id: 3,
    title: 'Gaming Laptop – Webbhallen Pro',
    image: 'https://cdn.webbhallen.com/product/987654/images/456xauto.jpg',
    link: '/'
  }
];

function GoogleSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = () => {
    const filtered = mockResults.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔍 Google-sök (fejkad)</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Sök produkt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleSearch}>Sök</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {results.map((result) => (
          <div
            key={result.id}
            style={{
              width: '250px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              background: '#fafafa'
            }}
          >
            <img
              src={result.image}
              alt={result.title}
              style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px' }}
            />
            <h3>{result.title}</h3>
            <Link to={result.link} style={{ color: '#007bff' }}>
              Gå till produkten
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoogleSearch;
