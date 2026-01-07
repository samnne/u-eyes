import "./index.css";
import AnswerPanel from "./components/AnswerPanel";
import Camera from "./components/Camera";
import DebugPanel from "./components/DebugPanel";
import Overlay from "./components/Overlay";
import { useEffect, useState } from "react";
import { useExplainWebSocket } from "./hooks/useExplainWebSocket";
import { FaCamera } from "react-icons/fa";
import AudioComponent from "./components/AudioComponent";

function App() {
  const [latency, setLatency] = useState(0);
  const [thoughtSignatures, setThoughtSignature] = useState([]);
  const { messages, sendMessage, connected } = useExplainWebSocket(
    import.meta.env.VITE_LOCAL_WS_URL
  );

  // useEffect(() => {
  //   messages.forEach((msg) => {
  //     setThoughtSignature((prev) => {
  //       return
  //     });
  //   });
  // }, [messages]);

  function handleMessage(
    type: "frame" | "scene" | "question",
    ts: number,
    payload: string,
    width: number = 0,
    height: number = 0
  ) {
    setLatency(ts);

    switch (type) {
      case "frame": {
        const frame: FrameMessage = {
          type: type,
          ts: ts,
          imageBase64: payload,
          width: width,
          height: height,
        };
        sendMessage(frame);
        break;
      }
      case "scene": {
        const scene: FrameMessage = {
          type: type,
          ts: ts,
          imageBase64: payload,
          width: width,
          height: height,
        };
        sendMessage(scene);
        break;
      }
      case "question": {
        const question: QuestionMessage = {
          text: payload,
          ts: ts,
          type: type,
        };
        sendMessage(question);
        break;
      }
    }
  }

  function test_handle(
    type: "frame" | "scene" | "question",
    payload: string | null
  ) {
   
    handleMessage(type, Date.now(), payload);
  }
  return (
    <main
      className="bg-black  relative min-w-screen h-screen flex flex-col items-center 
    "
    >
      <button
        onClick={() => test_handle("question", "What room am i in?")}
        type="button"
        className="absolute top-5 right-5 z-20 rounded-2xl hover:scale-115 transition-all duration-200 hover:rounded-3xl active:scale-115 focus:scale-115 bg-green-500 text-black w-8 h-8"
      >
        Q
      </button>

      <AnswerPanel messages={messages} latency={latency} />
      {connected ? (
        <Camera
          test_handle={test_handle}
          connected={connected}
          handleMessage={handleMessage}
        />
      ) : (
        <div className="absolute w-50 h-50 text-gray-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <FaCamera className="w-full h-full" />
        </div>
      )}

      <AudioComponent messages={messages} />

      <Overlay messages={messages} />

      <DebugPanel messages={messages} />
    </main>
  );
}

export default App;
