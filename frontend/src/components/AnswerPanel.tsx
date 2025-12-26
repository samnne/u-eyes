import {  type Ref } from "react";

const AnswerPanel = ({
  dialogRef,
  messages,
  latency
}: {
  dialogRef: Ref<HTMLDialogElement | null>;
  messages: ServerMessage[];
  latency: number;
 
}) => {
  
 
  
  
  const closeModal = () => {
    
    dialogRef?.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="absolute justify-self-center  self-start h-25 opacity-0 flex flex-col open:opacity-100 open:scale-100 scale-25 top-5     duration-300 transition-all bg-white p-5 rounded-full min-w-9/10  overflow-auto   shadow-xl"
    >
      <button  className="bg-black w-20 h-20 sticky rounded-full self-end">
        <span onClick={closeModal} className="neo-btn rounded-full bg-[#EA4335] active:bg-red-300">Close</span>
      </button>
      {messages.map((message: ServerMessage, idx: number) => (
        <div className=" text-black" key={idx}>
          {message.type === "meta" && <em className="capitalize ">{message.message}</em>}
          {message.type === "section" && <strong>{message.title}</strong>}
          <h1>{message.type === "token" && <span>{message.text}</span>}</h1>
          {message.type === "overlay" && (
            <span>Overlay updates: {message.overlays.length}</span>
          )}

          <span>{message.serverTs}ms</span>
        </div>
      ))}
    </dialog>
  );
};

export default AnswerPanel;
