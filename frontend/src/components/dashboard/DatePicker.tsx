import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const dates = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

  return (
    <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
      <button 
        onClick={() => onDateChange(subDays(selectedDate, 1))}
        className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all"
      >
        <ChevronLeft size={18} />
      </button>
      
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => onDateChange(date)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              isSameDay(date, selectedDate)
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {isSameDay(date, new Date()) ? 'Today' : format(date, 'MMM dd')}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onDateChange(addDays(selectedDate, 1))}
        className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
