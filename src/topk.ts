import { TOP_K } from "../constants/constants.js";
import type { Similarity } from "./type.js";
export function topK(data: Similarity[]): Similarity[] {
  return data.splice(0, TOP_K);
}
