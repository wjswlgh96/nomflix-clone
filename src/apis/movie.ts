export const BASE_PATH = "https://api.themoviedb.org/3";
export const IMAGE_PATH = "https://image.tmdb.org/t/p";

export function getMovies() {
  const key = process.env.REACT_APP_API_KEY;

  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${key}&language=ko&region=kr`
  ).then((res) => res.json());
}

export function getMovieSearch(keyword: string) {
  const key = process.env.REACT_APP_API_KEY;

  return fetch(
    `${BASE_PATH}/search/movie?api_key=${key}&query=${keyword}&language=ko&region=kr`
  ).then((res) => res.json());
}
