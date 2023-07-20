//code for background music
import { useEffect } from "react";

const BackgroundMusic = () => {
  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const audioElement = new Audio("/Disfigure-Blank.mp3");
    const sourceNode = audioContext.createMediaElementSource(audioElement);
    const gainNode = audioContext.createGain();

    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = 0.5; // Set the desired volume (range: 0.0 to 1.0)

    audioElement.loop = true;
    audioElement.autoplay = true;

    return () => {
      audioElement.pause();
      audioElement.removeAttribute("src");
      audioElement.load();
    };
  }, []);

  return null;
};

export default BackgroundMusic;
