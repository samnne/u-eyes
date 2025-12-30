from api.session import SessionState
import time
from dotenv import load_dotenv
import os
import base64
from typing import AsyncGenerator
from google import genai
from api.prompts import system_prompt
from db.db import save_to_db, get_obs_text


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=api_key,
)


def parse_image(base_64_str: str):
    comma = base_64_str.find(",") + 1
    return base_64_str[comma : len(base_64_str)]


async def stream_response(
    prompt: str, image_base64: str, history: list = []
) -> AsyncGenerator[dict, None]:

    image_bytes = base64.b64decode(parse_image(image_base64))
    # cache_name = ""
    # if len(history) != 0:
    #     cache = client.caches.create(
    #         model="gemini-3-flash-preview",
    #         config=genai.types.CreateCachedContentConfig(
    #             display_name="memory",
    #             ttl="3600s",
    #             contents=[genai.types.Part.from_text(text=history[0])],
    #             system_instruction=system_prompt,
    #         ),
    #     )
    #     cache_name = cache.name

    # GEMINI 3 CONFIG: Define thinking depth and image quality
    config = genai.types.GenerateContentConfig(
        system_instruction=system_prompt,
        thinking_config=genai.types.ThinkingConfig(
            include_thoughts=True, thinking_budget=-1
        ),
        media_resolution=genai.types.MediaResolution(value="MEDIA_RESOLUTION_MEDIUM"),
    )

    inputs = [
        genai.types.Part.from_text(text=prompt),
    ]

    if image_base64:
        inputs.append(
            genai.types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
        )

    stream = await client.aio.models.generate_content_stream(
        model="gemini-3-flash-preview", contents=history + inputs, config=config
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


async def send_token(
    session: SessionState,
    prompt: str,
    frame_data: str,
    frame_ts: float = 0,
    res_type: str = "",
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
        prompt, frame_data, history=get_obs_text() if res_type == "question" else []
    ):
        message["serverTs"] = message["serverTs"] - frame_ts
        if res_type == "scene" and message["type"] == "token":
            save_to_db(message["text"])
        else:
            await session.websocket.send_json(message)

    await session.websocket.send_json(
        {
            "type": "meta",
            "serverTs": int(time.time() * 1000) - frame_ts,
            "message": "gemini_stream_complete",
        }
    )
