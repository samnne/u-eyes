from pydantic import BaseModel


class MemorySchema(BaseModel):
    type: str
    location: str
    search_item: str
    ts: float
    entire_text: str
    user: str


