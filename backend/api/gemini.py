from api.session import SessionState
import time
from dotenv import load_dotenv
import os
import base64
from typing import AsyncGenerator
from google import genai
from api.prompts import system_prompt 

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=api_key,
)


def parse_image(base_64_str: str):
    comma = base_64_str.find(",") + 1
    return base_64_str[comma:len(base_64_str)]
    

async def stream_response(prompt: str, image_base64: str) -> AsyncGenerator[dict, None]:

    image_bytes = base64.b64decode(parse_image(image_base64))
 
    inputs = [
        genai.types.Part.from_text(
            text= system_prompt
        ),
        genai.types.Part.from_text(text=prompt),
        genai.types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
    ]

    stream = client.models.generate_content_stream(
        model="gemini-2.5-flash", contents=inputs
    )

    for chunk in stream:
        if hasattr(chunk, "text"):
      
            yield {
                "type": "token",
                "text": chunk.text,
                "serverTs": int(time.time() * 1000),
            }


async def send_token(session: SessionState, prompt: str, frame_data: str, frame_ts: float = 0):
    """
    Simulate token-by-token streaming to the client.
    Replace this function with real Gemini 3 streaming integration.
    """

    await session.websocket.send_json(
        {"type": "meta", "serverTs": int(time.time() * 1000) - frame_ts, "message": "gemini_stream_start"}
    )

    # async for message in stream_response(prompt, frame_data):

    #     await session.websocket.send_json(message)

    await session.websocket.send_json(
        {"type": "meta", "serverTs": int(time.time() * 1000) - frame_ts, "message": "gemini_stream_complete"}
    )
