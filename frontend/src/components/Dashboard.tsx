import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2, Activity, History } from 'lucide-react';
import LocationSelector from './dashboard/LocationSelector';
import DatePicker from './dashboard/DatePicker';
import TrafficChart from './dashboard/TrafficChart';
import SpeedChart from './dashboard/SpeedChart';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL } from '../services/api';

const socket = io(SOCKET_URL);

export default function Dashboard() {
  const [city, setCity] = useState('Bengaluru, Karnataka, India');
  const [area, setArea] = useState('All Areas');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLive, setIsLive] = useState(false);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrafficData = async () => {
    if (isLive) return;
    
    setLoading(true);
    setError(null);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`${API_BASE_URL}/api/traffic-data?city=${encodeURIComponent(city)}&date=${formattedDate}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setTrafficData(data);
    } catch (err) {
      setError('No data available for selected date/location');
      setTrafficData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, [city, area, selectedDate, isLive]);

  useEffect(() => {
    if (isLive) {
      const handleUpdate = (update: any) => {
        setTrafficData((prev) => {
          const newPoint = {
            time: format(new Date(update.timestamp), 'HH:mm:ss'),
            density: update.density,
            speed: update.speed
          };
          return [...prev.slice(-19), newPoint];
        });
      };
      
      socket.on('traffic_update', handleUpdate);
      return () => {
        socket.off('traffic_update', handleUpdate);
      };
    }
  }, [isLive]);

  return (
    <div className="p-6 space-y-8">
      {/* Dashboard Header & Controls */}
      <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter">Traffic Analytics</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Location: <span className="text-orange-500">{city}</span> {area !== 'All Areas' && `| Area: ${area}`} | Date: {format(selectedDate, 'dd MMMM yyyy')} ({format(selectedDate, 'EEEE')})
            </p>
          </div>

          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setIsLive(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                !isLive ? 'bg-zinc-800 text-zinc-100 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <History size={14} />
              Historical
            </button>
            <button
              onClick={() => setIsLive(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                isLive ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Activity size={14} className={isLive ? 'animate-pulse' : ''} />
              Live Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-zinc-800/50">
          <div className="lg:col-span-2">
            <LocationSelector 
              city={city} 
              area={area} 
              onCityChange={setCity} 
              onAreaChange={setArea} 
            />
          </div>
          <DatePicker 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-50" />
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-zinc-100 uppercase tracking-tight">Traffic Density Trend</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hourly variation (0-24h)</p>
            </div>
            {loading && <Loader2 className="animate-spin text-orange-500" size={18} />}
          </div>
          
          {error ? (
            <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm italic">
              {error}
            </div>
          ) : (
            <TrafficChart data={trafficData} />
          )}
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-50" />
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-zinc-100 uppercase tracking-tight">Average Speed (km/h)</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Real-time velocity metrics</p>
            </div>
            {loading && <Loader2 className="animate-spin text-green-500" size={18} />}
          </div>

          {error ? (
            <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm italic">
              {error}
            </div>
          ) : (
            <SpeedChart data={trafficData} />
          )}
        </div>
      </div>
    </div>
  );
}

