import { useState } from "react";
import { Inter } from "next/font/google";
import Login from "@/components/Login/Login";
// import Environment from '@/components/environment/game'
// import Game from "@/components/environment/game";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);
  return <main>
    <Login/>
  </main>;
}
