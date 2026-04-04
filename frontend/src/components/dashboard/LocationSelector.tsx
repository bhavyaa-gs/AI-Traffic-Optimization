import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface LocationSelectorProps {
  city: string;
  area: string;
  onCityChange: (city: string) => void;
  onAreaChange: (area: string) => void;
}

export default function LocationSelector({ city, area, onCityChange, onAreaChange }: LocationSelectorProps) {
  const areas = ['All Areas', 'KR Puram', 'MG Road', 'Whitefield', 'Electronic City', 'Indiranagar', 'Koramangala', 'HSR Layout', 'Hebbal'];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
          <MapPin size={18} />
        </div>
        <input 
          type="text" 
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="Enter City"
          className="bg-black border border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-white focus:border-orange-500 outline-none transition-all w-full md:w-64"
        />
      </div>

      <div className="relative group">
        <select 
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          className="appearance-none bg-black border border-zinc-800 rounded-2xl px-6 py-3 text-sm font-bold text-white focus:border-orange-500 outline-none transition-all w-full md:w-48 cursor-pointer"
        >
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
}
