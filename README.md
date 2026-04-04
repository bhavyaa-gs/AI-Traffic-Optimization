# SmartTraffic-AI 🚦

SmartTraffic-AI is a cutting-edge, real-time traffic optimization and monitoring system. It leverages AI to predict congestion, detect incidents, and provide actionable insights for urban traffic management.

## 🌟 Features

- **Live Traffic Map**: Interactive visualization of traffic density and vehicle flow using `react-leaflet`.
- **AI Traffic Predictor**: Neural network-based forecasting for congestion levels, average speeds, and accident risks.
- **Real-time Analytics**: Comprehensive dashboards featuring speed trends, vehicle volume, and incident history using `recharts`.
- **Incident Management**: Automated accident detection and reporting system.
- **Role-Based Access Control (RBAC)**:
  - **Admins**: Full system control, simulation management, and access to administrative tools.
  - **Users**: View-only access to maps, analytics, and alerts.
- **Real-time Synchronization**: Powered by Firebase Firestore and Socket.IO for instantaneous data updates.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion (Motion).
- **Backend**: Node.js, Express, Socket.IO.
- **Database & Auth**: Firebase (Firestore & Authentication).
- **AI/ML**: Google Gemini API (`@google/genai`) for intelligent insights and predictions.
- **Maps**: Leaflet & React Leaflet.
- **Charts**: Recharts.

## 🚀 Deployment

### Backend (Render)
1.  Create a new Web Service on Render.
2.  Connect your repository.
3.  Set **Root Directory** to `backend` (or keep as root and set build/start commands).
4.  **Build Command**: `npm install`
5.  **Start Command**: `node index.ts` (Note: Render supports TS stripping or use `tsx index.ts`).
6.  Add Environment Variables:
    *   `GEMINI_API_KEY`: Your Google Gemini API key.
    *   `NODE_ENV`: `production`

### Frontend (Vercel)
1.  Create a new Project on Vercel.
2.  Connect your repository.
3.  Set **Root Directory** to `frontend`.
4.  **Build Command**: `npm run build` (Ensure the root `package.json` is accessible or move `package.json` to `frontend/`).
5.  **Output Directory**: `dist`
6.  Add Environment Variables:
    *   `VITE_API_URL`: The URL of your Render backend (e.g., `https://your-app.onrender.com`).
    *   `VITE_GEMINI_API_KEY`: Your Google Gemini API key.

## 🛡️ Security & Permissions

The application uses Firebase Security Rules to protect data:
- **Users** can read traffic and accident data but cannot modify it.
- **Admins** have full write permissions for system-critical collections.
- **PII Protection**: User profiles are strictly scoped to the document owner.

## 📁 Project Structure

- `src/components/`: Reusable UI components (Map, Dashboard, Predictor, etc.).
- `src/services/`: API and Firebase service logic.
- `server.ts`: Express server with Socket.IO integration.
- `firestore.rules`: Security definitions for the database.
- `firebase-blueprint.json`: Data structure definitions.

## 📝 License

This project is licensed under the MIT License.
