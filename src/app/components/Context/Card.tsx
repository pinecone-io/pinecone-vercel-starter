import { BlueEllipseSvg } from "@/utils/svg/blueEllipse";
import { PineconeRecord } from "@pinecone-database/pinecone";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";

export interface ICard {
  pageContent: string;
  metadata: {
    hash: string;
  };
  id: string
}

interface ICardProps {
  card: ICard;
  context: PineconeRecord[] | null;
  id: string;
}

export const Card: FC<ICardProps> = ({ card, context }) => (
  <div
    id={card.id}
    className={`card w-full p-5 m-2`}
  >
    <ReactMarkdown>{card.pageContent}</ReactMarkdown>
    <div className="flex">
      {/* {selected && selected.includes(card.metadata.hash) && <BlueEllipseSvg />} */}
      <b className="text-xs">
        ID: {card.metadata.hash}
      </b>
    </div>
  </div>
);
