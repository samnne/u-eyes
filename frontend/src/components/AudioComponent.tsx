import { useEffect, useRef, useState, type Ref } from "react";

const AudioComponent = ({ messages }: { messages: ServerMessage[] }) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const audioContextRef: Ref<AudioContext> = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);

  useEffect(() => {
    const item = messages.find(msg => msg.type === "meta" && msg.message.includes("complete"))
    if (item){
      handleStart()
    }
  }, [messages]);
  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext({
        sampleRate: 24000,
      });
    }

    // 2. Resume logic (must be triggered by a user click)
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  };

  const playChunk = (base64Data: string) => {
    const ctx = audioContextRef.current;
    console.log(audioContextRef);
    if (!ctx || ctx.state === "suspended") return;
    // Converting data to buffer
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Int16Array(len / 2);
    for (let i = 0; i < len; i += 2) {
      bytes[i / 2] =
        (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
    }

    const float32Data = new Float32Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      float32Data[i] = bytes[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32Data.length, 24000);
    buffer.getChannelData(0).set(float32Data);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    const lookAhead = 0.05;

    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime + lookAhead;
    }
    // start audio
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
  };

  const handleStart = async () => {
    await initAudio();
    setIsStreaming(true);
    // Start your API connection here
    // When a message arrives:
    console.log(messages);
    for (let i = 0; i < messages.length; i++) {
      const chunk: ServerMessage = messages[i];

      if (chunk["type"] === "token" && chunk["audio"]) {
        playChunk(chunk["audio"]);
      }

      // if (chunk["type"] === "token") {
      //   speakText(!chunk["text"].includes("**") ? chunk["text"] : "")
      // }
    }
    setIsStreaming((prev) => !prev);
  };
  // const playAudio = async () => {
  //   await initAudio();
  //   const tokens = [];
  //   for (let i = 1; i < 4; i++) {
  //     const itemString = localStorage.getItem(`${i}`);
  //     if (itemString) {
  //       const item = JSON.parse(itemString);
  //       tokens.push(item);
  //     }
  //   }

  //   for (let i = 0; i < tokens.length; i++) {
  //     playChunk(tokens[i]["audio"]);
  //   }
  // };

  //

  return (
    <div className="absolute z-50 bottom-20">
      {/* <button onClick={handleStart} className="bg-red-500 text-black">
        {isStreaming ? "Streaming Audio..." : "Start Audio Session"}
      </button> */}
    </div>
  );
};

export default AudioComponent;
