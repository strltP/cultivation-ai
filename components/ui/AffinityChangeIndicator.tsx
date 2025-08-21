import React from 'react';
import { getAffinityLevel } from '../../services/affinityService';
import { FaArrowUp, FaArrowDown, FaHeart } from 'react-icons/fa';

interface AffinityChangeIndicatorProps {
  from: number;
  to: number;
}

const AffinityChangeIndicator: React.FC<AffinityChangeIndicatorProps> = ({ from, to }) => {
  const fromInfo = getAffinityLevel(from);
  const toInfo = getAffinityLevel(to);
  const change = to - from;
  const isIncrease = change > 0;

  return (
    <div className="absolute top-1/2 left-[calc(100%+1rem)] -translate-y-1/2 w-64 bg-gray-900/90 border-2 border-yellow-500/50 rounded-lg p-4 shadow-xl backdrop-blur-sm animate-slide-in-from-left z-30">
        <h4 className="text-lg font-bold text-center text-yellow-300 mb-3 flex items-center justify-center gap-2"><FaHeart /> Thiện Cảm Thay Đổi</h4>
        
        {/* From State */}
        <div className="flex items-center justify-between text-sm">
            <span className={`font-semibold ${fromInfo.color}`}>{fromInfo.level}</span>
            <span className="text-gray-300">{from}</span>
        </div>
        
        {/* Arrow and Change */}
        <div className="flex items-center justify-center my-2">
            <div className="w-full h-px bg-gray-600"></div>
            <div className={`flex items-center gap-1 mx-2 font-bold text-xl ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                {isIncrease ? <FaArrowUp /> : <FaArrowDown />}
                <span>{isIncrease ? '+' : ''}{change}</span>
            </div>
            <div className="w-full h-px bg-gray-600"></div>
        </div>
        
        {/* To State */}
        <div className="flex items-center justify-between text-sm">
            <span className={`font-semibold ${toInfo.color}`}>{toInfo.level}</span>
            <span className="text-gray-300">{to}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700/50 rounded-full h-2.5 mt-4">
            <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${toInfo.borderColorClass.replace('border-', 'bg-')}`}
                style={{ width: `${(to + 100) / 2}%` }}
            ></div>
        </div>
    </div>
  );
};

export default AffinityChangeIndicator;
