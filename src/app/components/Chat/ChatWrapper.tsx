import React, { FormEvent, ChangeEvent, forwardRef, useImperativeHandle, useRef, Ref, useEffect, useState } from "react";
import Messages from "./Messages";
import { Message, useChat } from "ai/react";
import type { RecordMetadata, ScoredPineconeRecord } from "@pinecone-database/pinecone";

export interface ChatInterface {
    handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleInputUpdated: (event: ChangeEvent<HTMLInputElement>) => void;
    ref: Ref<ChatInterface>;
    withContext: boolean;
}

interface ChatProps {
    withContext: boolean;
    getContext: (messages: Message[]) => Promise<ScoredPineconeRecord<RecordMetadata>[]>;
    ref: Ref<ChatInterface>
}

const Chat: React.FC<ChatProps> = forwardRef<ChatInterface, ChatProps>(({ withContext, getContext }, ref) => {
    const [context, setContext] = useState<ScoredPineconeRecord[] | null>(null);
    const { messages, handleInputChange, handleSubmit, isLoading } = useChat({
        body: {
            withContext
        },
        // onResponse: (response) => {
        //     console.log(response)
        // },
        // onFinish: async () => {
        //     console.log(withContext, messages.length)
        //     if (withContext && messages.length > 0) {
        //         console.log(messages)
        //         const context = getContext(messages)
        //         console.log("context", context)
        //     }
        //     // getContext(messages)
        // },
    });

    const prevMessagesLengthRef = useRef(messages.length);

    useEffect(() => {
        const updateContext = async () => {
            if (withContext) {
                if ((messages.length % 2 === 0) && messages.length > prevMessagesLengthRef.current) {
                    console.log("getting context")
                    prevMessagesLengthRef.current = messages.length;
                    const context = await getContext(messages)
                    setContext(context)
                    if (messages.length > 0) {
                        const lastMessage = messages[messages.length - 1];
                        lastMessage.data = JSON.parse(JSON.stringify(context.length));
                        lastMessage.data = {
                            ...(typeof lastMessage.data === 'object' ? lastMessage.data : {}),
                            numResults: context.length
                        };
                        messages[messages.length - 1] = lastMessage;
                    }
                }
            }
        };
        updateContext()
    }, [getContext, withContext, isLoading, prevMessagesLengthRef, messages]);

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
