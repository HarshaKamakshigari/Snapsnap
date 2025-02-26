"use client"; 

import { useRef, useState, useEffect } from "react";

const filters = {
  normal: "",
  grayscale: "grayscale(100%)",
  sepia: "sepia(100%)",
  invert: "invert(100%)",
  blur: "blur(5px)"
};

export default function Photobooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState("normal");

  useEffect(() => {
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    }
    startCamera();
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.filter = filters[filter]; // Apply selected filter
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  const downloadPhoto = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "photobooth.png";
    link.click();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Photobooth</h1>
      <video ref={videoRef} width="640" height="480" autoPlay style={{ filter: filters[filter] }} />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
      <div>
        {Object.keys(filters).map((key) => (
          <button key={key} onClick={() => setFilter(key)}>{key}</button>
        ))}
      </div>
      <button onClick={capturePhoto}>Capture</button>
      <button onClick={downloadPhoto}>Download</button>
    </div>
  );
}
