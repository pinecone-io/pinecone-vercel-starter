import React, { FormEvent, ChangeEvent, forwardRef, useImperativeHandle, useRef, Ref } from "react";
import Messages from "./Messages";
import { Message, useChat } from "ai/react";

export interface ChatInterface {
    handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleInputUpdated: (event: ChangeEvent<HTMLInputElement>) => void;
    ref: Ref<ChatInterface>;
    withContext: boolean;
}

interface ChatProps {
    withContext: boolean;
    getContext: (messages: Message[]) => void;
    ref: Ref<ChatInterface>
}

const Chat: React.FC<ChatProps> = forwardRef<ChatInterface, ChatProps>(({ withContext, getContext }, ref) => {

    const { messages, handleInputChange, handleSubmit } = useChat({
        body: {
            withContext
        },
        onFinish: async () => {
            console.log(withContext, messages.length)
            if (withContext && messages.length > 0) {
                console.log(messages)
                getContext(messages)
            }
            // getContext(messages)
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
