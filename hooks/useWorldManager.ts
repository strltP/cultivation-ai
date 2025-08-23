
import React, { useState, useEffect, useCallback } from 'react';
import type { PlayerState, NPC, ApiUsageStats, JournalEntry } from '../types/character';
import type { Interactable, InteractableTemplate } from '../types/interaction';
import type { TeleportLocation, PointOfInterest, MapArea, MapID } from '../types/map';
import type { Position } from '../types/common';
import { loadNpcsForMap, createMonsterFromData } from '../services/npcService';
import { POIS_BY_MAP } from '../mapdata'; // Only needed for NPC spawning logic
import { gameTimeToMinutes, advanceTime } from '../services/timeService';
import { ALL_ITEMS } from '../data/items/index';
import { ALL_INTERACTABLES } from '../data/interactables';
import { ALL_MONSTERS } from '../data/npcs/monsters';
import { SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/interactable_spawns';
import type { ProceduralSpawnRule } from '../mapdata/interactable_spawns';
import { MONSTER_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/monster_spawns';
import { NPC_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/npc_spawns';
import type { ProceduralMonsterRule, ProceduralNpcRule } from '../data/npcs/npc_types';
import { FACTIONS } from '../data/factions';

interface WorldDataSource {
    pois: Record<MapID, PointOfInterest[]>;
    mapAreas: Record<MapID, MapArea[]>;
    teleportGates: Record<MapID, TeleportLocation[]>;
}

const generateInteractablesForMap = (mapId: MapID, allPois: Record<MapID, PointOfInterest[]>, allMapAreas: Record<MapID, MapArea[]>): Interactable[] => {
    const definitions = SPAWN_DEFINITIONS_BY_MAP[mapId];
    if (!definitions) return [];

    const interactableTemplatesById = new Map<string, InteractableTemplate>(ALL_INTERACTABLES.map(t => [t.baseId, t]));
    const mapAreas = allMapAreas[mapId] || [];
    const poisForCurrentMap = allPois[mapId] || [];
    const finalInteractables: Interactable[] = [];

    for (const def of definitions) {
        if ('type' in def && def.type === 'procedural') { // Procedural spawn
            const rule = def;
            const area = mapAreas.find(a => a.id === rule.areaId);
            if (!area) continue;

            const weightedItems: string[] = [];
            for (const baseId in rule.itemWeights) {
                const weight = rule.itemWeights[baseId];
                for (let i = 0; i < weight; i++) weightedItems.push(baseId);
            }
            if (weightedItems.length === 0) continue;

            let generatedCount = 0;
            let attempts = 0;
            const MAX_ATTEMPTS_PER_ITEM = 20;

            while (generatedCount < rule.initialCount && attempts < rule.initialCount * MAX_ATTEMPTS_PER_ITEM) {
                attempts++;
                const x = Math.floor(area.position.x - area.size.width / 2 + Math.random() * area.size.width);
                const y = Math.floor(area.position.y - area.size.height / 2 + Math.random() * area.size.height);

                const isInsideForbiddenPOI = poisForCurrentMap.some(poi => {
                    const typesToAvoid = ['village', 'city', 'sect', 'building'];
                    if (!typesToAvoid.includes(poi.type)) return false;
                    const poiHalfWidth = poi.size.width / 2;
                    const poiHalfHeight = poi.size.height / 2;
                    return (x >= poi.position.x - poiHalfWidth && x <= poi.position.x + poiHalfWidth &&
                            y >= poi.position.y - poiHalfHeight && y <= poi.position.y + poiHalfHeight);
                });

                if (isInsideForbiddenPOI) continue;
                
                const randomBaseId = weightedItems[Math.floor(Math.random() * weightedItems.length)];
                const template = interactableTemplatesById.get(randomBaseId);
                if (!template) continue;

                finalInteractables.push({
                    id: `proc-${mapId}-${rule.areaId}-${generatedCount}-${Math.floor(Math.random() * 100000)}`,
                    baseId: template.baseId,
                    areaId: rule.areaId,
                    name: template.name,
                    type: template.type,
                    prompt: template.prompt,
                    position: { x, y },
                });
                generatedCount++;
            }
        } else if ('baseId' in def) { // Manual spawn
            const spawn = def;
            const template = interactableTemplatesById.get(spawn.baseId);
            if (template) {
                finalInteractables.push({
                    id: spawn.id,
                    baseId: spawn.baseId,
                    name: template.name,
                    type: template.type,
                    prompt: template.prompt,
                    position: spawn.position,
                });
            }
        }
    }
    return finalInteractables;
};


export const useWorldManager = (
    playerState: PlayerState,
    updateAndPersistPlayerState: (updater: React.SetStateAction<PlayerState>) => void,
    setGameMessage: (message: string | null) => void,
    dataSource: WorldDataSource,
    trackApiCall: (functionName: keyof ApiUsageStats['calls'], tokenCount: number) => void,
    handleFactionSuccession: (defeatedNpc: NPC, currentState: PlayerState) => PlayerState
) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentInteractables, setCurrentInteractables] = useState<Interactable[]>([]);
    const [currentTeleportGates, setCurrentTeleportGates] = useState<TeleportLocation[]>([]);
    const [currentPois, setCurrentPois] = useState<PointOfInterest[]>([]);
    const [currentMapAreas, setCurrentMapAreas] = useState<MapArea[]>([]);

    const defeatedNpcIds = new Set(playerState.defeatedNpcIds);
    const currentNpcs = (playerState.generatedNpcs[playerState.currentMap] || []).filter(npc => !defeatedNpcIds.has(npc.id));

    useEffect(() => {
        const currentMapId = playerState.currentMap;

        // --- Initialize Interactables if they haven't been generated for this map ---
        if (!playerState.generatedInteractables?.[currentMapId] && playerState.name) { // Check player name to avoid running on initial empty state
             const newInteractables = generateInteractablesForMap(currentMapId, dataSource.pois, dataSource.mapAreas);
             updateAndPersistPlayerState(p => {
                 if (!p) return null as any;
                 const newGeneratedInteractables = { ...p.generatedInteractables, [currentMapId]: newInteractables };
                 return { ...p, generatedInteractables: newGeneratedInteractables };
             });
             return; // Let the effect re-run with the updated state
        }
        
        // --- NPC Old Age Death Check & Succession ---
        updateAndPersistPlayerState((p: PlayerState) => {
            if (!p) return p;

            const allNpcs = Object.values(p.generatedNpcs).flat();
            const newlyDeceased: NPC[] = [];
            const newJournalEntries: JournalEntry[] = [];
            let stateAfterSuccession: PlayerState = p;

            allNpcs.forEach(npc => {
                if (
                    npc.npcType === 'cultivator' &&
                    npc.stats.maxThoNguyen > 0 &&
                    !p.defeatedNpcIds.includes(npc.id)
                ) {
                    const age = p.time.year - npc.birthTime.year;
                    if (age >= npc.stats.maxThoNguyen) {
                        newlyDeceased.push(npc);
                    }
                }
            });

            if (newlyDeceased.length > 0) {
                const newDefeatedIds = [...new Set([...p.defeatedNpcIds, ...newlyDeceased.map(n => n.id)])];
                const newDeathInfo = { ...(p.deathInfo || {}) };
                
                newlyDeceased.forEach(npc => {
                    const ageAtDeath = p.time.year - npc.birthTime.year;
                    newDeathInfo[npc.id] = { age: ageAtDeath };
                    
                    const journalMessage = `${npc.name} (${npc.role}) đã sống hết ${npc.stats.maxThoNguyen} năm thọ nguyên, hôm nay tọa hóa quy tiên.`;
                    newJournalEntries.push({ time: p.time, message: journalMessage, type: 'world' });
                });

                let intermediateState: PlayerState = {
                    ...p,
                    defeatedNpcIds: newDefeatedIds,
                    deathInfo: newDeathInfo,
                };
                
                // Trigger succession for each deceased NPC
                newlyDeceased.forEach(npc => {
                    stateAfterSuccession = handleFactionSuccession(npc, intermediateState);
                    if(stateAfterSuccession.generatedNpcs !== intermediateState.generatedNpcs) {
                        const faction = FACTIONS.find(f => f.id === npc.factionId);
                        const successor = Object.values(stateAfterSuccession.generatedNpcs).flat().find(n => n.role === npc.role && n.power === npc.power && !stateAfterSuccession.defeatedNpcIds.includes(n.id));
                        if(faction && successor) {
                             const successionMessage = `${faction.name} chấn động! ${npc.role} ${npc.name} đã tọa hóa. ${successor.role} ${successor.name} đã được đề cử lên thay thế, trở thành tân ${npc.role}.`;
                            newJournalEntries.push({ time: p.time, message: successionMessage, type: 'world' });
                        }
                    }
                    intermediateState = stateAfterSuccession;
                });
                
                // Combine journal entries at the end
                stateAfterSuccession.journal = [...(p.journal || []), ...newJournalEntries];
                
                return stateAfterSuccession;
            }

            return p; // No changes
        });


        // --- Respawn Logic ---
        const now = gameTimeToMinutes(playerState.time);
        const newlyRespawnedInteractableIds = new Set(playerState.respawningInteractables
            .filter(item => item.mapId === currentMapId && now >= gameTimeToMinutes(item.respawnAt))
            .map(item => item.originalId));

        if (newlyRespawnedInteractableIds.size > 0) {
            updateAndPersistPlayerState(p => {
                if (!p) return null as any;
                const newQueue = p.respawningInteractables.filter(item => !newlyRespawnedInteractableIds.has(item.originalId));
                return { ...p, respawningInteractables: newQueue };
            });
            return; // Let re-render handle visibility change
        }
        
        // --- World Object Loading & Visibility ---
        const activeRespawningIds = new Set(playerState.respawningInteractables
            .filter(item => item.mapId === currentMapId)
            .map(item => item.originalId));

        // Create new objects for rendering to avoid state mutation and ensure visual state is reset.
        const interactablesForMap = (playerState.generatedInteractables[currentMapId] || [])
            .filter(item => !activeRespawningIds.has(item.id))
            .map(item => {
                 if (item.type === 'spirit_field') {
                    // Create a new object and reset its dynamic properties
                    return {
                        ...item,
                        isPlanted: false,
                        isReady: false,
                        growthPercent: undefined,
                        plantName: undefined
                    };
                }
                return { ...item }; // Shallow copy for others
            });
        
        playerState.plantedPlots.forEach(plot => {
            if (plot.mapId === currentMapId) {
                const interactable = interactablesForMap.find((i: Interactable) => i.id === plot.plotId);
                if (interactable) {
                    const seedDef = ALL_ITEMS.find(item => item.id === plot.seedId);
                    const grownItemDef = ALL_ITEMS.find(item => item.id === seedDef?.growsIntoItemId);
                    if (seedDef && seedDef.growthTimeMinutes && grownItemDef) {
                         const plantedTimeMins = gameTimeToMinutes(plot.plantedAt);
                         const elapsedMins = now - plantedTimeMins;
                         const isReady = elapsedMins >= seedDef.growthTimeMinutes;
                         const growthPercent = Math.min(100, (elapsedMins / seedDef.growthTimeMinutes) * 100);
                         interactable.isPlanted = true;
                         interactable.plantName = grownItemDef.name;
                         interactable.isReady = isReady;
                         interactable.growthPercent = growthPercent;
                    }
                }
            }
        });
        
        setCurrentInteractables(interactablesForMap);
        setCurrentTeleportGates(dataSource.teleportGates[currentMapId] || []);
        setCurrentPois(dataSource.pois[currentMapId] || []);
        setCurrentMapAreas(dataSource.mapAreas[currentMapId] || []);

        const loadAndSetNpcs = async () => {
            const spawnDefinitionsExist = (NPC_SPAWN_DEFINITIONS_BY_MAP[currentMapId] || []).length > 0 || (MONSTER_SPAWN_DEFINITIONS_BY_MAP[currentMapId] || []).length > 0;
            const mapAlreadyInitialized = playerState.initializedMaps?.includes(currentMapId);
            const needsGeneration = spawnDefinitionsExist && !mapAlreadyInitialized;
            
            if (needsGeneration && !isLoading) {
                setIsLoading(true);
                try {
                    const { npcs: newNpcs, totalTokenCount, updatedNameCounts } = await loadNpcsForMap(currentMapId, POIS_BY_MAP, playerState);
                    trackApiCall('generateNpcs', totalTokenCount);
                    updateAndPersistPlayerState((prev: PlayerState) => {
                        if (!prev || prev.currentMap !== currentMapId) return prev;
                        const newGeneratedNpcs = { ...prev.generatedNpcs, [currentMapId]: newNpcs };
                        const newInitializedMaps = [...new Set([...(prev.initializedMaps || []), currentMapId])];
                        return { 
                            ...prev, 
                            generatedNpcs: newGeneratedNpcs, 
                            initializedMaps: newInitializedMaps,
                            nameUsageCounts: updatedNameCounts 
                        };
                    });
                } catch (error) {
                    console.error("Failed to load NPCs for map:", error);
                    setGameMessage("Thiên cơ hỗn loạn, không thể triệu hồi sinh linh lúc này.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadAndSetNpcs();

        // --- New Monster Population Check Logic ---
        const monsterRulesForMap = MONSTER_SPAWN_DEFINITIONS_BY_MAP[currentMapId] || [];
        if (monsterRulesForMap && monsterRulesForMap.length > 0) {
            updateAndPersistPlayerState(p => {
                if (!p) return null as any;
                
                let hasChanges = false;
                const newState = JSON.parse(JSON.stringify(p)); // Deep copy to prevent mutation
                const allNpcsForMap = newState.generatedNpcs[currentMapId] || [];
                const defeatedIds = new Set(newState.defeatedNpcIds);
                let newMonsters: NPC[] = [];
                let nextSpawnCheck = { ...(newState.nextMonsterSpawnCheck || {}) };

                monsterRulesForMap.forEach(rule => {
                    const ruleKey = `${currentMapId}-${rule.areaId}`;
                    const nextCheckTime = nextSpawnCheck[ruleKey];
                    const nextCheckMinutes = nextCheckTime ? gameTimeToMinutes(nextCheckTime) : 0;

                    if (now >= nextCheckMinutes) {
                        const livingMonstersForRule = allNpcsForMap.filter((npc: NPC) => 
                            npc.spawnRuleId === ruleKey && !defeatedIds.has(npc.id)
                        ).length;

                        if (livingMonstersForRule < rule.maxCount) {
                            hasChanges = true;
                            
                            const area = (dataSource.mapAreas[currentMapId] || []).find(a => a.id === rule.areaId);
                            if (area) {
                                const baseId = rule.monsterBaseIds[Math.floor(Math.random() * rule.monsterBaseIds.length)];
                                const template = ALL_MONSTERS.find(m => m.baseId === baseId);
                                if (template) {
                                    const level = Math.floor(Math.random() * (template.levelRange[1] - template.levelRange[0] + 1)) + template.levelRange[0];
                                    const x = area.position.x - area.size.width / 2 + Math.random() * area.size.width;
                                    const y = area.position.y - area.size.height / 2 + Math.random() * area.size.height;
                                    const id = `proc-monster-${currentMapId}-${baseId}-${Date.now()}-${Math.random()}`;
                                    
                                    newMonsters.push(createMonsterFromData(template, level, id, {x, y}, ruleKey, p.time, currentMapId));

                                    const [minTime, maxTime] = template.repopulationTimeMinutes;
                                    const repopulationMinutes = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
                                    nextSpawnCheck[ruleKey] = advanceTime(p.time, repopulationMinutes);
                                }
                            }
                        }
                    }
                });

                if (!hasChanges) return p;

                newState.nextMonsterSpawnCheck = nextSpawnCheck;
                newState.generatedNpcs[currentMapId] = [...allNpcsForMap, ...newMonsters];
                return newState;
            });
        }
        


    }, [playerState.currentMap, playerState.defeatedNpcIds, playerState.respawningInteractables, playerState.plantedPlots, playerState.time, playerState.generatedNpcs, playerState.generatedInteractables, dataSource, isLoading, updateAndPersistPlayerState, setGameMessage, trackApiCall, handleFactionSuccession]); 

    const handleRemoveAndRespawn = useCallback((interactable: Interactable, respawnTimeMultiplier: number = 1) => {
        const template = ALL_INTERACTABLES.find(t => t.baseId === interactable.baseId);
        
        if (template && template.repopulationTimeMinutes) {
            updateAndPersistPlayerState(p => {
                if (!p) return null as any;
                const [minTime, maxTime] = template.repopulationTimeMinutes!;
                const repopulationMinutes = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
                const finalRespawnTimeMins = repopulationMinutes * respawnTimeMultiplier;
                const respawnAt = advanceTime(p.time, finalRespawnTimeMins);
                const newRespawningItem = {
                    originalId: interactable.id,
                    baseId: interactable.baseId,
                    mapId: p.currentMap,
                    areaId: interactable.areaId,
                    originalPosition: interactable.position,
                    respawnAt: respawnAt,
                };
                return {
                    ...p,
                    respawningInteractables: [...p.respawningInteractables, newRespawningItem],
                };
            });
        } else {
            // Permanently remove if it doesn't respawn
            updateAndPersistPlayerState(p => {
                if (!p) return null as any;
                const currentMapId = p.currentMap;
                const masterList = p.generatedInteractables?.[currentMapId] || [];
                const newList = masterList.filter(item => item.id !== interactable.id);
                const newGeneratedInteractables = { ...p.generatedInteractables, [currentMapId]: newList };
                return { ...p, generatedInteractables: newGeneratedInteractables };
            });
        }
    }, [updateAndPersistPlayerState]);

    return {
        isLoading,
        setIsLoading,
        currentNpcs,
        currentInteractables,
        currentTeleportGates,
        currentPois,
        currentMapAreas,
        handleRemoveAndRespawn
    };
};
