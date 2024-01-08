import { Configuration, OpenAIApi } from 'openai-edge'
import { Message, OpenAIStream, StreamingTextResponse, experimental_StreamData } from 'ai'
import { Metadata, getContext } from '@/services/context'
import { PineconeRecord, ScoredVector } from '@pinecone-database/pinecone'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  try {

    const { messages, withContext, messageId } = await req.json()
    console.log("messageId", messageId)

    // Get the last message
    const lastMessage = messages[messages.length - 1]


    // Get the context from the last message
    const context = withContext ? await getContext(lastMessage.content, '', 3000, 0.8, false) : ''

    console.log("withContext", context.length)

    const docs = (withContext && context.length > 0) ? (context as PineconeRecord[]).map(match => (match.metadata as Metadata).chunk) : [];

    // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
    const contextText = docs.join("\n").substring(0, 3000)

    const prompt = [
      {
        role: 'system',
        content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${contextText}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
      },
    ]

    const sanitizedMessages = messages.map((message: any) => {
      const { createdAt, id, ...rest } = message;
      return rest;
    });

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [...prompt, ...sanitizedMessages.filter((message: Message) => message.role === 'user')]
    })

    const data = new experimental_StreamData();

    const stream = OpenAIStream(response, {
      onFinal(completion) {
        // IMPORTANT! you must close StreamData manually or the response will never finish.
        data.close();
      },
      // IMPORTANT! until this is stable, you must explicitly opt in to supporting streamData.
      experimental_streamData: true,
    });

    if (withContext) {
      data.append({
        context: [...context as PineconeRecord[]]
      })

    }

    // IMPORTANT! If you aren't using StreamingTextResponse, you MUST have the `X-Experimental-Stream-Data: 'true'` header
    // in your response so the client uses the correct parsing logic.
    return new StreamingTextResponse(stream, {}, data);


  } catch (e) {
    throw (e)
  }
}