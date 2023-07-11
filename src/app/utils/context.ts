import { ScoredVector } from "@pinecone-database/pinecone";
import { getMatchesFromEmbeddings } from "./pinecone";
import { getEmbeddings } from './embeddings'

export type Metadata = {
  url: string,
  text: string,
  chunk: string,
}

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (message: string, namespace: string, maxTokens = 3000, minScore = 0.7, getOnlyText = true): Promise<string | ScoredVector[]> => {

  // Get the embeddings of the input message
  const embedding = await getEmbeddings(message);

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getMatchesFromEmbeddings(embedding, 3, namespace);

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter(m => m.score && m.score > minScore);

  // If the `getOnlyText` flag is true, we return only the text of the matches
  if (getOnlyText) {
    // Use a map to deduplicate matches by URL
    const docs = matches && Array.from(qualifyingDocs.reduce((map, match) => {
      // Extract the chunk and URL from the match metadata
      const metadata = match.metadata as Metadata;
      const { chunk, url } = metadata;

      // If the URL isn't already in the map, add the chunk of text associated with it
      if (!map.has(url)) {
        map.set(url, chunk);
      }
      return map;
    }, new Map())).map(([_, chunk]) => chunk);

    // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
    return docs.join("\n").substring(0, maxTokens)
  } else {
    // If `getOnlyText` is false, return the full qualifying documents
    return qualifyingDocs
  }
}
