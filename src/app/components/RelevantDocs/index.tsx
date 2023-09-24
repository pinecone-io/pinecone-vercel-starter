import React, { FC } from "react";
import { Card, ICard } from "@/components/Card";


export interface IRelevantDoc {
    id: string;
    score: number;
    values: any[];
    metadata: {
        chunk: string;
        hash: string;
        text: string;
        url: string;
    };
}

interface RelevantDocsProps {
    relevantDocs: IRelevantDoc[] | null;
}
export const RelevantDocs: FC<RelevantDocsProps> = ({ relevantDocs }) => {
    return (
        <div className="p-4 bg-gray-700 rounded-lg overflow-y-auto">
            {relevantDocs && relevantDocs.map((doc) => {
                const cardData: ICard = {
                    pageContent: doc.metadata.chunk,
                    metadata: {
                        hash: doc.metadata.hash,
                        text: doc.metadata.text,
                        url: doc.metadata.url
                    },
                    score: doc.score,
                    values: doc.values
                };
                return <Card key={doc.id} card={cardData} />;
            })}
        </div>
    );
};

