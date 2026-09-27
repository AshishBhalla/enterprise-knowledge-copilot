export type Docs = {
  fileName: string;
  content: string;
  metadata: MetaData;
};

export type MetaData = {
  title: string;
  department: string;
  region: string;
};

export type Chunk = {
  chunkId: number;
} & Docs;

export type IndexedChunk = {
  embedding: number[];
} & Chunk;

export type Similarity = {
  chunkId: number;
  content: string;
  similarity: number;
  source: string;
};

export type Keyword = {
  chunkId: number;
  content: string;
  matches: number;
  source: string;
};

export type Reranked = { relevanceScore: number } & (Similarity | Keyword);

export type User = {
  user: string;
  department: string;
  region: string;
};
