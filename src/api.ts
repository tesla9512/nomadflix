const API_KEY = "8e95366c2104a6d9b2111abc27bd72d2";
const BASE_PATH = "https://api.themoviedb.org/3";
// const IMG_PATH = "https://image.tmdb.org/t/p/original";

interface IMovie {
  id: number;
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IGenre {
  id: number;
  name: string;
}

interface IProduction {
  id: number;
  logo_path: string;
  name: string;
}

export interface IGetMoiveDetail {
  adult: boolean;
  genres: IGenre[];
  title: string;
  tagline: string;
  overview: string;
  runtime: number;
  vote_average: number;
  production_companies: IProduction[];
  backdrop_path: string;
  poster_path: string;
}

export interface ISearch {
  id: number;
  release_date: string;
  title: string;
  poster_path: string;
}

export async function getMovies() {
  const response = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  );
  return await response.json();
}

export async function getDeatilMovie(moiveId: string) {
  const response = await fetch(
    `${BASE_PATH}/movie/${moiveId}?api_key=${API_KEY}&language=en-US`
  );
  return await response.json();
}

export async function getSearchMovie(keyword: string, page: number) {
  const response = await fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=${page}&include_adult=false`
  );
  return await response.json();
}
