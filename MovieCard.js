import React, { useState } from 'react';

export default function MovieCard({ movie }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="card" onClick={() => setExpanded(s => !s)}>
      <img className="card-poster" src={movie.poster} alt={`${movie.title} poster`} onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/250x375/374151/ffffff?text=No+Poster'}} />
      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>
        <p className="muted">{movie.year} • {movie.genre}</p>
        <p className={"summary " + (expanded ? 'expanded' : 'clamped')}>{movie.summary}</p>
        {expanded && (
          <div className="meta">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Cast:</strong> {movie.cast}</p>
          </div>
        )}
        <div className="card-footer">
          <span className="rating">★ {movie.rating}</span>
          <button className="btn link">{expanded ? 'Show Less' : 'Show More'}</button>
        </div>
      </div>
    </article>
  );
}
