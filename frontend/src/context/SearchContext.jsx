import { createContext, useState, useCallback } from 'react';

export const SearchContext = createContext(null);

const SESSION_KEY = 'cpt_search';

export const SearchProvider = ({ children }) => {
  const getInitialSearch = () => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : { cpt: '', zip: '' };
    } catch {
      return { cpt: '', zip: '' };
    }
  };

  const [searchParams, setSearchParamsState] = useState(getInitialSearch);
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);

  const setSearchParams = useCallback((params) => {
    setSearchParamsState(params);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(params));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParamsState({ cpt: '', zip: '' });
    sessionStorage.removeItem(SESSION_KEY);
    setResults([]);
    setPagination(null);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchParams,
        setSearchParams,
        results,
        setResults,
        pagination,
        setPagination,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
