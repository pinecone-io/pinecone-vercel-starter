import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from "next/server";

export async function POST() {
    // Instantiate a new Pinecone client
    const pinecone = new Pinecone();
    // Select the desired index
    const indexName = process.env.PINECONE_INDEX!;
    const index = pinecone.Index(indexName);

    // Use the custom namespace, if provided, otherwise use the default
    const namespaceName = process.env.PINECONE_NAMESPACE ?? ''
    const namespace = index.namespace(namespaceName)

    // Delete everything within the namespace
    const stats = await namespace.describeIndexStats()

    return NextResponse.json({
        ...stats
    })
}
