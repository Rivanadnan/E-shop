// src/pages/Search.tsx
import { useState, useEffect } from "react";
import axios from "axios";

type SearchResultItem = {
  title: string;
  link: string;
  snippet: string;
};

type ApiResponse = {
  items: SearchResultItem[];
  totalResults: string;
  currentPage: number;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const { data } = await axios.get<ApiResponse>(`${backendUrl}/search`, {
        params: { q: query, page },
      });

      setResults(data.items || []);
      setTotalResults(parseInt(data.totalResults || "0"));
    } catch (err) {
      console.error("Search failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [page]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    handleSearch();
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Products</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border p-2 rounded w-full max-w-md"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <div>
          <p className="mb-2">Showing page {page} of {totalPages}</p>
          <ul className="space-y-4">
            {results.map((item, idx) => (
              <li key={idx} className="border p-3 rounded">
                <a href={item.link} className="text-blue-700 font-semibold" target="_blank" rel="noreferrer">
                  {item.title}
                </a>
                <p>{item.snippet}</p>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
