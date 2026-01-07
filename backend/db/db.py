import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials
from dotenv import load_dotenv
import os
from api.prompts import test_snapshots
from google.genai import types
from api.session import SessionState


load_dotenv()

backend_auth = os.getenv("BACKEND_AUTH")

cred = credentials.Certificate("./service_account/ueyes_service_account_key.json")

app = firebase_admin.initialize_app(cred)

db = firestore.client()


def get_obs_text(session: SessionState):
    docs = db.collection("memory").order_by("ts").limit(100).get()
    text =""
    for doc in docs:
        doc_dict = doc.to_dict()
        formatted = doc_dict["ts"].strftime("%Y-%m-%d %H:%M:%S")
        # item = types.Content(
        #     role="user",
        #     parts=[types.Part.from_text(text=f"[{formatted}]-{doc_dict['text']}\n")],
        # )
        # # Save it to the session.
        # session.conversation.append(item)

        text += f"[{formatted}]-{doc_dict['text']}\n"
    return [text]


def seed():

    for item in test_snapshots:

        db.collection("memory").add(
            {"text": item["text"], "ts": firestore.firestore.SERVER_TIMESTAMP}
        )


def save_to_db(data: dict):
    doc_ref = db.collection("memory")

    query = doc_ref.add({"text": data, "ts": firestore.firestore.SERVER_TIMESTAMP})
