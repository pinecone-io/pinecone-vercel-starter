// page.tsx

"use client";

import React, { useEffect, useRef, useState, FormEvent } from "react";
import { Context } from "@/components/Context";
import Chat from "@/components/Chat";
import InstructionModal from "./components/InstructionModal";
import { Message } from "ai";

const Page: React.FC = () => {
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);


  const getContext = async (messages: Message[]) => {
    const response = await fetch("/api/context", {
      method: "POST",
      body: JSON.stringify({
        messages,
      }),
    });
    const { context } = await response.json();
    setContext(context.map((c: any) => c.id));
  };


  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   onFinish: async () => {
  //     setGotMessages(true);
  //   },
  // });

  // const prevMessagesLengthRef = useRef(messages.length);

  // const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   handleSubmit(e);
  //   setContext(null);
  //   setGotMessages(false);
  // };

  // useEffect(() => {
  //   const getContext = async () => {
  //     const response = await fetch("/api/context", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         messages,
  //       }),
  //     });
  //     const { context } = await response.json();
  //     setContext(context.map((c: any) => c.id));
  //   };
  //   if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
  //     getContext();
  //   }

  //   prevMessagesLengthRef.current = messages.length;
  // }, [messages, gotMessages]);

  return (
    <div className="flex flex-col justify-between h-screen bg-whitemx-auto max-w-full">


      <InstructionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="flex w-full flex-grow overflow-hidden relative">
        <div style={{
          backgroundColor: "#FBFBFC"
        }} className="absolute transform translate-x-full transition-transform duration-500 ease-in-out right-0 w-2/3 h-full bg-white overflow-y-auto lg:static lg:translate-x-0 lg:w-2/5">
          <Context className="" selected={context} />
        </div>
        <Chat
          getContext={getContext}
        // input={input}
        // handleInputChange={handleInputChange}
        // handleMessageSubmit={handleMessageSubmit}
        // messages={messages}
        />

        <button
          type="button"
          className="absolute left-20 transform -translate-x-12 bg-white text-white rounded-l py-2 px-4 lg:hidden"
          onClick={(e) => {
            e.currentTarget.parentElement
              ?.querySelector(".transform")
              ?.classList.toggle("translate-x-full");
          }}
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default Page;
