import firebase_admin
from firebase_admin import db
from firebase_admin import firestore
from firebase_admin import credentials
from dotenv import load_dotenv
import os
from db.db_schemas import MemorySchema

load_dotenv()

backend_auth = os.getenv("BACKEND_AUTH")

cred = credentials.Certificate("./service_account/ueyes_service_account_key.json")


firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://ueyes-74c38-default-rtdb.firebaseio.com/",
        "databaseAuthVariableOverride": {"uid": backend_auth},
    },
)


def retrieve_memory(user:str, search_item: str):
    db_ref = db.reference("/memory_store")

    db_ref.get()

def save_to_db(
    user: str, entire_text: str, search_item: str, location: str, ts: float, type: str
):
    """
    Docstring for save_to_db
    """
    db_ref = db.reference("/memory_store")

    push_ref = db_ref.push()

    push_ref.set(
        {
            "user": user,
            "text": entire_text,
            "search_item": search_item,
            "location": location,
            "ts": ts,
            "type": type,
        }
    )


save_to_db(
    user="my_username",
    entire_text="my_text",
    search_item="my_search_item",
    location="my_location",
    ts=123,
    type="memory",
)
