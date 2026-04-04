import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL } from '../services/api';

const socket = io(SOCKET_URL);

interface Accident {
  id: string;
  location: string;
  severity: 'Minor' | 'Major' | 'Critical';
  status: 'Detected' | 'Responding' | 'Resolved';
  timestamp: string;
}

export default function AccidentAlerts() {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Major' | 'Minor'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/accidents?city=Bengaluru`);
        if (!response.ok) throw new Error('Failed to fetch accidents');
        const data = await response.json();
        setAccidents(data);
      } catch (error) {
        console.error('Error fetching accidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccidents();

    const handleNewAccident = (newAccident: Accident) => {
      setAccidents((prev) => [newAccident, ...prev].slice(0, 20));
      
      // Browser Notification (Bonus)
      if (Notification.permission === 'granted' && (newAccident.severity === 'Critical' || newAccident.severity === 'Major')) {
        new Notification(`Traffic Alert: ${newAccident.severity} Incident`, {
          body: `Location: ${newAccident.location}`,
          icon: '/alert-icon.png'
        });
      }
    };

    socket.on('accident_alert', handleNewAccident);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('accident_alert', handleNewAccident);
    };
  }, []);

  const filteredAccidents = accidents.filter(a => filter === 'All' || a.severity === filter);

  return (
    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-orange-500" size={20} />
          <h3 className="text-xl font-semibold text-zinc-100">Incident Reports</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <Filter size={12} className="text-zinc-500 ml-2" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-transparent text-[10px] font-bold text-zinc-400 uppercase tracking-widest outline-none pr-2 py-1"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
          </div>
          <span className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-orange-500/20">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Live Feed
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-2">
            <Loader2 className="animate-spin" size={24} />
            <p className="text-xs font-bold uppercase tracking-widest">Syncing with Traffic Control...</p>
          </div>
        ) : filteredAccidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500 italic text-sm">
            No incidents reported in this category.
          </div>
        ) : (
          filteredAccidents.map((accident) => (
            <div key={accident.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 transition-all group relative overflow-hidden">
              <div className={`absolute left-0 top-0 w-1 h-full ${
                accident.severity === 'Critical' ? 'bg-red-500' :
                accident.severity === 'Major' ? 'bg-orange-500' :
                'bg-yellow-500'
              }`} />
              
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                  accident.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                  accident.severity === 'Major' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {accident.severity}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono font-bold">
                  {new Date(accident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="text-sm text-zinc-100 font-bold mb-3 group-hover:text-orange-500 transition-colors">
                {accident.location}, Bengaluru
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  {accident.status === 'Detected' && (
                    <div className="flex items-center gap-1.5 text-orange-500">
                      <Clock size={12} />
                      <span>Detected</span>
                    </div>
                  )}
                  {accident.status === 'Responding' && (
                    <div className="flex items-center gap-1.5 text-blue-500">
                      <Loader2 size={12} className="animate-spin" />
                      <span>Responding</span>
                    </div>
                  )}
                  {accident.status === 'Resolved' && (
                    <div className="flex items-center gap-1.5 text-green-500">
                      <CheckCircle size={12} />
                      <span>Resolved</span>
                    </div>
                  )}
                </div>
                
                <button className="text-[10px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-widest underline underline-offset-4">
                  View on Map
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

