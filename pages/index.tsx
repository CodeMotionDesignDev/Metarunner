import { useState } from "react";
import { Inter } from "next/font/google";
import Login from "@/components/Login";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);
  return <main>
    <Login/>
  </main>;
}
