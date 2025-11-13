import { mockMovies } from './data';

const ITEMS_PER_PAGE = 5;

export const fetchMovies = ({ query = '', page = 1, sort = 'rating_desc', genre = 'All' } = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const q = String(query || '').toLowerCase().trim();
      if (q === 'error') return reject(new Error('Simulated API error'));

      let results = mockMovies.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(q);
        const directorMatch = m.director.toLowerCase().includes(q);
        const castMatch = m.cast.toLowerCase().includes(q);
        const textMatch = q === '' ? true : (titleMatch || directorMatch || castMatch);
        const genreMatch = (genre === 'All') ? true : m.genre.includes(genre);
        return textMatch && genreMatch;
      });

      // sorting
      const [criteria, dir] = sort.split('_');
      results.sort((a,b)=>{
        let res = 0;
        if (criteria === 'rating') res = a.rating - b.rating;
        else if (criteria === 'year') res = a.year - b.year;
        else if (criteria === 'title') res = a.title.localeCompare(b.title);
        return dir === 'desc' ? -res : res;
      });

      const totalResults = results.length;
      const start = (page-1) * ITEMS_PER_PAGE;
      const pageItems = results.slice(start, start + ITEMS_PER_PAGE);

      resolve({ movies: pageItems, totalResults });
    }, 800);
  });
};
