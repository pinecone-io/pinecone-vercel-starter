import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: Request) {
  const pinecone = new Pinecone()
  const index = pinecone.Index(process.env.PINECONE_INDEX!)
  await index.deleteAll();
  return NextResponse.json({
    success: true
  })
}