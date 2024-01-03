// Chat.tsx

import React, { FormEvent, ChangeEvent, useRef } from "react";
import Messages from "./Messages";
import { Message } from "ai/react";
import ChatWithContext, { ChatInterface } from "./ChatWrapper";
import ChatInput from "./ChatInput";



const Chat: React.FC = () => {

  const chatWithContextRef = useRef<ChatInterface | null>(null);
  const chatWithoutContextRef = useRef<ChatInterface | null>(null);

  const [input, setInput] = React.useState<string>("")
  const onMessageSubmit = (e: FormEvent<HTMLFormElement>) => {
    setInput("")
    chatWithContextRef.current?.handleMessageSubmit(e)
    chatWithoutContextRef.current?.handleMessageSubmit(e)
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
    chatWithContextRef.current?.handleInputUpdated(event)
    chatWithoutContextRef.current?.handleInputUpdated(event)
  }

  return (
    <div id="chat" className="flex flex-col w-full h-full">

      <div className="flex flex-grow">
        <div className="w-1/2">
          <ChatWithContext ref={chatWithoutContextRef} withContext={true} />
        </div>
        <div className="w-1/2">
          <ChatWithContext ref={chatWithContextRef} withContext={false} />
        </div>
      </div>

      <div className="w-full">
        <ChatInput input={input} handleInputChange={onInputChange} handleMessageSubmit={onMessageSubmit} />
      </div>
    </div>
  );
};

export default Chat;
