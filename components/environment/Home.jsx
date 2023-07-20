"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
const BabylonScene = dynamic(() => import("./game"), {
  ssr: false,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://code.jquery.com/pep/0.4.2/pep.min.js";
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://cdn.babylonjs.com/babylon.js";
    document.body.appendChild(script2);

    const script3 = document.createElement("script");
    script3.src = "https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js";
    document.body.appendChild(script3);

    const script4 = document.createElement("script");
    script4.src = "https://code.jquery.com/pep/0.4.3/pep.js";
    document.body.appendChild(script4);

    const script5 = document.createElement("script");
    script5.src = "https://cdn.babylonjs.com/gui/babylon.gui.min.js";
    document.body.appendChild(script5);

    const script6 = document.createElement("script");
    script6.src = "/libs/browser-detector.js";
    document.body.appendChild(script6);

    const script7 = document.createElement("script");
    script7.src = "/libs/recast.js";
    document.body.appendChild(script7);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
      document.body.removeChild(script4);
      document.body.removeChild(script5);
      document.body.removeChild(script6);
      document.body.removeChild(script7);
    };
  }, []);
  useEffect(() => setLoaded(true));

  return (
    <>
      <span id="badge" class="badge">
        Checking Navigation
      </span>
      {loaded && <BabylonScene />}
      {/* <canvas id="renderCanvas" className="h-full w-full"></canvas> */}
    </>
  );
}
