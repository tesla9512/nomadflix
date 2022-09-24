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

export async function getMovies() {
  const response = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  );
  return await response.json();
}

// export async function getDeatilMovie(moiveId: string) {
//   const response = await fetch(
//     `${BASE_PATH}/movie/${moiveId}?api_key=${API_KEY}&language=en-US`
//   );
//   return await response.json();
// }
