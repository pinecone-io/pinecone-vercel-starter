import { Pinecone, ScoredPineconeRecord } from "@pinecone-database/pinecone";

// The function `getMatchesFromEmbeddings` is used to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async (embeddings: number[], topK: number, namespace: string): Promise<ScoredPineconeRecord[]> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  // Retrieve the list of indexes
  const indexes = await pinecone.listIndexes()

  let exists = false
  for (const index of indexes) {
    if (index.name === process.env.PINECONE_INDEX!) {
      exists = true
    }
  }

  // Check if the desired index is present, else throw an error
  if (!exists) {
    throw (new Error(`Index ${process.env.PINECONE_INDEX} does not exist`))
  }

  // Get the Pinecone index
  const index = pinecone!.Index(process.env.PINECONE_INDEX!);

  // Get the namespace
  const pineconeNamespace = index.namespace(namespace ?? '')

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: embeddings,
      topK,
      includeMetadata: true,
    })
    return queryResult.matches || []
  } catch (e) {
    // Log the error and throw it
    console.log("Error querying embeddings: ", e)
    throw (new Error(`Error querying embeddings: ${e}`,))
  }
}

export { getMatchesFromEmbeddings }
