import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

import { PageInfo } from './Models/PageInfo';
import { Person } from './Models/Person';

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
      totalCount
    }
  }
`;

type sortCol = 'name' | 'numMovies' | 'none';

function PeopleList() {
  const [filterText, setFilterText] = useState('');
  const [sortCol, setSortCol] = useState<sortCol>('none');
  const [isSortAscending, setIsSortAscending] = useState(false);
  const { data, loading, error, fetchMore } = useQuery<{
    allPeople: {
      people: Person[];
      pageInfo: PageInfo;
      totalCount: number;
    };
  }>(PEOPLE_QUERY, { variables: { first: FETCH_MAX } });

  function setSort(col: sortCol) {
    setSortCol(col);
    setIsSortAscending(!isSortAscending);
  }

  return (
    <>
      {sortCol !== 'none' && (
        <p>
          Sorting: {isSortAscending ? 'Ascending' : 'Descending'}{' '}
          {sortCol === 'name' ? 'Name' : 'Number of movies'}
        </p>
      )}
      {loading && !error && <em>Please wait...</em>}
      {error && <em>There was an error: {error.name}</em>}
      {!loading && !error && (
        <>
          <input
            onChange={(e) => setFilterText(e.target.value)}
            value={filterText}
          />
          <table>
            <caption>Star Wars People</caption>
            <thead>
              <tr>
                <th scope="col">
                  <button onClick={() => setSort('name')}>Name</button>
                </th>
                <th scope="col">Movies</th>
                <th scope="col">
                  <button onClick={() => setSort('numMovies')}>
                    Number of movies
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.allPeople.people
                  .filter((person) => person.name.includes(filterText))
                  .sort((personA, personB) => {
                    if (sortCol === 'none') {
                      return 0;
                    }

                    let valA;
                    let valB;
                    if (sortCol === 'name') {
                      valA = personA.name;
                      valB = personB.name;
                    } else {
                      // numMovies
                      valA = personA.filmConnection.films.length;
                      valB = personB.filmConnection.films.length;
                    }

                    if (valA < valB) {
                      return isSortAscending ? -1 : 1;
                    }

                    if (valA > valB) {
                      return isSortAscending ? 1 : -1;
                    }

                    return 0;
                  })
                  .map((person) => (
                    <tr key={person.id}>
                      <th scope="row">{person.name}</th>
                      <td>
                        {person.filmConnection.films
                          .map((film) => film.title)
                          .join(', ')}
                      </td>
                      <td>{person.filmConnection.films.length}</td>
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
                        totalCount: fetchMoreResult.allPeople.totalCount,
                      },
                    };
                  },
                });
              }}
            >
              Load more
            </button>

            <button
              disabled={
                data?.allPeople.totalCount === data?.allPeople.people.length
              }
              onClick={() => {
                fetchMore({
                  variables: { first: data?.allPeople.totalCount },
                  updateQuery: (_previousQueryResult, { fetchMoreResult }) =>
                    fetchMoreResult,
                });
              }}
            >
              Load all
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default PeopleList;
