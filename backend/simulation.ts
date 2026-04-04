import { Server } from "socket.io";

const BENGALURU_LOCATIONS = [
  "KR Puram", "MG Road", "Whitefield", "Electronic City", "Indiranagar",
  "Koramangala", "HSR Layout", "Hebbal", "Richmond Circle", "Silk Board"
];

export function startTrafficSimulation(io: Server) {
  // Real-time traffic simulation (Bangalore, India)
  setInterval(() => {
    const density = Math.floor(Math.random() * 100);
    const speed = Math.floor(Math.random() * 100);

    const trafficUpdate = {
      id: Math.random().toString(36).substr(2, 9),
      location: {
        lat: 12.9716 + (Math.random() - 0.5) * 0.05,
        lng: 77.5946 + (Math.random() - 0.5) * 0.05,
      },
      density,
      speed,
      congestionLevel: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      accidentRisk: density > 85 ? "Critical" : (density > 60 ? "Major" : "Minor"),
      timestamp: new Date().toISOString(),
    };
    io.emit("traffic_update", trafficUpdate);

    // AI-Based Accident Simulation Logic
    const accidentProbability = (density > 85 || speed < 15) ? 0.3 : 0.05;
    
    if (Math.random() < accidentProbability) {
      const accidentAlert = {
        id: Math.random().toString(36).substr(2, 9),
        location: BENGALURU_LOCATIONS[Math.floor(Math.random() * BENGALURU_LOCATIONS.length)],
        severity: density > 90 ? "Critical" : (density > 70 ? "Major" : "Minor"),
        status: "Detected",
        timestamp: new Date().toISOString(),
        coordinates: {
          lat: 12.9716 + (Math.random() - 0.5) * 0.05,
          lng: 77.5946 + (Math.random() - 0.5) * 0.05,
        }
      };
      io.emit("accident_alert", accidentAlert);
    }
  }, 5000);
}
