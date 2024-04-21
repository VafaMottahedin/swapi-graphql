import { Movie } from './Movie';

export interface Person {
  id: string;
  name: string;
  filmConnection: { films: Movie[] };
}
