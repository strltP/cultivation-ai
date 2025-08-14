
import React from 'react';
import type { PointOfInterest, PointOfInterestType } from '../types/map';
import { FaCity, FaGopuram, FaHome, FaSkullCrossbones, FaLandmark, FaUniversity } from 'react-icons/fa';

interface PointOfInterestProps {
  poi: PointOfInterest;
  onClick?: () => void;
}

const POI_STYLES: { [key in PointOfInterestType]: { icon: React.ReactNode; color: string; shadow: string } } = {
    village: { icon: <FaHome size={32}/>, color: 'text-green-300', shadow: 'drop-shadow(0 0 8px #4ade80)' },
    city: { icon: <FaCity size={40}/>, color: 'text-yellow-300', shadow: 'drop-shadow(0 0 10px #facc15)' },
    sect: { icon: <FaGopuram size={40}/>, color: 'text-blue-300', shadow: 'drop-shadow(0 0 10px #60a5fa)' },
    dungeon: { icon: <FaSkullCrossbones size={32}/>, color: 'text-red-400', shadow: 'drop-shadow(0 0 8px #f87171)' },
    landmark: { icon: <FaLandmark size={32}/>, color: 'text-gray-300', shadow: 'drop-shadow(0 0 8px #d1d5db)' },
    building: { icon: <FaUniversity size={32}/>, color: 'text-purple-300', shadow: 'drop-shadow(0 0 8px #c084fc)'},
    nation: { icon: <div/>, color: '', shadow: '' } // Nation is a MapArea, not rendered here.
};


const PointOfInterestComponent: React.FC<PointOfInterestProps> = ({ poi, onClick }) => {
    if (poi.type === 'nation') return null; // Do not render nations as POIs

    const style = POI_STYLES[poi.type];
    const isInteractive = !!(poi.targetMap && onClick);

    const baseClasses = "absolute flex flex-col items-center justify-center group";
    const interactiveClasses = isInteractive ? 'cursor-pointer transform transition-transform hover:scale-110' : 'pointer-events-none';


    return (
        <div
            className={`${baseClasses} ${interactiveClasses}`}
            style={{
                left: `${poi.position.x}px`,
                top: `${poi.position.y}px`,
                transform: 'translate(-50%, -50%)',
            }}
            title={poi.name}
            onClick={(e) => {
                if (!isInteractive) return;
                e.stopPropagation();
                onClick?.();
            }}
        >
             {/* Icon with shadow */}
            <div className={`${style.color}`} style={{ filter: style.shadow }}>
                {style.icon}
            </div>

            {/* Name Plate */}
            <div className="mt-2 px-3 py-1 bg-black/50 rounded-md shadow-lg backdrop-blur-sm">
                 <span className="font-bold text-lg text-white" style={{textShadow: '1px 1px 2px #000'}}>{poi.name}</span>
            </div>
           
            {/* Optional pulsing ring for interactive POIs */}
            {isInteractive && (
                <div className="absolute inset-0 w-full h-full rounded-full bg-yellow-400/20 animate-pulse -z-10 scale-150 group-hover:scale-200 transition-transform duration-300"></div>
            )}
        </div>
    );
};

export default PointOfInterestComponent;