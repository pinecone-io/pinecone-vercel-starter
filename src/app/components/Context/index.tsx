import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { urls } from "./urls";
import UrlButton from "./UrlButton";
import { Card, ICard } from "./Card";
import { clearIndex, crawlDocument } from "./utils";
import { Select, Option } from "@material-tailwind/react";
import type { SelectProps } from "@material-tailwind/react";

import { Button } from "./Button";
import Header from "../Header";
interface ContextProps {
  className: string;
  selected: string[] | null;
}

const style = {
  contextWrapper: {
    display: "flex",

    padding: "var(--spacer-huge, 64px) var(--spacer-m, 32px) var(--spacer-m, 32px) var(--spacer-m, 32px)",
    flexDirection: "column",
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
  }
}

export const Context: React.FC<ContextProps> = ({ className, selected }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);

  const [splittingMethod, setSplittingMethod] = useState("markdown");
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(1);

  const [url, setUrl] = useState("");

  // Scroll to selected card
  useEffect(() => {
    const element = selected && document.getElementById(selected[0]);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-white p-2 font-bold">
      {children}
    </label>
  );

  const handleUrlChange = (e) => {
    setUrl(e)
  }

  const handleSplittingMethodChange = (e) => {

  }

  const buttons = entries.map((entry, key) => (

    <Option
      key={key} value={entry.url}
      className="flex items-center gap-2"
    // onClick={() =>
    //   crawlDocument(
    //     entry.url,
    //     setEntries,
    //     setCards,
    //     splittingMethod,
    //     chunkSize,
    //     overlap
    //   )
    // }
    ><div>
        <div style={{ width: '100%' }}>{entry.title}</div>
        <div style={{ width: '30%', fontSize: 'small', color: 'grey', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.url}</div>
      </div>
    </Option>

  ));

  return (
    <div
      className="w-full"
      style={{ ...style.contextWrapper, flexDirection: "column" as "column" }}
    >

      <div style={{ ...style.textHeaderWrapper, flexDirection: "column" as "column" }} className="w-full">
        <Header />
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          This RAG chatbot uses Pinecone and Vercel's AI SDK to demonstrate a URL crawl, data chunking and embedding, and semantic questioning.
        </div>

      </div>
      <div className="flex flex-column w-full" style={{ ...style.textHeaderWrapper }}>
        <div className="mb-3 w-full">
          <h4 style={{ fontWeight: 700, marginBottom: 7 }}>Select demo url to index</h4>
          <Select label="URL" onChange={handleUrlChange} autoheight={true} size="lg" selected={(element) => {
            const title = urls.find((u) => u.url === url)?.title
            return <div>{title}</div>
          }

          } >
            {buttons}
          </Select>
        </div>

        <div className="mb-3 w-full">
          <h4 style={{ fontWeight: 700, marginBottom: 7 }}>Splitting method</h4>
          <Select label="Splitting method" className="flex flex-col gap-6" onChange={handleSplittingMethodChange} autoheight={true} size="lg" >
            <Option value="recursive">Recursive Text Splitting</Option>
            <Option value="markdown">Markdown Splitting</Option>
          </Select>
        </div>

        <Button
          className="my-2 duration-100 button-primary"
          style={{ backgroundColor: "#1B17F5", color: "white", fontWeight: 500, padding: "12px 32px" }}
          onClick={() => clearIndex(setEntries, setCards)}
        >
          Embed and upsert
        </Button>
      </div>

      <div className="flex flex-wrap w-full mt-5" style={{ paddingBottom: 8, borderBottom: "1px solid #738FAB1F" }}>
        <div className="uppercase" style={{ fontSize: 12 }}>Index records</div>
        <div style={{ color: "#1B17F5", fontSize: 12 }} className="right ml-auto">Clear</div>
      </div>

      {/* <div className="flex flex-col items-start sticky top-0 w-full">
        <div className="flex flex-col items-start lg:flex-row w-full lg:flex-wrap p-2">
          {buttons}
        </div>
        <div className="flex-grow w-full px-4">
          <Button
            className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
            style={{
              backgroundColor: "#4f6574",
              color: "white",
            }}
            onClick={() => clearIndex(setEntries, setCards)}
          >
            Clear Index
          </Button>
        </div>
        <div className="flex p-2"></div>
        <div className="text-left w-full flex flex-col rounded-b-lg bg-gray-600 p-3 subpixel-antialiased">
          <DropdownLabel htmlFor="splittingMethod">
            Splitting Method:
          </DropdownLabel>
          <div className="relative w-full">
            <select
              id="splittingMethod"
              value={splittingMethod}
              className="p-2 bg-gray-700 rounded text-white w-full appearance-none hover:cursor-pointer"
              onChange={(e) => setSplittingMethod(e.target.value)}
            >
              <option value="recursive">Recursive Text Splitting</option>
              <option value="markdown">Markdown Splitting</option>
            </select>
          </div>
          {splittingMethod === "recursive" && (
            <div className="my-4 flex flex-col">
              <div className="flex flex-col w-full">
                <DropdownLabel htmlFor="chunkSize">
                  Chunk Size: {chunkSize}
                </DropdownLabel>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="chunkSize"
                  min={1}
                  max={2048}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-full">
                <DropdownLabel htmlFor="overlap">
                  Overlap: {overlap}
                </DropdownLabel>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="overlap"
                  min={1}
                  max={200}
                  onChange={(e) => setOverlap(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        {cards &&
          cards.map((card, key) => (
            <Card key={key} card={card} selected={selected} />
          ))}
      </div> */}
    </div>
  );
};
