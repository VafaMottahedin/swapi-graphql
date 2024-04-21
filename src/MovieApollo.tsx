import { Movie } from './Models/Movie';
import { useQuery, gql } from '@apollo/client';
import MovieList from './MovieList';

const FILMS_QUERY = gql`
  query Movies {
    allFilms {
      films {
        id
        title
        director
        releaseDate
      }
    }
  }
`;

function MovieApollo() {
  const { data, loading, error } = useQuery<{ allFilms: { films: Movie[] } }>(
    FILMS_QUERY
  );

  return (
    <MovieList
      loading={loading}
      error={error?.name}
      movies={data?.allFilms.films}
    />
  );
}

export default MovieApollo;
