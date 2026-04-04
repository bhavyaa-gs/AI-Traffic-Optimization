import { Router } from "express";

const router = Router();

const BENGALURU_LOCATIONS = [
  "KR Puram", "MG Road", "Whitefield", "Electronic City", "Indiranagar",
  "Koramangala", "HSR Layout", "Hebbal", "Richmond Circle", "Silk Board"
];

// Health Check
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Accident Logs
router.get("/accidents", (req, res) => {
  const initialAccidents = Array.from({ length: 5 }, (_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    location: BENGALURU_LOCATIONS[Math.floor(Math.random() * BENGALURU_LOCATIONS.length)],
    severity: ["Minor", "Major", "Critical"][Math.floor(Math.random() * 3)],
    status: ["Detected", "Responding", "Resolved"][Math.floor(Math.random() * 3)],
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 2).toISOString(),
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json(initialAccidents);
});

// AI Predictor Endpoint
router.post("/predict", (req, res) => {
  const { density, speed, time, location, weather } = req.body;
  
  // AI Logic Simulation
  let congestion = "Low";
  if (density > 75 || speed < 20) congestion = "High";
  else if (density > 40 || speed < 40) congestion = "Medium";
  
  const baseSpeed = 60;
  const densityFactor = 0.5;
  const predictedSpeed = Math.max(5, Math.round(baseSpeed - (density * densityFactor) + (Math.random() * 5 - 2.5)));
  
  let accidentRisk = "Minor";
  const hour = parseInt(time.split(":")[0]);
  const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
  
  if (density > 85 && speed < 15) accidentRisk = "Critical";
  else if (density > 60 || isPeakHour || weather === "Rainy") accidentRisk = "Major";
  
  const confidence = 0.85 + (Math.random() * 0.1);

  res.json({
    congestion,
    predicted_speed: predictedSpeed,
    accident_risk: accidentRisk,
    confidence: parseFloat(confidence.toFixed(2)),
    timestamp: new Date().toISOString()
  });
});

// Traffic Analytics
router.get("/traffic-data", (req, res) => {
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    
    let baseDensity = 20 + Math.random() * 20;
    if (hour >= 8 && hour <= 10) baseDensity = 70 + Math.random() * 20;
    else if (hour >= 17 && hour <= 20) baseDensity = 75 + Math.random() * 25;
    else if (hour >= 23 || hour <= 5) baseDensity = 5 + Math.random() * 10;
    
    const density = Math.min(100, Math.max(0, Math.round(baseDensity)));
    const maxSpeed = 60;
    const speed = Math.max(10, Math.round(maxSpeed - (density * 0.5) + (Math.random() * 10 - 5)));
    
    return { time, density, speed };
  });

  res.json(hourlyData);
});

export default router;
