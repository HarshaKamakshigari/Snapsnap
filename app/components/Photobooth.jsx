"use client";

import { useRef, useState, useEffect } from "react";

const filters = {
  normal: "",
  grayscale: "grayscale(100%)",
  sepia: "sepia(100%)",
  invert: "invert(100%)",
  blur: "blur(5px)",
};

export default function Photobooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState("normal");
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOn]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // ✅ Uses the default webcam
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.filter = filters[filter];
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-300 p-6">
      <h1 className="text-3xl font-bold mb-4">Snap snap</h1>

      {isCameraOn ? (
        <video
          ref={videoRef}
          className="w-full max-w-lg rounded-lg border-2 border-gray-300 shadow-md"
          autoPlay
          style={{ filter: filters[filter] }}
        />
      ) : (
        <p className="text-lg text-gray-600">Camera is off</p>
      )}

      <canvas ref={canvasRef} width="640" height="480" className="hidden" />

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {Object.keys(filters).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-md text-white transition ${
              filter === key ? "bg-orange-500" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`px-5 py-2 rounded-md text-white transition ${
            isCameraOn ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>

        <button
          onClick={capturePhoto}
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
        >
          Capture
        </button>

        <button
          onClick={downloadPhoto}
          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
        >
          Download
        </button>
      </div>
    </div>
  );
}
