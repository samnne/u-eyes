import "./index.css";
import AnswerPanel from "./components/AnswerPanel";
import Camera from "./components/Camera";
import Overlay from "./components/Overlay";
import { useState } from "react";
import { useExplainWebSocket } from "./hooks/useExplainWebSocket";
import { FaCamera } from "react-icons/fa";
import AudioComponent from "./components/AudioComponent";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "./auth/firebase";
import { motion } from "motion/react";


function SignIn({ handleUID }: { handleUID: (uid: string) => void }) {
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const signInWithGoogle = async (judges: boolean) => {
    try {
      if (judges === true) {
        const res = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        console.log(res.user);
        setError("");
        return;
      }
      const result = await signInWithPopup(auth, provider);
      handleUID(result.user.uid);
      setError("");
    } catch (error) {
      setError("Failed to Sign In.");
      console.error("Error During Sign In:", error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      {error && (
        <div className="text-red-500 text-2xl absolute top-10 font-bold bg-black border-2 border-red-500 shadow shadow-red-500 rounded-2xl p-5">
          <p>{error}</p>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          signInWithGoogle(true);
        }}
        className="flex flex-col items-start gap-4 border-2 sm:p-10 p-5 bg-black shadow-lg shadow-purple-500 border-purple-500 "
      >
        <h1 className="text-4xl text-white">
          Welcome to <br /> uEyes
        </h1>
        <div className="text-white">
          <p>
            A computer vision application that{" "}
            <i className="font-bold">remembers,</i> powered by Gemini 3.
          </p>
        </div>
        <div className="w-full text-white">
          <input
            type="text"
            name="email"
            id="email"
            onChange={handleChange}
            placeholder="Email"
            className="p-2 border-b outline-0 font-light w-full border-purple-500"
          />
        </div>
        <div className="w-full text-white">
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            placeholder="Password"
            className="p-2 border-b outline-0 font-light w-full border-purple-500"
          />
        </div>

        <div className="flex font-bold gap-4 w-full">
          <motion.button
            whileTap={{
              scale: 0.8,
            }}
            whileFocus={{
              scale: 1.1,
            }}
            whileHover={{
              scale: 1.1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
            className="bg-purple-500 cursor-pointer text-white p-2 rounded"
          >
            Sign In
          </motion.button>
          <motion.button
            whileTap={{
              scale: 0.8,
            }}
            whileFocus={{
              scale: 1.1,
            }}
            whileHover={{
              scale: 1.1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
            type="button"
            onClick={() => signInWithGoogle(false)}
            className="bg-gray-500 cursor-pointer text-white p-2 rounded"
          >
            Sign In with Google
          </motion.button>
        </div>
        <span className="font-light text-gray-500 text-sm">
          &copy; 2026 uEyes. All Rights Reserved
        </span>
      </form>
    </>
  );
}

function App() {
  const [latency, setLatency] = useState(0);
  const [questionModal, setQuestionModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  // const [thoughtSignatures, setThoughtSignature] = useState([]);
  const { messages, sendMessage, connected, connect } = useExplainWebSocket(
    import.meta.env.VITE_LOCAL_WS_URL,
    // import.meta.env.VITE_PROD_WS_URL,
  );

  const { currentUser } = auth;

  const handleUID = (uid: string) => {
    console.log(currentUser, uid);
    setIsSignedIn(true);
  };

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
          uid: currentUser?.uid,
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
          uid: currentUser?.uid,
        };
        sendMessage(scene);
        break;
      }
      case "question": {
        const question: QuestionMessage = {
          text: payload,
          ts: ts,
          type: type,
          uid: currentUser?.uid,
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
      setQuestionModal(false);
    }

    handleMessage(type, Date.now(), payload ? payload : "");
  }

  return (
    <>
      {isSignedIn ? (
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
          {!connected && (
            <motion.button
              whileTap={{
                scale: 0.8,
              }}
              whileFocus={{
                scale: 1.1,
              }}
              whileHover={{
                scale: 1.1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="absolute left-1/2 text-white bg-black border border-purple-500 p-2 -translate-x-1/2 bottom-10"
              onClick={connect}
             
            >
              Connect
            </motion.button>
          )}
        </main>
      ) : (
        <main className="h-screen w-screen overflow-hidden bg-black flex justify-center items-center">
          <SignIn handleUID={handleUID} />
        </main>
      )}
    </>
  );
}

export default App;
