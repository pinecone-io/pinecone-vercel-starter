import Image from "next/image";
import testAILogo from "../../../public/test-ai.png";
export default function Header({ className }: { className?: string }) {
    return (
    <header
      className={`flex items-center justify-center text-gray-200 text-2xl ${className}`}
    >
      {/* https://www.fontspace.com/ */}
      <Image
        src={testAILogo}
        alt="pinecone-logo"
        width="230"
        height="50"
        className="ml-3"
      />     
    </header>
  );
}
