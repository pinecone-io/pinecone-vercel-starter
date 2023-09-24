// SidePanel.tsx

import React, { useState } from "react";
import { Context } from "@/components/Context";
import { RelevantDocs, IRelevantDoc } from "@/components/RelevantDocs";

interface SidePanelProps {
    context: string[] | null;
    relevantDocs: IRelevantDoc[] | null;
}

const SidePanel: React.FC<SidePanelProps> = ({ context, relevantDocs }) => {
    const [activePanel, setActivePanel] = useState<"context" | "relevantDocs">("context");

    const buttonBaseStyles = "py-2 px-4 w-full my-2 uppercase active:scale-[98%] transition-transform duration-100 rounded";
    const inactiveButtonStyles = "bg-#4f6574 text-white";
    const activeButtonStyles = "bg-gray-300 hover:bg-gray-400";

    return (
        <div className="flex flex-col border-2 overflow-y-auto rounded-lg border-gray-500 w-full">
            {/* Toggle Buttons */}
            <div className="flex space-x-4 mb-4 p-2">
                <button
                    onClick={() => setActivePanel("context")}
                    className={`${buttonBaseStyles} ${activePanel === "context" ? activeButtonStyles : inactiveButtonStyles}`}
                >
                    Seed
                </button>
                <button
                    onClick={() => setActivePanel("relevantDocs")}
                    className={`${buttonBaseStyles} ${activePanel === "relevantDocs" ? activeButtonStyles : inactiveButtonStyles}`}
                >
                    Relevant Documents
                </button>
            </div>

            {/* Panels */}
            {activePanel === "context" && (
                <Context className="" selected={context} />
            )}

            {activePanel === "relevantDocs" && (
                <RelevantDocs relevantDocs={relevantDocs} />
            )}
        </div>
    );
};

export default SidePanel;
