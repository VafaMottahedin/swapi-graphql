import { Movie } from './Models/Movie';

interface Props {
  loading: boolean;
  error: string | undefined;
  movies: Movie[] | undefined;
}

function MovieList({ loading, error, movies }: Props) {
  return (
    <>
      {loading && !error && <em>Please wait...</em>}
      {error && <em>There was an error: {error}</em>}
      {!loading && !error && (
        <table>
          <caption>Star Wars Movies</caption>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Director</th>
              <th scope="col">Year</th>
            </tr>
          </thead>
          <tbody>
            {movies &&
              movies.map((movie) => (
                <tr key={movie.id}>
                  <th scope="row">{movie.title}</th>
                  <td>{movie.director}</td>
                  <td>{movie.releaseDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default MovieList;
