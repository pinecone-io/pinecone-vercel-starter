import React, { FormEvent, ChangeEvent, forwardRef, useImperativeHandle, useRef, Ref, useEffect, useState } from "react";
import Messages from "./Messages";
import { Message, useChat } from "ai/react";
import type { PineconeRecord, RecordMetadata, ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { ExtendedStreamingTextResponse } from "@/api/chat/route";
import { v4 as uuidv4 } from 'uuid';

export interface ChatInterface {
    handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleInputUpdated: (event: ChangeEvent<HTMLInputElement>) => void;
    ref: Ref<ChatInterface>;
    withContext: boolean;
}

interface ChatProps {
    withContext: boolean;
    setContext: (data: PineconeRecord[]) => void;
    context?: PineconeRecord[] | null;
    ref: Ref<ChatInterface>
}

const Chat: React.FC<ChatProps> = forwardRef<ChatInterface, ChatProps>(({ withContext, setContext, context }, ref) => {
    // const [context, setContext] = useState<ScoredPineconeRecord[] | undefined | null>(null);
    const { messages, handleInputChange, handleSubmit, isLoading, data } = useChat({
        sendExtraMessageFields: true,
        body: {
            withContext,
        },
    });

    useEffect(() => {
        console.log("HELLO", context)
    }, [context])

    useEffect(() => {
        if (data) {
            // console.log(data, messages);
            setContext(data as PineconeRecord[]) // Logs the additional data
        }
    }, [data]);

    const prevMessagesLengthRef = useRef(messages.length);

    // useEffect(() => {
    //     const updateContext = async () => {
    //         if (withContext) {
    //             if ((messages.length % 2 === 0) && messages.length > prevMessagesLengthRef.current) {
    //                 console.log("getting context")
    //                 prevMessagesLengthRef.current = messages.length;
    //                 try {
    //                     const context = await getContext(messages)
    //                     // setContext(context)
    //                     if (messages.length > 0 && context) {
    //                         const lastMessage = messages[messages.length - 1];
    //                         lastMessage.data = JSON.parse(JSON.stringify(context.length));
    //                         lastMessage.data = {
    //                             ...(typeof lastMessage.data === 'object' ? lastMessage.data : {}),
    //                             numResults: context.length
    //                         };
    //                         messages[messages.length - 1] = lastMessage;
    //                     }
    //                 } catch (e) {
    //                     console.log(e)
    //                 }

    //             }
    //         }
    //     };
    //     updateContext()
    // }, [getContext, withContext, isLoading, prevMessagesLengthRef, messages, context]);

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
        <div className="flex-col w-50 overflow-auto">
            {context ? <Messages messages={messages} withContext={withContext} context={context} /> : <Messages messages={messages} withContext={withContext} />}
        </div>
    );
});


Chat.displayName = 'Chat';

export default Chat;
