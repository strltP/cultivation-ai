import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { MAPS, POIS_BY_MAP, TELEPORT_GATES_BY_MAP, MAP_AREAS_BY_MAP } from './mapdata';
import CharacterCreation from './components/CharacterCreation';
import { useGameState } from './hooks/useGameState';
import { useCamera } from './hooks/useCamera';
import { useGameLoop } from './hooks/useGameLoop';
import type { PlayerState } from './types/character';
import type { GameMap } from './types/map';
import { usePlayerPersistence, createNewPlayer } from './hooks/usePlayerPersistence';
import { generatePlaceNames, PlaceToName } from './services/geminiService';
import type { LinhCan } from './types/linhcan';
import UIManager from './components/ui/UIManager';
import WorldRenderer from './components/world/WorldRenderer';


const App: React.FC = () => {
    const [playerState, setPlayerState] = usePlayerPersistence();

    const handleCharacterCreate = (name: string, useRandomNames: boolean, linhCan: LinhCan[], gender: 'Nam' | 'Nữ') => {
        const newPlayer = createNewPlayer(name, useRandomNames, linhCan, gender);
        setPlayerState(newPlayer);
    };

    if (!playerState) {
        return <CharacterCreation onCharacterCreate={handleCharacterCreate} setPlayerState={setPlayerState} />;
    }

    return <Game key={playerState.name} playerState={playerState} setPlayerState={setPlayerState} />;
};


interface GameProps {
    playerState: PlayerState;
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
}

const Game: React.FC<GameProps> = ({ playerState: initialPlayerState, setPlayerState }) => {
    const [isGameReady, setIsGameReady] = useState(false);
    const [isGeneratingNames, setIsGeneratingNames] = useState(false);
    const [playerState, setInternalPlayerState] = useState(initialPlayerState);

    useEffect(() => {
        const initializeGame = async () => {
            if (playerState.useRandomNames && (!playerState.nameOverrides || Object.keys(playerState.nameOverrides).length === 0)) {
                setIsGeneratingNames(true);
                
                const placesToName: PlaceToName[] = [];
                Object.values(MAPS).forEach(map => placesToName.push({ id: map.id, type: 'Đại Lục', originalName: map.name }));
                Object.values(MAP_AREAS_BY_MAP).flat().forEach(area => placesToName.push({ id: area.id, type: 'Vùng Đất', originalName: area.name }));
                Object.values(POIS_BY_MAP).flat().forEach(poi => {
                    let type = 'Địa Điểm';
                    if (poi.type === 'city') type = 'Thành Thị';
                    if (poi.type === 'village') type = 'Thôn Làng';
                    if (poi.type === 'sect') type = 'Tông Môn';
                    if (poi.type === 'dungeon') type = 'Bí Cảnh';
                    placesToName.push({ id: poi.id, type, originalName: poi.name });
                });
                Object.values(TELEPORT_GATES_BY_MAP).flat().forEach(gate => placesToName.push({ id: gate.id, type: 'Trận Pháp', originalName: gate.name }));

                const overrides = await generatePlaceNames(placesToName);
                
                setInternalPlayerState(p => ({ ...p, nameOverrides: overrides }));
                setIsGeneratingNames(false);
            }
            setIsGameReady(true);
        };
        initializeGame();
    }, []);

    // This effect syncs the internal state with the persistent one from the parent
    useEffect(() => {
        setPlayerState(playerState);
    }, [playerState, setPlayerState]);


    if (!isGameReady) {
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="w-16 h-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin"></div>
                <p className="ml-4 text-xl text-yellow-300">
                    {isGeneratingNames ? 'Thiên cơ tái lập, vạn vật đổi tên...' : 'Đang tải thế giới...'}
                </p>
            </div>
        );
    }

    return <GameWorld playerState={playerState} setPlayerState={setInternalPlayerState} />;
};


interface GameWorldProps {
    playerState: PlayerState;
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
}

const GameWorld: React.FC<GameWorldProps> = ({ playerState, setPlayerState }) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        if (!playerState || !playerState.stats.maxThoNguyen) return;

        const age = playerState.time.year - 1;
        if (age >= playerState.stats.maxThoNguyen) {
            setIsGameOver(true);
            setPlayerState(p => ({ ...p, targetPosition: p.position }));
        }
    }, [playerState.time.year, playerState.stats.maxThoNguyen, setPlayerState]);

    const effectiveMaps = useMemo(() => {
        if (!playerState.nameOverrides) return MAPS;
        const newMaps = JSON.parse(JSON.stringify(MAPS));
        Object.keys(newMaps).forEach(mapId => {
            if (playerState.nameOverrides?.[mapId]) {
                newMaps[mapId].name = playerState.nameOverrides[mapId];
            }
        });
        return newMaps as Record<string, GameMap>;
    }, [playerState.nameOverrides]);

    const gameState = useGameState(playerState, setPlayerState as React.Dispatch<React.SetStateAction<PlayerState | null>>, { allMaps: effectiveMaps });
    
    useGameLoop(playerState, setPlayerState as React.Dispatch<React.SetStateAction<PlayerState>>, gameState.isMapOpen || gameState.isLoading || !!gameState.combatState || isGameOver || !!gameState.chatTargetNpc, gameState.isMeditating, gameState.pendingInteraction);
    
    const currentMapData = effectiveMaps[playerState.currentMap];

    const { cameraPosition, currentZone, currentArea } = useCamera(
        playerState.position,
        currentMapData,
        gameState.currentPois,
        gameState.currentMapAreas,
        gameContainerRef
    );

    const handleWorldClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (gameState.isLoading || gameState.isMapOpen || !gameContainerRef.current || gameState.combatState || gameState.plantingPlot || gameState.isAlchemyPanelOpen || gameState.chatTargetNpc) return;
        if (gameState.activeInteractionNpc) gameState.setActiveInteractionNpc(null);
        if (gameState.activeInteractionInteractable) gameState.setActiveInteractionInteractable(null);

        const rect = gameContainerRef.current.getBoundingClientRect();
        const worldX = e.clientX - rect.left - cameraPosition.x;
        const worldY = e.clientY - rect.top - cameraPosition.y;

        const newTargetPosition = {
            x: Math.max(0, Math.min(currentMapData.size.width, worldX)),
            y: Math.max(0, Math.min(currentMapData.size.height, worldY)),
        };

        gameState.setTargetPosition(newTargetPosition);
    };

    const handleToggleMap = useCallback(() => {
        if (!gameState.isMapOpen) {
            setPlayerState(p => ({ ...p, targetPosition: p.position }));
        }
        gameState.setIsMapOpen(prev => !prev);
    }, [gameState.isMapOpen, gameState.setIsMapOpen, setPlayerState]);
    
    const handleToggleInfoPanel = useCallback(() => gameState.setIsInfoPanelOpen(prev => !prev), [gameState.setIsInfoPanelOpen]);
    const handleToggleWorldInfoPanel = useCallback(() => gameState.setIsWorldInfoPanelOpen(prev => !prev), [gameState.setIsWorldInfoPanelOpen]);


    return (
        <div ref={gameContainerRef} className="relative w-full h-full overflow-hidden bg-gray-900">
            <WorldRenderer
                playerRef={playerRef}
                currentMapData={currentMapData}
                cameraPosition={cameraPosition}
                playerState={playerState}
                isMeditating={gameState.isMeditating}
                currentPois={gameState.currentPois}
                currentNpcs={gameState.currentNpcs}
                currentInteractables={gameState.currentInteractables}
                currentTeleportGates={gameState.currentTeleportGates}
                allMaps={effectiveMaps}
                onWorldClick={handleWorldClick}
                onGenericInteraction={gameState.handleGenericInteraction}
                onProcessInteraction={gameState.processInteraction}
                setActiveInteractionNpc={gameState.setActiveInteractionNpc}
                setActiveInteractionInteractable={gameState.setActiveInteractionInteractable}
                onGatherInteractable={gameState.handleGatherInteractable}
                onTeleport={gameState.handleTeleport}
                onEnterPoi={gameState.handleEnterPoi}
            />
            <UIManager
                playerState={playerState}
                setPlayerState={setPlayerState}
                gameState={gameState}
                currentMapData={currentMapData}
                currentArea={currentArea}
                currentZone={currentZone}
                cameraPosition={cameraPosition}
                allMaps={effectiveMaps}
                onToggleMap={handleToggleMap}
                onToggleInfoPanel={handleToggleInfoPanel}
                onToggleWorldInfoPanel={handleToggleWorldInfoPanel}
            />

            {isGameOver && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-fade-in text-center">
                    <h2 className="text-6xl font-serif font-bold text-gray-400 mb-4">Thọ Nguyên Đã Tận</h2>
                    <p className="text-2xl text-gray-300 mb-8">Hành trình tu tiên của đạo hữu đã đến hồi kết. Thân tử đạo tiêu, một kiếp luân hồi.</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('tu_tien_player_state_v3');
                            window.location.reload();
                        }}
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 font-bold py-3 px-8 rounded-lg shadow-lg text-xl transform transition-transform hover:scale-105"
                    >
                        Bắt Đầu Lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;