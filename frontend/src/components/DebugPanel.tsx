const DebugPanel = ({ messages }: { messages: ServerMessage[] }) => {
  const HIGH = 100;
  const LOW = 200;

  const localMessage = messages[messages.length - 1];
  console.log(messages);
  return (
    <button
      className={`${
        messages.length > 0 ? "block" : "hidden"
      } absolute  bottom-4 rounded-2xl  left-4`}
    >
      <span className=" flex items-center gap-2  px-6 py-3 justify-center font-bold bg-black  rounded-xl z-10 w-full h-full ">
        {localMessage && (
          <>
            <div
              className={`w-2 h-2 rounded-full ${
                localMessage.serverTs < LOW
                  ? "bg-green-400"
                  : localMessage.serverTs < HIGH
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            ></div>
            <span
              className={`text-white text-xs`}
            >
              {localMessage.type === "meta" && `${localMessage.serverTs}ms`}
            </span>
          </>
        )}
      </span>
    </button>
  );
};

export default DebugPanel;
