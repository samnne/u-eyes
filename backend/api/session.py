from fastapi import WebSocket
from collections import deque
from asyncio import Queue

class SessionState:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.frames = deque(maxlen=30)  
        self.conversation = []          
        self.context_summary = ""  
        self.ai_session = None
        self.audio_queue: Queue | None = None
        self.thought_signature: bytes | None = None

    def set_thought_signature(self, ts:bytes | None):
        self.thought_signature = ts


