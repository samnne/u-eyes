from fastapi import WebSocket
from collections import deque


class SessionState:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.frames = deque(maxlen=30)  
        self.conversation = []          
        self.context_summary = ""      


