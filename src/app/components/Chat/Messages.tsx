import { Message } from "ai";
import { useRef } from "react";

export default function Messages({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="rounded-lg overflow-y-scroll flex-grow flex flex-col justify-end ">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`my-2 p-3 transition-shadow duration-200 flex slide-in-bottom`}
        >
          <div className="p-2  flex items-center">
            {msg.role === "assistant" ? "🤖" : "🧑‍💻"}
          </div>
          <div className="ml-2 flex items-center">
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
