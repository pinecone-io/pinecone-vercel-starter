import React from "react";
import { AiFillGithub } from "react-icons/ai";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionModal: React.FC<InstructionModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-300 p-5 z-50 rounded-lg shadow-lg relative w-8/12 md:w-5/12">
        <button
          onClick={onClose}
          className="absolute right-2 text-3xl top-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <p>
          This chatbot demonstrates a simple RAG pattern using{" "}
          <a href="https://pinecone.io" target="_blank" className="text-gray">
            Pinecone
          </a>{" "}
          and Vercel&apos;s AI SDK. In the context panel on the right, you can
          see some articles you can index in Pinecone (on mobile, open the
          context panel by clicking the button at the top left of the message
          panel). Click on the blue link icons to open the URLs in a new window.
        </p>
        <br />
        <p>
          After you index them, you can ask the chatbot questions about the
          specific of each article. The segments relevant to the answers the
          chatbot gives will be highlighted.
        </p>
        <br />
        <p>
          You can clear the index by clicking the &quot;Clear Index&quot; button
          in the context panel.
        </p>
      </div>
      <div
        className="absolute inset-0 bg-black z-20 opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default InstructionModal;
