const Overlay = ({ messages }: { messages: ServerMessage[] }) => {
  const localMessage = messages[messages.length - 1];
  console.log(messages)
  return (
    <div></div>
    // <button className="absolute bottom-5 bg-black left-5 h-fit">
    //   <span className=" neo-btn bg-gray-100">
    //     { localMessage && 
    //       <span className="text-black">
    //         {localMessage.type === "meta" && `${localMessage.serverTs}ms`}
    //       </span>
    //     }
    //   </span>
    // </button>
  );
};

export default Overlay;
