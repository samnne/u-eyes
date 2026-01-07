from pydantic import BaseModel

class FrameMessage(BaseModel):
    type: str
    ts: float
    imageBase64: str
    width: int
    height: int




class QuestionMessage(BaseModel):
    type: str
    ts: float
    text: str



ClientMessage = FrameMessage | QuestionMessage 