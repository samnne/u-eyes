from api.session import SessionState
import time
from dotenv import load_dotenv
import os
import base64
from typing import AsyncGenerator
from google import genai
from websockets.exceptions import ConnectionClosedOK
from api.prompts import system_prompt
from db.db import save_to_db, get_obs_text
import asyncio

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=api_key,
)


def process_pcm(data) -> str:
    return base64.b64encode(data).decode("utf-8")


def get_cache(history: str):
    cache_name = ""
    if len(history) != 0:
        cache = client.caches.create(
            model="gemini-3-flash-preview",
            config=genai.types.CreateCachedContentConfig(
                display_name="memory",
                ttl="3600s",
                contents=[genai.types.Part.from_text(text=history)],
                system_instruction=system_prompt,
            ),
        )
        cache_name = cache.name

    return cache_name


def parse_image(base_64_str: str) -> str:
    comma = base_64_str.find(",") + 1
    return base_64_str[comma : len(base_64_str)]


async def recieve_audio(ai_session, session: SessionState, audio_queue) -> None:
    try:
        async for response in ai_session.receive():
            if response.data is None:
                continue
            if response.server_content and response.server_content.turn_complete:
                await audio_queue.put(
                    {
                        "type": "meta",
                        "message": "messege_end",
                        "serverTs": int(time.time() * 1000),
                    }
                )
                continue
            if response.data is None:
                continue
            await audio_queue.put(
                {
                    "type": "audio",
                    "stream": process_pcm(response.data),
                    "serverTs": int(time.time() * 1000),
                    "thought_signature": session.thought_signature,
                }
            )
        await audio_queue.put(
            {
                "type": "meta",
                "message": "audio_end",
                "serverTs": int(time.time() * 1000),
            }
        )

    except ConnectionClosedOK:
        # Normal shutdown — do NOT log as error
        print("Not an error, but ConnectionClosedOK")
        pass

    except Exception as e:
        print("Audio receive crashed:", e)


def generate_client_config() -> tuple[
    genai.types.GenerateContentConfig,
    genai.types.LiveConnectConfig,
    genai.types.GenerateContentConfig,
]:
    # regular config
    config = genai.types.GenerateContentConfig(
        thinking_config=genai.types.ThinkingConfig(
            include_thoughts=True, thinking_budget=-1
        ),
        # cached_content=get_cache(get_obs_text(session=None)[0]),
        media_resolution=genai.types.MediaResolution(value="MEDIA_RESOLUTION_MEDIUM"),
    )
    # native audio tts
    audio_config = genai.types.LiveConnectConfig(
        response_modalities=[genai.types.Modality(value="AUDIO")],
        system_instruction="Take the the text given to you and shorten it to make more friendly and conversational",
    )
    # traditonal tts
    other = genai.types.GenerateContentConfig(
        response_modalities=[genai.types.Modality(value="AUDIO")],
        # system_instruction="Take the the text given to you and shorten it to make more friendly and conversational",
        speech_config=genai.types.SpeechConfig(
            voice_config=genai.types.VoiceConfig(
                prebuilt_voice_config=genai.types.PrebuiltVoiceConfig(voice_name="Puck")
            )
        ),
    )
    return (config, audio_config, other)


async def stream_response(
    prompt: str,
    image_base64: str,
    session: SessionState,
    history: list = [],
    ai_session=None,
) -> AsyncGenerator[dict, None]:
    image_bytes = base64.b64decode(parse_image(image_base64))
    while not session.audio_queue.empty():
        try:
            session.audio_queue.get()
        except asyncio.QueueEmpty:
            break

    config, _, other = generate_client_config()

    inputs = [
        genai.types.Part.from_text(text=prompt),
    ]

    if image_base64:
        inputs.append(
            genai.types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
        )
    if session.thought_signature:
        inputs.append(genai.types.Part(thought_signature=session.thought_signature))

    stream = await client.aio.models.generate_content_stream(
        model="gemini-3-flash-preview",
        contents=history + inputs,
        config=config,
    )

    async for chunk in stream:
        if chunk:
            for part in chunk.candidates[0].content.parts:  # type: ignore
                if part.thought:
                    yield {
                        "type": "thought",
                        "text": part.text,
                        "serverTs": int(time.time() * 1000),
                    }

                elif part.text:
                    session.set_thought_signature(
                        part.thought_signature
                        if hasattr(part, "thought_signature")
                        else None
                    )  # type: ignore
                    # model = client.models.generate_content(
                    #     model="gemini-2.5-flash-preview-tts",
                    #     config=other,
                    #     contents=part.text,
                    # )
                    await ai_session.send_realtime_input(text=part.text)
                    # yield {
                    #     "type": "audio",
                    #     "stream": process_pcm(
                    #         model.candidates[0].content.parts[0].inline_data.data
                    #     ),
                    #     "serverTs": int(time.time() * 1000),
                    #     "thought_signature": session.thought_signature,
                    # }
                    yield {
                        "type": "token",
                        "text": part.text,
                        "serverTs": int(time.time() * 1000),
                        "thought_signature": (
                            part.thought_signature
                            if hasattr(part, "thought_signature")
                            else None
                        ),
                    }

        while not session.audio_queue.empty():
            msg = await session.audio_queue.get()

            yield msg
    while True:
        msg = await session.audio_queue.get()

        if msg["type"] == "meta" and msg["message"] == "audio_end":
            break
        yield msg


async def send_token(
    session: SessionState,
    prompt: str,
    frame_data: str,
    frame_ts: float = 0,
    res_type: str = "",
    ai_session=None,
):
    """
    Simulate token-by-token streaming to the client.
    Replace this function with real Gemini 3 streaming integration.
    """

    await session.websocket.send_json(
        {
            "type": "meta",
            "serverTs": int(time.time() * 1000) - frame_ts,
            "message": "gemini_stream_start",
        }
    )

    async for message in stream_response(
        prompt,
        frame_data,
        history=get_obs_text(session) if res_type == "question" else [],
        session=session,
        ai_session=ai_session,
    ):
        message["serverTs"] = message["serverTs"] - frame_ts
        if res_type == "scene" and message["type"] == "token":
            save_to_db(message["text"])
        else:
            print(message)

            await session.websocket.send_json(message)

    await session.websocket.send_json(
        {
            "type": "meta",
            "serverTs": int(time.time() * 1000) - frame_ts,
            "message": "gemini_stream_complete",
        }
    )
