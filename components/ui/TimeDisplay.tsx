import React from 'react';
import type { GameTime } from '../../types/character';
import { FaSun, FaMoon } from 'react-icons/fa';

interface TimeDisplayProps {
  time: GameTime;
}

const CANH_GIO = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'
];

// Each Canh Gio is 2 hours long, starting from 23:00 (11 PM) for Tý
const getCanhGio = (hour: number) => {
    const adjustedHour = (hour + 1) % 24; // Shift so 23:00 becomes hour 0
    const index = Math.floor(adjustedHour / 2);
    return CANH_GIO[index];
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ time }) => {
  const { year, season, month, day, hour, minute } = time;

  const isDay = hour >= 6 && hour < 18;
  const rotation = ((hour * 60 + minute) / (24 * 60)) * 360;

  const paddedHour = String(hour).padStart(2, '0');
  const paddedMinute = String(minute).padStart(2, '0');
  const canhGio = getCanhGio(hour);

  return (
    <div
      className="absolute top-4 right-4 bg-gray-900/70 p-3 rounded-lg border border-yellow-400/30 shadow-lg backdrop-blur-sm flex items-center gap-4 z-20"
      title={`Năm ${year}, ${season}, Tháng ${month}, Ngày ${day} - ${paddedHour}:${paddedMinute}`}
    >
      <div className="relative w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
        {/* Sun/Moon Icons */}
        <FaSun className={`absolute text-yellow-300 transition-opacity duration-1000 ${isDay ? 'opacity-100' : 'opacity-0'}`} size={20} />
        <FaMoon className={`absolute text-blue-200 transition-opacity duration-1000 ${!isDay ? 'opacity-100' : 'opacity-0'}`} size={18} />
        
        {/* Rotating Hand */}
        <div 
          className="absolute w-full h-full"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 1s linear' }}
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-red-400 rounded-full"></div>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{paddedHour}:{paddedMinute}</span>
            <span className="text-base text-yellow-300">Giờ {canhGio}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
            {`${season} - Ngày ${day}, Tháng ${month}, Năm ${year}`}
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
