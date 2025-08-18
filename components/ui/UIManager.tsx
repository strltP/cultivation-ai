import React, { useCallback } from 'react';
import type { PlayerState, NPC } from '../../types/character';
import type { GameMap } from '../../types/map';
import type { Position } from '../../types/common';
import { useUI, useWorld, usePlayerActions, useCombat, useInteraction } from '../../hooks/useGameContext';

import Hud from './Hud';
import DialogueBox from './DialogueBox';
import WorldMap from './WorldMap';
import InfoPanel from './InfoPanel';
import WorldInfoPanel from './WorldInfoPanel';
import CombatUI from '../combat/CombatUI';
import InteractionMenu from './InteractionMenu';
import InteractableMenu from './InteractableMenu';
import NpcInfoPanel from './NpcInfoPanel';
import TradePanel from './TradePanel';
import TeleportationTalismanUI from './TeleportationTalismanUI';
import PlantingMenu from './PlantingMenu';
import AlchemyPanel from './AlchemyPanel';
import JournalPanel from './JournalPanel';
import SeclusionPanel from './SeclusionPanel';


interface UIManagerProps {
    playerState: PlayerState;
    currentMapData: GameMap;
    currentArea: string | null;
    currentZone: string | null;
    cameraPosition: Position;
    allMaps: Record<string, GameMap>;
}

const UIManager: React.FC<UIManagerProps> = (props) => {
    const { 
        playerState, 
        currentMapData, 
        currentArea, 
        currentZone,
        cameraPosition,
        allMaps,
    } = props;
    
    // --- CONTEXT HOOKS ---
    const {
        isMapOpen, setIsMapOpen,
        isInfoPanelOpen, setIsInfoPanelOpen,
        isJournalOpen, setIsJournalOpen,
        isWorldInfoPanelOpen, setIsWorldInfoPanelOpen,
        isTeleportUIOpen, setIsTeleportUIOpen,
        isAlchemyPanelOpen, setIsAlchemyPanelOpen,
        isSeclusionPanelOpen, setIsSeclusionPanelOpen,
        tradingNpc, setTradingNpc,
        plantingPlot, setPlantingPlot,
        updateAndPersistPlayerState, // Get the atomic state updater
        setTeleportingWithItemIndex,
    } = useUI();
    
    const { gameMessage, isLoading, currentPois, currentMapAreas, currentTeleportGates } = useWorld();
    
    const { 
        isMeditating, 
        handleBreakthrough, 
        handleToggleMeditation, 
        handleLevelUpSkill, 
        handleUseItem,
        handleTalismanTeleport,
        handleCraftItem,
        handleStartSeclusion,
    } = usePlayerActions();

    const {
        combatState,
        handleCombatAction,
        closeCombatScreen,
        handleKillNpc,
        handleSpareNpc,
        handlePlayerDeathAndRespawn,
        handleChallenge,
    } = useCombat();

    const {
        activeDialogue, setActiveDialogue,
        activeInteractionNpc, setActiveInteractionNpc,
        activeInteractionInteractable, setActiveInteractionInteractable,
        viewingNpc, setViewingNpc,
        handleGatherInteractable,
        handleDestroyInteractable,
        handleViewInfoInteractable,
        handlePlantSeed,
        handleInitiateTrade,
        handleStartChat,
    } = useInteraction();
    
    // --- DERIVED LOGIC & HANDLERS ---
    const calculateMenuPosition = (worldPos: Position) => {
        const screenX = worldPos.x + cameraPosition.x;
        const screenY = worldPos.y + cameraPosition.y;
        return { left: screenX, top: screenY };
    };

    const handleViewInfo = (npc: NPC) => {
        setActiveInteractionNpc(null);
        setViewingNpc(npc);
    };

     const handleTrade = (npc: NPC) => {
        setActiveInteractionNpc(null);
        handleInitiateTrade(npc);
    };
    
    const onToggleMap = useCallback(() => {
        if (!isMapOpen) {
            // Logic to stop player movement can be handled by the game loop's isPaused flag
        }
        setIsMapOpen(prev => !prev);
    }, [isMapOpen, setIsMapOpen]);
    
    const onToggleInfoPanel = useCallback(() => setIsInfoPanelOpen(prev => !prev), [setIsInfoPanelOpen]);
    const onToggleJournalPanel = useCallback(() => setIsJournalOpen(prev => !prev), [setIsJournalOpen]);
    const onToggleWorldInfoPanel = useCallback(() => setIsWorldInfoPanelOpen(prev => !prev), [setIsWorldInfoPanelOpen]);
    const onToggleSeclusionPanel = useCallback(() => setIsSeclusionPanelOpen(prev => !prev), [setIsSeclusionPanelOpen]);

    const handleCloseTeleportUI = useCallback(() => {
        setIsTeleportUIOpen(false);
        setTeleportingWithItemIndex(null);
    }, [setIsTeleportUIOpen, setTeleportingWithItemIndex]);

    return (
        <>
            {!combatState && (
                <Hud
                    playerState={playerState}
                    currentMap={currentMapData}
                    gameMessage={gameMessage}
                    isLoading={isLoading}
                    currentArea={currentArea}
                    currentZone={currentZone}
                    onBreakthrough={handleBreakthrough}
                    onToggleMap={onToggleMap}
                    onToggleMeditation={handleToggleMeditation}
                    onToggleInfoPanel={onToggleInfoPanel}
                    onToggleJournalPanel={onToggleJournalPanel}
                    onToggleWorldInfoPanel={onToggleWorldInfoPanel}
                    onToggleSeclusionPanel={onToggleSeclusionPanel}
                    isMeditating={isMeditating}
                />
            )}

            {activeDialogue && <DialogueBox dialogue={activeDialogue} onClose={() => setActiveDialogue(null)} />}
            
            {activeInteractionNpc && (
                <InteractionMenu
                    npc={activeInteractionNpc}
                    position={calculateMenuPosition(activeInteractionNpc.position)}
                    onStartChat={() => handleStartChat(activeInteractionNpc)}
                    onChallenge={() => handleChallenge(activeInteractionNpc)}
                    onViewInfo={() => handleViewInfo(activeInteractionNpc)}
                    onTrade={() => handleTrade(activeInteractionNpc)}
                    onClose={() => setActiveInteractionNpc(null)}
                />
            )}

            {activeInteractionInteractable && (
                <InteractableMenu
                    interactable={activeInteractionInteractable}
                    position={calculateMenuPosition(activeInteractionInteractable.position)}
                    onGather={() => handleGatherInteractable(activeInteractionInteractable)}
                    onViewInfo={() => handleViewInfoInteractable(activeInteractionInteractable)}
                    onDestroy={() => handleDestroyInteractable(activeInteractionInteractable)}
                    onClose={() => setActiveInteractionInteractable(null)}
                />
            )}
            
            {plantingPlot && (
                <PlantingMenu
                    playerState={playerState}
                    plot={plantingPlot}
                    onClose={() => setPlantingPlot(null)}
                    onPlant={handlePlantSeed}
                />
            )}

            {viewingNpc && <NpcInfoPanel npc={viewingNpc} onClose={() => setViewingNpc(null)} playerState={playerState} />}
            {isMapOpen && <WorldMap 
                allMaps={allMaps} 
                playerState={playerState} 
                onClose={onToggleMap}
                currentPois={currentPois}
                currentMapAreas={currentMapAreas}
                currentTeleportGates={currentTeleportGates}
            />}
            {isInfoPanelOpen && <InfoPanel playerState={playerState} setPlayerState={updateAndPersistPlayerState} onClose={onToggleInfoPanel} onLevelUpSkill={handleLevelUpSkill} onUseItem={handleUseItem} />}
            {isJournalOpen && <JournalPanel playerState={playerState} onClose={onToggleJournalPanel} />}
            {isWorldInfoPanelOpen && <WorldInfoPanel playerState={playerState} onClose={onToggleWorldInfoPanel} />}
            {tradingNpc && <TradePanel playerState={playerState} setPlayerState={updateAndPersistPlayerState} npc={tradingNpc} setNpc={setTradingNpc} onClose={() => setTradingNpc(null)} />}
            {isTeleportUIOpen && (
                <TeleportationTalismanUI
                    currentMapId={playerState.currentMap}
                    allMaps={allMaps}
                    onTeleport={handleTalismanTeleport}
                    onClose={handleCloseTeleportUI}
                />
            )}
            {isAlchemyPanelOpen && (
                <AlchemyPanel
                    playerState={playerState}
                    onClose={() => setIsAlchemyPanelOpen(false)}
                    onCraft={handleCraftItem}
                />
            )}
            {isSeclusionPanelOpen && (
                <SeclusionPanel 
                    playerState={playerState}
                    onClose={onToggleSeclusionPanel}
                    onStart={handleStartSeclusion}
                />
            )}

            {combatState && (
                <CombatUI 
                    combatState={combatState} 
                    onAction={handleCombatAction} 
                    onClose={closeCombatScreen} 
                    onKill={handleKillNpc}
                    onSpare={handleSpareNpc}
                    onPlayerDeath={handlePlayerDeathAndRespawn}
                />
            )}
        </>
    );
};

export default UIManager;