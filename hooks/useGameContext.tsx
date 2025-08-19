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
import { advanceTime, gameTimeToMinutes } from '../services/timeService';
import { ALL_ITEMS } from '../data/items/index';
import { ALL_RECIPES } from '../../data/alchemy_recipes';
import type { CombatState, PlayerAction } from '../types/combat';
import { generatePlaceNames, PlaceToName } from '../services/geminiService';
import { generateGlobalNpcIntent } from '../services/npcIntentService';
import { handleNpcActionCompletion, formatIntentDescriptionForJournal } from '../services/npcActionService';
import { DAYS_PER_MONTH, REALM_PROGRESSION } from '../constants';
import { getNextCultivationLevel, getRealmLevelInfo, calculateAllStats, getCultivationInfo } from '../services/cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import type { CharacterAttributes, CombatStats } from '../types/stats';


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
    setGameMessage: (message: string | null) => void;
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

    // NPC Progression & Action Logic
    useEffect(() => {
        if (!isGameReady || !playerState || !playerState.time) return;

        const lastCheck = playerState.lastNpcProgressionCheck || playerState.time;
        const monthsPassed = (playerState.time.year - lastCheck.year) * 12 + (playerState.time.month - lastCheck.month);

        if (monthsPassed >= 1) { // Check every month
            const processNpcUpdates = (currentState: PlayerState) => {
                const newGeneratedNpcs = JSON.parse(JSON.stringify(currentState.generatedNpcs));
                let hasChanges = false;
                const newGlobalJournalEntries: JournalEntry[] = [];
                const minutesPassed = monthsPassed * DAYS_PER_MONTH * 24 * 60;
                
                const allPoisById = new Map<string, PointOfInterest>();
                Object.values(POIS_BY_MAP).flat().forEach(poi => allPoisById.set(poi.id, poi));

                const npcsToGetIntentFor: { npc: NPC }[] = [];
                const nowMinutes = gameTimeToMinutes(currentState.time);

                for (const mapId_str in newGeneratedNpcs) {
                    const mapId = mapId_str as MapID;
                    for (const npc of newGeneratedNpcs[mapId]) {
                        if (npc.npcType !== 'cultivator' || !npc.cultivation) continue;
                        if (currentState.defeatedNpcIds.includes(npc.id)) continue; // *** FIX: Skip defeated NPCs ***

                        // --- Part 0: Passive Cultivation ---
                        const totalHoursPassed = monthsPassed * DAYS_PER_MONTH * 24;
                        let intentMultiplier = 1.0; // Default for idle NPCs
                        if (npc.currentIntent) {
                            switch (npc.currentIntent.type) {
                                case 'MEDITATE':  intentMultiplier = 2.0; break;
                                case 'GATHER':    intentMultiplier = 0.5; break;
                                case 'HUNT':      intentMultiplier = 0.5; break;
                                case 'TRADE':     intentMultiplier = 0.3; break;
                                case 'CHALLENGE': intentMultiplier = 0.2; break;
                            }
                        }
                        const BASE_QI_PER_HOUR = 0.08; const NGO_TINH_QI_FACTOR = 0.003;
                        const BASE_CAM_NGO_PER_HOUR = 0.1; const NGO_TINH_CAM_NGO_FACTOR = 0.02;
                        const realmMultiplier = 1 + (npc.cultivation.realmIndex * 0.15);
                        const qiPerHour = (BASE_QI_PER_HOUR + (npc.attributes.ngoTinh * NGO_TINH_QI_FACTOR)) * realmMultiplier * intentMultiplier;
                        const camNgoPerHour = (BASE_CAM_NGO_PER_HOUR + (npc.attributes.ngoTinh * NGO_TINH_CAM_NGO_FACTOR)) * realmMultiplier * intentMultiplier;
                        const passiveQiGained = Math.round(qiPerHour * totalHoursPassed);
                        const passiveCamNgoGained = Math.round(camNgoPerHour * totalHoursPassed);
                        if (passiveQiGained > 0) npc.qi = Math.min(npc.stats.maxQi, (npc.qi || 0) + passiveQiGained);
                        if (passiveCamNgoGained > 0) npc.camNgo = (npc.camNgo || 0) + passiveCamNgoGained;

                        // --- Part 0.5: Active Progression (Breakthrough & Skill Up) ---
                        if (npc.qi >= npc.stats.maxQi) {
                            const nextLevel = getNextCultivationLevel(npc.cultivation);
                            if (nextLevel) {
                                hasChanges = true;
                                const newLevelInfo = getRealmLevelInfo(nextLevel);
                                for (const key in newLevelInfo?.bonuses) {
                                    const statKey = key as keyof (CombatStats & CharacterAttributes);
                                    const value = newLevelInfo!.bonuses[statKey];
                                    let rolledValue = typeof value === 'number' ? value : Math.floor(Math.random() * (value![1] - value![0] + 1)) + value![0];
                                    (npc.cultivationStats as any)[statKey] = ((npc.cultivationStats as any)[statKey] || 0) + rolledValue;
                                }
                                npc.cultivation = nextLevel;
                                const { finalStats, finalAttributes } = calculateAllStats(npc.baseAttributes, npc.cultivation, npc.cultivationStats, npc.learnedSkills, ALL_SKILLS, npc.equipment, ALL_ITEMS, npc.linhCan);
                                npc.stats = finalStats; npc.attributes = finalAttributes; npc.hp = finalStats.maxHp; npc.mana = finalStats.maxMana; npc.qi = 0;
                                const newCultivationInfo = getCultivationInfo(nextLevel);
                                const journalEntry: JournalEntry = { time: currentState.time, message: `${npc.name} bế quan khổ tu, cuối cùng đã thành công đột phá đến ${newCultivationInfo.name}!`, type: 'world' };
                                if (!npc.actionHistory) npc.actionHistory = [];
                                npc.actionHistory.push(journalEntry); newGlobalJournalEntries.push(journalEntry);
                            }
                        } else if (npc.camNgo > 0) {
                            const upgradableSkills = npc.learnedSkills.map(ls => ({ def: ALL_SKILLS.find(s => s.id === ls.skillId), learned: ls })).filter(s => s.def && s.learned.currentLevel < s.def.maxLevel).map(s => ({ ...s, cost: s.def!.enlightenmentBaseCost + s.learned.currentLevel * s.def!.enlightenmentCostPerLevel }));
                            if (upgradableSkills.length > 0) {
                                upgradableSkills.sort((a, b) => a.cost - b.cost);
                                const cheapestUpgrade = upgradableSkills[0];
                                if (npc.camNgo >= cheapestUpgrade.cost) {
                                    hasChanges = true; npc.camNgo -= cheapestUpgrade.cost; cheapestUpgrade.learned.currentLevel++;
                                    if(cheapestUpgrade.def!.type === 'TAM_PHAP') {
                                        const { finalStats, finalAttributes } = calculateAllStats(npc.baseAttributes, npc.cultivation, npc.cultivationStats, npc.learnedSkills, ALL_SKILLS, npc.equipment, ALL_ITEMS, npc.linhCan);
                                        npc.stats = finalStats; npc.attributes = finalAttributes;
                                    }
                                    const journalEntry: JournalEntry = { time: currentState.time, message: `${npc.name} miệt mài nghiên cứu, đã lĩnh ngộ "${cheapestUpgrade.def!.name}" đến tầng thứ ${cheapestUpgrade.learned.currentLevel}.`, type: 'world' };
                                    if (!npc.actionHistory) npc.actionHistory = [];
                                    npc.actionHistory.push(journalEntry); newGlobalJournalEntries.push(journalEntry);
                                }
                            }
                        }

                        // --- Part 1: Progress current intent (travel or at destination) ---
                        if (npc.path && typeof npc.currentPathStepIndex === 'number' && npc.intentProgress?.isTraveling) {
                            hasChanges = true;
                            const currentStep = npc.path[npc.currentPathStepIndex];
                            if (currentStep) {
                                const TRAVEL_SPEED_PIXELS_PER_MINUTE = 5;
                                const destinationPos = currentStep.targetPosition;
                                const dx = destinationPos.x - npc.position.x; const dy = destinationPos.y - npc.position.y;
                                const totalDistance = Math.hypot(dx, dy);
                                const distanceToTravelThisTick = minutesPassed * TRAVEL_SPEED_PIXELS_PER_MINUTE;
                                if (distanceToTravelThisTick >= totalDistance) {
                                    npc.position = { ...destinationPos };
                                    if (npc.currentPathStepIndex < npc.path.length - 1) {
                                        npc.currentPathStepIndex++; const nextStep = npc.path[npc.currentPathStepIndex]; npc.currentMap = nextStep.mapId;
                                    } else {
                                        npc.path = undefined; npc.currentPathStepIndex = undefined;
                                        if (npc.currentIntent && npc.intentProgress) {
                                            if (npc.currentIntent.durationMonths > 0) {
                                                npc.intentProgress.isTraveling = false;
                                                npc.intentProgress.timeAtDestination = npc.currentIntent.durationMonths * DAYS_PER_MONTH * 24 * 60;
                                                npc.intentProgress.startTime = currentState.time;
                                            } else {
                                                npc.currentIntent = undefined; npc.intentProgress = undefined;
                                            }
                                        } else {
                                            npc.intentProgress = undefined;
                                        }
                                    }
                                } else {
                                    const ratio = distanceToTravelThisTick / totalDistance; npc.position.x += dx * ratio; npc.position.y += dy * ratio;
                                }
                            }
                        } else if (npc.intentProgress && !npc.intentProgress.isTraveling) {
                            hasChanges = true;
                            const timeSpent = Math.min(minutesPassed, npc.intentProgress.timeAtDestination || 0);
                            npc.intentProgress.timeAtDestination = (npc.intentProgress.timeAtDestination || 0) - timeSpent;
                            if (npc.intentProgress.timeAtDestination <= 0) {
                                const result = handleNpcActionCompletion(npc, currentState.time, POIS_BY_MAP);
                                if (result) {
                                    Object.assign(npc, result.updatedNpc);
                                    if (!npc.actionHistory) npc.actionHistory = [];
                                    npc.actionHistory.push(result.journalEntry);
                                    newGlobalJournalEntries.push(result.journalEntry);
                                }
                            }
                        }

                        // --- Part 2: Check if NPC can get a new intent ---
                        let canGetNewIntent = true;
                        if (npc.cannotActUntil) {
                            if (nowMinutes < gameTimeToMinutes(npc.cannotActUntil)) { canGetNewIntent = false; } 
                            else { npc.cannotActUntil = undefined; hasChanges = true; }
                        }
                        
                        // --- Part 3: Generate new intent if needed and allowed ---
                        if (canGetNewIntent && !npc.currentIntent) {
                            npcsToGetIntentFor.push({ npc });
                        }
                    }
                }

                if (npcsToGetIntentFor.length > 0) {
                    hasChanges = true;
                    npcsToGetIntentFor.forEach(({ npc }) => {
                        const newIntent = generateGlobalNpcIntent(npc, currentState, POIS_BY_MAP, TELEPORT_GATES_BY_MAP);
                        if (newIntent) {
                            npc.currentIntent = newIntent;
                            npc.path = newIntent.path;
                            npc.currentPathStepIndex = newIntent.path ? 0 : undefined;
                            npc.lastDecisionTime = currentState.time;
                            if(npc.path && npc.path.length > 0) {
                                npc.intentProgress = { startTime: currentState.time, isTraveling: true, };
                            }

                            // Generate and add journal entry for new intent
                            const journalMessage = formatIntentDescriptionForJournal(npc.name, newIntent);
                            const journalEntry: JournalEntry = {
                                time: currentState.time,
                                message: journalMessage,
                                type: 'world'
                            };

                            if (!npc.actionHistory) npc.actionHistory = [];
                            npc.actionHistory.push(journalEntry);
                            newGlobalJournalEntries.push(journalEntry);
                        }
                    });
                }
                
                const npcsToMove: { npc: NPC, from: MapID, to: MapID }[] = [];
                for (const mapId_str in newGeneratedNpcs) {
                    newGeneratedNpcs[mapId_str] = newGeneratedNpcs[mapId_str].filter((npc: NPC) => {
                        if (npc.currentMap !== mapId_str) {
                            npcsToMove.push({ npc, from: mapId_str as MapID, to: npc.currentMap });
                            return false;
                        }
                        return true;
                    });
                }
                npcsToMove.forEach(({ npc, to }) => {
                    if (!newGeneratedNpcs[to]) newGeneratedNpcs[to] = [];
                    newGeneratedNpcs[to].push(npc);
                });

                if (hasChanges) {
                    updateAndPersistPlayerState(p => {
                        if (!p) return p;
                        return { ...p, generatedNpcs: newGeneratedNpcs, journal: [...(p.journal || []), ...newGlobalJournalEntries], lastNpcProgressionCheck: p.time, };
                    });
                }
            };
            processNpcUpdates(playerState);
        }
    }, [playerState.time.month, playerState.time.year, isGameReady, playerState, updateAndPersistPlayerState]);


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
                message: message,
                type: 'player'
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
        setGameMessage: setGameMessage,
        isLoading: worldManager.isLoading,
        currentNpcs: worldManager.currentNpcs,
        currentInteractables: worldManager.currentInteractables,
        currentTeleportGates: worldManager.currentTeleportGates,
        currentPois: worldManager.currentPois,
        currentMapAreas: worldManager.currentMapAreas,
    }), [gameMessageObject, setGameMessage, worldManager]);

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