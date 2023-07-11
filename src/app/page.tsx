"use client";

import { useEffect, useRef, useState } from "react";
import { Context } from "./components/Context";
import Header from "./components/Header";
import Messages from "./components/Messages";
import { useChat } from "ai/react";

export default function Chat() {
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async (message) => {
      setGotMessages(true);
    },
  });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: any) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch("/api/context", {
        method: "POST",
        body: JSON.stringify({
          messages,
        }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

  return (
    <div className="flex flex-col justify-between h-screen bg-gray-800 p-2 mx-auto max-w-full">
      <Header className=" mt-5 mb-5" />
      <div className="flex w-full flex-grow overflow-hidden">
        <div className="flex flex-col w-3/5 mr-4 mx-5">
          <Messages messages={messages} />
          <>
            <form
              onSubmit={handleMessageSubmit}
              className="mt-5 mb-5 relative bg-gray-700 rounded-lg"
            >
              <input
                type="text"
                className="input-glow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-10 bg-gray-600 border-gray-600 transition-shadow duration-200"
                value={input}
                onChange={handleInputChange}
              />

              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                Press ⮐ to send
              </span>
            </form>
          </>
        </div>
        <div className="bg-gray-700 w-2/5 overflow-y-auto">
          <Context className="" selected={context} />
        </div>
      </div>
    </div>
  );
}
