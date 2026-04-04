from sentence_transformers import SentenceTransformer
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import spacy
import torch

# =========================
# 🔥 DEVICE
# =========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_num_threads(2)
print("🔥 Loading AI models...")

# =========================
# 🔥 EMBEDDING
# =========================
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# =========================
# 🔥 GENERATOR
# =========================
text_generator = pipeline(
    "text2text-generation",
    model="google/flan-t5-base",
    device=0 if torch.cuda.is_available() else -1
)

# =========================
# 🔥 BART MODEL (IMPORTANT FIX)
# =========================
tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")

model = AutoModelForSeq2SeqLM.from_pretrained(
    "sshleifer/distilbart-cnn-12-6"
).to(device)

# =========================
# 🔥 NER
# =========================
nlp = spacy.load("en_core_web_sm")

print("✅ Models loaded successfully")