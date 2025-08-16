import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { PlayerState } from '../../types/character';
import type { PointOfInterest, GameMap, PointOfInterestType, MapArea, TeleportLocation, MapID } from '../../types/map';
import { FaUserCircle, FaCity, FaGopuram, FaHome, FaSkullCrossbones, FaLandmark, FaUniversity } from 'react-icons/fa';
import { GiPortal } from 'react-icons/gi';

interface WorldMapProps {
  allMaps: Record<string, GameMap>;
  playerState: PlayerState;
  onClose: () => void;
  currentPois: PointOfInterest[];
  currentMapAreas: MapArea[];
  currentTeleportGates: TeleportLocation[];
}

const POI_ICONS: Record<PointOfInterestType, React.ReactNode> = {
    village: <FaHome />,
    city: <FaCity />,
    sect: <FaGopuram />,
    dungeon: <FaSkullCrossbones />,
    landmark: <FaLandmark />,
    building: <FaUniversity />,
};

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

const WorldMap: React.FC<WorldMapProps> = ({ allMaps, playerState, onClose, currentPois, currentMapAreas, currentTeleportGates }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const currentMapData = allMaps[playerState.currentMap];

  const clampTransform = useCallback((t: {scale: number, x: number, y: number}) => {
      if (!mapContainerRef.current) return t;
      const { width: containerWidth, height: containerHeight } = mapContainerRef.current.getBoundingClientRect();
      const { width: mapWidth, height: mapHeight } = currentMapData.size;

      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, t.scale));
      const mapRenderedWidth = mapWidth * newScale;
      const mapRenderedHeight = mapHeight * newScale;

      const maxX = mapRenderedWidth > containerWidth ? 0 : (containerWidth - mapRenderedWidth) / 2;
      const minX = mapRenderedWidth > containerWidth ? containerWidth - mapRenderedWidth : (containerWidth - mapRenderedWidth) / 2;
      const newX = Math.max(minX, Math.min(maxX, t.x));

      const maxY = mapRenderedHeight > containerHeight ? 0 : (containerHeight - mapRenderedHeight) / 2;
      const minY = mapRenderedHeight > containerHeight ? containerHeight - mapRenderedHeight : (containerHeight - mapRenderedHeight) / 2;
      const newY = Math.max(minY, Math.min(maxY, t.y));

      return { scale: newScale, x: newX, y: newY };

  }, [currentMapData.size]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const { width: containerWidth, height: containerHeight } = mapContainerRef.current.getBoundingClientRect();
    const { width: mapWidth, height: mapHeight } = currentMapData.size;

    const scaleX = containerWidth / mapWidth;
    const scaleY = containerHeight / mapHeight;
    const initialScale = Math.min(scaleX, scaleY) * 0.9;
    
    setTransform(clampTransform({
      scale: initialScale,
      x: (containerWidth - (mapWidth * initialScale)) / 2,
      y: (containerHeight - (mapHeight * initialScale)) / 2
    }));
  }, [currentMapData.size, clampTransform]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!mapContainerRef.current) return;
    const { left, top } = mapContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const zoomFactor = 1.1;

    const newScale = e.deltaY < 0 ? transform.scale * zoomFactor : transform.scale / zoomFactor;
    
    const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
    const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
    
    setTransform(clampTransform({ scale: newScale, x: newX, y: newY }));
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }

  const handleMouseUp = () => {
    setIsPanning(false);
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const newX = e.clientX - panStartRef.current.x;
    const newY = e.clientY - panStartRef.current.y;
    setTransform(t => clampTransform({ ...t, x: newX, y: newY }));
  }

  // Clamping function to prevent font/icon sizes from becoming too large or small
  const getClampedSize = (base: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, base / transform.scale));
  };


  return (
    <div 
      className="absolute inset-0 bg-black/70 flex items-center justify-center z-40 animate-fade-in"
      onClick={onClose}
    >
      <div 
        ref={mapContainerRef}
        className="relative bg-gray-900/80 backdrop-blur-sm border-4 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 overflow-hidden cursor-grab"
        style={{ width: '90vw', height: '90vh' }}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl font-bold text-yellow-300 z-10 pointer-events-none" style={{ textShadow: '1px 1px 3px #000'}}>{currentMapData.name}</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10 cursor-pointer"
          aria-label="Đóng bản đồ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full h-full" style={{ cursor: isPanning ? 'grabbing' : 'grab' }}>
            <div style={{ 
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, 
                transformOrigin: '0 0',
                width: currentMapData.size.width,
                height: currentMapData.size.height,
            }}>
                <div className="absolute inset-0" style={{...currentMapData.backgroundStyle}}/>
                
                {currentMapAreas.map(area => (
                  <div key={area.id}
                      className="absolute border-2 rounded-lg pointer-events-none flex items-center justify-center"
                      style={{
                          ...area.style,
                          left: `${area.position.x - area.size.width / 2}px`,
                          top: `${area.position.y - area.size.height / 2}px`,
                          width: `${area.size.width}px`,
                          height: `${area.size.height}px`,
                      }}>
                      <span className="font-bold text-white bg-black/30 px-2 py-1 rounded"
                            style={{ fontSize: getClampedSize(32, 14, 160), textShadow: '1px 1px 3px black' }}>
                          {area.name}
                      </span>
                  </div>
                ))}
                
                {currentPois.map(poi => {
                  const iconSize = getClampedSize(24, 10, 120);
                  const fontSize = getClampedSize(16, 8, 80);
                  return (
                    <div key={poi.id} 
                        className="absolute flex items-center gap-2" 
                        style={{ left: poi.position.x, top: poi.position.y, transform: 'translate(-50%, -50%)' }}>
                      <div style={{fontSize: iconSize}} className="text-white">
                            {POI_ICONS[poi.type]}
                      </div>
                      <span className="text-white bg-black/50 px-2 py-1 rounded" style={{fontSize: fontSize, textShadow: '1px 1px 2px black'}}>{poi.name}</span>
                    </div>
                  )
                })}

                {currentTeleportGates.map(gate => {
                  const iconSize = getClampedSize(32, 14, 160);
                  const fontSize = getClampedSize(14, 7, 70);
                  return (
                    <div key={gate.id} 
                        className="absolute flex flex-col items-center gap-1 text-center" 
                        style={{ 
                            left: gate.position.x, 
                            top: gate.position.y, 
                            transform: 'translate(-50%, -50%)',
                            filter: 'drop-shadow(0 0 8px #06b6d4)' 
                        }}>
                      <div style={{fontSize: iconSize}} className="text-cyan-300 animate-spin-slow">
                            <GiPortal />
                      </div>
                      <span className="text-white bg-black/50 px-2 py-1 rounded" style={{fontSize: fontSize, textShadow: '1px 1px 2px black'}}>{gate.name}</span>
                    </div>
                  )
                })}
                
                <div className="absolute" style={{ left: playerState.position.x, top: playerState.position.y, transform: 'translate(-50%, -50%)' }}>
                    <FaUserCircle className="text-blue-300" size={getClampedSize(32, 14, 160)} style={{filter: 'drop-shadow(0 0 8px #60a5fa)'}} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
