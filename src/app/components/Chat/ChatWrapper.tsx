// Chat.tsx

import React, { RefObject, FormEvent, ChangeEvent, forwardRef, useImperativeHandle, useRef } from "react";
import Messages from "./Messages";
import { Message, useChat } from "ai/react";

export interface ChatInterface {
    handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleInputUpdated: (event: ChangeEvent<HTMLInputElement>) => void;
    ref: RefObject<ChatInterface>;
    withContext: boolean;
}

interface ChatProps {
    withContext: boolean;
}

const Chat: React.FC<ChatProps> = forwardRef(({ withContext }, ref) => {

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        body: {
            withContext
        },
        onFinish: async () => {
            // setGotMessages(true);
        },
    });

    const chatRef = useRef<ChatInterface>(null);

    useImperativeHandle(ref, () => ({
        handleMessageSubmit: (event: FormEvent<HTMLFormElement>) => {
            handleSubmit(event)
        },
        handleInputUpdated: (event: ChangeEvent<HTMLInputElement>) => {
            handleInputChange(event)
        },
        withContext,
        ref: chatRef,
    }));


    return (
        <div className="flex-col w-50">
            <Messages messages={messages} withContext={withContext} />
        </div>
    );
});


Chat.displayName = 'Chat';

export default Chat;
