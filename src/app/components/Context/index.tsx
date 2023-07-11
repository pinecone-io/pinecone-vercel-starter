import React, { useState } from "react";
import { urls } from "./urls";
import UrlButton from "./UrlButton";
import { Card, ICard } from "./Card";
interface ContextProps {
  className: string;
}

export const Context: React.FC<ContextProps> = ({ className }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([
    {
      pageContent: "Hello World",
      metadata: {
        hash: "123",
      },
    },
  ]);

  const buttons = entries.map((entry, key) => (
    <UrlButton key={key} entry={entry} />
  ));
  return (
    <div className="flex flex-col space-y-4 overflow-y-scroll items-center">
      <div className="flex flex-col items-center sticky top-0">
        <div className="flex p-2">{buttons}</div>
        <div className="flex p-2">
          <div className="flex-grow px-2"></div>
        </div>
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
