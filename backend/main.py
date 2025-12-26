from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from api.session import SessionState
import time
from api.schemas import FrameMessage, QuestionMessage, ControlMessage
from api.gemini import send_token


app = FastAPI(title="uEyes")


active_sessions: List[SessionState] = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # http://localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws/explain")
async def image_endpoint(websocket: WebSocket):
    session = SessionState(websocket=websocket)
    active_sessions.append(session)
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            data_type = data.get("type")

            if data_type == "frame":
                frame = FrameMessage(**data)
                session.frames.append(frame)
                # Here: forward to Gemini streaming adapter
                await send_token(session, f"Received frame at {frame.ts}")
            elif data_type == "question":
                question = QuestionMessage(**data)
                session.conversation.append(question.text)
                # Here: forward question + context to Gemini
                await send_token(session, f"Processing question: {question.text}")
            elif data_type == "control":
                control = ControlMessage(**data)
                await send_token(session, f"Control updated: mode={control.mode}")
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
            await websocket.send_text("The message recieved f{data}")
    except:
        print("Disconnect")
    finally:
        await websocket.close()
