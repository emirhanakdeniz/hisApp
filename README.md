# His - Emotion Analysis

His is a web application that analyzes emotions from text and visually presents the results to the user. Users can discover the emotions in their written texts, view their analysis history, and see emotion distributions. The app features a modern and interactive interface.

## Features
- **Emotion Analysis:** Text entered by the user is analyzed using a machine learning model to detect its emotion (Happiness, Sadness, Anger, Fear, Disgust, Surprise, Neutral).
- **Multi-User Support:** Different users can be created, and each user's analysis history is kept separately (on web).
- **History & Statistics:** The last 5 analyses and emotion ratios are visualized.
- **Modern UI:** Animations, onboarding, dynamic background, and mobile compatibility.
- **Lightweight & Fast:** Only necessary libraries and an optimized model are used.


## Setup
### Backend (Flask)
1. Install the required Python packages:
   ```bash
   pip install flask flask-cors pandas numpy neattext scikit-learn joblib
   ```
2. Make sure the file `backend/model/emotion_detection_pipeline_validated.pkl` exists.
3. Start the backend:
   ```bash
   cd backend
   python app.py
   ```
   By default, it runs at `http://127.0.0.1:5000`.

### Frontend
1. Open the `index.html` file in the project root directory in your browser.
2. The interface will automatically send requests to the backend. If needed, update the backend address in `script.js`.

## Usage
- Enter or select your username.
- Write your feelings in the text box and click the "Analyze" button.
- The result will be displayed on the screen with emoji and animations.
- You can view your analysis history and emotion ratios.

## Technologies
- **Backend:** Python, Flask, scikit-learn, joblib, neattext
- **Frontend:** HTML, CSS, JavaScript, GSAP, particles.js, animate.css
- **Model:** Logistic Regression/Naive Bayes-based emotion analysis model (pkl file)

## File Structure
```
hisApp/
  backend/
    app.py
    model/
      emotion_detection_pipeline_validated.pkl
      emotion_detection_pipeline_original.pkl
  index.html
  script.js
  styles.css
  logo.svg
  favicon.svg
```

## Usage Restrictions
**This project is not open for free use. If you wish to use, modify, or distribute any part of this project, you must contact the owner and obtain explicit permission first.**


---
**His - Discover Your Emotions!** 