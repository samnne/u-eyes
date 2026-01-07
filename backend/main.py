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
    allow_origins=["*"],  # http://localhost:5173
    # allow_credentials=False,
    # allow_methods=["*"],
    # allow_headers=["*"],
)


active_sessions: List[SessionState] = []


async def request_processing(websocket, session, ai_session=None):
    data = await websocket.receive_json()

    data_type = data.get("type")
    print(data_type)
    if data_type == "frame":
        frame = FrameMessage(**data)
        session.frames.append(frame)

        prompt = "Explain what is in this frame. Give answers when needed"

        await send_token(
            session,
            prompt=prompt,
            frame_data=frame.imageBase64,
            frame_ts=frame.ts,
            ai_session=ai_session,
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
            ai_session=ai_session,
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
            ai_session=ai_session,
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


@app.websocket("/ws/explain")
async def image_endpoint(websocket: WebSocket):
    session = SessionState(websocket=websocket)
    active_sessions.append(session)
    session.audio_queue = asyncio.Queue()
    await websocket.accept()
    config, audio_config, _ = generate_client_config()
    # while True:
    #     try:
    #         async with client.aio.live.connect(
    #             model="gemini-2.5-flash-native-audio-preview-12-2025",
    #             config=audio_config,
    #         ) as ai_session:
    #             audio_task = asyncio.create_task(
    #                 recieve_audio(ai_session, session, session.audio_queue)
    #             )
    try:
        while True:
            await request_processing(websocket, session, None)
    except Exception as e:
        if "1006" in str(e) or "ConnectionClosed" in str(e):
            print(f"Detected 1006 Abnormal Closure. Attempting to reconnect...{e}")
            await asyncio.sleep(1)  # Wait a second before trying again
            # continue
        else:
            print(f"Permanent Error: {e}")
            # break
        # except Exception as e:
        #     if "1006" in str(e) or "ConnectionClosed" in str(e):
        #         print(f"Detected 1006 Abnormal Closure. Attempting to reconnect...{e}")
        #         await asyncio.sleep(1)  # Wait a second before trying again
        #     else:
        #         print(f"Permanent Error: {e}")
