import { useState } from 'react';

const API_KEY = 'AIzaSyBdRBLgtvJhQ3qtWW4-FzQ037uW3MYilCY';
const CSE_ID = 'a62ea9750df754041';

function GoogleSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(1);

  const fetchResults = async (customStartIndex = 1) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CSE_ID}&q=${query}&start=${customStartIndex}`
      );
      const data = await response.json();
      setResults(data.items || []);
      setStartIndex(customStartIndex);
    } catch (err) {
      console.error('Fel vid sök:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Sök på webben</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          placeholder="Sök..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={() => fetchResults()}>Sök</button>
      </div>

      <div>
        {results.map((item, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <h3>{item.title}</h3>
            </a>
            <p>{item.snippet}</p>
            {item.pagemap?.cse_image && item.pagemap.cse_image[0]?.src && (
              <img src={item.pagemap.cse_image[0].src} alt="" style={{ width: '100px' }} />
            )}
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => fetchResults(startIndex + 10)}>Nästa sida ➡</button>
          {startIndex > 1 && (
            <button onClick={() => fetchResults(startIndex - 10)} style={{ marginLeft: '1rem' }}>
              ⬅ Föregående sida
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default GoogleSearch;
