import AppContext from "@/appContext";
import { Button } from "@material-tailwind/react";
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React, { useContext, useState } from "react";
import Header from "../Header";
import { ICard } from "./Card";
import { RecursiveSplittingOptions } from "./RecursiveSplittingOptions";
import { urls } from "./urls";
import { clearIndex, crawlDocument } from "./utils";

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


export const Sidebar: React.FC = () => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);
  const [splittingMethod, setSplittingMethod] = useState<string>("markdown");
  const [chunkSize, setChunkSize] = useState<number>(256);
  const [overlap, setOverlap] = useState<number>(1);
  const [url, setUrl] = useState<string>(entries[0].url);
  const [clearIndexComplete, setClearIndexCompleteMessageVisible] = useState<boolean>(false)
  const [crawling, setCrawling] = useState<boolean>(false)
  const [crawlingDoneVisible, setCrawlingDoneVisible] = useState<boolean>(false)
  const [openChunkSizePopover, setOpenChunkSizePopover] = useState(false);
  const [openOverLapPopover, setOpenOverLapPopover] = useState(false);

  const { refreshIndex } = useContext(AppContext);

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
      console.log("it's time")
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

  const buttons = entries.map((entry, key) => (
    <MenuItem
      key={key} value={entry.url}
    ><div className="flex-col" >
        <div>{entry.title}</div>
        <div style={{ ...styles.entryUrl, whiteSpace: 'nowrap' as 'nowrap' }}>{entry.url}</div>
      </div>
    </MenuItem>
  ));


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
          <RecursiveSplittingOptions
            chunkSize={chunkSize}
            setChunkSize={setChunkSize}
            overlap={overlap}
            setOverlap={setOverlap}
            openChunkSizePopover={openChunkSizePopover}
            setOpenChunkSizePopover={setOpenChunkSizePopover}
            openOverLapPopover={openOverLapPopover}
            setOpenOverLapPopover={setOpenOverLapPopover}
          />
        )}
        <Button
          className={`my-2 duration-100 button-primary ${crawlingDoneVisible ? "bg-green-500" : "bg-blue-700"} text-white font-medium px-8 py-3 transition-all duration-500 ease-in-out`}
          onClick={handleEmbedAndUpsertClick}
          style={{ backgroundColor: `${crawlingDoneVisible ? "#15B077" : "#1B17F5"}` }}
          placeholder=""
        >
          {!crawling ? (crawlingDoneVisible ? "Success" : "Embed and upsert") : (<div className="flex">
            <CircularProgress size={20} sx={{
              color: "white",
            }} />
            <div className="ml-5">In progress</div>
          </div>)}
        </Button>
      </div>
      <div className="flex flex-wrap w-full mt-5 pb-2 border-b border-[#738FAB1F]">
        <div className="text-xs uppercase">Index records</div>
        <div className="text-[#1B17F5] ml-auto cursor-pointer text-xs" onClick={handleClearIndexClick}>Clear</div>
      </div>
      {(
        <div className={`text-xs mt-1 
                        transition-all 
                        duration-500 
                        ease-in-out 
                        transform ${clearIndexComplete ? "translate-y-0" : "translate-y-16"} 
                        opacity-${clearIndexComplete ? "100" : "0"} 
                        ${clearIndexComplete ? "h-auto" : "h-0"}`}>
          Index cleared
        </div>
      )}
      {(
        <div className={`text-xs mt-1 mb-2 
                        transition-all 
                        duration-500 
                        ease-in-out 
                        transform ${crawling ? "translate-y-0" : "translate-y-16"} 
                        opacity-${crawling ? "100" : "0"} ${crawling ? "h-auto" : "h-0"}`}>
          <CircularProgress size={10} sx={{
            color: "black",
          }} /> <span className="ml-2">Chunking and embedding your data...</span>
        </div>
      )}
      <div className="flex flex-wrap w-full">
        <div className="flex">
          {cards && cards.length > 0 ?
            <div className="mt-2 flex flex-row text-[#72788D]">
              <div className="font-bold mb-2 whitespace-nowrap">{cards.length} results</div>
              <div className="ml-2 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-xs">
                <a href={url} target="_blank">{url}</a>
              </div>
            </div>
            :
            <div></div>
          }
        </div>
      </div>


    </div>
  );
};
