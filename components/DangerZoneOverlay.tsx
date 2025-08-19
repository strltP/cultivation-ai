import React from 'react';

interface DangerZoneOverlayProps {
  isActive: boolean;
}

const DangerZoneOverlay: React.FC<DangerZoneOverlayProps> = ({ isActive }) => {
  return <div className={`danger-zone-overlay ${isActive ? 'active' : ''}`}></div>;
};

export default DangerZoneOverlay;