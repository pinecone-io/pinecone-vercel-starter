import React, { useState } from "react";
import { urls } from "./urls";
import UrlButton from "./UrlButton";
import { Card, ICard } from "./Card";
import { crawlDocument } from "./utils";
interface ContextProps {
  className: string;
}

export const Context: React.FC<ContextProps> = ({ className }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);

  const [splittingMethod, setSplittingMethod] = useState("markdown");
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(1);

  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-white p-2 font-bold">
      {children}
    </label>
  );

  const DropdownInput: React.FC<{
    value: number;
    id: string;
    min: number;
    max: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }> = ({ value, id, min, max, onChange }) => (
    <input
      className="p-2 bg-gray-700"
      type="range"
      id={id}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
    />
  );

  const Dropdown: React.FC = () => {
    return (
      <div className="text-left w-full ml-1 mr-1 flex flex-col bg-gray-600 p-3  subpixel-antialiased">
        <DropdownLabel htmlFor="splittingMethod">
          Splitting Method:
        </DropdownLabel>
        <select
          id="splittingMethod"
          value={splittingMethod}
          className="p-2 bg-gray-700 rounded text-white"
          onChange={(e) => setSplittingMethod(e.target.value)}
        >
          <option value="recursive">Recursive Text Splitting</option>
          <option value="markdown">Markdown Splitting</option>
        </select>
        {splittingMethod === "recursive" && (
          <div className="my-4 flex flex-col">
            <div className="flex flex-col w-full">
              <DropdownLabel htmlFor="chunkSize">
                Chunk Size: {chunkSize}
              </DropdownLabel>
              <DropdownInput
                value={chunkSize}
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
              <DropdownInput
                value={overlap}
                id="overlap"
                min={1}
                max={200}
                onChange={(e) => setOverlap(parseInt(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const buttons = entries.map((entry, key) => (
    <UrlButton
      key={key}
      entry={entry}
      onClick={() =>
        crawlDocument(
          entry.url,
          setEntries,
          setCards,
          splittingMethod,
          chunkSize,
          overlap
        )
      }
    />
  ));
  return (
    <div className="flex flex-col space-y-4 overflow-y-scroll items-center">
      <div className="flex flex-col items-center sticky top-0">
        <div className="flex p-2">{buttons}</div>
        <div className="flex p-2">
          <div className="flex-grow px-2"></div>
        </div>
        <Dropdown />
      </div>
      <div className="flex flex-wrap w-full">
        {cards &&
          cards.map((card, key) => (
            <Card key={key} card={card} selected={[]} />
          ))}
      </div>
    </div>
  );
};
