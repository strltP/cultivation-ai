import React, { useEffect, useState, useRef } from 'react';
import { GameProvider, useUI, useCombat, useInteraction, useWorld, usePlayerActions } from './hooks/useGameContext';
import { useCamera } from './hooks/useCamera';
import { useGameLoop } from './hooks/useGameLoop';
import type { PlayerState } from './types/character';
import { usePlayerPersistence, createNewPlayer, savePlayerState, initializeNewWorld } from './hooks/usePlayerPersistence';
import type { LinhCan } from './types/linhcan';
import UIManager from './components/ui/UIManager';
import WorldRenderer from './components/world/WorldRenderer';
import CharacterCreation from './components/CharacterCreation';
import ChatPanel from './components/ui/ChatPanel';
import { useDebounce } from './hooks/useDebounce';
import DangerZoneOverlay from './components/DangerZoneOverlay';
import { advanceTime } from './services/timeService';


const App: React.FC = () => {
    const [playerState, setPlayerState] = usePlayerPersistence();
    const debouncedPlayerState = useDebounce(playerState, 2000);

    useEffect(() => {
        if (debouncedPlayerState) {
            savePlayerState(debouncedPlayerState);
        }
    }, [debouncedPlayerState]);

    const handleCharacterCreate = async (name: string, linhCan: LinhCan[], gender: 'Nam' | 'Nữ') => {
        const newPlayer = createNewPlayer(name, linhCan, gender);
        const initializedPlayer = await initializeNewWorld(newPlayer);
        setPlayerState(initializedPlayer);
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
    const [gameOverReason, setGameOverReason] = React.useState<'age' | 'hp' | null>(null);
    const [isInDangerZone, setIsInDangerZone] = useState(false);
    const environmentalDamageInterval = useRef<number | null>(null);
    const hpDrainInterval = useRef<number | null>(null);
    const prevPlayerStateRef = useRef<PlayerState | null>(null);


    // --- CONTEXT HOOKS ---
    const { 
        playerState, 
        updateAndPersistPlayerState,
        isGameReady, 
        allMaps,
        isMapOpen,
        isJournalOpen,
        plantingPlot,
        isAlchemyPanelOpen,
        isSeclusionPanelOpen,
    } = useUI(); // playerState is now from context
    const { combatState } = useCombat();
    const { isLoading, currentPois, currentNpcs, currentInteractables, currentTeleportGates, currentMapAreas, setGameMessage } = useWorld();
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
    
    // --- CAMERA & DANGER ZONE ---
    const currentMapData = allMaps[playerState!.currentMap];
    const { cameraPosition, currentZone, currentArea, currentMapArea, dangerLevel } = useCamera(
        playerState!.position,
        currentMapData,
        currentPois,
        currentMapAreas,
        gameContainerRef
    );

    // --- GAME LOOP ---
    const isPaused = !isGameReady || isMapOpen || isJournalOpen || isLoading || !!combatState || isGameOver || !!chatTargetNpc || !!plantingPlot || isAlchemyPanelOpen || isSeclusionPanelOpen;
    useGameLoop(playerState!, updateAndPersistPlayerState, isPaused, isMeditating, pendingInteraction, currentMapArea);
    
    // --- GAME OVER LOGIC ---
    React.useEffect(() => {
        if (!playerState) return;
        let shouldEndGame = false;
        let reason: 'age' | 'hp' | null = null;

        if (playerState.stats.maxThoNguyen && playerState.time.year - 1 >= playerState.stats.maxThoNguyen) {
            shouldEndGame = true;
            reason = 'age';
        } else if (playerState.hp <= 0) {
            shouldEndGame = true;
            reason = 'hp';
        }

        if (shouldEndGame && !isGameOver) {
            setIsGameOver(true);
            setGameOverReason(reason);
            updateAndPersistPlayerState(p => ({ ...p, targetPosition: p.position }));
        }
    }, [playerState, isGameOver, updateAndPersistPlayerState]);
    
     // --- Special Effects Logic (Mana Depletion Message, etc.) ---
    useEffect(() => {
        if (prevPlayerStateRef.current) {
            const wasMoving = prevPlayerStateRef.current.position.x !== prevPlayerStateRef.current.targetPosition.x || prevPlayerStateRef.current.position.y !== prevPlayerStateRef.current.targetPosition.y;
            if (currentMapArea?.depletesMana && playerState.mana === 0 && prevPlayerStateRef.current.mana > 0 && wasMoving) {
                setGameMessage("Linh lực cạn kiệt, không thể tiếp tục phi hành!");
            }
        }
        prevPlayerStateRef.current = playerState;
    }, [playerState.mana, playerState.position, playerState.targetPosition, currentMapArea, setGameMessage]);


    // --- DANGER ZONE EFFECTS LOGIC ---
    useEffect(() => {
        const playerRealm = playerState.cultivation.realmIndex;
        const isUnderleveled = dangerLevel !== null && playerRealm < dangerLevel;

        setIsInDangerZone(isUnderleveled);

        // Clear previous interval
        if (environmentalDamageInterval.current) {
            clearInterval(environmentalDamageInterval.current);
            environmentalDamageInterval.current = null;
        }
        
        const hasDebuff = playerState.activeEffects.some(e => e.type === 'ENVIRONMENTAL_DEBUFF');

        if (isUnderleveled) {
             if (!hasDebuff) {
                updateAndPersistPlayerState(p => ({
                    ...p,
                    activeEffects: [...p.activeEffects, { type: 'ENVIRONMENTAL_DEBUFF', duration: Infinity, value: 0, sourceSkillId: 'world' }]
                }));
            }

            environmentalDamageInterval.current = window.setInterval(() => {
                let messageShown = false;
                updateAndPersistPlayerState(p => {
                    if (p.hp <= 0) return p;

                    let newMana = p.mana;
                    let newHp = p.hp;

                    // Damage Mana first, then HP
                    if (newMana > 0) {
                        const manaDamage = Math.max(1, Math.floor(p.stats.maxMana * 0.02)); // 2% max mana damage
                        newMana = Math.max(0, p.mana - manaDamage);
                    } else {
                        const hpDamage = Math.max(1, Math.floor(p.stats.maxHp * 0.01)); // 1% max hp damage
                        newHp = Math.max(0, p.hp - hpDamage);
                    }
                    
                    if (!messageShown) {
                         setGameMessage(`Linh khí cuồng bạo ở ${currentZone || currentArea} đang ăn mòn cơ thể bạn!`);
                         messageShown = true;
                    }

                    return { ...p, hp: newHp, mana: newMana };
                });
            }, 4000); // Damage every 4 seconds

        } else {
            if (hasDebuff) {
                 updateAndPersistPlayerState(p => ({
                    ...p,
                    activeEffects: p.activeEffects.filter(e => e.type !== 'ENVIRONMENTAL_DEBUFF')
                }));
            }
        }

        // Cleanup function for when component unmounts or dependencies change
        return () => {
            if (environmentalDamageInterval.current) {
                clearInterval(environmentalDamageInterval.current);
                environmentalDamageInterval.current = null;
            }
        };

    }, [dangerLevel, playerState.cultivation.realmIndex, playerState.activeEffects, updateAndPersistPlayerState, currentArea, currentZone, setGameMessage]);

    // --- Stranded at Sea HP Drain Logic ---
    useEffect(() => {
        // If not in a mana drain area, or have mana, or are already dead, stop the drain.
        // This effect runs independently of 'isPaused' to ensure the penalty applies even with menus open.
        if (!currentMapArea?.depletesMana || playerState.mana > 0 || playerState.hp <= 0) {
            if (hpDrainInterval.current) {
                clearInterval(hpDrainInterval.current);
                hpDrainInterval.current = null;
            }
            return;
        }
    
        // This condition means we are stranded at sea with 0 mana.
        if (!hpDrainInterval.current) {
            hpDrainInterval.current = window.setInterval(() => {
                let messageShown = false;
                updateAndPersistPlayerState(p => {
                    if (p.hp <= 0) {
                         if (hpDrainInterval.current) clearInterval(hpDrainInterval.current);
                         hpDrainInterval.current = null;
                         return p;
                    }
                    
                    // Increase HP drain rate to 5% max HP.
                    const hpDamage = Math.max(1, Math.floor(p.stats.maxHp * 0.05)); 
                    const newHp = Math.max(0, p.hp - hpDamage);
                    
                    // Advance time by 1 hour each tick.
                    const newTime = advanceTime(p.time, 60);

                    if (!messageShown) {
                        setGameMessage(`Bị mắc kẹt trên biển, sinh lực đang bị ăn mòn!`);
                        messageShown = true;
                    }

                    return { ...p, hp: newHp, time: newTime };
                });
            }, 500); // Damage every 0.5 seconds (faster than before).
        }
    
        // Cleanup interval on component unmount or if conditions change.
        return () => {
            if (hpDrainInterval.current) {
                clearInterval(hpDrainInterval.current);
                hpDrainInterval.current = null;
            }
        };
    }, [currentMapArea?.depletesMana, playerState.mana, playerState.hp, updateAndPersistPlayerState, setGameMessage]);

    
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
                    Đang tải thế giới...
                </p>
            </div>
        );
    }

    return (
        <div ref={gameContainerRef} className={`relative w-full h-full overflow-hidden ${combatState || chatTargetNpc ? '' : 'bg-gray-900'}`}>
            <DangerZoneOverlay isActive={isInDangerZone} />
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
                    currentMapArea={currentMapArea}
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
                    playerState={playerState}
                />
            )}

            {isGameOver && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-fade-in text-center">
                    {gameOverReason === 'age' ? (
                        <>
                            <h2 className="text-6xl font-serif font-bold text-gray-400 mb-4">Thọ Nguyên Đã Tận</h2>
                            <p className="text-2xl text-gray-300 mb-8">Hành trình tu tiên của đạo hữu đã đến hồi kết. Thân tử đạo tiêu, một kiếp luân hồi.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-6xl font-serif font-bold text-red-400 mb-4">Thân Thể Hủy Diệt</h2>
                            <p className="text-2xl text-gray-300 mb-8">Sinh lực đã cạn, thân thể không thể chống đỡ. Hành trình tu tiên của đạo hữu đã kết thúc.</p>
                        </>
                    )}
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