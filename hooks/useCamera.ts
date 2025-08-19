


import { useState, useLayoutEffect, RefObject } from 'react';
import type { Position } from '../types/common';
import type { GameMap, PointOfInterest, MapArea } from '../types/map';

export const useCamera = (
    playerPosition: Position,
    currentMapData: GameMap,
    currentPois: PointOfInterest[],
    currentMapAreas: MapArea[],
    gameContainerRef: RefObject<HTMLDivElement>
) => {
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });
    const [currentZone, setCurrentZone] = useState<string | null>(null);
    const [currentArea, setCurrentArea] = useState<string | null>(null);
    const [dangerLevel, setDangerLevel] = useState<number | null>(null);

    useLayoutEffect(() => {
        if (!gameContainerRef.current) return;

        const { width: viewportWidth, height: viewportHeight } = gameContainerRef.current.getBoundingClientRect();
        const mapWidth = currentMapData.size.width;
        const mapHeight = currentMapData.size.height;
        
        let cameraX = -playerPosition.x + viewportWidth / 2;
        let cameraY = -playerPosition.y + viewportHeight / 2;

        cameraX = Math.min(0, Math.max(cameraX, viewportWidth - mapWidth));
        cameraY = Math.min(0, Math.max(cameraY, viewportHeight - mapHeight));
        
        setCameraPosition({ x: cameraX, y: cameraY });

        const zone = currentPois.find(poi => 
            playerPosition.x >= poi.position.x - poi.size.width / 2 &&
            playerPosition.x <= poi.position.x + poi.size.width / 2 &&
            playerPosition.y >= poi.position.y - poi.size.height / 2 &&
            playerPosition.y <= poi.position.y + poi.size.height / 2
        );
        setCurrentZone(zone ? zone.name : null);

        const area = currentMapAreas.find(area =>
            playerPosition.x >= area.position.x - area.size.width / 2 &&
            playerPosition.x <= area.position.x + area.size.width / 2 &&
            playerPosition.y >= area.position.y - area.size.height / 2 &&
            playerPosition.y <= area.position.y + area.size.height / 2
        );
        setCurrentArea(area ? area.name : null);

        // Prioritize POI danger level over area danger level
        setDangerLevel(zone?.dangerLevel ?? area?.dangerLevel ?? null);

    }, [playerPosition, currentMapData.size, currentPois, currentMapAreas, gameContainerRef]);

    return { cameraPosition, currentZone, currentArea, dangerLevel };
};