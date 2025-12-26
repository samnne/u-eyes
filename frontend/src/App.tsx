import "./index.css";
import AnswerPanel from "./components/AnswerPanel";
import Camera from "./components/Camera";
import DebugPanel from "./components/DebugPanel";
import Overlay from "./components/Overlay";
import { useRef, useState } from "react";
import { useExplainWebSocket } from "./hooks/useExplainWebSocket";

function App() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [latency, setLatency] = useState(0)
  const { messages, sendMessage, connected } = useExplainWebSocket(
    import.meta.env.VITE_LOCAL_WS_URL
  );

  function handleMessage(type: "frame", ts: number, imageBase64:string, width:number, height:number) {
    setLatency(ts)
   
    const frame: FrameMessage = {
      type: type,
      ts: ts,
      imageBase64: imageBase64,
      width: width,
      height: height,
    };
    sendMessage(frame);
  }
  const openModal = () => {
    dialogRef.current?.showModal();
  };
  return (
    <main className="bg-[#fffefd] relative min-w-screen h-screen flex flex-col items-center   ">
      <AnswerPanel
        messages={messages}
        dialogRef={dialogRef}
        latency={latency}
      />
      <Camera connected={connected} handleMessage={handleMessage} />
    
      <Overlay messages={messages} />

  
      <DebugPanel messages={messages} />
      <div className="absolute bottom-5 bg-black right-5 h-fit">
        <button
          onClick={openModal}
          className="z-10 bottom-5 right-5 bg-[#176ced] active:bg-[#4587eb] neo-btn "
        >
          View Response
        </button>
      </div>
    </main>
  );
}

export default App;
