import React from "react";
import { urls } from "./urls";
import UrlButton from "./UrlButton";
interface ContextProps {
  className: string;
}

export const Context: React.FC<ContextProps> = ({ className }) => {
  const [entries, setEntries] = React.useState(urls);

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
    </div>
  );
};
