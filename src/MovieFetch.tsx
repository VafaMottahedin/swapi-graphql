import { useState, useEffect } from 'react';
import { Movie } from './Models/Movie';
import { API_ENDPOINT } from './Constants';
import MovieList from './MovieList';

const FILMS_QUERY = `query Movies { allFilms { films { id title director releaseDate } } }`; // had issues splitting this into separate lines

function MovieFetch() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch(`${API_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({
        operationName: 'Movies',
        query: FILMS_QUERY,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          return;
        }
        return response.json();
      })
      .then((result) => {
        setIsSearching(false);
        setMovies(result.data.allFilms.films);
      })
      .catch((error) => {
        setIsSearching(false);
        setErrorMessage(error.message);
      });
  }, [isSearching]);

  return (
    <MovieList loading={isSearching} error={errorMessage} movies={movies} />
  );
}

export default MovieFetch;
