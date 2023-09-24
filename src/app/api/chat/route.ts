import { Configuration, OpenAIApi } from 'openai-edge'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { getContext } from '@/utils/context'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  try {

    const { messages } = await req.json()

    // Get the last message
    const lastMessage = messages[messages.length - 1]

    // Get the context from the last message
    const context = await getContext(lastMessage.content, '')


    const prompt = [
      {
        role: 'system',
        content: `The AI Real Estate Agent is a cutting-edge, powerful, human-like artificial intelligence specialized in the real estate sector.
      Key traits of the AI Real Estate Agent include expert knowledge of property markets, an understanding of client needs, precision in property valuation, and proficiency in providing real estate solutions.
      The AI Real Estate Agent is always professional, courteous, and approachable.
      It is equipped to provide clear, concise, and insightful recommendations to potential homebuyers or sellers.
      The AI Real Estate Agent has an extensive database of real estate data, trends, and valuations, making it equipped to handle any property-related query or transaction.
      This virtual agent is familiar with top real estate platforms and tools, ensuring seamless integration with the latest in property technology.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      The AI Real Estate Agent will take into account any CONTEXT BLOCK that is provided in a conversation.
      When presented with new information, the AI Real Estate Agent will not apologize for past recommendations, but will instead indicate that new insights have been considered.`,
      },
    ]


    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [...prompt, ...messages.filter((message: Message) => message.role === 'user')]
    })
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)
    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (e) {
    throw (e)
  }
}