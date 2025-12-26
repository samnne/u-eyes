from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from api.session import SessionState
import time
from api.schemas import FrameMessage, QuestionMessage, ControlMessage
from api.gemini import send_token
from fastapi.responses import HTMLResponse


app = FastAPI(title="uEyes")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # http://localhost:5173
    # allow_credentials=False,
    # allow_methods=["*"],
    # allow_headers=["*"],
)



active_sessions: List[SessionState] = []


@app.websocket("/ws/explain")
async def image_endpoint(websocket: WebSocket):
    session = SessionState(websocket=websocket)
    active_sessions.append(session)
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()

         
            data_type = data.get("type")
            print("hey")
            if data_type == "frame":
                frame = FrameMessage(**data)
                session.frames.append(frame)
               
                prompt = "Explain what is in this frame. Give answers when needed"

                await send_token(session, prompt=prompt, frame_data=frame.imageBase64, frame_ts=frame.ts)
            elif data_type == "question":
                question = QuestionMessage(**data)
                session.conversation.append(question.text)
                
                await send_token(session, question.text, session.frames[-1].imageBase64 if session.frames else "")
            else:
                await websocket.send_json(
                    {
                        "type": "error",
                        "serverTs": time.time(),
                        "message": "Unknown message type",
                        "recoverable": True,
                    }
                )

        # Image processing via gemini.py

        # Return the explaination via websocket
            await websocket.send_text(f"The message recieved {data}")
    except Exception as e:
        print(f"Disconnect {e}")
    # finally:
    #     await websocket.close()
