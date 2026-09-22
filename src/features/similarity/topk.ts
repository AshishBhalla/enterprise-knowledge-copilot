import { TOP_K } from "../../config/constants.js";
import type { Similarity } from "../../types/type.js";

export function topK(data: Similarity[]): Similarity[] {
  return data.splice(0, TOP_K);
}
