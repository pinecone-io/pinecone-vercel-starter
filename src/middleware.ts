import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const requiredEnvVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_ENVIRONMENT', 'PINECONE_INDEX'];
    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar] && !process.env.CI) {
            throw new Error(`${envVar} environment variable is not defined`);
        }
    });
    return NextResponse.next()
}