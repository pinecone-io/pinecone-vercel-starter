import { PineconeClient, ScoredVector } from "@pinecone-database/pinecone";

let pinecone: PineconeClient | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone
}

// The function `getMatchesFromEmbeddings` is used to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async (embeddings: number[], topK: number, namespace: string): Promise<ScoredVector[]> => {
  // Obtain a client for Pinecone
  const pinecone = await getPineconeClient();

  // Retrieve the list of indexes
  const indexes = await pinecone.listIndexes()

  // Check if the desired index is present, else throw an error
  if (!indexes.includes(process.env.PINECONE_INDEX!)) {
    throw (new Error(`Index ${process.env.PINECONE_INDEX} does not exist`))
  }

  // Get the Pinecone index
  const index = pinecone!.Index(process.env.PINECONE_INDEX!);

  // Define the query request
  const queryRequest = {
    vector: embeddings,
    topK,
    includeMetadata: true,
    namespace
  }

  try {
    // Query the index with the defined request
    const queryResult = await index.query({ queryRequest })
    return queryResult.matches || []
  } catch (e) {
    // Log the error and throw it
    console.log("Error querying embeddings: ", e)
    throw (new Error(`Error querying embeddings: ${e}`,))
  }
}

export { getMatchesFromEmbeddings }