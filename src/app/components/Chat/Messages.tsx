import { Message } from "ai";
import { useRef, useState } from "react";
import { UserIcon } from "@/utils/icons/user";
import { PineconeIcon } from "@/utils/icons/pinecone";
import { EllipseIcon } from "@/utils/icons/ellipse";
import { BlueEllipseSvg } from "@/utils/svg/blueEllipse";
import { PineconeRecord } from "@pinecone-database/pinecone";
import Popover from '@mui/material/Popover';
import { Typography } from "@mui/material";
import { PineconeSvg } from "@/utils/svg/pinecone";
import { PineconeLogoSvg } from "@/utils/svg/pineconeLogo";

export default function Messages({ messages, withContext, context }: { messages: Message[], withContext: boolean, context?: { context: PineconeRecord[] }[] }) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLButtonElement | null }>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, messageId: string) => {
    setAnchorEls(prev => ({ ...prev, [messageId]: event.currentTarget }));
  };

  // Handle close function
  const handleClose = (messageId: string) => {
    setAnchorEls(prev => ({ ...prev, [messageId]: null }));
  };

  // const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;

  const assistantMessages = messages.filter((_, index) => index % 2 === 1);
  const assistantMessagesObject = assistantMessages.reduce((obj: { [key: string]: Message }, message) => {
    obj[message.id] = message;
    return obj;
  }, {});

  console.log(assistantMessagesObject);
  console.log("context", context);

  const styles = {
    lightGrey: {
      color: "#72788D"
    },
    placeholder: {
      fontSize: 12,
      marginTop: 10,
    }
  }

  return (
    <div className="rounded-lg overflow-y-scroll flex-grow flex flex-col justify-end h-full">
      {messages.length == 0 && (
        <div className="flex justify-center items-center h-full">
          {withContext ? <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <PineconeLogoSvg />
            </div>
            <div style={{ ...styles.lightGrey, ...styles.placeholder }}>
              This is your chatbot powered by pinecone
            </div>
          </div> : <div style={{ ...styles.lightGrey, ...styles.placeholder }}>
            Compare to a chatbot without context
          </div>}
        </div>
      )}
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
                    <button onMouseEnter={(event: React.MouseEvent<HTMLButtonElement>) => handleClick(event, msg.id)} onMouseLeave={() => handleClose(msg.id)} className="flex mt-1">
                      <BlueEllipseSvg /><span className="ml-1" style={{ color: "#72788D", fontSize: 12 }}>Found in {entry.context.length} results</span>
                    </button>

                    <Popover
                      id={msg.id}
                      open={Boolean(anchorEls[msg.id])}
                      anchorEl={anchorEls[msg.id]}
                      onClose={() => handleClose(msg.id)}
                      disableRestoreFocus
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      sx={{
                        width: "60%",
                        pointerEvents: 'none',
                      }}
                    >
                      {
                        entry.context.map((c, index) => {
                          return (
                            <div key={index} className="p-2">
                              <Typography sx={{ fontSize: 12, fontWeight: 400 }}>
                                {c.metadata?.chunk}
                              </Typography>
                            </div>
                          )
                        })
                      }
                    </Popover>
                  </>


                )}
                {
                  !withContext && msg.role === "assistant" && (index == messages.length - 1) && (<div className="mt-1" style={{ color: "#72788D", fontSize: 12 }}>
                    This answer may be speculative or inaccurate.
                  </div>)
                }
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
