from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import neattext.functions as nfx
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("model\emotion_detection_pipeline_validated.pkl")

# ön temizleme
def clean_text(text):
    text = text.lower()  
    text = nfx.remove_stopwords(text) 
    text = nfx.remove_special_characters(text)
    return text

# endpoint
@app.route('/analyze', methods=['POST'])
def analyze():
    # metni al
    data = request.json
    text = data['text']

    # metni temizle
    cleaned_text = clean_text(text)

    # modele gönderip sonucu al
    sentiment = model.predict([text])[0]

    # sonucu JSON olarak döndür
    return jsonify({'sentiment': sentiment})

# run
if __name__ == '__main__':
    app.run(debug=False)