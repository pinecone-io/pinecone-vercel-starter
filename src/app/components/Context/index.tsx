import React from "react";
interface ContextProps {
  className: string;
}

export const Context: React.FC<ContextProps> = ({ className }) => {
  return (
    <div className="flex flex-col space-y-4 overflow-y-scroll items-center">
      <div className="flex flex-col items-center sticky top-0">
        <div className="flex p-2">
          <div className="flex-grow px-2">
            <div className="flex flex-col items-center text-white text-xl">
              Context
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
