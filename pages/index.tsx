import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);
  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="w-64 h-64 flex flex-col justify-center items-center">
          {/* Add your animation component here */}
          {showAnimation && (
            <div className=" bg-cyan-500 animate-spin w-full h-full duration-200" />
          )}
        </div>
        <h1 className="text-white mx-auto text-4xl mt-8">Under Development</h1>
        <p className="text-gray-400 mt-2">Stay tuned for updates!</p>
      </div>
    </main>
  );
}
