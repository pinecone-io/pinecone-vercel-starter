import { Message } from "ai";
import { useRef, useState } from "react";
import { UserIcon } from "@/utils/icons/user";
import { PineconeIcon } from "@/utils/icons/pinecone";
import { EllipseIcon } from "@/utils/icons/ellipse";
import { PineconeRecord } from "@pinecone-database/pinecone";
import Popover from '@mui/material/Popover';
import { Typography } from "@mui/material";

export default function Messages({ messages, withContext, context }: { messages: Message[], withContext: boolean, context?: { context: PineconeRecord[] }[] }) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // console.log(messages)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const assistantMessages = messages.filter((_, index) => index % 2 === 1);
  const assistantMessagesObject = assistantMessages.reduce((obj: { [key: string]: Message }, message) => {
    obj[message.id] = message;
    return obj;
  }, {});

  console.log(assistantMessagesObject);
  console.log("context", context);

  return (
    <div className="rounded-lg overflow-y-scroll flex-grow flex flex-col justify-end ">
      {messages?.map((msg, index) => {
        const isAssistant = msg.role === "assistant";
        const entry = isAssistant && withContext && context && context[Math.floor(index / 2)];

        return (
          <div
            key={index}
            className={`my-2 ml-3 pt-2 transition-shadow duration-200 flex slide-in-bottom`}
          >
            <div className="p-2 flex items-start">
              {msg.role === "assistant" ? (withContext ? <PineconeIcon /> : <EllipseIcon />) : <UserIcon />}
            </div>
            <div className="ml-2 mt-1.5 flex items-center">
              <div className="flex flex-col">
                <div className="font-bold">
                  {msg.role === "assistant" ? (withContext ? "Pinecone + OpenAI Model" : "OpenAI Model") : "You"}
                </div>
                <div>{msg.content}</div>
                {entry && entry.context.length > 0 && (
                  <>
                    <div onMouseOver={(event: React.MouseEvent<HTMLDivElement>) => handleClick(event as any)}>
                      Found in {entry.context.length} results
                    </div>

                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      sx={{
                        maxWidth: "50%",
                      }}
                    >
                      {
                        entry.context.map((c, index) => {
                          return (
                            <div key={index} className="p-2">
                              <Typography sx={{ fontSize: 10, fontWeight: 400 }}>
                                {c.metadata?.chunk}
                              </Typography>
                            </div>
                          )
                        })
                      }
                    </Popover>
                  </>


                )}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
