import React, { FC } from "react";
import ReactMarkdown from "react-markdown";

export interface ICard {
    pageContent: string;
    score?: number;
    values?: any[];
    metadata: {
        hash: string;
        chunk?: string;
        text?: string;
        url?: string;
    };
}

interface ICardProps {
    card: ICard;
    selected?: string[] | null;
}

export const Card: FC<ICardProps> = ({ card, selected }) => {
    const relevancePercentage = card.score ? (card.score * 100).toFixed(0) : undefined;

    return (
        <div
            id={card.metadata.hash}
            className={`card w-full p-5 m-2 text-white ${selected && selected.includes(card.metadata.hash)
                ? "bg-gray-600"
                : "bg-gray-800"
                } ${selected && selected.includes(card.metadata.hash)
                    ? "border-double border-4 border-sky-500"
                    : "opacity-60 hover:opacity-80 transition-opacity duration-300 ease-in-out"
                }`}
        >
            {/* Display the URL as a source link if it exists */}
            {card.metadata.url && (
                <div className="mb-2">
                    <span className="mr-1 font-bold">Source:</span>
                    <a href={card.metadata.url} target="_blank" rel="noopener noreferrer" className="underline">
                        {card.metadata.url}
                    </a>
                </div>
            )}
            
            {/* Always display the page content */}
            <ReactMarkdown>{card.pageContent}</ReactMarkdown>

            {/* Display the relevance percentage if score exists */}
            {relevancePercentage && <div className="text-xs mb-2">{relevancePercentage}% relevant</div>}

            {/* Display the hash */}
            <b className="text-xs">{card.metadata.hash}</b>
        </div>
    );
};
