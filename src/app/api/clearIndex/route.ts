import { NextRequest, NextResponse } from "next/server";
import { getPineconeClient } from "@/utils/pinecone";

export async function POST(req: Request) {
  const pinecone = await getPineconeClient()
  const index = pinecone.Index(process.env.PINECONE_INDEX!)
  await index.delete1({
    deleteAll: true
  });
  return NextResponse.json({
    success: true
  })
}