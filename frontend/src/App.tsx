import "./index.css";
import AnswerPanel from "./components/AnswerPanel";
import Camera from "./components/Camera";
import Overlay from "./components/Overlay";
import { useState } from "react";
import { useExplainWebSocket } from "./hooks/useExplainWebSocket";
import { FaCamera } from "react-icons/fa";
import AudioComponent from "./components/AudioComponent";

function App() {
  const [latency, setLatency] = useState(0);
  const [questionModal, setQuestionModal] = useState(false);
  const [question, setQuestion] = useState("");
  // const [thoughtSignatures, setThoughtSignature] = useState([]);
  const { messages, sendMessage, connected } = useExplainWebSocket(
    // import.meta.env.VITE_LOCAL_WS_URL
    import.meta.env.VITE_PROD_WS_URL,
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
    height: number = 0,
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
    payload: string | null,
  ) {
    if (type === "question") {
      setQuestionModal(false)
    }

    handleMessage(type, Date.now(), payload ? payload : "");
  }

  return (
    <main
      className="bg-black  relative min-w-screen h-screen flex flex-col items-center 
    "
    >
      <button
        onClick={() => setQuestionModal((prev) => !prev)}
        type="button"
        className="absolute top-5 right-5 z-20 rounded-2xl hover:scale-115 transition-all duration-200 hover:rounded-3xl active:scale-115 focus:scale-115 bg-purple-500 text-white cursor-pointer w-8 h-8"
      >
        Q
      </button>

      <div
        className={` ${questionModal ? "scale-100 border-purple-500 border  right-10 top-10 z-50" : "scale-0 right-5 top-5 -z-10"}  transition-all duration-200 ease-in-out  max-sm:right-2  flex justify-center items-center   absolute max-sm:p-2 p-4 rounded-2xl w-80 sm:w-90 h-fit bg-black`}
      >
        <div>
          <input
            type="text"
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            className="outline-0 w-3/4 text-white"
            placeholder="Type your question..."
          />
        </div>
        <div>
          <button
            onClick={() => test_handle("question", question)}
            className="w-full bg-purple-500 hover:scale-110 transition-all duration-150 ease-in-out cursor-pointer focus:bg-purple-800 active:bg-purple-800 text-purple-100 px-4 py-2 rounded-2xl"
          >
            Submit
          </button>
        </div>
      </div>

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
      {/* <DebugPanel messages={messages} /> */}
    </main>
  );
}

export default App;
