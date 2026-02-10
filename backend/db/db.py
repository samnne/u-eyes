import asyncio
import firebase_admin
from google.cloud.firestore_v1 import FieldFilter
from firebase_admin import firestore
from firebase_admin import credentials
from dotenv import load_dotenv
import os
from api.prompts import test_snapshots
from google.genai import types
from api.session import SessionState


load_dotenv()


cred = credentials.Certificate("./db/ueyes_service_account_key.json")

app = firebase_admin.initialize_app(cred)

db = firestore.client()

def _get_obs_text_sync(session: SessionState):
    query = db.collection("memory").where(filter=FieldFilter("uid", "==", session.uid)).order_by("ts").limit(5)
    docs = query.stream()
    text = ""
    for doc in docs:
        doc_dict = doc.to_dict()
        ts = doc_dict.get("ts")
        formatted = ts.strftime("%Y-%m-%d %H:%M:%S") if ts else "NO_TIMESTAMP"
        text += f"[{formatted}]-{doc_dict.get('text','')}\n"
    return text

async def get_obs_text(session: SessionState):
    try:
        return await asyncio.wait_for(
            asyncio.to_thread(_get_obs_text_sync, session),
            timeout=5
        )
    except asyncio.TimeoutError:
        print("🔥 Firestore timed out")
        return ""




# async def seed():

#     for item in test_snapshots:

#         db.collection("memory").add(
#             {"text": item["text"], "ts": firestore.firestore.SERVER_TIMESTAMP}
#         )


def save_to_db(data: str, session: SessionState):
    doc_ref = db.collection("memory")

    query = doc_ref.add(
        {"text": data, "ts": firestore.firestore.SERVER_TIMESTAMP, "uid": session.uid}
    )
