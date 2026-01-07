import { useEffect, useState } from "react";

const Overlay = ({ messages }: { messages: ServerMessage[] }) => {
  const localMessages = messages.filter(
    (msg) => msg.type === "thought" || msg.type === "meta"
  );
  const [message, setMessage] = useState("Ready");
  const changeLoadingText = () => {
    localMessages.map((msg) =>
      msg.type === "meta" && msg.message.includes("complete")
        ? setMessage("Done")
        : setMessage("Thinking")
    );
  };
  useEffect(() => {
    changeLoadingText();
  }, [messages]);

  return (
    <>
      <div className="absolute bottom-4 right-4 z-10">
        <div className=" bg-black/80 backdrop-blur-sm rounded-xl px-6 py-2 shadow-lg border transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500/80">{message}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overlay;
