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
  context: { context: PineconeRecord[] }[] | null;
  id: string;
}

export const Card: FC<ICardProps> = ({ card, context }) => (
  <div
    id={card.id}
    className={`card w-full mb-2`}
  >
    <ReactMarkdown>{card.pageContent}</ReactMarkdown>
    <div className="flex">
      {/* {selected && selected.includes(card.metadata.hash) && <BlueEllipseSvg />} */}
      <b className="text-xs mt-2" style={{ color: "#72788D", fontWeight: 400 }}>
        ID: {card.metadata.hash}
      </b>
    </div>
  </div>
);
