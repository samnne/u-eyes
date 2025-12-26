
from api.session import SessionState
import time
import asyncio

async def send_token(session: SessionState, text: str):
    """
    Simulate token-by-token streaming to the client.
    Replace this function with real Gemini 3 streaming integration.
    """
    for token in text.split():
        await session.websocket.send_json({
            "type": "token",
            "serverTs": time.time(),
            "text": token + " "
        })
        await asyncio.sleep(0.05)  # simulate streaming delay