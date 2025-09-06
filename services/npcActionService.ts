import type { NPC, GameTime, JournalEntry, NpcIntent, PathStep, PlayerState, NpcRelationship, RelationshipType } from '../types/character';
import type { MapID, PointOfInterest } from '../types/map';
import { ALL_ITEMS } from '../data/items/index';
import type { InventorySlot } from '../types/item';
import { DAYS_PER_MONTH } from '../constants';
import { advanceTime, gameTimeToMinutes } from './timeService';
import { getMapPath, generateGlobalNpcIntent } from './npcIntentService';
import { MAPS, POIS_BY_MAP, TELEPORT_GATES_BY_MAP, MAP_AREAS_BY_MAP } from '../mapdata';
import { FACTIONS } from '../data/factions';
import { ALL_INTERACTABLES } from '../data/interactables/index';
import type { Interactable } from '../types/interaction';


export const formatIntentDescriptionForJournal = (npcName: string, intent: NpcIntent): string => {
    const allPois = Object.values(POIS_BY_MAP).flat();
    const destinationPoi = allPois.find(p => p.id === intent.destinationPoiId);
    const destinationName = `${destinationPoi?.name || 'một nơi nào đó'} (${MAPS[intent.destinationMapId]?.name || 'Bản đồ không rõ'})`;

    let actionText = '';
    
    switch(intent.type) {
        case 'MEDITATE': actionText = `bắt đầu bế quan tại`; break;
        case 'GATHER': actionText = `bắt đầu đi thu thập tài nguyên tại`; break;
        case 'HUNT': actionText = `bắt đầu đi săn yêu thú tại`; break;
        case 'TRADE': actionText = `bắt đầu đi giao thương tại`; break;
        case 'CHALLENGE': actionText = `bắt đầu đi khiêu chiến tại`; break;
        case 'WANDERER': actionText = `bắt đầu di chuyển đến`; break;
        case 'SOCIALIZE': actionText = intent.description; return actionText;
        default: actionText = `bắt đầu hành trình đến`;
    }
    
    return `${npcName} đã ${actionText} ${destinationName}.`;
};

export const formatCurrentIntentStatus = (npc: NPC): string => {
    const intent = npc.currentIntent;
    if (!intent) return 'Không có mục tiêu hiện tại.';

    const allPois = Object.values(POIS_BY_MAP).flat();
    const allAreas = Object.values(MAP_AREAS_BY_MAP).flat();
    const destinationPoi = allPois.find(p => p.id === intent.destinationPoiId);
    const destinationArea = allAreas.find(a => a.id === intent.destinationPoiId);

    const destinationName = `${destinationPoi?.name || destinationArea?.name || 'một nơi nào đó'} (${MAPS[intent.destinationMapId]?.name || 'Bản đồ không rõ'})`;

    let actionText = '';
    const isTraveling = npc.intentProgress?.isTraveling;
    const statusText = isTraveling ? 'đang trên đường' : 'đang';

    switch(intent.type) {
        case 'MEDITATE': actionText = `bế quan tại`; break;
        case 'GATHER': actionText = `thu thập tài nguyên tại`; break;
        case 'HUNT': actionText = `săn yêu thú tại`; break;
        case 'TRADE': actionText = `giao thương tại`; break;
        case 'CHALLENGE': actionText = `khiêu chiến tại`; break;
        case 'WANDERER': actionText = `di chuyển đến`; break;
        case 'SOCIALIZE': actionText = intent.description; return actionText;
        default: actionText = `làm nhiệm vụ tại`;
    }
    
    let timeText = '';
    if (!isTraveling && npc.intentProgress?.timeAtDestination) {
        const monthsLeft = npc.intentProgress.timeAtDestination / (DAYS_PER_MONTH * 24 * 60);
        timeText = ` (Còn khoảng ${Math.ceil(monthsLeft)} tháng)`;
    }

    return `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} ${statusText.slice(1)} ${actionText} ${destinationName}${timeText}.`;
};


// Helper to add items to inventory, handling stacking
const addItemToNpcInventory = (inventory: InventorySlot[], itemId: string, quantity: number): InventorySlot[] => {
    const newInventory = JSON.parse(JSON.stringify(inventory));
    const itemDef = ALL_ITEMS.find(i => i.id === itemId);
    if (!itemDef) return newInventory;

    let remainingQuantity = quantity;

    // Add to existing stacks first
    if (itemDef.stackable > 1) {
        for (const slot of newInventory) {
            if (remainingQuantity <= 0) break;
            if (slot.itemId === itemId && slot.quantity < itemDef.stackable) {
                const canAdd = itemDef.stackable - slot.quantity;
                const amountToStack = Math.min(remainingQuantity, canAdd);
                slot.quantity += amountToStack;
                remainingQuantity -= amountToStack;
            }
        }
    }

    // Add to new stacks
    while (remainingQuantity > 0) {
        // Assuming NPCs have infinite inventory space for this simulation
        newInventory.push({ itemId, quantity: remainingQuantity });
        remainingQuantity = 0; // Simplified for NPCs
    }

    return newInventory;
};

export const handleNpcActionCompletion = (
    npc: NPC,
    intentToComplete: NpcIntent,
    currentTime: GameTime,
    allPoisByMap: Record<MapID, PointOfInterest[]>,
    generatedInteractablesForMap: Interactable[],
    allNpcsOnMap: NPC[]
): { npcUpdates: { npcId: string, updates: Partial<NPC> }[], journalEntry?: JournalEntry, harvestedInteractable?: Interactable } | null => {
    if (npc.npcType === 'monster') return null;

    const npcUpdates: { npcId: string, updates: Partial<NPC> }[] = [];
    let actionCompletionMessage = '';
    let harvestedInteractable: Interactable | undefined = undefined;

    const intent = intentToComplete;
    const duration = intent.durationMonths;

    const destinationPoi = allPoisByMap[intent.destinationMapId]?.find(p => p.id === intent.destinationPoiId);
    const destinationArea = MAP_AREAS_BY_MAP[intent.destinationMapId]?.find(a => a.id === intent.destinationPoiId);
    const destinationMapName = MAPS[intent.destinationMapId]?.name || 'Nơi Vô Định';
    const destinationName = destinationPoi?.name || destinationArea?.name ? `${destinationPoi?.name || destinationArea?.name} (${destinationMapName})` : 'một nơi nào đó';


    // Step 1: Handle the outcome of the completed action and generate a message for it.
    switch (intent.type) {
        case 'MEDITATE': {
            actionCompletionMessage = `${npc.name} đã kết thúc ${duration} tháng bế quan tại ${destinationName}, cảm thấy tu vi có phần tinh tiến, khí tức trở nên càng thêm vững chắc.`;
            break;
        }
        case 'GATHER': {
            let newInventory = npc.inventory || [];
            const itemsFound: Record<string, number> = {};
            
            // Check if the destination is an area and try to harvest a real node
            if(destinationArea) {
                const gatherableNodes = generatedInteractablesForMap.filter(i => {
                    if(i.areaId !== destinationArea.id) return false;
                    if(intent.gatherTargetType === 'herb' && i.type !== 'herb') return false;
                    if(intent.gatherTargetType === 'stone' && i.type !== 'stone') return false;
                    return true;
                });

                if(gatherableNodes.length > 0) {
                    harvestedInteractable = gatherableNodes[Math.floor(Math.random() * gatherableNodes.length)];
                    const template = ALL_INTERACTABLES.find(t => t.baseId === harvestedInteractable!.baseId);
                    
                    if (template?.loot) {
                        template.loot.forEach(lootRule => {
                            if (Math.random() < lootRule.chance) {
                                const quantity = Math.floor(Math.random() * (lootRule.quantity[1] - lootRule.quantity[0] + 1)) + lootRule.quantity[0];
                                if (quantity > 0) {
                                    newInventory = addItemToNpcInventory(newInventory, lootRule.itemId, quantity);
                                    itemsFound[lootRule.itemId] = (itemsFound[lootRule.itemId] || 0) + quantity;
                                }
                            }
                        });
                    }
                }
            }

            npcUpdates.push({ npcId: npc.id, updates: { inventory: newInventory } });
            const foundItemsStr = Object.keys(itemsFound).map(id => `${itemsFound[id]}x ${ALL_ITEMS.find(i => i.id === id)?.name || 'Vật phẩm'}`).join(', ');
            actionCompletionMessage = foundItemsStr ? `${npc.name} đã đi thu thập tài nguyên tại ${destinationName} trong ${duration} tháng và tìm thấy: ${foundItemsStr}.` : `${npc.name} đã đi thu thập tài nguyên tại ${destinationName} trong ${duration} tháng nhưng không có thu hoạch gì.`;
            break;
        }
        case 'HUNT': {
            const possibleLoot = ['material_monster_bone_1', 'material_monster_blood_1', 'material_monster_core_1'];
            let newInventory = npc.inventory || [];
            const itemsFound: Record<string, number> = {};
            const huntCount = Math.ceil(duration * (1 + npc.attributes.coDuyen / 25));
            for (let i = 0; i < huntCount; i++) {
                if(Math.random() < 0.7) {
                    const itemId = possibleLoot[Math.floor(Math.random() * possibleLoot.length)];
                    newInventory = addItemToNpcInventory(newInventory, itemId, 1);
                    itemsFound[itemId] = (itemsFound[itemId] || 0) + 1;
                }
            }
            npcUpdates.push({ npcId: npc.id, updates: { inventory: newInventory } });
            const foundItemsStr = Object.keys(itemsFound).map(id => `${itemsFound[id]}x ${ALL_ITEMS.find(i => i.id === id)?.name || 'Vật phẩm'}`).join(', ');
            actionCompletionMessage = foundItemsStr ? `${npc.name} đã đi săn yêu thú tại ${destinationName} trong ${duration} tháng và thu được: ${foundItemsStr}.` : `${npc.name} đã đi săn yêu thú tại ${destinationName} trong ${duration} tháng nhưng không thành công.`;
            break;
        }
        case 'TRADE': {
            const earnings = Math.round(duration * 500 * (1 + npc.attributes.coDuyen / 30));
            npcUpdates.push({ npcId: npc.id, updates: { linhThach: (npc.linhThach || 0) + earnings } });
            actionCompletionMessage = `${npc.name} đã đi giao thương tại ${destinationName} trong ${duration} tháng, kiếm được ${earnings.toLocaleString()} linh thạch.`;
            break;
        }
        case 'CHALLENGE': {
            actionCompletionMessage = `${npc.name} đã hoàn thành ý định "${intent.description}" tại ${destinationName} sau ${duration} tháng.`;
            break;
        }
        case 'WANDERER': {
            actionCompletionMessage = `${npc.name} đã đến ${destinationName}.`;
            break;
        }
    }

    if (!actionCompletionMessage) return null;

    let restMonths = Math.floor(Math.random() * 3) + 1;
    let restAndReturnMessage = '';

    const faction = FACTIONS.find(f => f.id === npc.factionId);
    const role = faction?.roles.find(r => r.name === npc.role);

    if (role && role.fixedPositionChance && Math.random() < role.fixedPositionChance) {
        restMonths = Math.floor(Math.random() * 7) + 6;
    }
    
    const allPois = Object.values(allPoisByMap).flat();
    const homeMapData = MAPS[npc.homeMapId];
    const needsToReturnHome = homeMapData && (npc.currentMap !== npc.homeMapId);
    
    let finalUpdatesForActor: Partial<NPC> = {};

    if (needsToReturnHome) {
        restAndReturnMessage = `Sau đó, ${npc.name} quyết định trở về nhà và nghỉ ngơi ${restMonths} tháng.`;
        const mapPath = getMapPath(npc.currentMap, npc.homeMapId!);
        
        let returnPosition = { x: homeMapData.size.width / 2, y: homeMapData.size.height / 2 };
        
        const homePoi = npc.homePoiId ? allPois.find(p => p.id === npc.homePoiId) : undefined;
        if (homePoi && Math.random() < 0.7) {
            returnPosition.x = homePoi.position.x - homePoi.size.width / 2 + Math.random() * homePoi.size.width;
            returnPosition.y = homePoi.position.y - homePoi.size.height / 2 + Math.random() * homePoi.size.height;
        } else {
            returnPosition.x = Math.random() * homeMapData.size.width;
            returnPosition.y = Math.random() * homeMapData.size.height;
        }

        if (mapPath) {
            const pathSteps: PathStep[] = [];
            for (let i = 0; i < mapPath.length; i++) {
                const currentMapId = mapPath[i];
                if (i < mapPath.length - 1) {
                    const nextMapId = mapPath[i + 1];
                    const poisForMap = allPoisByMap[currentMapId];
                    const gatesForMap = TELEPORT_GATES_BY_MAP[currentMapId];
                    const entryPoi = Array.isArray(poisForMap) ? poisForMap.find(p => p.targetMap === nextMapId) : undefined;
                    const entryGate = Array.isArray(gatesForMap) ? gatesForMap.find(g => g.targetMap === nextMapId) : undefined;
                    const exitPoint = entryPoi || entryGate;
                    if (exitPoint) {
                        pathSteps.push({ mapId: currentMapId, targetPosition: exitPoint.position });
                    } else {
                        pathSteps.length = 0; break;
                    }
                } else {
                    pathSteps.push({ mapId: currentMapId, targetPosition: returnPosition });
                }
            }

            if (pathSteps.length > 0) {
                 const returnIntent: NpcIntent = {
                    type: 'WANDERER',
                    description: `Đang trên đường trở về ${MAPS[npc.homeMapId!].name}.`,
                    destinationPoiId: 'HOME',
                    destinationMapId: npc.homeMapId!,
                    destinationPosition: returnPosition,
                    durationMonths: 0,
                    path: pathSteps
                };
                finalUpdatesForActor.currentIntent = returnIntent;
                finalUpdatesForActor.path = returnIntent.path;
                finalUpdatesForActor.currentPathStepIndex = 0;
                finalUpdatesForActor.intentProgress = { startTime: currentTime, isTraveling: true };
            } else {
                finalUpdatesForActor = { currentIntent: undefined, path: undefined, currentPathStepIndex: undefined, intentProgress: undefined };
            }
        } else {
            finalUpdatesForActor = { currentIntent: undefined, path: undefined, currentPathStepIndex: undefined, intentProgress: undefined };
        }
    } else {
        finalUpdatesForActor = { currentIntent: undefined, path: undefined, currentPathStepIndex: undefined, intentProgress: undefined };
        restAndReturnMessage = `Sau đó, ${npc.name} quyết định nghỉ ngơi tại chỗ ${restMonths} tháng.`;
    }
    
    const restMinutes = restMonths * DAYS_PER_MONTH * 24 * 60;
    finalUpdatesForActor.cannotActUntil = advanceTime(currentTime, restMinutes);
    finalUpdatesForActor.lastDecisionTime = currentTime;
    
    npcUpdates.push({ npcId: npc.id, updates: finalUpdatesForActor });

    const finalJournalMessage = `${actionCompletionMessage} ${restAndReturnMessage}`.trim();
    const journalEntry: JournalEntry = { time: currentTime, message: finalJournalMessage, type: 'world', npcId: npc.id };

    return { npcUpdates, journalEntry, harvestedInteractable };
};

export const processNpcActionsForTimeSkip = (
    currentState: PlayerState,
    monthsToSkip: number
): { updatedNpcs: Record<string, NPC[]>, newJournalEntries: JournalEntry[], harvestedInteractables: (Interactable & { mapId: MapID })[] } => {
    const newGeneratedNpcs = JSON.parse(JSON.stringify(currentState.generatedNpcs));
    let hasChanges = false;
    const newGlobalJournalEntries: JournalEntry[] = [];
    const minutesPassed = monthsToSkip * DAYS_PER_MONTH * 24 * 60;
    const harvestedInteractables: (Interactable & { mapId: MapID })[] = [];
    
    const npcsToGetIntentFor: { npc: NPC }[] = [];
    const nowMinutes = gameTimeToMinutes(currentState.time);

    for (const mapId_str in newGeneratedNpcs) {
        const mapId = mapId_str as MapID;
        const allNpcsOnMap = newGeneratedNpcs[mapId];

        for (const npc of allNpcsOnMap) {
            if (npc.npcType !== 'cultivator' || !npc.cultivation) continue;
            if (currentState.defeatedNpcIds.includes(npc.id)) continue;

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
                    const interactablesForMap = currentState.generatedInteractables[npc.currentMap] || [];
                    const result = handleNpcActionCompletion(npc, npc.currentIntent!, currentState.time, POIS_BY_MAP, interactablesForMap, allNpcsOnMap);
                    if (result) {
                        if (result.journalEntry) {
                            newGlobalJournalEntries.push(result.journalEntry);
                        }
                        if (result.harvestedInteractable) {
                             harvestedInteractables.push({ ...result.harvestedInteractable, mapId: npc.currentMap });
                        }
                        for (const update of result.npcUpdates) {
                            const npcToUpdate = allNpcsOnMap.find((n: NPC) => n.id === update.npcId);
                            if (npcToUpdate) {
                                Object.assign(npcToUpdate, update.updates);
                            }
                        }
                    }
                }
            }

            let canGetNewIntent = true;
            if (npc.cannotActUntil) {
                if (nowMinutes < gameTimeToMinutes(npc.cannotActUntil)) { canGetNewIntent = false; } 
                else { npc.cannotActUntil = undefined; hasChanges = true; }
            }
            
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
                const journalMessage = formatIntentDescriptionForJournal(npc.name, newIntent);
                const journalEntry: JournalEntry = { time: currentState.time, message: journalMessage, type: 'world', npcId: npc.id };
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

    return { updatedNpcs: newGeneratedNpcs, newJournalEntries: newGlobalJournalEntries, harvestedInteractables };
};

export const processSocialInteractionsForTimeSkip = (
    currentState: PlayerState,
    monthsToSkip: number
): { updatedNpcs: Record<string, NPC[]>, newJournalEntries: JournalEntry[] } => {
    if (!currentState.npcAffinityStore) {
        currentState.npcAffinityStore = {};
    }

    const allLivingNpcs = Object.values(currentState.generatedNpcs).flat().filter((npc: NPC) => 
        npc.npcType === 'cultivator' && !currentState.defeatedNpcIds.includes(npc.id)
    );
    const allMapIds = Object.keys(currentState.generatedNpcs) as MapID[];

    for (const mapId of allMapIds) {
        const npcsOnMap = allLivingNpcs.filter(n => n.currentMap === mapId);
        if (npcsOnMap.length < 2) continue;

        for (let i = 0; i < npcsOnMap.length; i++) {
            for (let j = i + 1; j < npcsOnMap.length; j++) {
                const npcA = npcsOnMap[i];
                const npcB = npcsOnMap[j];

                const BASE_INTERACTION_CHANCE_PER_MONTH = 0.15; // Increased chance
                let interactionChance = BASE_INTERACTION_CHANCE_PER_MONTH;

                if (npcA.personalityTags?.some(t => ['Hào sảng', 'Tốt bụng'].includes(t))) interactionChance *= 1.5;
                if (npcB.personalityTags?.some(t => ['Hào sảng', 'Tốt bụng'].includes(t))) interactionChance *= 1.5;
                if (npcA.personalityTags?.some(t => ['Âm trầm', 'Thích yên tĩnh'].includes(t))) interactionChance *= 0.5;
                if (npcB.personalityTags?.some(t => ['Âm trầm', 'Thích yên tĩnh'].includes(t))) interactionChance *= 0.5;

                const totalInteractionChance = 1 - Math.pow(1 - interactionChance, monthsToSkip);

                if (Math.random() < totalInteractionChance) {
                    const key = [npcA.id, npcB.id].sort().join('_');
                    const currentAffinity = currentState.npcAffinityStore[key] || 0;

                    let isPositive = true;
                    if (currentAffinity < -20) isPositive = false;
                    
                    const hasConflictPersonalityA = npcA.personalityTags?.some(t => ['Nóng nảy', 'Kiêu ngạo', 'Tà ác', 'Tàn nhẫn'].includes(t));
                    const hasConflictPersonalityB = npcB.personalityTags?.some(t => ['Nóng nảy', 'Kiêu ngạo', 'Tà ác', 'Tàn nhẫn'].includes(t));
                    const hasGoodPersonalityA = npcA.personalityTags?.some(t => ['Nhân từ', 'Hào sảng', 'Khiêm tốn'].includes(t));
                    const hasGoodPersonalityB = npcB.personalityTags?.some(t => ['Nhân từ', 'Hào sảng', 'Khiêm tốn'].includes(t));

                    if (hasConflictPersonalityA && hasConflictPersonalityB) {
                         isPositive = Math.random() < 0.1; // 10% chance to be positive
                    } else if (hasConflictPersonalityA || hasConflictPersonalityB) {
                        isPositive = Math.random() < 0.4; // 40% chance
                    } else if (hasGoodPersonalityA && hasGoodPersonalityB) {
                         isPositive = Math.random() < 0.9; // 90% chance
                    } else if (hasGoodPersonalityA || hasGoodPersonalityB) {
                         isPositive = Math.random() < 0.7; // 70% chance
                    }

                    let affinityChange = isPositive
                        ? Math.floor(Math.random() * 5) + 2  // +2 to +6
                        : -(Math.floor(Math.random() * 8) + 3); // -3 to -10
                    
                    const newAffinity = Math.max(-100, Math.min(100, currentAffinity + affinityChange));

                    currentState.npcAffinityStore[key] = newAffinity;
                }
            }
        }
    }
    
    return { updatedNpcs: currentState.generatedNpcs, newJournalEntries: [] };
};
