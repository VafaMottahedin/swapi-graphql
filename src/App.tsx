import MovieFetch from './MovieFetch';
import MovieApollo from './MovieApollo';
import PeopleList from './PeopleList';

function App() {
  return (
    <>
      <h1>GraphQL examples</h1>

      <h2>Movie list using fetch API</h2>
      <MovieFetch />

      <h2>Movie list using Apollo Client</h2>
      <MovieApollo />

      <h2>Paginated people list</h2>
      <PeopleList />
    </>
  );
}

export default App;
