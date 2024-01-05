import React, { createRef, useEffect, useRef, useState } from "react";
import { urls } from "./urls";
import { Card, ICard } from "./Card";
import { clearIndex, crawlDocument } from "./utils";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
// import { Button } from "./Button";
import Header from "../Header";
import type { PineconeRecord } from "@pinecone-database/pinecone";
import { IoMdInformationCircleOutline } from "react-icons/io";
// import Popover from "@mui/material/Popover";
import { Typography } from "@mui/material";


import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button

} from "@material-tailwind/react";

interface ContextProps {
  className: string;
  context: { context: PineconeRecord[] }[] | null;
  refreshIndex: () => void;
}

const styles = {
  contextWrapper: {
    display: "flex",
    padding: "var(--spacer-huge, 64px) var(--spacer-m, 32px) var(--spacer-m, 32px) var(--spacer-m, 32px)",
    alignItems: "flex-start",
    gap: "var(--Spacing-0, 0px)",
    alignSelf: "stretch",
    backgroundColor: "#FBFBFC"
  },
  textHeaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch"
  },
  entryUrl: {
    fontSize: 'small',
    color: 'grey',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: "400px"
  },
  h4: {
    fontWeight: 700, marginBottom: 7
  }
}




export const Context: React.FC<ContextProps> = ({ className, context, refreshIndex }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);
  const [splittingMethod, setSplittingMethod] = useState<string>("markdown");
  const [chunkSize, setChunkSize] = useState<number>(256);
  const [overlap, setOverlap] = useState<number>(1);
  const [url, setUrl] = useState<string>(entries[0].url);
  const [clearIndexComplete, setClearIndexCompleteMessageVisible] = useState<boolean>(false)
  const [crawling, setCrawling] = useState<boolean>(false)
  const [crawlingDoneVisible, setCrawlingDoneVisible] = useState<boolean>(false)

  const [anchorElChunkSize, setAnchorElChunkSize] = useState<HTMLElement | null>(null);
  const [anchorElOverlap, setAnchorElOverlap] = useState<HTMLElement | null>(null);

  const chunkSizeOpen = Boolean(anchorElChunkSize);
  const overlapOpen = Boolean(anchorElOverlap);




  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor}>
      {children}
    </label>
  );

  const handleUrlChange = (event: SelectChangeEvent<typeof url>) => {
    const {
      target: { value },
    } = event;
    setUrl(value)
  }

  const handleSplittingMethodChange = (event: SelectChangeEvent<typeof splittingMethod>) => {
    const {
      target: { value },
    } = event;
    setSplittingMethod(value)
  }

  const handleEmbedAndUpsertClick = async () => {
    setCrawling(true)
    await crawlDocument(
      url,
      setEntries,
      setCards,
      splittingMethod,
      chunkSize,
      overlap
    )

    setCrawling(false)
    setCrawlingDoneVisible(true)
    setTimeout(() => {
      setCrawlingDoneVisible(false)
      refreshIndex()
    }, 2000)
  }

  const handleClearIndexClick = async () => {
    await clearIndex(setEntries, setCards)
    setClearIndexCompleteMessageVisible(true)
    refreshIndex()
    setTimeout(() => {
      setClearIndexCompleteMessageVisible(false)
    }, 2000)
  }


  const handleChunkSizePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log(infoIconRef.current)
    setAnchorElChunkSize(infoIconRef.current);
  };

  const handleChunkSizePopoverClose = () => {
    setAnchorElChunkSize(null);
  };

  const handleOverlapPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOverlap(event.currentTarget);
  };

  const handleOverlapPopoverClose = () => {
    setAnchorElOverlap(null);
  };

  const buttons = entries.map((entry, key) => (
    <MenuItem
      key={key} value={entry.url}
    ><div className="flex-col" >
        <div>{entry.title}</div>
        <div style={{ ...styles.entryUrl, whiteSpace: 'nowrap' as 'nowrap' }}>{entry.url}</div>
      </div>
    </MenuItem>
  ));

  const [openChunkSizePopover, setOpenChunkSizePopover] = useState(false);

  const chunkSizePopoverTriggers = {
    onMouseEnter: () => setOpenChunkSizePopover(true),
    onMouseLeave: () => setOpenChunkSizePopover(false),
  };

  const [openOverLapPopover, setOpenOverLapPopover] = useState(false);

  const overLapPopoverTriggers = {
    onMouseEnter: () => setOpenOverLapPopover(true),
    onMouseLeave: () => setOpenOverLapPopover(false),
  };

  return (
    <div
      className="w-full"
      style={{ ...styles.contextWrapper, flexDirection: "column" as "column" }}
    >
      <div style={{ ...styles.textHeaderWrapper, flexDirection: "column" as "column" }} className="w-full">
        <Header />
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          This RAG chatbot uses Pinecone and Vercel&apos;s AI SDK to demonstrate a URL crawl, data chunking and embedding, and semantic questioning.
        </div>
      </div>
      <div className="flex flex-column w-full" style={{ ...styles.textHeaderWrapper, flexDirection: "column", }}>
        <div className="mb-3 w-full">
          <h4 style={styles.h4}>Select demo url to index</h4>
          <Select className="w-full" value={url} onChange={handleUrlChange} MenuProps={{
            keepMounted: true,
            PaperProps: {
              style: {
                width: 'fit-content',
                marginLeft: 15,
                marginTop: 10,
              },
            },
          }}>
            {buttons}
          </Select>
        </div>
        <div className="mb-3 w-full">
          <h4 style={styles.h4}>Splitting method</h4>
          <Select value={splittingMethod} className="w-full" onChange={handleSplittingMethodChange} MenuProps={{
            PaperProps: {
              style: {
                marginTop: 10
              }
            }
          }} >
            <MenuItem value="markdown">Markdown Splitting</MenuItem>
            <MenuItem value="recursive">Recursive Text Splitting</MenuItem>
          </Select>
        </div>
        {splittingMethod === "recursive" && (
          <div className="w-full">
            <div className="my-4 flex flex-col">
              <div className="flex flex-col w-full">
                <div className="flex gap-1">

                  <span>Chunk Size: </span><span className="font-bold">{chunkSize}</span><span>
                    <div>
                      <Popover open={openChunkSizePopover} handler={setOpenChunkSizePopover} placement="left">
                        <PopoverHandler {...chunkSizePopoverTriggers}>
                          <div><IoMdInformationCircleOutline className="text-[#72788D] mt-1 text-lg" /></div>
                        </PopoverHandler>
                        <PopoverContent {...chunkSizePopoverTriggers} className="z-50 max-w-[24rem]">
                          <div className="mb-2 flex items-center justify-between gap-4">
                            Chunk size in recursive text splitting is the user defined portion of text that's divided and processed in each recursion step, influencing the accuracy of the operation.
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </span>
                </div>

                <input
                  className="p-2"
                  type="range"
                  id="chunkSize"
                  min={1}
                  max={2048}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-full">
                <DropdownLabel htmlFor="overlap">
                  <div className="flex gap-1">
                    <span>Overlap:</span><span className="font-bold">{overlap}</span><span>
                      <div>
                        <div>
                          <Popover open={openOverLapPopover} handler={setOpenOverLapPopover} placement="left">
                            <PopoverHandler {...overLapPopoverTriggers}>
                              <div><IoMdInformationCircleOutline className="text-[#72788D] mt-1 text-lg" /></div>
                            </PopoverHandler>
                            <PopoverContent {...overLapPopoverTriggers} className="z-50 max-w-[24rem]">
                              <div className="mb-2 flex items-center justify-between gap-4">
                                Overlap in recursive text splitting is the user-specified section of text that's intentionally repeated across chunks to maintain context and potentially enhance accuracy.
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </span>
                  </div>
                </DropdownLabel>
                <input
                  className="p-2"
                  type="range"
                  id="overlap"
                  min={1}
                  max={200}
                  onChange={(e) => setOverlap(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
        <Button
          className={`my-2 duration-100 button-primary ${crawlingDoneVisible ? "bg-green-500" : "bg-blue-700"} text-white font-medium px-8 py-3 transition-all duration-500 ease-in-out`}
          onClick={handleEmbedAndUpsertClick}
          style={{ backgroundColor: `${crawlingDoneVisible ? "#15B077" : "#1B17F5"}` }}
        >
          {!crawling ? (crawlingDoneVisible ? "Success" : "Embed and upsert") : (<div className="flex">
            <CircularProgress size={20} sx={{
              color: "white",
            }} />
            <div className="ml-5">In progress</div>
          </div>)}
        </Button>
      </div>
      <div className="flex flex-wrap w-full mt-5" style={{ paddingBottom: 8, borderBottom: "1px solid #738FAB1F" }}>
        <div className="text-xs uppercase">Index records</div>
        <div style={{ color: "#1B17F5", fontSize: 12, cursor: "pointer" }} className="right ml-auto" onClick={handleClearIndexClick}>Clear</div>
      </div>
      {(
        <div style={{ fontSize: 12, marginTop: 5, transition: "all 0.5s ease-in-out", transform: `${clearIndexComplete ? "translateY(0%)" : "translateY(60%)"}`, opacity: `${clearIndexComplete ? "1" : "0"}`, height: `${clearIndexComplete ? "auto" : "0"}` }}>
          Index cleared
        </div>
      )}
      {(
        <div style={{ fontSize: 12, marginTop: 5, marginBottom: 10, transition: "all 0.5s ease-in-out", transform: `${crawling ? "translateY(0%)" : "translateY(60%)"}`, opacity: `${crawling ? "1" : "0"}`, height: `${crawling ? "auto" : "0"}` }}>
          <CircularProgress size={10} sx={{
            color: "black",
          }} /> <span className="ml-2">Chunking and embedding your data...</span>
        </div>
      )}
      <div className="flex flex-wrap w-full">
        <div className="flex">
          {cards && cards.length > 0 ?
            <div className="mt-2" style={{ color: "#72788D", display: "flex", flexDirection: "row" }}>
              <div className="font-bold mb-2 whitespace-nowrap">{cards.length} results </div>
              <div className="ml-2 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-xs">
                <a href={url} target="_blank">{url}</a>
              </div>
            </div>
            :
            <div></div>
          }
        </div>
        {/* {cards &&
          cards.map((card, key) => (
            <Card id={card.metadata.hash} key={key} card={card} context={context} />
          ))} */}
      </div>


    </div>
  );
};
