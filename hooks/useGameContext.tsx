import React, { createContext, useContext, useState, useCallback, useRef, useMemo, useEffect, ReactNode } from 'react';
import type { PlayerState, NPC, ChatMessage, JournalEntry } from '../types/character';
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
import { getNextCultivationLevel, getCultivationInfo, getRealmLevelInfo, calculateAllStats } from '../services/cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import type { CharacterAttributes, CombatStats } from '../types/stats';
import { DAYS_PER_MONTH } from '../constants';


// --- TYPE DEFINITIONS FOR CONTEXTS ---

interface IUIContext {
    playerState: PlayerState;
    updateAndPersistPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void;
    isGameReady: boolean;
    isGeneratingNames: boolean;
    allMaps: Record<string, GameMap>;
    isMapOpen: boolean;
    setIsMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isInfoPanelOpen: boolean;
    setIsInfoPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isJournalOpen: boolean;
    setIsJournalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isWorldInfoPanelOpen: boolean;
    setIsWorldInfoPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isTeleportUIOpen: boolean;
    setIsTeleportUIOpen: React.Dispatch<React.SetStateAction<boolean>>;
    teleportingWithItemIndex: number | null;
    setTeleportingWithItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
    isAlchemyPanelOpen: boolean;
    setIsAlchemyPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isSeclusionPanelOpen: boolean;
    setIsSeclusionPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
    handleStartSeclusion: (months: number) => void;
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
    playerState: PlayerState;
    updateAndPersistPlayerState: (updater: React.SetStateAction<PlayerState>) => void;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, playerState, updateAndPersistPlayerState }) => {
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
                
                updateAndPersistPlayerState(p => ({ ...p, nameOverrides: overrides }));
                setIsGeneratingNames(false);
            }
            setIsGameReady(true);
        };
        initializeGame();
    }, []); // Run only once on mount

    // NPC Cultivation Progression Logic
    useEffect(() => {
        if (!isGameReady || !playerState.time) return;
    
        const lastCheck = playerState.lastNpcProgressionCheck || playerState.time;
        const monthsPassed = (playerState.time.year - lastCheck.year) * 12 + (playerState.time.month - lastCheck.month);
    
        if (monthsPassed > 0) {
            updateAndPersistPlayerState(p => {
                if (!p) return p;
    
                const newGeneratedNpcs = JSON.parse(JSON.stringify(p.generatedNpcs));
                const newJournalEntries: JournalEntry[] = [];
                const totalHoursPassed = monthsPassed * DAYS_PER_MONTH * 24;
    
                for (const mapId in newGeneratedNpcs) {
                    for (const npc of newGeneratedNpcs[mapId]) {
                        if (npc.npcType !== 'cultivator' || !npc.cultivation) continue;
    
                        // --- Base QI Gain Rate (remains unchanged) ---
                        const SECLUSION_QI_PER_HOUR_BASE = 0.5;
                        const NGO_TINH_FACTOR_QI = 0.02;
                        const realmMultiplier = 1 + (npc.cultivation.realmIndex * 0.15);
                        const qiPerHour = (SECLUSION_QI_PER_HOUR_BASE + (npc.attributes.ngoTinh * NGO_TINH_FACTOR_QI)) * realmMultiplier;
                        const totalPotentialQiGained = Math.round(qiPerHour * totalHoursPassed);
    
                        // --- New Cam Ngo Calculation (matches player's seclusion formula) ---
                        const CAM_NGO_PER_MONTH_BASE = 10;
                        const totalCamNgoGained = Math.round((CAM_NGO_PER_MONTH_BASE + npc.attributes.ngoTinh * 0.5 + npc.attributes.tamCanh * 0.5) * monthsPassed);
                        npc.camNgo = (npc.camNgo || 0) + totalCamNgoGained;

                        // --- NPC Action Decision ---
                        let action: 'CULTIVATE' | 'ENLIGHTEN' | 'EXPLORE' = 'CULTIVATE';
                        const upgradableSkills = npc.learnedSkills
                            .map((ls: any) => ({ learned: ls, def: ALL_SKILLS.find(s => s.id === ls.skillId) }))
                            .filter((item: any) => item.def && item.learned.currentLevel < item.def.maxLevel);
                        
                        const cheapestSkillCost = upgradableSkills.length > 0 
                            ? Math.min(...upgradableSkills.map((s: any) => s.def!.enlightenmentBaseCost + s.learned.currentLevel * s.def!.enlightenmentCostPerLevel))
                            : Infinity;
    
                        let cultivateChance = 0.70;
                        let enlightenChance = 0.25;
    
                        if (npc.qi >= npc.stats.maxQi) {
                            cultivateChance = 0;
                            enlightenChance = 0.95;
                        } else if (upgradableSkills.length === 0 || npc.camNgo < cheapestSkillCost) {
                            enlightenChance = 0;
                            cultivateChance = 0.95;
                        }
                        
                        const randomRoll = Math.random();
                        if (randomRoll < cultivateChance) {
                            action = 'CULTIVATE';
                        } else if (randomRoll < cultivateChance + enlightenChance) {
                            action = 'ENLIGHTEN';
                        } else {
                            action = 'EXPLORE';
                        }
    
                        // --- Perform Action ---
                        switch(action) {
                            case 'CULTIVATE':
                                npc.qi = Math.min(npc.stats.maxQi, (npc.qi || 0) + totalPotentialQiGained);
                                
                                const nextCultivationLevel = getNextCultivationLevel(npc.cultivation);
                                if (nextCultivationLevel && npc.qi >= npc.stats.maxQi) {
                                    const breakthroughChance = Math.min(0.95, 0.5 + (npc.attributes.tamCanh / 200) + (npc.attributes.coDuyen / 400));
                                    if (Math.random() < breakthroughChance) {
                                        const oldCultivationInfo = getCultivationInfo(npc.cultivation);
                                        const qiRequiredForOldLevel = npc.stats.maxQi;
                                        const newLevelInfo = getRealmLevelInfo(nextCultivationLevel);
                                        if (!newLevelInfo) continue;
    
                                        const newCultivationStats = { ...npc.cultivationStats };
                                        for (const key in newLevelInfo.bonuses) {
                                            const statKey = key as keyof (CombatStats & CharacterAttributes);
                                            const value = newLevelInfo.bonuses[statKey];
                                            let rolledValue = typeof value === 'number' ? value : (Array.isArray(value) ? Math.floor(Math.random() * (value[1] - value[0] + 1)) + value[0] : 0);
                                            if (rolledValue !== 0) (newCultivationStats as any)[statKey] = ((newCultivationStats as any)[statKey] || 0) + rolledValue;
                                        }
                                        const { finalStats, finalAttributes } = calculateAllStats(npc.baseAttributes, nextCultivationLevel, newCultivationStats, npc.learnedSkills, ALL_SKILLS, npc.equipment, ALL_ITEMS, npc.linhCan);
                                        
                                        npc.cultivation = nextCultivationLevel;
                                        npc.attributes = finalAttributes;
                                        npc.stats = finalStats;
                                        npc.cultivationStats = newCultivationStats;
                                        npc.hp = finalStats.maxHp;
                                        npc.mana = finalStats.maxMana;
                                        npc.qi -= qiRequiredForOldLevel;
                                        const newCultivationInfo = getCultivationInfo(nextCultivationLevel);
                                        newJournalEntries.push({ time: p.time, message: `Có tin đồn, ${npc.name} (${npc.role}) sau nhiều năm khổ tu đã đột phá thành công, từ ${oldCultivationInfo.name} tiến vào cảnh giới ${newCultivationInfo.name}!` });
                                    } else {
                                        npc.qi = npc.stats.maxQi * 0.8;
                                        newJournalEntries.push({ time: p.time, message: `Nghe nói ${npc.name} (${npc.role}) nếm mùi thất bại khi cố gắng đột phá, tu vi bị hao tổn.` });
                                    }
                                }
                                break;
                            
                            case 'ENLIGHTEN':
                                npc.qi = Math.min(npc.stats.maxQi, (npc.qi || 0) + Math.round(totalPotentialQiGained * 0.25)); // Passive gain
    
                                const upgradableSkillsNow = npc.learnedSkills
                                    .map((ls: any) => ({ learned: ls, def: ALL_SKILLS.find(s => s.id === ls.skillId) }))
                                    .filter((item: any) => item.def && item.learned.currentLevel < item.def.maxLevel)
                                    .map((item: any) => ({ ...item, cost: item.def!.enlightenmentBaseCost + item.learned.currentLevel * item.def!.enlightenmentCostPerLevel }))
                                    .filter((item: any) => npc.camNgo >= item.cost);
    
                                if (upgradableSkillsNow.length > 0) {
                                    upgradableSkillsNow.sort((a: any, b: any) => a.cost - b.cost);
                                    const skillToUpgrade = upgradableSkillsNow[0];
                                    
                                    npc.camNgo -= skillToUpgrade.cost;
                                    const skillIndex = npc.learnedSkills.findIndex((s: any) => s.skillId === skillToUpgrade.learned.skillId);
                                    npc.learnedSkills[skillIndex].currentLevel++;
                                    
                                    newJournalEntries.push({ time: p.time, message: `Có tin đồn, ${npc.name} (${npc.role}) sau nhiều năm khổ tu đã lĩnh ngộ "${skillToUpgrade.def!.name}" lên tầng thứ ${npc.learnedSkills[skillIndex].currentLevel}!` });
    
                                    if (skillToUpgrade.def!.type === 'TAM_PHAP') {
                                        const { finalStats, finalAttributes } = calculateAllStats(npc.baseAttributes, npc.cultivation, npc.cultivationStats, npc.learnedSkills, ALL_SKILLS, npc.equipment, ALL_ITEMS, npc.linhCan);
                                        npc.attributes = finalAttributes;
                                        npc.stats = finalStats;
                                    }
                                }
                                break;
    
                            case 'EXPLORE':
                                npc.qi = Math.min(npc.stats.maxQi, (npc.qi || 0) + Math.round(totalPotentialQiGained * 0.10));
                                break;
                        }
                    }
                }
    
                return {
                    ...p,
                    generatedNpcs: newGeneratedNpcs,
                    journal: [...(p.journal || []), ...newJournalEntries],
                    lastNpcProgressionCheck: p.time,
                };
            });
        }
    }, [playerState.time.month, playerState.time.year, isGameReady, updateAndPersistPlayerState]);


    const [gameMessageObject, setGameMessageObject] = useState<{ text: string; id: number } | null>(null);
    const pendingInteraction = useRef<(() => void) | null>(null);

    const setGameMessage = useCallback((message: string | null) => {
        if (message) {
            setGameMessageObject({ text: message, id: Date.now() + Math.random() });
        } else {
            setGameMessageObject(null);
        }
    }, [setGameMessageObject]);

    const addJournalEntry = useCallback((message: string) => {
        updateAndPersistPlayerState((p: PlayerState) => {
            if (!p) return p;
            const newEntry: JournalEntry = {
                time: p.time,
                message: message
            };
            return {
                ...p,
                journal: [...(p.journal || []), newEntry]
            };
        });
    }, [updateAndPersistPlayerState]);

    // --- UI Panel State ---
    const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);
    const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
    const [isWorldInfoPanelOpen, setIsWorldInfoPanelOpen] = useState<boolean>(false);
    const [isTeleportUIOpen, setIsTeleportUIOpen] = useState<boolean>(false);
    const [teleportingWithItemIndex, setTeleportingWithItemIndex] = useState<number | null>(null);
    const [isAlchemyPanelOpen, setIsAlchemyPanelOpen] = useState<boolean>(false);
    const [isSeclusionPanelOpen, setIsSeclusionPanelOpen] = useState<boolean>(false);
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
    const stopAllActions = useRef<() => void>(() => {});

    const openTeleportUIWithItem = useCallback((itemIndex: number) => {
        setTeleportingWithItemIndex(itemIndex);
        setIsTeleportUIOpen(true);
    }, []);

    const inventoryManager = useInventoryManager(
        playerState,
        updateAndPersistPlayerState,
        setGameMessage,
        addJournalEntry,
        openTeleportUIWithItem,
        () => setIsAlchemyPanelOpen(true)
    );

    const worldManager = useWorldManager(playerState, updateAndPersistPlayerState, setGameMessage, {
        pois: effectivePois,
        mapAreas: effectiveMapAreas,
        teleportGates: effectiveTeleportGates,
    });

    const playerActions = usePlayerActionsManager(updateAndPersistPlayerState, setGameMessage, stopAllActions);

    const combatManager = useCombatManager(
        playerState, updateAndPersistPlayerState, setGameMessage, addJournalEntry, stopAllActions,
        inventoryManager.handleAddItemToInventory,
        inventoryManager.handleAddLinhThach
    );

    const handleInitiateTrade = (npcToTradeWith: NPC) => {
        // Find the most up-to-date version of the NPC from the player state to prevent using a stale object.
        const freshNpc = playerState.generatedNpcs[playerState.currentMap]?.find(n => n.id === npcToTradeWith.id);

        if (!freshNpc) {
            setGameMessage(`${npcToTradeWith.name || 'NPC'} đã không còn ở đây.`);
            return;
        }
        stopAllActions.current();
        setTradingNpc(freshNpc); // Use the fresh NPC object
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
            addJournalEntry,
            allMaps
        },
        stopAllActions
    );

    const fullStopAllActions = useCallback(() => {
        playerActions.setIsMeditating(false);
        interactionManager.setActiveDialogue(null);
        interactionManager.setActiveInteractionNpc(null);
        interactionManager.setActiveInteractionInteractable(null);
        interactionManager.setViewingNpc(null);
        setTradingNpc(null);
        setIsTeleportUIOpen(false);
        setTeleportingWithItemIndex(null);
        setPlantingPlot(null);
        setIsAlchemyPanelOpen(false);
        setIsSeclusionPanelOpen(false);
        interactionManager.handleCloseChat();
    }, [playerActions, interactionManager]);

    stopAllActions.current = fullStopAllActions;

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
        updateAndPersistPlayerState(prevState => ({ ...prevState, targetPosition: pos }));
    };
    
    const handleTalismanTeleport = useCallback((targetMap: MapID) => {
        if (teleportingWithItemIndex === null) return;

        const itemIndexToConsume = teleportingWithItemIndex;
        setTeleportingWithItemIndex(null);
        setIsTeleportUIOpen(false);
        worldManager.setIsLoading(true);
        const targetMapName = allMaps[targetMap].name;
        setGameMessage(`Không gian đang dao động, chuẩn bị dịch chuyển đến ${targetMapName}...`);

        setTimeout(() => {
            updateAndPersistPlayerState(prev => {
                if (!prev) return prev;

                // 1. Consume the item
                const newInventory = [...prev.inventory];
                const itemSlot = newInventory[itemIndexToConsume];

                if (!itemSlot || !ALL_ITEMS.find(i => i.id === itemSlot.itemId)?.effects?.some(e => e.type === 'TELEPORT')) {
                    console.error("Teleport item not found at expected index.");
                    return prev;
                }
                
                if (itemSlot.quantity > 1) {
                    itemSlot.quantity -= 1;
                } else {
                    newInventory.splice(itemIndexToConsume, 1);
                }
                
                const timeAdvanced = advanceTime(prev.time, 24 * 60); // Teleporting takes 1 day
                
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

                return {
                    ...prev,
                    inventory: newInventory,
                    currentMap: targetMap,
                    position: landingPositions[targetMap],
                    targetPosition: landingPositions[targetMap],
                    time: timeAdvanced
                }
            });
            worldManager.setIsLoading(false);
            setGameMessage(`Đã đến ${targetMapName}!`);
        }, 2000);
    }, [updateAndPersistPlayerState, worldManager, setGameMessage, allMaps, teleportingWithItemIndex, setIsTeleportUIOpen]);

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

            const newPlantedPlots = [...prev.plantedPlots];
            newPlantedPlots.push({
                plotId,
                mapId: prev.currentMap,
                seedId: seedItemId,
                plantedAt: prev.time,
            });

            const message = `Đã gieo trồng ${seedDef.name}.`;
            setGameMessage(message);
            addJournalEntry(message);
            setPlantingPlot(null);

            return {
                ...prev,
                inventory: newInventory,
                plantedPlots: newPlantedPlots,
            };
        });
    }, [updateAndPersistPlayerState, setGameMessage, addJournalEntry]);
    
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
                    const message = `Luyện đan thành công! Nhận được ${quantity}x ${resultItemDef.name}.`;
                    setGameMessage(message);
                    addJournalEntry(message);
                }
            } else {
                const message = "Luyện đan thất bại! Tất cả nguyên liệu đã bị hủy.";
                setGameMessage(message);
                addJournalEntry(message);
            }
            return newState;
        });
    }, [updateAndPersistPlayerState, setGameMessage, addJournalEntry]);


    // --- CONTEXT VALUES ---

    const uiContextValue: IUIContext = useMemo(() => ({
        playerState, 
        updateAndPersistPlayerState,
        isGameReady, isGeneratingNames, allMaps,
        isMapOpen, setIsMapOpen,
        isInfoPanelOpen, setIsInfoPanelOpen,
        isJournalOpen, setIsJournalOpen,
        isWorldInfoPanelOpen, setIsWorldInfoPanelOpen,
        isTeleportUIOpen, setIsTeleportUIOpen,
        teleportingWithItemIndex, setTeleportingWithItemIndex,
        isAlchemyPanelOpen, setIsAlchemyPanelOpen,
        isSeclusionPanelOpen, setIsSeclusionPanelOpen,
        tradingNpc, setTradingNpc,
        plantingPlot, setPlantingPlot,
    }), [playerState, updateAndPersistPlayerState, isGameReady, isGeneratingNames, allMaps, isMapOpen, isInfoPanelOpen, isJournalOpen, isWorldInfoPanelOpen, isTeleportUIOpen, teleportingWithItemIndex, isAlchemyPanelOpen, isSeclusionPanelOpen, tradingNpc, plantingPlot]);

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
        handleStartSeclusion: playerActions.handleStartSeclusion,
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