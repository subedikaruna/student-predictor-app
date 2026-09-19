# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestClassifier

app = FastAPI(title="Student Result Predictor API")

# Allow your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you can restrict this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Train and Save Model (Runs only once when the server starts)
if not os.path.exists("model.pkl"):
    print("Training model for the first time...")
    df = pd.read_csv("student_multiple_binary_classification.csv")
    X = df[['StudyHours', 'Attendance', 'PreviousMarks']]
    y = df['Result']
    
    model = RandomForestClassifier(
        n_estimators=100, 
        criterion='entropy', 
        max_depth=3, 
        random_state=42
    )
    model.fit(X, y)
    joblib.dump(model, "model.pkl")
    print("Model saved as model.pkl!")

# 2. Load the trained model
model = joblib.load("model.pkl")

# 3. Define the data structure for incoming requests
class StudentData(BaseModel):
    StudyHours: float
    Attendance: float
    PreviousMarks: float

@app.get("/")
def read_root():
    return {"message": "Student Predictor API is running successfully!"}

@app.post("/predict")
def predict_result(data: StudentData):
    # Convert input to DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # Predict
    prediction = model.predict(input_df)[0]
    probabilities = model.predict_proba(input_df)[0]
    
    # Get the confidence of the predicted class
    confidence = max(probabilities) * 100
    
    return {
        "prediction": prediction,
        "confidence": round(confidence, 2)
    }