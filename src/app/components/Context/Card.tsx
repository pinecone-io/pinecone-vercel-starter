import { BlueEllipseSvg } from "@/utils/svg/blueEllipse";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";

export interface ICard {
  pageContent: string;
  metadata: {
    hash: string;
  };
}

interface ICardProps {
  card: ICard;
  selected: string[] | null;
}

export const Card: FC<ICardProps> = ({ card, selected }) => (
  <div
    id={card.metadata.hash}
    className={`card w-full p-5 m-2 ${selected && selected.includes(card.metadata.hash)
      ? ""
      : "opacity-80 hover:opacity-100 transition-opacity duration-300 ease-in-out"
      }`}
  >
    <ReactMarkdown>{card.pageContent}</ReactMarkdown>
    <div className="flex">
      {selected && selected.includes(card.metadata.hash) && <BlueEllipseSvg />}
      <b className="text-xs">
        ID: {card.metadata.hash}
      </b>
    </div>
  </div>
);
