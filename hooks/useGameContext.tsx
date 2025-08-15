import React, { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect, ReactNode } from 'react';
import type { PlayerState, NPC, ChatMessage } from '../types/character';
import type { Position } from '../types/common';
import type { GameMap, MapArea, PointOfInterest, TeleportLocation, MapID } from '../types/map';
import type { Dialogue, Interactable } from '../types/interaction';
import { useWorldManager } from './useWorldManager';
import { usePlayerActions as usePlayerActionsManager } from './usePlayerActions';
import { useInventoryManager } from './useInventoryManager';
import { useCombatManager } from './useCombatManager';
import { useInteractionManager } from './useInteractionManager';
import { MAPS, POIS_BY_MAP, TELEPORT_GATES_BY_MAP, MAP_AREAS_BY_MAP } from '../mapdata';
import { advanceTime } from '../services/timeService';
import { ALL_ITEMS } from '../data/items/index';
import { ALL_RECIPES } from '../../data/alchemy_recipes';
import type { CombatState, PlayerAction } from '../types/combat';
import { generatePlaceNames, PlaceToName } from '../services/geminiService';
import { savePlayerState } from './usePlayerPersistence';
import { useDebounce } from './useDebounce';


// --- TYPE DEFINITIONS FOR CONTEXTS ---

interface IUIContext {
    playerState: PlayerState;
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
    updateAndPersistPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void;
    isGameReady: boolean;
    isGeneratingNames: boolean;
    allMaps: Record<string, GameMap>;
    isMapOpen: boolean;
    setIsMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isInfoPanelOpen: boolean;
    setIsInfoPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isWorldInfoPanelOpen: boolean;
    setIsWorldInfoPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isTeleportUIOpen: boolean;
    setIsTeleportUIOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isAlchemyPanelOpen: boolean;
    setIsAlchemyPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tradingNpc: NPC | null;
    setTradingNpc: React.Dispatch<React.SetStateAction<NPC | null>>;
    plantingPlot: Interactable | null;
    setPlantingPlot: React.Dispatch<React.SetStateAction<Interactable | null>>;
}

interface IWorldContext {
    gameMessage: { text: string; id: number } | null;
    isLoading: boolean;
    currentNpcs: NPC[];
    currentInteractables: Interactable[];
    currentTeleportGates: TeleportLocation[];
    currentPois: PointOfInterest[];
    currentMapAreas: MapArea[];
}

interface IPlayerActionsContext {
    isMeditating: boolean;
    setIsMeditating: React.Dispatch<React.SetStateAction<boolean>>;
    handleBreakthrough: () => void;
    handleToggleMeditation: () => void;
    handleLevelUpSkill: (skillId: string) => void;
    handleUseItem: (itemIndex: number) => void;
    handleTalismanTeleport: (targetMap: MapID) => void;
    handleCraftItem: (recipeId: string) => void;
}

interface ICombatContext {
    combatState: CombatState | null;
    handleChallenge: (npc: NPC) => void;
    handleCombatAction: (action: PlayerAction) => void;
    closeCombatScreen: () => void;
    handleKillNpc: () => void;
    handleSpareNpc: () => void;
    handlePlayerDeathAndRespawn: () => void;
}

interface IInteractionContext {
    pendingInteraction: React.MutableRefObject<(() => void) | null>;
    activeDialogue: Dialogue | null;
    setActiveDialogue: React.Dispatch<React.SetStateAction<Dialogue | null>>;
    activeInteractionNpc: NPC | null;
    setActiveInteractionNpc: React.Dispatch<React.SetStateAction<NPC | null>>;
    activeInteractionInteractable: Interactable | null;
    setActiveInteractionInteractable: React.Dispatch<React.SetStateAction<Interactable | null>>;
    viewingNpc: NPC | null;
    setViewingNpc: React.Dispatch<React.SetStateAction<NPC | null>>;
    chatTargetNpc: NPC | null;
    chatHistory: ChatMessage[];
    isChatLoading: boolean;
    processInteraction: (target: Interactable) => Promise<void>;
    handleTeleport: (gate: TeleportLocation) => void;
    handleEnterPoi: (poi: PointOfInterest) => void;
    handleGenericInteraction: (target: NPC | Interactable | TeleportLocation | PointOfInterest, interactionFn: () => void) => void;
    handleGatherInteractable: (interactable: Interactable) => void;
    handleDestroyInteractable: (interactable: Interactable) => void;
    handleViewInfoInteractable: (interactable: Interactable) => void;
    handlePlantSeed: (plotId: string, seedItemId: string, inventoryIndex: number) => void;
    handleInitiateTrade: (npc: NPC) => void;
    setTargetPosition: (pos: Position) => void;
    handleStartChat: (npc: NPC) => void;
    handleSendMessage: (message: string) => Promise<void>;
    handleCloseChat: () => void;
}


// --- CONTEXT CREATION ---

const UIContext = createContext<IUIContext | null>(null);
const WorldContext = createContext<IWorldContext | null>(null);
const PlayerActionsContext = createContext<IPlayerActionsContext | null>(null);
const CombatContext = createContext<ICombatContext | null>(null);
const InteractionContext = createContext<IInteractionContext | null>(null);


// --- CONSUMER HOOKS ---

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error("useUI must be used within a GameProvider");
    return context;
};
export const useWorld = () => {
    const context = useContext(WorldContext);
    if (!context) throw new Error("useWorld must be used within a GameProvider");
    return context;
};
export const usePlayerActions = () => {
    const context = useContext(PlayerActionsContext);
    if (!context) throw new Error("usePlayerActions must be used within a GameProvider");
    return context;
};
export const useCombat = () => {
    const context = useContext(CombatContext);
    if (!context) throw new Error("useCombat must be used within a GameProvider");
    return context;
};
export const useInteraction = () => {
    const context = useContext(InteractionContext);
    if (!context) throw new Error("useInteraction must be used within a GameProvider");
    return context;
};


// --- GAME PROVIDER COMPONENT ---

interface GameProviderProps {
    children: ReactNode;
    initialPlayerState: PlayerState;
    setPlayerStateForPersistence: React.Dispatch<React.SetStateAction<PlayerState | null>>;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, initialPlayerState, setPlayerStateForPersistence }) => {
    const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);
    const [isGameReady, setIsGameReady] = useState(false);
    const [isGeneratingNames, setIsGeneratingNames] = useState(false);
    
    // Game Initialization Logic (e.g., generating names)
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
                
                setPlayerState(p => ({ ...p, nameOverrides: overrides }));
                setIsGeneratingNames(false);
            }
            setIsGameReady(true);
        };
        initializeGame();
    }, []); // Run only once on mount


    const [gameMessageObject, setGameMessageObject] = useState<{ text: string; id: number } | null>(null);
    const pendingInteraction = useRef<(() => void) | null>(null);

    const setGameMessage = useCallback((message: string | null) => {
        if (message) {
            setGameMessageObject({ text: message, id: Date.now() + Math.random() });
        } else {
            setGameMessageObject(null);
        }
    }, [setGameMessageObject]);

    // --- Debounced Auto-Save ---
    // This is now the single source of truth for persisting state to localStorage.
    // It prevents race conditions and improves performance by not saving on every state change.
    const debouncedPlayerState = useDebounce(playerState, 500);

    useEffect(() => {
        // We only want to save once the game is ready and the debounced state exists.
        // This prevents saving an empty or partially loaded state on initial load.
        if (isGameReady && debouncedPlayerState) {
            savePlayerState(debouncedPlayerState);
        }
    }, [debouncedPlayerState, isGameReady]);

    // --- Atomic State Updater ---
    // This function now ONLY updates the React state. The debounced useEffect above 
    // will handle persisting it to localStorage automatically and safely.
    const updateAndPersistPlayerState = useCallback((updater: (prevState: PlayerState) => PlayerState) => {
        setPlayerState(updater);
    }, [setPlayerState]);

    // --- UI Panel State ---
    const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);
    const [isWorldInfoPanelOpen, setIsWorldInfoPanelOpen] = useState<boolean>(false);
    const [isTeleportUIOpen, setIsTeleportUIOpen] = useState<boolean>(false);
    const [isAlchemyPanelOpen, setIsAlchemyPanelOpen] = useState<boolean>(false);
    const [tradingNpc, setTradingNpc] = useState<NPC | null>(null);
    const [plantingPlot, setPlantingPlot] = useState<Interactable | null>(null);

    // --- Effective Map Data Calculation ---
    const { allMaps, effectivePois, effectiveMapAreas, effectiveTeleportGates } = useMemo(() => {
        const overrides = playerState.nameOverrides || {};
        const maps = JSON.parse(JSON.stringify(MAPS));
        const pois = JSON.parse(JSON.stringify(POIS_BY_MAP));
        const areas = JSON.parse(JSON.stringify(MAP_AREAS_BY_MAP));
        const gates = JSON.parse(JSON.stringify(TELEPORT_GATES_BY_MAP));

        Object.keys(maps).forEach(mapId => {
            if (overrides?.[mapId]) maps[mapId].name = overrides[mapId];
        });
        Object.values(pois).flat().forEach((poi: PointOfInterest) => {
            if (overrides[poi.id]) poi.name = overrides[poi.id];
        });
        Object.values(areas).flat().forEach((area: MapArea) => {
            if (overrides[area.id]) area.name = overrides[area.id];
        });
        Object.values(gates).flat().forEach((gate: TeleportLocation) => {
            if (overrides[gate.id]) gate.name = overrides[gate.id];
        });

        return { allMaps: maps, effectivePois: pois, effectiveMapAreas: areas, effectiveTeleportGates: gates };
    }, [playerState.nameOverrides]);

    // --- Sub-Hook Instantiation ---
    const inventoryManager = useInventoryManager(playerState, updateAndPersistPlayerState, setGameMessage, () => setIsTeleportUIOpen(true), () => setIsAlchemyPanelOpen(true));

    const worldManager = useWorldManager(playerState, setPlayerState, setGameMessage, {
        pois: effectivePois,
        mapAreas: effectiveMapAreas,
        teleportGates: effectiveTeleportGates,
    });

    const stopAllActions = useRef(() => { });

    const playerActions = usePlayerActionsManager(updateAndPersistPlayerState, setGameMessage, stopAllActions.current);

    const combatManager = useCombatManager(
        playerState, updateAndPersistPlayerState, setGameMessage, stopAllActions.current,
        inventoryManager.handleAddItemToInventory,
        inventoryManager.handleAddLinhThach
    );

    const handleInitiateTrade = (npc: NPC) => {
        stopAllActions.current();
        setTradingNpc(npc);
    };

    const interactionManager = useInteractionManager(
        playerState, updateAndPersistPlayerState, worldManager.isLoading, worldManager.setIsLoading,
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
            allMaps
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

    stopAllActions.current = fullStopAllActions;
    playerActions.stopAllActions.current = fullStopAllActions;
    combatManager.stopAllActions.current = fullStopAllActions;
    interactionManager.stopAllActions.current = fullStopAllActions;

    useEffect(() => {
        if (tradingNpc) {
            const npcsOnMap = playerState.generatedNpcs[playerState.currentMap] || [];
            const updatedNpc = npcsOnMap.find(n => n.id === tradingNpc.id);
            if (updatedNpc) {
                if (JSON.stringify(updatedNpc) !== JSON.stringify(tradingNpc)) {
                    setTradingNpc(updatedNpc);
                }
            } else {
                setTradingNpc(null);
            }
        }
    }, [playerState.generatedNpcs, playerState.currentMap, tradingNpc]);

    const setTargetPosition = (pos: Position) => {
        fullStopAllActions();
        pendingInteraction.current = null;
        setPlayerState(prevState => ({ ...prevState, targetPosition: pos }));
    };
    
    const handleTalismanTeleport = useCallback((targetMap: MapID) => {
        setIsTeleportUIOpen(false);
        worldManager.setIsLoading(true);
        const targetMapName = allMaps[targetMap].name;
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
            updateAndPersistPlayerState(prev => {
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
    }, [updateAndPersistPlayerState, worldManager.setIsLoading, setGameMessage, allMaps]);

     const handlePlantSeed = useCallback((plotId: string, seedItemId: string, inventoryIndex: number) => {
        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;

            const seedDef = ALL_ITEMS.find(i => i.id === seedItemId);
            if (!seedDef) return prev;

            const newInventory = [...prev.inventory];
            const invSlot = newInventory[inventoryIndex];
            if (invSlot.quantity > 1) {
                invSlot.quantity -= 1;
            } else {
                newInventory.splice(inventoryIndex, 1);
            }

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
    }, [updateAndPersistPlayerState, setGameMessage]);
    
    const handleCraftItem = useCallback((recipeId: string) => {
        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;
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
    }, [updateAndPersistPlayerState, setGameMessage]);


    // --- CONTEXT VALUES ---

    const uiContextValue: IUIContext = useMemo(() => ({
        playerState, setPlayerState: setPlayerState as React.Dispatch<React.SetStateAction<PlayerState>>, 
        updateAndPersistPlayerState,
        isGameReady, isGeneratingNames, allMaps,
        isMapOpen, setIsMapOpen,
        isInfoPanelOpen, setIsInfoPanelOpen,
        isWorldInfoPanelOpen, setIsWorldInfoPanelOpen,
        isTeleportUIOpen, setIsTeleportUIOpen,
        isAlchemyPanelOpen, setIsAlchemyPanelOpen,
        tradingNpc, setTradingNpc,
        plantingPlot, setPlantingPlot,
    }), [playerState, setPlayerState, updateAndPersistPlayerState, isGameReady, isGeneratingNames, allMaps, isMapOpen, isInfoPanelOpen, isWorldInfoPanelOpen, isTeleportUIOpen, isAlchemyPanelOpen, tradingNpc, plantingPlot]);

    const worldContextValue: IWorldContext = useMemo(() => ({
        gameMessage: gameMessageObject,
        isLoading: worldManager.isLoading,
        currentNpcs: worldManager.currentNpcs,
        currentInteractables: worldManager.currentInteractables,
        currentTeleportGates: worldManager.currentTeleportGates,
        currentPois: worldManager.currentPois,
        currentMapAreas: worldManager.currentMapAreas,
    }), [gameMessageObject, worldManager]);

    const playerActionsContextValue: IPlayerActionsContext = useMemo(() => ({
        isMeditating: playerActions.isMeditating,
        setIsMeditating: playerActions.setIsMeditating,
        handleBreakthrough: playerActions.handleBreakthrough,
        handleToggleMeditation: playerActions.handleToggleMeditation,
        handleLevelUpSkill: playerActions.handleLevelUpSkill,
        handleUseItem: inventoryManager.handleUseItem,
        handleTalismanTeleport,
        handleCraftItem,
    }), [playerActions, inventoryManager, handleTalismanTeleport, handleCraftItem]);

    const combatContextValue: ICombatContext = useMemo(() => ({
        combatState: combatManager.combatState,
        handleChallenge: combatManager.handleChallenge,
        handleCombatAction: combatManager.handleCombatAction,
        closeCombatScreen: combatManager.closeCombatScreen,
        handleKillNpc: combatManager.handleKillNpc,
        handleSpareNpc: combatManager.handleSpareNpc,
        handlePlayerDeathAndRespawn: combatManager.handlePlayerDeathAndRespawn,
    }), [combatManager]);

    const interactionContextValue: IInteractionContext = useMemo(() => ({
        pendingInteraction,
        ...interactionManager,
        setTargetPosition,
        handlePlantSeed,
    }), [interactionManager, setTargetPosition, handlePlantSeed]);

    return (
        <UIContext.Provider value={uiContextValue}>
            <WorldContext.Provider value={worldContextValue}>
                <PlayerActionsContext.Provider value={playerActionsContextValue}>
                    <CombatContext.Provider value={combatContextValue}>
                        <InteractionContext.Provider value={interactionContextValue}>
                            {children}
                        </InteractionContext.Provider>
                    </CombatContext.Provider>
                </PlayerActionsContext.Provider>
            </WorldContext.Provider>
        </UIContext.Provider>
    );
};