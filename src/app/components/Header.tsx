import Image from "next/image";
import PineconeLogo from "../../../public/pinecone.svg";
import VercelLogo from "../../../public/vercel.svg";

export default function Header({ className }: { className?: string }) {
  return (
    <header
      className={`flex items-center justify-center text-gray-200 text-2xl ${className}`}
    >
      <Image
        src={PineconeLogo}
        alt="pinecone-logo"
        width="160"
        height="50"

      />{" "}
      <div className="text-3xl ml-3 mr-3">/</div>
      <Image
        src={VercelLogo}
        alt="vercel-logo"
        width="105.719"
        height="23.895"
        className="mr-3 mt-2"
      />
    </header>
  );
}