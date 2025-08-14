import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { PlayerState, NPC } from '../types/character';
import type { Position } from '../types/common';
import type { GameMap, MapArea, PointOfInterest, TeleportLocation, MapID } from '../types/map';
import type { Interactable } from '../interaction';
import { useWorldManager } from './useWorldManager';
import { usePlayerActions } from './usePlayerActions';
import { useInventoryManager } from './useInventoryManager';
import { useCombatManager } from './useCombatManager';
import { useInteractionManager } from './useInteractionManager';
import { MAPS, POIS_BY_MAP, TELEPORT_GATES_BY_MAP, MAP_AREAS_BY_MAP, INTERACTABLES_BY_MAP } from '../constants';
import { advanceTime } from '../services/timeService';
import { ALL_ITEMS } from '../data/items';
import { ALL_RECIPES } from '../data/alchemy_recipes';
import type { InventorySlot } from '../types/item';

export const useGameState = (
    playerState: PlayerState,
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>,
    options: { allMaps: Record<string, GameMap> }
) => {
    // --- Core State & Refs ---
    const [gameMessageObject, setGameMessageObject] = useState<{ text: string; id: number } | null>(null);
    const pendingInteraction = useRef<(() => void) | null>(null);

    const setGameMessage = useCallback((message: string | null) => {
        if (message) {
            setGameMessageObject({ text: message, id: Date.now() + Math.random() });
        } else {
            setGameMessageObject(null);
        }
    }, [setGameMessageObject]);

    // --- UI Panel State ---
    const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);
    const [isWorldInfoPanelOpen, setIsWorldInfoPanelOpen] = useState<boolean>(false);
    const [isTeleportUIOpen, setIsTeleportUIOpen] = useState<boolean>(false);
    const [isAlchemyPanelOpen, setIsAlchemyPanelOpen] = useState<boolean>(false);
    const [tradingNpc, setTradingNpc] = useState<NPC | null>(null);
    const [plantingPlot, setPlantingPlot] = useState<Interactable | null>(null);


    // --- Effective Map Data Calculation ---
    const { effectivePois, effectiveMapAreas, effectiveTeleportGates } = useMemo(() => {
        const overrides = playerState.nameOverrides || {};
        const pois = JSON.parse(JSON.stringify(POIS_BY_MAP));
        const areas = JSON.parse(JSON.stringify(MAP_AREAS_BY_MAP));
        const gates = JSON.parse(JSON.stringify(TELEPORT_GATES_BY_MAP));

        Object.values(pois).flat().forEach((poi: PointOfInterest) => {
            if(overrides[poi.id]) poi.name = overrides[poi.id];
        });
        Object.values(areas).flat().forEach((area: MapArea) => {
            if(overrides[area.id]) area.name = overrides[area.id];
        });
        Object.values(gates).flat().forEach((gate: TeleportLocation) => {
            if(overrides[gate.id]) gate.name = overrides[gate.id];
        });

        return { effectivePois: pois, effectiveMapAreas: areas, effectiveTeleportGates: gates };
    }, [playerState.nameOverrides]);


    // --- Sub-Hook Instantiation ---
    const inventoryManager = useInventoryManager(setPlayerState, setGameMessage, () => setIsTeleportUIOpen(true), () => setIsAlchemyPanelOpen(true));
    
    const worldManager = useWorldManager(playerState, setPlayerState, setGameMessage, {
        pois: effectivePois,
        mapAreas: effectiveMapAreas,
        teleportGates: effectiveTeleportGates,
        interactables: INTERACTABLES_BY_MAP
    });
    
    const stopAllActions = useCallback(() => {}, []);

    const playerActions = usePlayerActions(setPlayerState, setGameMessage, stopAllActions);

    const combatManager = useCombatManager(
        playerState, setPlayerState, setGameMessage, stopAllActions, 
        inventoryManager.handleAddItemToInventory, 
        inventoryManager.handleAddLinhThach
    );

     const handleInitiateTrade = (npc: NPC) => {
        interactionManager.stopAllActions.current();
        setTradingNpc(npc);
    };

    const interactionManager = useInteractionManager(
        playerState, setPlayerState, worldManager.isLoading, worldManager.setIsLoading,
        setGameMessage, pendingInteraction, 
        { isMapOpen, isInfoPanelOpen, isWorldInfoPanelOpen, combatState: combatManager.combatState },
        { 
            handleAddItemToInventory: inventoryManager.handleAddItemToInventory, 
            handleAddLinhThach: inventoryManager.handleAddLinhThach,
            handleRemoveAndRespawn: worldManager.handleRemoveAndRespawn, 
            handleChallenge: combatManager.handleChallenge,
            handleInitiateTrade: handleInitiateTrade,
            setPlantingPlot,
            setIsAlchemyPanelOpen,
            allMaps: options.allMaps
        }
    );

    const fullStopAllActions = useCallback(() => {
        playerActions.setIsMeditating(false);
        interactionManager.setActiveDialogue(null);
        interactionManager.setActiveInteractionNpc(null);
        interactionManager.setActiveInteractionInteractable(null);
        interactionManager.setViewingNpc(null);
        setTradingNpc(null);
        setIsTeleportUIOpen(false);
        setPlantingPlot(null);
        setIsAlchemyPanelOpen(false);
        interactionManager.handleCloseChat();
    }, [playerActions, interactionManager]);

    playerActions.stopAllActions.current = fullStopAllActions;
    combatManager.stopAllActions.current = fullStopAllActions;
    interactionManager.stopAllActions.current = fullStopAllActions;

    // Sync tradingNpc state with the master list in playerState
    useEffect(() => {
        if (tradingNpc) {
            const npcsOnMap = playerState.generatedNpcs[playerState.currentMap] || [];
            const updatedNpc = npcsOnMap.find(n => n.id === tradingNpc.id);
            if (updatedNpc) {
                // Check if the state is actually different to prevent infinite loops
                if (JSON.stringify(updatedNpc) !== JSON.stringify(tradingNpc)) {
                    setTradingNpc(updatedNpc);
                }
            } else {
                // NPC was removed from the world, so close the trade panel.
                setTradingNpc(null);
            }
        }
    }, [playerState.generatedNpcs, playerState.currentMap, tradingNpc]);

    const setTargetPosition = (pos: Position) => {
        fullStopAllActions();
        pendingInteraction.current = null;
        setPlayerState(prevState => {
            if (!prevState) return null;
            return { ...prevState, targetPosition: pos };
        });
    };

    const handleTalismanTeleport = useCallback((targetMap: MapID) => {
        setIsTeleportUIOpen(false);
        worldManager.setIsLoading(true);
        const targetMapName = options.allMaps[targetMap].name;
        setGameMessage(`Không gian đang dao động, chuẩn bị dịch chuyển đến ${targetMapName}...`);

        const landingPositions: Record<MapID, Position> = {
            'BAC_VUC': { x: 400, y: 400 },
            'DAI_HOANG': { x: 1100, y: 250 },
            'DONG_HAI': { x: 150, y: 400 },
            'THIEN_NAM': { x: 3800, y: 1800 },
            'THAT_HUYEN_THANH': {x: 500, y: 850},
            'LUC_YEN_THON': { x: 1000, y: 1300 },
            'LUU_LY_TONG': { x: 1600, y: 2000 },
            'VAN_BAO_LAU': { x: 1200, y: 1600 },
            'THIEN_MA_TUU_LAU': { x: 1400, y: 1600 },
            'MO_LINH_THANH': { x: 600, y: 850 },
            'HUYEN_NGOC_THANH': { x: 2000, y: 1750 },
            'THANH_VAN_MON': { x: 1500, y: 3800 },
            'DUOC_VIEN': { x: 1000, y: 1300 },
            'HAC_AM_SAM_LAM': { x: 1500, y: 3800 },
        };

        setTimeout(() => {
            setPlayerState(prev => {
                if (!prev) return null;
                const timeAdvanced = advanceTime(prev.time, 24 * 60); // Teleporting takes 1 day
                return {
                    ...prev,
                    currentMap: targetMap,
                    position: landingPositions[targetMap],
                    targetPosition: landingPositions[targetMap],
                    time: timeAdvanced
                }
            });
            worldManager.setIsLoading(false);
            setGameMessage(`Đã đến ${targetMapName}!`);
        }, 2000);
    }, [setPlayerState, worldManager.setIsLoading, setGameMessage, options.allMaps]);

    const handlePlantSeed = useCallback((plotId: string, seedItemId: string, inventoryIndex: number) => {
        setPlayerState(prev => {
            if (!prev) return null;

            const seedDef = ALL_ITEMS.find(i => i.id === seedItemId);
            if (!seedDef) return prev;

            // Remove seed from inventory
            const newInventory = [...prev.inventory];
            const invSlot = newInventory[inventoryIndex];
            if (invSlot.quantity > 1) {
                invSlot.quantity -= 1;
            } else {
                newInventory.splice(inventoryIndex, 1);
            }

            // Add to planted plots
            const newPlantedPlots = [...(prev.plantedPlots || [])];
            newPlantedPlots.push({
                plotId,
                mapId: prev.currentMap,
                seedId: seedItemId,
                plantedAt: prev.time,
            });

            setGameMessage(`Đã gieo trồng ${seedDef.name}.`);
            setPlantingPlot(null);

            return {
                ...prev,
                inventory: newInventory,
                plantedPlots: newPlantedPlots,
            };
        });
    }, [setPlayerState, setGameMessage]);
    
    const handleCraftItem = useCallback((recipeId: string) => {
        setPlayerState(prev => {
            if (!prev) return null;

            const recipe = ALL_RECIPES.find(r => r.id === recipeId);
            if (!recipe) {
                setGameMessage("Không tìm thấy đan phương này.");
                return prev;
            }

            const inventoryMap = prev.inventory.reduce((acc, slot) => {
                acc[slot.itemId] = (acc[slot.itemId] || 0) + slot.quantity;
                return acc;
            }, {} as Record<string, number>);

            const hasAllIngredients = recipe.ingredients.every(
                ing => (inventoryMap[ing.itemId] || 0) >= ing.quantity
            );

            if (!hasAllIngredients) {
                setGameMessage("Không đủ nguyên liệu để luyện đan.");
                return prev;
            }
            
            // Consume ingredients
            let newInventory = [...prev.inventory];
            recipe.ingredients.forEach(ing => {
                let remainingToRemove = ing.quantity;
                newInventory = newInventory.map(slot => {
                    if (slot.itemId === ing.itemId && remainingToRemove > 0) {
                        const amountToRemove = Math.min(slot.quantity, remainingToRemove);
                        slot.quantity -= amountToRemove;
                        remainingToRemove -= amountToRemove;
                    }
                    return slot;
                }).filter(slot => slot.quantity > 0);
            });

            // Calculate success
            const successChance = Math.min(1, recipe.baseSuccessChance + prev.attributes.ngoTinh * recipe.ngoTinhFactor);
            const isSuccess = Math.random() < successChance;
            
            const timeAdvanced = advanceTime(prev.time, recipe.timeToCraftMinutes);
            let newState = { ...prev, inventory: newInventory, time: timeAdvanced };

            if (isSuccess) {
                const quantity = Math.floor(Math.random() * (recipe.resultQuantity[1] - recipe.resultQuantity[0] + 1)) + recipe.resultQuantity[0];
                const resultItemDef = ALL_ITEMS.find(i => i.id === recipe.resultItemId);
                if (resultItemDef) {
                     let remainingQuantity = quantity;
                     if (resultItemDef.stackable > 1) {
                         for (const slot of newState.inventory) {
                            if (remainingQuantity <= 0) break;
                            if (slot.itemId === resultItemDef.id && slot.quantity < resultItemDef.stackable) {
                                const canAdd = resultItemDef.stackable - slot.quantity;
                                const amountToStack = Math.min(remainingQuantity, canAdd);
                                slot.quantity += amountToStack;
                                remainingQuantity -= amountToStack;
                            }
                        }
                     }
                      while (remainingQuantity > 0 && newState.inventory.length < 30) {
                        const amountForNewStack = Math.min(remainingQuantity, resultItemDef.stackable);
                        newState.inventory.push({ itemId: resultItemDef.id, quantity: amountForNewStack });
                        remainingQuantity -= amountForNewStack;
                     }
                    setGameMessage(`Luyện đan thành công! Nhận được ${quantity}x ${resultItemDef.name}.`);
                }
            } else {
                setGameMessage("Luyện đan thất bại! Tất cả nguyên liệu đã bị hủy.");
            }
            
            return newState;
        });
    }, [setPlayerState, setGameMessage]);

    return {
        gameMessage: gameMessageObject,
        isLoading: worldManager.isLoading,
        isMapOpen, setIsMapOpen,
        isInfoPanelOpen, setIsInfoPanelOpen,
        isWorldInfoPanelOpen, setIsWorldInfoPanelOpen,
        isTeleportUIOpen, setIsTeleportUIOpen,
        isAlchemyPanelOpen, setIsAlchemyPanelOpen,
        tradingNpc, setTradingNpc,
        plantingPlot, setPlantingPlot,
        pendingInteraction,
        currentNpcs: worldManager.currentNpcs,
        currentInteractables: worldManager.currentInteractables,
        currentTeleportGates: worldManager.currentTeleportGates,
        currentPois: worldManager.currentPois,
        currentMapAreas: worldManager.currentMapAreas,
        isMeditating: playerActions.isMeditating,
        handleBreakthrough: playerActions.handleBreakthrough,
        handleToggleMeditation: playerActions.handleToggleMeditation,
        handleLevelUpSkill: playerActions.handleLevelUpSkill,
        handleUseItem: inventoryManager.handleUseItem,
        handleTalismanTeleport,
        handleCraftItem,
        combatState: combatManager.combatState,
        handleChallenge: combatManager.handleChallenge,
        handleCombatAction: combatManager.handleCombatAction,
        closeCombatScreen: combatManager.closeCombatScreen,
        handleKillNpc: combatManager.handleKillNpc,
        handleSpareNpc: combatManager.handleSpareNpc,
        handlePlayerDeathAndRespawn: combatManager.handlePlayerDeathAndRespawn,
        activeDialogue: interactionManager.activeDialogue,
        setActiveDialogue: interactionManager.setActiveDialogue,
        activeInteractionNpc: interactionManager.activeInteractionNpc,
        setActiveInteractionNpc: interactionManager.setActiveInteractionNpc,
        activeInteractionInteractable: interactionManager.activeInteractionInteractable,
        setActiveInteractionInteractable: interactionManager.setActiveInteractionInteractable,
        viewingNpc: interactionManager.viewingNpc,
        setViewingNpc: interactionManager.setViewingNpc,
        processInteraction: interactionManager.processInteraction,
        handleTeleport: interactionManager.handleTeleport,
        handleEnterPoi: interactionManager.handleEnterPoi,
        handleGenericInteraction: interactionManager.handleGenericInteraction,
        handleGatherInteractable: interactionManager.handleGatherInteractable,
        handleDestroyInteractable: interactionManager.handleDestroyInteractable,
        handleViewInfoInteractable: interactionManager.handleViewInfoInteractable,
        handlePlantSeed,
        handleInitiateTrade,
        setTargetPosition,
        chatTargetNpc: interactionManager.chatTargetNpc,
        chatHistory: interactionManager.chatHistory,
        isChatLoading: interactionManager.isChatLoading,
        handleStartChat: interactionManager.handleStartChat,
        handleSendMessage: interactionManager.handleSendMessage,
        handleCloseChat: interactionManager.handleCloseChat,
    };
};