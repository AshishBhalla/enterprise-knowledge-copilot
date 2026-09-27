import { TOP_K } from "../../config/constants.js";

export function topK<T>(data: T[]): T[] {
  return data.splice(0, TOP_K);
}
