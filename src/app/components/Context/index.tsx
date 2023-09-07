import React, { FormEvent, useEffect, useState } from 'react';
import { getURLs, addURL, clearURLs } from './urls';
import UrlButton, { IUrlEntry } from './UrlButton';
import { Card, ICard } from './Card';
import { clearIndex, crawlDocument } from './utils';

import { Button } from './Button';

interface ContextProps {
  className: string;
  selected: string[] | null;
}

export const Context: React.FC<ContextProps> = ({ className, selected }) => {
  const [entries, setEntries] = useState(getURLs);
  const [cards, setCards] = useState<ICard[]>([]);

  const [splittingMethod, setSplittingMethod] = useState('markdown');
  const [newURL, setNewURL] = useState('');
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(1);

  const handleNewURLSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newURL.length > 0) {
      const url = validateAndReturnURL();
      addURL({
        url: url.toString(),
        title: newURL,
        seeded: false,
        loading: false,
      });
      let newURLList = [...getURLs()];
      setEntries(newURLList);
      setNewURL('');
    }
  };

  const handleClearURLsSubmit = async () => {
    const newURLList: IUrlEntry[] = [];
    clearURLs();
    setEntries(newURLList);
  };

  const validateAndReturnURL = () => {
    let url;
    try {
      url = new URL(newURL);
    } catch (e) {
      const baseUrl = 'https://www.google.com/search?q=';
      url = new URL(baseUrl + newURL.replaceAll(' ', '%20'));
    }
    return url;
  };

  useEffect(() => {
    const element = selected && document.getElementById(selected[0]);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, [selected]);

  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-white p-2 font-bold">
      {children}
    </label>
  );

  const buttons = entries.map((entry: IUrlEntry, key: any) => (
    <div className="" key={`${key}-${entry.loading}`}>
      <UrlButton
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
    </div>
  ));

  return (
    <div
      className={`flex flex-col border-2 overflow-y-auto rounded-lg border-gray-500 w-full ${className}`}
    >
      <div className="flex flex-col items-start sticky top-0 w-full">
        <div className="flex flex-col lg:flex-row w-full lg:flex-wrap p-2">
          {buttons}
        </div>
        <div className="flex-grow w-full px-4">
          <form
            onSubmit={handleNewURLSubmit}
            className="mt-5 mb-5 relative bg-gray-700 rounded-lg"
          >
            <input
              type="text"
              className="input-glow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-10 bg-gray-600 border-gray-600 transition-shadow duration-200"
              value={newURL}
              onChange={(e) => setNewURL(e.target.value)}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            Add URL ⮐
            </span>
          </form>
          <div className="flex justify-between">
            <Button
              className="my-2 uppercase active:scale-[98%] transition-transform duration-100"
              style={{
                backgroundColor: '#4f6574',
                color: 'white',
                width: '48%',
              }}
              onClick={handleClearURLsSubmit}
            >
              Clear URL List
            </Button>
            <Button
              className="my-2 uppercase active:scale-[98%] transition-transform duration-100"
              style={{
                backgroundColor: '#4f6574',
                color: 'white',
                width: '48%',
              }}
              onClick={() => clearIndex(setEntries, setCards)}
            >
              Clear Index
            </Button>
          </div>
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
          {splittingMethod === 'recursive' && (
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
      </div>
    </div>
  );
};
