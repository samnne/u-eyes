import { useEffect } from "react";
import { useCamera } from "../hooks/useCamera";

const Camera = (
  {
    handleMessage,
    connected,
  }: {
    handleMessage: (
      type: "frame",
      ts: number,
      imageBase64: string,
      width: number,
      height: number
    ) => void;
    connected: boolean
  },
) => {
  const { videoRef, startCamera, captureFrame } = useCamera();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  useEffect(() => {
  
    if (!connected) return;
    const interval = setInterval(() => {
      const frameBase64 = captureFrame();
      
      if (frameBase64) {
       
        handleMessage("frame", Date.now(), frameBase64, 500, 800);
      }
    }, 5000); // 1 frame per second
    return () => clearInterval(interval);
  }, [captureFrame]);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <video
        ref={videoRef}
        // width={}
        // height={}
        className="object-cover border-black border-4 w-full h-full"
        autoPlay
        muted
      ></video>
    </div>
  );
};

export default Camera;
