// Chat.tsx

import React, { FormEvent, ChangeEvent } from "react";
import Messages from "./Messages";
import { Message } from "ai/react";

interface Chat {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  messages: Message[];
}

const Chat: React.FC<Chat> = ({
  input,
  handleInputChange,
  handleMessageSubmit,
  messages,
}) => {
  return (
    <div id="chat" className="flex flex-col w-full" >
      <div className="flex flex-grow">
        <Messages messages={messages} />
        <Messages messages={messages} />
      </div>
      <div style={{ border: "1px solid #738FAB1F", padding: 30 }} className="w-full">
        <form
          onSubmit={handleMessageSubmit}
          className="bg-white rounded-lg relative"
        >
          <div style={{ border: "1px solid ##72788D", borderRadius: 4 }}>
            <input
              type="text"
              className="input-glow appearance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-10 transition-shadow duration-200"
              value={input}
              onChange={handleInputChange}
              placeholder="Start typing..."
            />
            <svg style={{
              background: "black",
              margin: 9,
              borderRadius: 4,
            }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="black" className="absolute right-0 top-0 mt-3 mr-3">
              <path d="M3.33301 9.99998L4.50801 11.175L9.16634 6.52498V16.6666H10.833V6.52498L15.483 11.1833L16.6663 9.99998L9.99967 3.33331L3.33301 9.99998Z" fill="white" />
            </svg>
          </div>

          <div style={{ marginTop: 15, color: "#72788D", fontSize: 12 }}>
            Your index contains no vector embeddings yet. Please add some by indexing one of the demo URLs on the left.
          </div>

        </form>
      </div>
    </div>
  );
};

export default Chat;
