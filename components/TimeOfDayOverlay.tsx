import React from 'react';

interface TimeOfDayOverlayProps {
  gameHour: number;
}

const TimeOfDayOverlay: React.FC<TimeOfDayOverlayProps> = ({ gameHour }) => {
  const getOverlayStyle = (): React.CSSProperties => {
    let backgroundColor = 'rgba(0, 0, 0, 0)';
    let opacity = 0;

    if (gameHour >= 20 || gameHour < 5) { // Night (8 PM - 5 AM)
      backgroundColor = 'rgba(12, 28, 64, 0.4)'; // Deep blue
    } else if (gameHour >= 5 && gameHour < 7) { // Dawn (5 AM - 7 AM)
      const progress = (gameHour - 5) / 2; // 0 to 1
      const r = Math.round(255 * (1 - progress) + 40 * progress);
      const g = Math.round(165 * (1 - progress) + 180 * progress);
      const b = Math.round(0 * (1 - progress) + 255 * progress);
      opacity = 0.3 * (1 - progress);
      backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (gameHour >= 18 && gameHour < 20) { // Dusk (6 PM - 8 PM)
      const progress = (gameHour - 18) / 2; // 0 to 1
      const r = Math.round(255 * (1 - progress) + 12 * progress);
      const g = Math.round(140 * (1 - progress) + 28 * progress);
      const b = Math.round(0 * (1 - progress) + 64 * progress);
      opacity = 0.35 * progress;
      backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return {
      backgroundColor,
      transition: 'background-color 2s linear',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 10,
    };
  };

  return <div style={getOverlayStyle()}></div>;
};

export default TimeOfDayOverlay;
