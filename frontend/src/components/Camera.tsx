import { useEffect } from "react";
import { useCamera } from "../hooks/useCamera";

const Camera = ({
  handleMessage,
  connected,
  test_handle,
}: {
  handleMessage: (
    type: "frame" | "scene" | "question",
    ts: number,
    imageBase64: string,
    width: number,
    height: number
  ) => void;
  connected: boolean;
  test_handle: (type: "frame" | "scene" | "question", payload: string | null) => void;
}) => {
  const { videoRef, startCamera, captureFrame } = useCamera();

  useEffect(() => {
    startCamera();
  }, [startCamera]);
  // console.log(captureFrame())
  // useEffect(() => {

  //   const interval = setInterval(() => {
  //     const frameBase64 = captureFrame();
  //     if (frameBase64) {
  //       handleMessage("frame", Date.now(), frameBase64, 800, 800);
  //     }
  //   }, 20000); // 1 frame per second

  //   return () => clearInterval(interval);
  // }, [captureFrame]);
  // useEffect(() => {

  //   const interval = setInterval(() => {
  //     const frameBase64 = captureFrame();
  //     if (frameBase64) {
  //       handleMessage("scene", Date.now(), frameBase64, 800, 800);
  //     }
  //   }, 60000); // 1 frame per second

  //   return () => clearInterval(interval);
  // }, [captureFrame]);
  return (
    <div className="w-full h-full p-1    flex justify-center items-center">
      <button
        onClick={() => test_handle("frame", captureFrame())}
        type="button"
        className="absolute top-20 right-5 z-20 rounded-2xl hover:scale-115 transition-all duration-200 hover:rounded-3xl active:scale-115 focus:scale-115 bg-blue-500 text-black w-8 h-8"
      >
        F
      </button>
      <button
        onClick={() => test_handle("scene", captureFrame())}
        type="button"
        className="absolute top-35 right-5 z-20 rounded-2xl hover:scale-115 transition-all duration-200 hover:rounded-3xl active:scale-115 focus:scale-115 bg-purple-500 text-black w-8 h-8"
      >
        S
      </button>
      <video
        ref={videoRef}
        // width={}
        // height={}
        className="object-cover w-full  rounded-2xl h-full"
        autoPlay
        // style={{
        //   transform: "scaleX(-1)"
        // }}
        muted
      ></video>
    </div>
  );
};

export default Camera;
