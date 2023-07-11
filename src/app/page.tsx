"use client";

import Header from "./components/Header";

export default function Chat() {
  return (
    <div className="flex flex-col justify-between h-screen bg-gray-800 p-2 mx-auto max-w-full">
      <Header className=" mt-5 mb-5" />
      <div className="flex flex-start text-xl text-white justify-center h-screen">
        Hello Pinecone Summit!
      </div>
    </div>
  );
}
