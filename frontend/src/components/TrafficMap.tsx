import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { Navigation, MapPin, Search, Loader2, ChevronRight, Info, Clock, Route as RouteIcon, X, AlertCircle } from 'lucide-react';
import { getCoordinates, getRoute, RouteData, formatDistance, formatDuration } from '../services/routingService';
import { SOCKET_URL } from '../services/api';
import { Circle } from 'react-leaflet';

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const StartIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const EndIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

L.Marker.prototype.options.icon = DefaultIcon;

const socket = io(SOCKET_URL);

interface TrafficPoint {
  id: string;
  location: { lat: number; lng: number };
  density: number;
  speed: number;
  congestionLevel: string;
  accidentRisk: 'Minor' | 'Major' | 'Critical';
  timestamp: string;
}

// Component to handle map bounds
function MapBoundsHandler({ routes }: { routes: (RouteData | null)[] }) {
  const map = useMap();
  useEffect(() => {
    const validRoutes = routes.filter(r => r && r.coordinates.length > 0);
    if (validRoutes.length > 0) {
      const allCoords = validRoutes.flatMap(r => r!.coordinates);
      const bounds = L.latLngBounds(allCoords as L.LatLngExpression[]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, map]);
  return null;
}

export default function TrafficMap() {
  const [trafficPoints, setTrafficPoints] = useState<TrafficPoint[]>([]);
  const [startQuery, setStartQuery] = useState('Bangalore Railway Station');
  const [endQuery, setEndQuery] = useState('MG Road, Bangalore');
  const [fastestRoute, setFastestRoute] = useState<RouteData | null>(null);
  const [shortestRoute, setShortestRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showRiskZones, setShowRiskZones] = useState(true);
  
  const center: [number, number] = [12.9716, 77.5946]; // Bangalore

  useEffect(() => {
    socket.on('traffic_update', (data: TrafficPoint) => {
      setTrafficPoints((prev) => [...prev.slice(-20), data]);
    });
    return () => {
      socket.off('traffic_update');
    };
  }, []);

  const handleFindRoute = async () => {
    setLoading(true);
    setError(null);
    setFastestRoute(null);
    setShortestRoute(null);

    try {
      const startCoords = await getCoordinates(startQuery);
      const endCoords = await getCoordinates(endQuery);

      if (!startCoords || !endCoords) {
        setError('Invalid location. Please ensure the locations are within Bengaluru city limits.');
        setLoading(false);
        return;
      }

      // Fetch routes in parallel
      const [fastest, shortest] = await Promise.all([
        getRoute([startCoords[0], startCoords[1]], [endCoords[0], endCoords[1]]),
        getRoute([startCoords[0], startCoords[1]], [endCoords[0], endCoords[1]])
      ]);

      if (fastest) setFastestRoute(fastest);
      if (shortest) setShortestRoute(shortest);

      if (!fastest && !shortest) {
        setError('No valid route found within Bengaluru. Please try different locations.');
      }
    } catch (err) {
      setError('An error occurred while calculating the route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-[650px] w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col md:flex-row">
      {/* Sidebar Overlay (Desktop) / Bottom Sheet (Mobile) */}
      <div className={`z-[1000] bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800 transition-all duration-500 flex flex-col ${
        showDirections ? 'w-full md:w-96' : 'w-full md:w-80'
      }`}>
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Navigation className="text-orange-500" size={20} />
              <h3 className="font-black text-sm uppercase tracking-[0.2em]">Route Optimizer</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowRiskZones(!showRiskZones)}
                className={`p-1.5 rounded-lg border transition-all ${showRiskZones ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                title="Toggle Risk Zones"
              >
                <AlertCircle size={16} />
              </button>
              {loading && <Loader2 className="animate-spin text-orange-500" size={18} />}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Source</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={14} />
                <input 
                  type="text" 
                  value={startQuery}
                  onChange={(e) => setStartQuery(e.target.value)}
                  placeholder="e.g. Bangalore Railway Station"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-xs text-zinc-100 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={14} />
                <input 
                  type="text" 
                  value={endQuery}
                  onChange={(e) => setEndQuery(e.target.value)}
                  placeholder="e.g. MG Road, Bangalore"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-xs text-zinc-100 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleFindRoute}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-600/20"
            >
              {loading ? 'Calculating...' : 'Optimize Route'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <Info size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Directions Panel */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {fastestRoute && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Route Details</h4>
                <button 
                  onClick={() => setShowDirections(!showDirections)}
                  className="text-[10px] font-bold text-orange-500 uppercase hover:underline"
                >
                  {showDirections ? 'Hide Steps' : 'View Steps'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Fastest</span>
                  </div>
                  <p className="text-lg font-black text-green-500">{formatDuration(fastestRoute.duration)}</p>
                  <p className="text-[10px] text-zinc-500">{formatDistance(fastestRoute.distance)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <RouteIcon size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Shortest</span>
                  </div>
                  <p className="text-lg font-black text-blue-500">
                    {shortestRoute ? formatDistance(shortestRoute.distance) : 'N/A'}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {shortestRoute ? formatDuration(shortestRoute.duration) : ''}
                  </p>
                </div>
              </div>

              {showDirections && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  {fastestRoute.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                          {idx + 1}
                        </div>
                        {idx < fastestRoute.steps.length - 1 && (
                          <div className="w-px h-full bg-zinc-800 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-zinc-200 font-medium leading-snug mb-1">{step.instruction}</p>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          <span>{step.name}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700" />
                          <span>{formatDistance(step.distance)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapBoundsHandler routes={[fastestRoute, shortestRoute]} />

          {/* Draw Routes */}
          {fastestRoute && (
            <Polyline 
              positions={fastestRoute.coordinates as L.LatLngExpression[]} 
              color="#22c55e" 
              weight={6} 
              opacity={0.8}
            >
              <Popup>Fastest Path: {formatDuration(fastestRoute.duration)}</Popup>
            </Polyline>
          )}

          {shortestRoute && (
            <Polyline 
              positions={shortestRoute.coordinates as L.LatLngExpression[]} 
              color="#3b82f6" 
              weight={4} 
              opacity={0.6}
              dashArray="10, 10"
            >
              <Popup>Shortest Path: {formatDistance(shortestRoute.distance)}</Popup>
            </Polyline>
          )}

          {/* Start/End Markers */}
          {fastestRoute && (
            <>
              <Marker position={fastestRoute.coordinates[0] as L.LatLngExpression} icon={StartIcon}>
                <Popup>Start: {startQuery}</Popup>
              </Marker>
              <Marker position={fastestRoute.coordinates[fastestRoute.coordinates.length - 1] as L.LatLngExpression} icon={EndIcon}>
                <Popup>End: {endQuery}</Popup>
              </Marker>
            </>
          )}

          {/* Risk Zones */}
          {showRiskZones && trafficPoints.map((point) => (
            point.accidentRisk !== 'Minor' && (
              <Circle 
                key={`risk-${point.id}`}
                center={[point.location.lat, point.location.lng]}
                radius={point.accidentRisk === 'Critical' ? 1000 : 500}
                pathOptions={{ 
                  color: point.accidentRisk === 'Critical' ? '#ef4444' : '#f97316',
                  fillColor: point.accidentRisk === 'Critical' ? '#ef4444' : '#f97316',
                  fillOpacity: 0.2,
                  weight: 1
                }}
              />
            )
          ))}

          {/* Traffic Points */}
          {trafficPoints.map((point) => (
            <Marker key={point.id} position={[point.location.lat, point.location.lng]}>
              <Popup>
                <div className="p-3 min-w-[180px] bg-zinc-950 text-zinc-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
                    <div className={`w-2 h-2 rounded-full ${point.congestionLevel === 'High' ? 'bg-red-500' : point.congestionLevel === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <h3 className="font-black text-xs uppercase tracking-widest">AI Traffic Node</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Congestion</span>
                      <span className={point.congestionLevel === 'High' ? 'text-red-500' : point.congestionLevel === 'Medium' ? 'text-orange-500' : 'text-green-500'}>{point.congestionLevel}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Accident Risk</span>
                      <span className={point.accidentRisk === 'Critical' ? 'text-red-500' : point.accidentRisk === 'Major' ? 'text-orange-500' : 'text-yellow-500'}>{point.accidentRisk}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Speed</span>
                      <span className="text-zinc-100">{point.speed} km/h</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Density</span>
                      <span className="text-zinc-100">{point.density} v/km</span>
                    </div>
                  </div>
                  <p className="text-[8px] text-zinc-600 mt-3 font-mono text-right">{new Date(point.timestamp).toLocaleTimeString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

