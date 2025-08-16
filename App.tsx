import React, { useEffect } from 'react';
import { GameProvider, useUI, useCombat, useInteraction, useWorld, usePlayerActions } from './hooks/useGameContext';
import { useCamera } from './hooks/useCamera';
import { useGameLoop } from './hooks/useGameLoop';
import type { PlayerState } from './types/character';
import { usePlayerPersistence, createNewPlayer, savePlayerState } from './hooks/usePlayerPersistence';
import type { LinhCan } from './types/linhcan';
import UIManager from './components/ui/UIManager';
import WorldRenderer from './components/world/WorldRenderer';
import CharacterCreation from './components/CharacterCreation';
import ChatPanel from './components/ui/ChatPanel';
import { useDebounce } from './hooks/useDebounce';


const App: React.FC = () => {
    const [playerState, setPlayerState] = usePlayerPersistence();
    const debouncedPlayerState = useDebounce(playerState, 500);

    useEffect(() => {
        if (debouncedPlayerState) {
            savePlayerState(debouncedPlayerState);
        }
    }, [debouncedPlayerState]);

    const handleCharacterCreate = (name: string, useRandomNames: boolean, linhCan: LinhCan[], gender: 'Nam' | 'Nữ') => {
        const newPlayer = createNewPlayer(name, useRandomNames, linhCan, gender);
        setPlayerState(newPlayer);
    };

    if (!playerState) {
        return <CharacterCreation onCharacterCreate={handleCharacterCreate} setPlayerState={setPlayerState} />;
    }
    
    // This is the single, authoritative function for updating state throughout the app.
    // It's passed down through the context provider.
    const updateAndPersistPlayerState = (updater: React.SetStateAction<PlayerState>) => {
        setPlayerState(updater as any);
    };

    return (
        <GameProvider 
            playerState={playerState} 
            updateAndPersistPlayerState={updateAndPersistPlayerState}
        >
            <GameWorld />
        </GameProvider>
    );
};


const GameWorld: React.FC = () => {
    const gameContainerRef = React.useRef<HTMLDivElement>(null);
    const playerRef = React.useRef<HTMLDivElement>(null);
    const [isGameOver, setIsGameOver] = React.useState(false);

    // --- CONTEXT HOOKS ---
    const { 
        playerState, 
        updateAndPersistPlayerState,
        isGameReady, 
        isGeneratingNames,
        allMaps,
        isMapOpen,
        isJournalOpen,
        plantingPlot,
        isAlchemyPanelOpen,
        isSeclusionPanelOpen,
    } = useUI(); // playerState is now from context
    const { combatState } = useCombat();
    const { isLoading, currentPois, currentNpcs, currentInteractables, currentTeleportGates, currentMapAreas } = useWorld();
    const { isMeditating } = usePlayerActions();
    const { 
        pendingInteraction, 
        chatTargetNpc, 
        chatHistory,
        isChatLoading,
        setTargetPosition,
        setActiveInteractionNpc,
        setActiveInteractionInteractable,
        handleGenericInteraction,
        processInteraction,
        handleGatherInteractable,
        handleTeleport,
        handleEnterPoi,
        handleSendMessage,
        handleCloseChat,
    } = useInteraction();
    
    // --- GAME OVER LOGIC ---
    React.useEffect(() => {
        if (!playerState || !playerState.stats.maxThoNguyen) return;

        const age = playerState.time.year - 1;
        if (age >= playerState.stats.maxThoNguyen) {
            setIsGameOver(true);
            updateAndPersistPlayerState(p => ({ ...p, targetPosition: p.position }));
        }
    }, [playerState?.time.year, playerState?.stats.maxThoNguyen, updateAndPersistPlayerState]);

    // --- GAME LOOP ---
    const isPaused = !isGameReady || isMapOpen || isJournalOpen || isLoading || !!combatState || isGameOver || !!chatTargetNpc || !!plantingPlot || isAlchemyPanelOpen || isSeclusionPanelOpen;
    useGameLoop(playerState!, updateAndPersistPlayerState, isPaused, isMeditating, pendingInteraction);
    
    // --- CAMERA ---
    const currentMapData = allMaps[playerState!.currentMap];
    const { cameraPosition, currentZone, currentArea } = useCamera(
        playerState!.position,
        currentMapData,
        currentPois,
        currentMapAreas,
        gameContainerRef
    );
    
    // --- EVENT HANDLERS ---
    const handleWorldClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isLoading || isMapOpen || isJournalOpen || !gameContainerRef.current || combatState || plantingPlot || isAlchemyPanelOpen || chatTargetNpc || isSeclusionPanelOpen) return;
        
        setActiveInteractionNpc(null);
        setActiveInteractionInteractable(null);

        const rect = gameContainerRef.current.getBoundingClientRect();
        const worldX = e.clientX - rect.left - cameraPosition.x;
        const worldY = e.clientY - rect.top - cameraPosition.y;

        const newTargetPosition = {
            x: Math.max(0, Math.min(currentMapData.size.width, worldX)),
            y: Math.max(0, Math.min(currentMapData.size.height, worldY)),
        };
        
        setTargetPosition(newTargetPosition);
    };

    if (!isGameReady || !playerState) {
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="w-16 h-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin"></div>
                <p className="ml-4 text-xl text-yellow-300">
                    {isGeneratingNames ? 'Thiên cơ tái lập, vạn vật đổi tên...' : 'Đang tải thế giới...'}
                </p>
            </div>
        );
    }

    return (
        <div ref={gameContainerRef} className={`relative w-full h-full overflow-hidden ${combatState || chatTargetNpc ? '' : 'bg-gray-900'}`}>
            {!combatState && !chatTargetNpc && (
                 <WorldRenderer
                    playerRef={playerRef}
                    currentMapData={currentMapData}
                    cameraPosition={cameraPosition}
                    playerState={playerState}
                    isMeditating={isMeditating}
                    currentPois={currentPois}
                    currentNpcs={currentNpcs}
                    currentInteractables={currentInteractables}
                    currentTeleportGates={currentTeleportGates}
                    allMaps={allMaps}
                    onWorldClick={handleWorldClick}
                    onGenericInteraction={handleGenericInteraction}
                    onProcessInteraction={processInteraction}
                    setActiveInteractionNpc={setActiveInteractionNpc}
                    setActiveInteractionInteractable={setActiveInteractionInteractable}
                    onGatherInteractable={handleGatherInteractable}
                    onTeleport={handleTeleport}
                    onEnterPoi={handleEnterPoi}
                />
            )}
            <UIManager
                playerState={playerState}
                currentMapData={currentMapData}
                currentArea={currentArea}
                currentZone={currentZone}
                cameraPosition={cameraPosition}
                allMaps={allMaps}
            />

             {chatTargetNpc && (
                <ChatPanel
                    npc={chatTargetNpc}
                    history={chatHistory}
                    isLoading={isChatLoading}
                    onSendMessage={handleSendMessage}
                    onClose={handleCloseChat}
                />
            )}

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
