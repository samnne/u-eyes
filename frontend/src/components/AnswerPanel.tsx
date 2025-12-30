import { useEffect, useRef, useState, type Ref } from "react";
import { FaInfoCircle } from "react-icons/fa";
const AnswerPanel = ({
  messages,
  latency,
}: {
  messages: ServerMessage[];
  latency: number;
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [open, setOpen] = useState(false);
  const [latText, setLatText] = useState("");
  const openModal = () => {
    dialogRef?.current?.showModal();
  };

  const handleLatencyText = () => {
    messages.map((message) =>
      message.type === "meta" && message.message.includes("complete")
        ? setLatText(`${message.serverTs}ms`)
        : setLatText(`${message.serverTs}ms`)
    );
  };
  useEffect(() => {
    handleLatencyText();
  }, [messages]);

  const handleModal = () => {
    if (dialogRef?.current?.open) {
      closeModal();
      setOpen(false);
    } else {
      openModal();
      setOpen(true);
    }
  };
  const closeModal = () => {
    dialogRef?.current?.close();
  };

  return (
    <>
      <button
        onClick={handleModal}
        disabled={messages.length > 0 ? false : true}
        className={` ${open ? "opacity-0" : "opacity-100"} ${
          messages.length > 0 && !open ? " border-green-400" : ""
        } flex active:scale-115 text-white justify-center  items-center focus:scale-110 hover:scale-110 hover:translate-y-2   transition-all duration-200  shadow-inner  h-8 cursor-pointer bg-[#000000c4]  absolute w-5/12 top-2 rounded-full  z-10`}
      >
        
      </button>
      <dialog
        ref={dialogRef}
        onClick={handleModal}
        className="absolute opacity-0 no-scrollbar gap-2  text-white bg-black shadow-[#0000004b] open:max-h-40  shadow-lg p-2  max-h-8 justify-self-center  flex flex-col open:opacity-80  top-2 px-5 scale-25   open:scale-100 duration-400 transition-all  rounded-4xl min-w-5/12   open:min-w-24/25 overflow-auto  "
      >
        <div className="flex-1">

        {messages.map((message: ServerMessage, idx: number) => (
          <div className=" text-white  flex justify-between" key={idx}>
            {message.type === "meta" && message.message}
            <h1 className="capitalize">
              {message.type === "token" && <span>{message.text} </span>}
            </h1>
          </div>
        ))}
        </div>
        <span className="sticky bottom-0 right-0 ml-auto w-fit  rounded-2xl bg-white text-black p-1 ">{latText}</span>
      </dialog>
    </>
  );
};

export default AnswerPanel;
