import os
import uuid
import logging
from typing import List, Dict
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv

import easyocr
from gtts import gTTS

# ---------------------------
# Basic config
# ---------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend")

load_dotenv()

# Directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("audio/output", exist_ok=True)

# FastAPI app
app = FastAPI(title="Sukhi Suvidha Backend (OCR + Chatbot)")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Supported OCR languages
# ---------------------------
OCR_LANG_MAP = {
    "en": ["en"],
    "hi": ["hi"],
    "bn": ["bn"],
    "te": ["te"],
    "ta": ["ta"],
    "mr": ["mr"],
}

# Cache EasyOCR Readers
readers: Dict[str, easyocr.Reader] = {}


def get_easyocr_reader(lang_code: str) -> easyocr.Reader:
  if lang_code not in OCR_LANG_MAP:
      raise ValueError(f"Unsupported OCR language: {lang_code}")
  if lang_code not in readers:
      logger.info(f"Initializing EasyOCR reader for {lang_code}...")
      readers[lang_code] = easyocr.Reader(OCR_LANG_MAP[lang_code], gpu=False)
  return readers[lang_code]


# ---------------------------
# Save file utility
# ---------------------------
def save_file(upload: UploadFile) -> str:
    filename = f"{uuid.uuid4().hex}_{upload.filename}"
    path = os.path.join("uploads", filename)
    with open(path, "wb") as f:
        f.write(upload.file.read())
    return path


# ---------------------------
# TTS generator
# ---------------------------
def make_audio(text: str, lang: str):
    if not text:
        return None

    lang_map = {
        "en": "en",
        "hi": "hi",
        "mr": "mr",
        "ta": "ta",
        "te": "te",
        "bn": "bn",
    }

    gtts_lang = lang_map.get(lang, "en")

    filename = f"{uuid.uuid4().hex}.mp3"
    output_path = os.path.join("audio/output", filename)

    tts = gTTS(text=text, lang=gtts_lang)
    tts.save(output_path)

    return filename


# ---------------------------
# Upload OCR endpoint
# ---------------------------
@app.post("/upload-ocr")
async def upload_ocr(uploadFile: UploadFile = File(...), language_code: str = Form(...)):
    try:
        if language_code not in OCR_LANG_MAP:
            raise HTTPException(status_code=400, detail="Unsupported language.")

        # Save file
        path = save_file(uploadFile)

        # OCR
        reader = get_easyocr_reader(language_code)
        text_list: List[str] = reader.readtext(path, detail=0)
        extracted_text = " ".join(text_list).strip()

        # No GPT – simple relay
        simplified = extracted_text or "No readable text found."

        # Generate audio
        audio_file = make_audio(simplified, language_code)

        return JSONResponse(
            {
                "text": simplified,
                "audio_url": f"/audio/{audio_file}" if audio_file else None,
            }
        )

    except Exception as e:
        logger.exception("Upload OCR failed")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------
# Serve audio files
# ---------------------------
@app.get("/audio/{filename}")
def get_audio(filename: str):
    path = os.path.join("audio/output", filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audio not found.")
    return FileResponse(path, media_type="audio/mpeg")


# ---------------------------
# Rule-based medical chatbot (no OpenAI)
# ---------------------------
def medical_chatbot(message: str, lang: str = "en"):
    """Simple rule-based medical assistant"""

    message_lower = message.lower()

    medical_responses = {
        "en": {
            "fever": "For fever: Rest well, drink fluids, take paracetamol. Visit doctor if fever >102°F or persists 3+ days.",
            "cough": "For cough: Drink warm water, avoid cold drinks, inhale steam. Visit doctor if persistent.",
            "headache": "For headache: Rest in dark room, drink water, avoid screens. Visit doctor if severe.",
            "cold": "For cold: Warm fluids, rest, nasal saline drops. Usually improves in 7-10 days.",
            "stomach": "For stomach issues: Drink ORS, eat bananas/rice, avoid spicy food.",
            "skin": "Keep area clean + dry. Avoid scratching. Use mild soap. Consult dermatologist if severe.",
            "pain": "Rest the area, use ice pack, take prescribed pain medicine if needed.",
            "default": "I can help with fever, cough, headache, cold, skin or stomach issues. Describe your symptom."
        },
        "hi": {
            "fever": "बुखार: आराम करें, तरल पदार्थ पिएं, पेरासिटामोल लें। 3 दिन से ज़्यादा बुखार हो तो डॉक्टर को दिखाएं।",
            "cough": "खांसी: शहद वाला गर्म पानी पिएं, भाप लें। यदि एक सप्ताह से अधिक हो तो डॉक्टर को दिखाएं।",
            "headache": "सिरदर्द: अंधेरे कमरे में आराम करें, पानी पिएं, स्क्रीन टाइम कम करें।",
            "cold": "जुकाम: आराम करें, गर्म तरल लें, सलाइन ड्रॉप्स use करें।",
            "stomach": "पेट दर्द: ORS पिएँ, हल्का भोजन करें, मसालेदार भोजन से बचें।",
            "skin": "त्वचा: साफ रखें, खुजलाएं नहीं, हल्के साबुन का उपयोग करें।",
            "pain": "दर्द: आराम करें, बर्फ की सिकाई करें।",
            "default": "मैं बुखार, खांसी, सिरदर्द, जुकाम, पेट और त्वचा समस्याओं में मदद कर सकता हूँ।"
        }
    }

    # detect language responses
    res = medical_responses.get(lang, medical_responses["en"])

    # keyword matching
    for key in ["fever", "cough", "headache", "cold", "stomach", "skin", "pain"]:
        if key in message_lower:
            return res[key]

    return res["default"]


# Chatbot API
@app.post("/chat")
async def chat_with_bot(message: str = Form(...), lang: str = Form("en")):
    try:
        reply = medical_chatbot(message, lang)
        return {"reply": reply}
    except Exception:
        return {"reply": "Sorry, I couldn't understand. Try again."}


# ---------------------------
# Health check
# ---------------------------
@app.get("/")
def root():
    return {"status": "running", "service": "Backend Ready"}