// page.tsx

"use client";

import React, { useEffect, useRef, useState, FormEvent } from "react";
import { Context } from "@/components/Context";
import Chat from "@/components/Chat";
import InstructionModal from "./components/InstructionModal";
import { Message } from "ai";
import { PineconeRecord, ScoredPineconeRecord } from "@pinecone-database/pinecone";

const Page: React.FC = () => {
  const [context, setContext] = useState<{ context: PineconeRecord[] }[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [totalRecords, setTotalRecords] = useState<number>(0);


  const refreshIndex = async () => {
    const response = await fetch("/api/checkIndex", {
      method: "POST",
    });
    try {
      const stats = await response.json();
      setTotalRecords(stats.totalRecordCount);
    } catch (e) {
      console.log(e)
    }
  }


  return (
    <div className="flex flex-col justify-between h-screen bg-whitemx-auto max-w-full">
      <InstructionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="flex w-full flex-grow overflow-hidden relative">
        <div style={{
          backgroundColor: "#FBFBFC"
        }} className="absolute transform translate-x-full transition-transform duration-500 ease-in-out right-0 w-2/3 h-full bg-white overflow-y-auto lg:static lg:translate-x-0 lg:w-2/5">
          <Context className="" context={context} refreshIndex={refreshIndex} />
        </div>
        <Chat setContext={setContext} showIndexMessage={totalRecords === 0} context={context} />
        <button
          type="button"
          className="absolute left-20 transform -translate-x-12 bg-white text-white rounded-l py-2 px-4 lg:hidden"
          onClick={(e) => {
            e.currentTarget.parentElement
              ?.querySelector(".transform")
              ?.classList.toggle("translate-x-full");
          }}
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default Page;
