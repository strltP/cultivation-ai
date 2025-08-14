import React from 'react';
import type { PlayerState, NPC } from '../../types/character';
import type { Interactable } from '../../types/interaction';
import type { GameMap } from '../../types/map';
import type { Position } from '../../types/common';
import type { useGameState } from '../../hooks/useGameState';

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
import ChatPanel from './ChatPanel';

interface UIManagerProps {
    playerState: PlayerState;
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
    gameState: ReturnType<typeof useGameState>;
    currentMapData: GameMap;
    currentArea: string | null;
    currentZone: string | null;
    cameraPosition: Position;
    allMaps: Record<string, GameMap>;
    onToggleMap: () => void;
    onToggleInfoPanel: () => void;
    onToggleWorldInfoPanel: () => void;
}

const UIManager: React.FC<UIManagerProps> = (props) => {
    const { 
        playerState, 
        setPlayerState,
        gameState, 
        currentMapData, 
        currentArea, 
        currentZone,
        cameraPosition,
        allMaps,
        onToggleMap, 
        onToggleInfoPanel, 
        onToggleWorldInfoPanel 
    } = props;
    
    const {
        activeDialogue,
        setActiveDialogue,
        gameMessage,
        isLoading,
        isMapOpen,
        isInfoPanelOpen,
        isWorldInfoPanelOpen,
        isTeleportUIOpen,
        setIsTeleportUIOpen,
        isAlchemyPanelOpen,
        setIsAlchemyPanelOpen,
        tradingNpc,
        setTradingNpc,
        plantingPlot,
        setPlantingPlot,
        chatTargetNpc,
        chatHistory,
        isChatLoading,
        currentPois,
        currentMapAreas,
        currentTeleportGates,
        pendingInteraction,
        activeInteractionNpc,
        setActiveInteractionNpc,
        activeInteractionInteractable,
        setActiveInteractionInteractable,
        viewingNpc,
        setViewingNpc,
        combatState,
        handleBreakthrough,
        handleTeleport,
        handleEnterPoi,
        handleGenericInteraction,
        handleChallenge,
        handleInitiateTrade,
        setTargetPosition,
        handleToggleMeditation,
        handleLevelUpSkill,
        handleUseItem,
        handleTalismanTeleport,
        handleCombatAction,
        closeCombatScreen,
        handleKillNpc,
        handleSpareNpc,
        handlePlayerDeathAndRespawn,
        handleGatherInteractable,
        handleDestroyInteractable,
        handleViewInfoInteractable,
        handlePlantSeed,
        handleCraftItem,
        handleStartChat,
        handleSendMessage,
        handleCloseChat,
    } = gameState;

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
                    onToggleWorldInfoPanel={onToggleWorldInfoPanel}
                    isMeditating={gameState.isMeditating}
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

            {viewingNpc && <NpcInfoPanel npc={viewingNpc} onClose={() => setViewingNpc(null)} />}
            {isMapOpen && <WorldMap 
                allMaps={allMaps} 
                playerState={playerState} 
                onClose={onToggleMap}
                currentPois={currentPois}
                currentMapAreas={currentMapAreas}
                currentTeleportGates={currentTeleportGates}
            />}
            {isInfoPanelOpen && <InfoPanel playerState={playerState} setPlayerState={setPlayerState} onClose={onToggleInfoPanel} onLevelUpSkill={handleLevelUpSkill} onUseItem={handleUseItem} />}
            {isWorldInfoPanelOpen && <WorldInfoPanel onClose={onToggleWorldInfoPanel} />}
            {tradingNpc && <TradePanel playerState={playerState} setPlayerState={setPlayerState} npc={tradingNpc} setNpc={setTradingNpc} onClose={() => setTradingNpc(null)} />}
            {isTeleportUIOpen && (
                <TeleportationTalismanUI
                    currentMapId={playerState.currentMap}
                    allMaps={allMaps}
                    onTeleport={handleTalismanTeleport}
                    onClose={() => setIsTeleportUIOpen(false)}
                />
            )}
            {isAlchemyPanelOpen && (
                <AlchemyPanel
                    playerState={playerState}
                    onClose={() => setIsAlchemyPanelOpen(false)}
                    onCraft={handleCraftItem}
                />
            )}
            {chatTargetNpc && (
                <ChatPanel
                    npc={chatTargetNpc}
                    history={chatHistory}
                    isLoading={isChatLoading}
                    onSendMessage={handleSendMessage}
                    onClose={handleCloseChat}
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
