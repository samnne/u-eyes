import React, { useEffect, useRef, useState, type Ref } from "react";

const AudioComponent = ({ messages }: { messages: ServerMessage[] }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [localMessages, setLocalMessages] = useState([])
  const [queue, setQueue] = useState<Array<string>>([]);
  // useRef ensures these persist across re-renders without resetting
  const audioContextRef: Ref<AudioContext> = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  useEffect(() => {
    const func = () => {
      setLocalMessages(prev => {
        const mockQueue: Array<string> = [];

        messages.forEach(msg => {
          if (msg.type === "audio") mockQueue.unshift(msg.stream);

        })
        setQueue(mockQueue)
        return messages
      })
    }
    func()
  }, [messages])


  const initAudio = async () => {
    if (!audioContextRef.current) {
      // 1. Initialize Context (Gemini is 24kHz)
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
    if (!ctx || ctx.state === "suspended") return;


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

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
  };

  const handleStart = async () => {
    await initAudio();
    setIsStreaming(true);

    // Start your API connection here
    // When a message arrives:
    if (queue.length > 0) {

      for (let i = 0; i < messages.length; i++) {
        const chunk: string = queue.shift();
        playChunk(chunk)
      }
    }


  };


  // 

  return (
    <div className="absolute z-50 bottom-20">
      <button
        onClick={handleStart}
        className="bg-red-500 text-black"

      >
        {isStreaming ? "Streaming Audio..." : "Start Audio Session"}
      </button>
    </div>
  );
};

export default AudioComponent;
