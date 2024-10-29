import { IMAGE_PATH } from "../apis/movie";

export function makeImagePath(id: string, format?: string) {
  return `${IMAGE_PATH}/${format ? format : "original"}/${id}`;
}
