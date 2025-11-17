import React, { useState, useEffect, useMemo } from 'react';
import MovieCard from './MovieCard';
import { fetchMovies } from './api';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('Ajith');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortCriteria, setSortCriteria] = useState('rating_desc');
  const [genreFilter, setGenreFilter] = useState('All');

  const ITEMS_PER_PAGE = 5;

  const totalPages = useMemo(() => Math.ceil(totalResults / ITEMS_PER_PAGE), [totalResults]);

  useEffect(() => {
    let mounted = true;
    const doSearch = async () => {
      setIsLoading(true);
      setIsError(null);
      try {
        const { movies: resultMovies, totalResults } = await fetchMovies({
          query: searchTerm,
          page: currentPage,
          sort: sortCriteria,
          genre: genreFilter
        });
        if (!mounted) return;
        setMovies(resultMovies);
        setTotalResults(totalResults);
      } catch (err) {
        if (!mounted) return;
        setIsError(err.message || 'Failed to fetch');
        setMovies([]);
        setTotalResults(0);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    doSearch();
    return () => { mounted = false; };
  }, [searchTerm, currentPage, sortCriteria, genreFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      <header className="header">
        <h1>movie store</h1>
      </header>

      <main className="container">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            className="search-input"
            placeholder="Search by title, actor (e.g., Ajith, Vijay) or director (e.g., Nolan)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn primary" type="submit" disabled={isLoading}>Search</button>
        </form>

        <div className="controls">
          <div className="control">
            <label>Genre</label>
            <select value={genreFilter} onChange={(e) => { setGenreFilter(e.target.value); setCurrentPage(1); }}>
              <option>All</option>
              <option>Action</option>
              <option>Sci-Fi</option>
              <option>Drama</option>
              <option>Thriller</option>
              <option>Comedy</option>
            </select>
          </div>

          <div className="control">
            <label>Sort</label>
            <select value={sortCriteria} onChange={(e) => { setSortCriteria(e.target.value); setCurrentPage(1); }}>
              <option value="rating_desc">Rating (High → Low)</option>
              <option value="rating_asc">Rating (Low → High)</option>
              <option value="year_desc">Year (Newest)</option>
              <option value="year_asc">Year (Oldest)</option>
              <option value="title_asc">Title (A → Z)</option>
            </select>
          </div>
        </div>

        <section className="results">
          {isLoading && <div className="loading">Loading movies...</div>}
          {isError && <div className="error">{isError}</div>}

          {!isLoading && !isError && movies.length === 0 && (
            <div className="empty">No movies found — try another search.</div>
          )}

          <div className="grid">
            {movies.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage===1}>Prev</button>
              <span>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
              <button className="btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage===totalPages}>Next</button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">Made with ❤️ — Movie Store</footer>
    </div>
  );
}
