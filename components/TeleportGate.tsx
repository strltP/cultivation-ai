import React from 'react';
import type { TeleportLocation, GameMap } from '../types/map';
import { GiPortal } from 'react-icons/gi';

interface TeleportGateProps {
  gate: TeleportLocation;
  allMaps: Record<string, GameMap>;
  onClick: () => void;
}

const TeleportGate: React.FC<TeleportGateProps> = ({ gate, allMaps, onClick }) => {
  const targetMapName = allMaps[gate.targetMap]?.name || 'một nơi vô định';

  return (
    <div
      className="absolute flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform duration-300"
      style={{
        left: `${gate.position.x}px`,
        top: `${gate.position.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={`Dịch chuyển tới ${targetMapName}`}
    >
      <GiPortal className="text-cyan-300 text-5xl animate-spin-slow" style={{ filter: 'drop-shadow(0 0 8px #06b6d4)'}} />
      <div className="absolute w-full h-full bg-purple-500/30 rounded-full animate-pulse blur-md"></div>
    </div>
  );
};

export default TeleportGate;