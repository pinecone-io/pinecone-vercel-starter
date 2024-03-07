import seed from './seed'
import { NextResponse } from 'next/server';
import { ServerlessSpecCloudEnum } from '@pinecone-database/pinecone'

export const runtime = 'edge'

export async function POST(req: Request) {

  const { url, options } = await req.json()
  try {
    const documents = await seed(
      url,
      1,
      process.env.PINECONE_INDEX!,
      process.env.PINECONE_CLOUD as ServerlessSpecCloudEnum || 'aws',
      process.env.PINECONE_REGION || 'us-west-2',
      options
    )
    return NextResponse.json({ success: true, documents })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed crawling" })
  }
}