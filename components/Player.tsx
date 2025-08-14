
import React, { forwardRef } from 'react';
import type { Position } from '../types/common';

interface PlayerProps {
  position: Position;
  isMeditating: boolean;
}

const Player = forwardRef<HTMLDivElement, PlayerProps>(({ position, isMeditating }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute w-8 h-8 bg-blue-400 rounded-full border-2 border-white player-shadow"
      style={{
        left: 0, // Position is now controlled by transform for better performance
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        transition: 'transform 100ms linear',
      }}
    >
      <div className="w-full h-full animate-pulse bg-white/30 rounded-full"></div>
      {isMeditating && (
        <div className="absolute inset-[-15px] rounded-full player-meditation-aura pointer-events-none"></div>
      )}
    </div>
  );
});

Player.displayName = 'Player';

export default Player;
