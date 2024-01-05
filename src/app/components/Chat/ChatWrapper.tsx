import React, { FormEvent, ChangeEvent, forwardRef, useImperativeHandle, useRef, Ref, useEffect, useState } from "react";
import Messages from "./Messages";
import { useChat } from "ai/react";
import type { PineconeRecord, RecordMetadata, ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from 'uuid';

export interface ChatInterface {
    handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleInputUpdated: (event: ChangeEvent<HTMLInputElement>) => void;
    ref: Ref<ChatInterface>;
    withContext: boolean;
}

interface ChatProps {
    withContext: boolean;
    setContext: (data: { context: PineconeRecord[] }[]) => void;
    context?: { context: PineconeRecord[] }[] | null;
    ref: Ref<ChatInterface>
}

const Chat: React.FC<ChatProps> = forwardRef<ChatInterface, ChatProps>(({ withContext, setContext, context }, ref) => {
    const { messages, handleInputChange, handleSubmit, isLoading, data } = useChat({
        sendExtraMessageFields: true,
        body: {
            withContext,
        },
    });

    useEffect(() => {
        if (data) {
            setContext(data as { context: PineconeRecord[] }[]) // Logs the additional data
        }
    }, [data, setContext]);

    const prevMessagesLengthRef = useRef(messages.length);

    const chatRef = useRef<ChatInterface>(null);

    useImperativeHandle(ref, () => ({
        handleMessageSubmit: (event: FormEvent<HTMLFormElement>) => {
            const id = uuidv4(); // Generate a unique ID
            handleSubmit(event, {
                data: {
                    messageId: id, // Include the ID in the message object
                    // Include any other extra fields here
                },
            })
        },
        handleInputUpdated: (event: ChangeEvent<HTMLInputElement>) => {
            handleInputChange(event)
        },
        withContext,
        ref: chatRef,
    }));


    return (
        <div className="flex-col w-50 overflow-auto h-full" style={{ borderLeft: "1px solid #738FAB1F" }}>
            {context ? <Messages messages={messages} withContext={withContext} context={context} /> : <Messages messages={messages} withContext={withContext} />}
        </div>
    );
});


Chat.displayName = 'Chat';

export default Chat;
