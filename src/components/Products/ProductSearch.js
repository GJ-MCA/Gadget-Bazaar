import React, { useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/gadgetbazaar/products/search?q=${query}`);
      const data = await response.json();
      setResults(data);
      setError('');
    } catch (error) {
      console.error(error);
      setResults([]);
      setError('Unable to perform search');
    }
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      {results.length === 0 && <p>No results found</p>}
      {results.length > 0 && (
        <ul>
          {results.map((product) => (
            <li key={product._id}>{product.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
