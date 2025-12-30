import "./index.css";
import AnswerPanel from "./components/AnswerPanel";
import Camera from "./components/Camera";
import DebugPanel from "./components/DebugPanel";
import Overlay from "./components/Overlay";
import { useState } from "react";
import { useExplainWebSocket } from "./hooks/useExplainWebSocket";

function App() {
  const [latency, setLatency] = useState(0);

  const { messages, sendMessage, connected } = useExplainWebSocket(
    import.meta.env.VITE_PHONE_WS_URL
  );

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

  function test_handle(type: "frame" | "scene" | "question", payload: string | null) {
    console.log("hey");
    handleMessage(type, Date.now(), payload);
  }
  return (
    <main
      className="bg-black relative min-w-screen h-screen flex flex-col items-center 
    "
    >
      <button
        onClick={() => test_handle("question", "Where are my keys")}
        type="button"
        className="absolute top-5 right-5 z-20 rounded-2xl hover:scale-115 transition-all duration-200 hover:rounded-3xl active:scale-115 focus:scale-115 bg-green-500 text-black w-8 h-8"
      >
        Q
      </button>

      <AnswerPanel messages={messages} latency={latency} />
      <Camera
        test_handle={test_handle}
        connected={connected}
        handleMessage={handleMessage}
      />

      <Overlay messages={messages} />

      <DebugPanel messages={messages} />
    </main>
  );
}

export default App;
