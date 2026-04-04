import { GoogleGenAI, Type } from "@google/genai";
import { API_BASE_URL } from "./api";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function predictTraffic(data: {
  time: string;
  weather: string;
  density: number;
  roadConditions: string;
}) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Predict traffic congestion level (Low, Medium, High) based on:
      Time: ${data.time}
      Weather: ${data.weather}
      Vehicle Density: ${data.density}
      Road Conditions: ${data.roadConditions}
      Return only the congestion level.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          congestionLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          reason: { type: Type.STRING }
        },
        required: ["congestionLevel", "reason"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getAIPrediction(data: {
  density: number;
  speed: number;
  time: string;
  location: string;
  weather: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Prediction failed');
  return response.json();
}

export async function detectAccident(imageData: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: "Analyze this traffic camera frame. Detect if an accident has occurred. Return JSON with 'accidentDetected' (boolean), 'severity' (Minor, Major, Critical), and 'description'." },
        { inlineData: { mimeType: "image/jpeg", data: imageData } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          accidentDetected: { type: Type.BOOLEAN },
          severity: { type: Type.STRING, enum: ["Minor", "Major", "Critical"] },
          description: { type: Type.STRING }
        },
        required: ["accidentDetected", "severity", "description"]
      }
    }
  });

  return JSON.parse(response.text || "{}" );
}
