import { PageInfo } from './Models/PageInfo';
import { Person } from './Models/Person';
import { useQuery, gql } from '@apollo/client';
import { FETCH_MAX } from './Constants';

const PEOPLE_QUERY = gql`
  query AllPeople($first: Int, $after: String) {
    allPeople(first: $first, after: $after) {
      people {
        id
        name
        filmConnection {
          films {
            title
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

function PeopleList() {
  const { data, loading, error, fetchMore } = useQuery<{
    allPeople: {
      people: Person[];
      pageInfo: PageInfo;
    };
  }>(PEOPLE_QUERY, { variables: { first: FETCH_MAX } });

  return (
    <>
      {loading && !error && <em>Please wait...</em>}
      {error && <em>There was an error: {error.name}</em>}
      {!loading && !error && (
        <>
          <table>
            <caption>Star Wars People</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Movies</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.allPeople.people.map((person) => (
                  <tr key={person.id}>
                    <th scope="row">{person.name}</th>
                    <td>
                      {person.filmConnection.films
                        .map((film) => film.title)
                        .join(', ')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div>
            <button
              disabled={!data?.allPeople.pageInfo.hasNextPage}
              onClick={() => {
                fetchMore({
                  variables: {
                    first: FETCH_MAX,
                    after: data?.allPeople.pageInfo.endCursor,
                  },
                  updateQuery: (previousQueryResult, { fetchMoreResult }) => {
                    return {
                      allPeople: {
                        people: [
                          ...previousQueryResult.allPeople.people,
                          ...fetchMoreResult.allPeople.people,
                        ],
                        pageInfo: fetchMoreResult.allPeople.pageInfo,
                      },
                    };
                  },
                });
              }}
            >
              Load more
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default PeopleList;
