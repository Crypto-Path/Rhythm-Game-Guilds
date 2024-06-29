import * as React from 'react';
import { apiCall } from '../functions/index';

export const SearchBar = ({query, setQuery, setResults}) => {

  const fetchResults = React.useCallback(async (query) => {
    try {
      console.log(`Searching for ${query}...`);
      const tempResults = await apiCall(`https://api.quavergame.com/v1/users/search/${query}`);
      setResults(tempResults.users);
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults([]);
    }
  }, [setResults]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query.trim());
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchResults, query, setResults]);

  return (
    <>
      <div className="search-bar-container">
        <input type="text" className="searchbar" placeholder="Search users..." value={query} onChange={e => setQuery(e.target.value)}/>
      </div>
    </>
  );
}