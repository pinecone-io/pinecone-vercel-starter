import type { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getMatchesFromEmbeddings } from "./pinecone";
import type { Metadata } from './pinecone';
import { getEmbeddings } from './embeddings'

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (message: string, namespace: string, minScore = 0.7): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Get the embeddings of the input message
  const embedding = await getEmbeddings(message);

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getMatchesFromEmbeddings(embedding, 3, namespace);

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter(m => m.score && m.score > minScore);

  return qualifyingDocs
}

export const getContextText = (matches: ScoredPineconeRecord<Metadata>[], maxTokens = 3000): string => {
  let docs = matches.map(match => (match.metadata)?.chunk);

  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  return docs.join("\n").substring(0, maxTokens)
}