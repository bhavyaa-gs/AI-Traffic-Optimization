import React, { useState } from 'react';
import { Brain, Loader2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getAIPrediction } from '../services/aiService';

export default function AIPredictor() {
  const [location, setLocation] = useState('KR Puram, Bengaluru');
  const [density, setDensity] = useState(65);
  const [speed, setSpeed] = useState(25);
  const [weather, setWeather] = useState('Clear');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAIPrediction({
        density,
        speed,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location,
        weather
      });
      setPrediction(data);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-500/20 rounded-xl">
          <Brain className="text-orange-500" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Traffic Predictor</h2>
          <p className="text-zinc-400 text-sm">Predict congestion and risks using neural networks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Location</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Vehicle Density (%)</label>
              <input 
                type="number" 
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Avg Speed (km/h)</label>
              <input 
                type="number" 
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Weather Condition</label>
            <select 
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
            >
              <option>Clear</option>
              <option>Rainy</option>
              <option>Foggy</option>
              <option>Stormy</option>
            </select>
          </div>

          <button 
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Brain size={20} />}
            {loading ? 'Analyzing Data...' : 'Run AI Prediction'}
          </button>
        </div>

        <div className="space-y-6">
          {prediction ? (
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${
                  prediction.congestion === 'High' ? 'bg-red-500/20 text-red-500' :
                  prediction.congestion === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {prediction.congestion} Congestion
                </div>
                <h3 className="text-4xl font-black text-white mb-2">{prediction.predicted_speed} km/h</h3>
                <p className="text-zinc-500 text-sm">Predicted Average Speed</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase mb-2">
                    <AlertTriangle size={12} />
                    Accident Risk
                  </div>
                  <div className={`text-sm font-bold ${
                    prediction.accident_risk === 'Critical' ? 'text-red-500' :
                    prediction.accident_risk === 'Major' ? 'text-orange-500' :
                    'text-green-500'
                  }`}>
                    {prediction.accident_risk}
                  </div>
                </div>
                <div className="p-4 bg-black rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase mb-2">
                    <CheckCircle size={12} />
                    Confidence
                  </div>
                  <div className="text-sm font-bold text-white">
                    {(prediction.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-orange-500/5 rounded-xl border border-orange-500/20 flex items-start gap-3">
                <Clock className="text-orange-500 shrink-0" size={18} />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Prediction generated at {new Date(prediction.timestamp).toLocaleTimeString()}. 
                  This model considers historical patterns, real-time density, and environmental factors.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <Brain className="text-zinc-700" size={32} />
              </div>
              <h3 className="text-lg font-bold text-zinc-500 mb-2">No Prediction Data</h3>
              <p className="text-zinc-600 text-sm max-w-xs">
                Enter traffic parameters and run the analysis to see AI-driven congestion forecasts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
