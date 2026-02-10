from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from api.session import SessionState
import time
from api.schemas import FrameMessage, QuestionMessage
from api.gemini import send_token, client, generate_client_config, recieve_audio
from db.db import *
import asyncio


app = FastAPI(title="uEyes")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://samnne.github.io/",
    ],  # http://localhost:5173
    # allow_credentials=False,
    # allow_methods=["*"],
    # allow_headers=["*"],
)


active_sessions: List[SessionState] = []


async def request_processing(websocket: WebSocket, session: SessionState):
    data = await websocket.receive_json()
  
    data_type = data.get("type")
    print(data_type)
    if data.get("uid"):
        session.uid = data.get("uid")
    
    
    if data_type == "frame":
        frame = FrameMessage(**data)
        session.frames.append(frame)

        prompt = "Explain what is in this frame. Give answers when needed"

        await send_token(
            session,
            prompt=prompt,
            frame_data=frame.imageBase64,
            frame_ts=frame.ts,
        )
    elif data_type == "scene":
        frame = FrameMessage(**data)
        session.frames.append(frame)

        prompt = "Give a dense description of the scene and find key items that the user may need later. In one sentance."

        await send_token(
            session,
            prompt,
            frame.imageBase64,
            frame.ts,
            res_type=data_type,
        )
    elif data_type == "question":
        question = QuestionMessage(**data)
        session.conversation.append(question.text)

        await send_token(
            session,
            prompt=question.text,
            frame_data="",
            res_type=data_type,
            frame_ts=question.ts,
        )

    else:
        await websocket.send_json(
            {
                "type": "error",
                "serverTs": time.time(),
                "message": "Unknown message type",
                "recoverable": True,
            }
        )


@app.get("/")
def index():
    return {"message": "Welcome to the uEyes API!"}


@app.websocket("/ws/explain")
async def image_endpoint(websocket: WebSocket):
    session = SessionState(websocket=websocket)
    active_sessions.append(session)
   
    await websocket.accept()
    config, audio_config, _ = generate_client_config()
    # while True:
    # async with client.aio.live.connect(
    #     model="gemini-2.5-flash-native-audio-preview-12-2025",
    #     config=audio_config,
    # ) as ai_session:
    #     audio_task = asyncio.create_task(
    #         recieve_audio(ai_session, session, session.audio_queue)
    #     )
    #     session.ai_session = ai_session
    try:
        while True:
            await request_processing(websocket=websocket, session=session)
    except Exception as e:
        print(f"WebSocket error: {e}")


# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run(app, host="0.0.0.0", port=8000)

