// UrlButton.tsx

import { Button } from "./Button";
import React, { FC } from "react";

export interface IUrlEntry {
  url: string;
  title: string;
  seeded: boolean;
  loading: boolean;
}

interface IURLButtonProps {
  entry: IUrlEntry;
  onClick: () => Promise<void>;
}

const UrlButton: FC<IURLButtonProps> = ({ entry, onClick }) => (
  <div key={`${entry.url}-${entry.seeded}`} className="pr-2 lg:flex-grow">
    <Button
      className={`relative overflow-hidden w-full my-1 lg:my-2 mx-2 ${
        entry.loading ? "shimmer" : ""
      }`}
      style={{
        backgroundColor: entry.seeded ? "green" : "bg-gray-800",
        color: entry.seeded ? "white" : "text-gray-200",
      }}
      onClick={onClick}
    >
      {entry.loading && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: -1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            animation: "shimmer 2s infinite",
          }}
        ></div>
      )}
      <div className="relative">{entry.title}</div>
    </Button>
  </div>
);

export default UrlButton;
