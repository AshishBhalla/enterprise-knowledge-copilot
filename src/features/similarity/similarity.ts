// calculate cosine similarity
const cosineSimilarity = (a: number[], b: number[]): number => {
  const lengthA = a.length;
  const lengthB = b.length;
  if (lengthA !== lengthB) {
    throw new Error("Vectors must have the same dimensions");
  }
  let sum = 0;
  let sumSquareA = 0;
  let sumSquareB = 0;
  for (let i = 0; i < lengthA; i++) {
    sum += a[i]! * b[i]!;
    sumSquareA += a[i]! * a[i]!;
    sumSquareB += b[i]! * b[i]!;
  }
  const magA = Math.sqrt(sumSquareA);
  const magB = Math.sqrt(sumSquareB);

  if (magA === 0 || magB === 0) {
    throw new Error("Cannot calculate cosine similarity for a zero vector");
  }

  return sum / (magA * magB);
};

export default cosineSimilarity;
