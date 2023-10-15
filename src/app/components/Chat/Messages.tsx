import { Message } from "ai";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Messages({ messages }: { messages: Message[] }) {
  // Scroll to the most recent message whenever a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="border-2 border-gray-600 p-6 rounded-lg overflow-y-scroll flex-grow flex flex-col bg-gray-700">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${msg.role === "assistant" ? "text-green-300" : "text-blue-300"
            } my-2 p-3 rounded shadow-md hover:shadow-lg transition-shadow duration-200 flex slide-in-bottom bg-gray-800 border border-gray-600 message-glow`}
        >
          <div className="rounded-tl-lg bg-gray-800 p-2 border-r border-gray-600 flex items-center">
            {msg.role === "assistant" ? "🤖" : "🧑‍💻"}
          </div>
          {/* <div className="ml-2 flex items-center text-gray-200"> */}
          <div className="ml-2 items-center text-gray-200">
            <ReactMarkdown className="markdown">{msg.content}</ReactMarkdown>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
