import AppContext from "@/appContext";
import type { PineconeRecord } from "@pinecone-database/pinecone";
import React, { ChangeEvent, FormEvent, useContext, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatWrapper, { ChatInterface } from "./ChatWrapper";

interface ChatProps {
  setContext: (data: { context: PineconeRecord[] }[]) => void;
  context: { context: PineconeRecord[] }[] | null;
}

const Chat: React.FC<ChatProps> = ({ setContext, context }) => {

  const chatWithContextRef = useRef<ChatInterface | null>(null);
  const chatWithoutContextRef = useRef<ChatInterface | null>(null);

  const { totalRecords } = useContext(AppContext);

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
          <ChatWrapper ref={chatWithoutContextRef} withContext={true} setContext={setContext} context={context} />
        </div>
        <div className="w-1/2">
          <ChatWrapper ref={chatWithContextRef} withContext={false} setContext={setContext} />
        </div>
      </div>

      <div className="w-full">
        <ChatInput input={input} handleInputChange={onInputChange} handleMessageSubmit={onMessageSubmit} showIndexMessage={totalRecords === 0} />
      </div>
    </div>
  );
};

export default Chat;
