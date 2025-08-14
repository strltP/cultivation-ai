import { useState, useEffect, useCallback } from 'react';
import type { PlayerState, NPC } from '../types/character';
import type { Interactable } from '../types/interaction';
import type { TeleportLocation, PointOfInterest, MapArea, MapID } from '../types/map';
import type { Position } from '../types/common';
import { loadNpcsForMap, createMonsterFromData } from '../services/npcService';
import { POIS_BY_MAP } from '../constants'; // Only needed for NPC spawning logic
import { gameTimeToMinutes, advanceTime } from '../services/timeService';
import { ALL_ITEMS } from '../data/items';
import { ALL_INTERACTABLES } from '../data/interactables';
import { ALL_MONSTERS } from '../data/npcs/monsters';


interface WorldDataSource {
    pois: Record<MapID, PointOfInterest[]>;
    mapAreas: Record<MapID, MapArea[]>;
    teleportGates: Record<MapID, TeleportLocation[]>;
    interactables: Record<MapID, Interactable[]>;
}

export const useWorldManager = (
    playerState: PlayerState,
    setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>,
    setGameMessage: (message: string | null) => void,
    dataSource: WorldDataSource
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
        
        // --- Interactable Respawn Logic ---
        const itemsToRespawn = (playerState.respawningInteractables || []).filter(item => {
            return item.mapId === currentMapId && gameTimeToMinutes(playerState.time) >= gameTimeToMinutes(item.respawnAt);
        });

        if (itemsToRespawn.length > 0) {
            const remainingRespawnQueue = playerState.respawningInteractables?.filter(item => !itemsToRespawn.find(r => r.originalId === item.originalId));
            
            const poisForCurrentMap = dataSource.pois[currentMapId] || [];
            
            itemsToRespawn.forEach(itemToRespawn => {
                 const template = ALL_INTERACTABLES.find(t => t.baseId === itemToRespawn.baseId);
                if (!template) return;

                let newPosition: Position;
                if (itemToRespawn.areaId) {
                    const area = (dataSource.mapAreas[itemToRespawn.mapId] || []).find(a => a.id === itemToRespawn.areaId);
                    if (area) {
                        let attempts = 0;
                        let isInsideForbiddenPOI = false;
                        do {
                            const halfWidth = area.size.width / 2;
                            const halfHeight = area.size.height / 2;
                            const x = Math.floor(area.position.x - halfWidth + Math.random() * area.size.width);
                            const y = Math.floor(area.position.y - halfHeight + Math.random() * area.size.height);
                            newPosition = { x, y };
                            
                            isInsideForbiddenPOI = poisForCurrentMap.some(poi => {
                                const typesToAvoid = ['village', 'city', 'sect', 'building'];
                                if (!typesToAvoid.includes(poi.type)) return false;
                                const poiHalfWidth = poi.size.width / 2;
                                const poiHalfHeight = poi.size.height / 2;
                                return (x >= poi.position.x - poiHalfWidth && x <= poi.position.x + poiHalfWidth && y >= poi.position.y - poiHalfHeight && y <= poi.position.y + poiHalfHeight);
                            });
                            attempts++;
                        } while (isInsideForbiddenPOI && attempts < 20);
                    } else {
                        newPosition = itemToRespawn.originalPosition; // Fallback
                    }
                } else {
                    newPosition = itemToRespawn.originalPosition;
                }

                const newInteractable: Interactable = {
                    id: `respawn-${itemToRespawn.originalId}-${Date.now()}`,
                    baseId: template.baseId,
                    areaId: itemToRespawn.areaId,
                    name: template.name,
                    type: template.type,
                    prompt: template.prompt,
                    position: newPosition!,
                };
                
                dataSource.interactables[currentMapId].push(newInteractable);
            });
            
            setPlayerState(p => p ? { ...p, respawningInteractables: remainingRespawnQueue } : p);
        }

        // --- NPC Respawn Logic ---
        const npcsToRespawn = (playerState.respawningNpcs || []).filter(item => {
            return item.mapId === currentMapId && gameTimeToMinutes(playerState.time) >= gameTimeToMinutes(item.respawnAt);
        });

        if (npcsToRespawn.length > 0) {
            const remainingNpcRespawnQueue = playerState.respawningNpcs?.filter(item => !npcsToRespawn.find(r => r.originalId === item.originalId));
            
            const newNpcs: NPC[] = [];
            npcsToRespawn.forEach(itemToRespawn => {
                const template = ALL_MONSTERS.find(t => t.baseId === itemToRespawn.baseId);
                if (!template) return;

                const newId = `respawn-${itemToRespawn.originalId}-${Date.now()}`;
                const newNpc = createMonsterFromData(template, itemToRespawn.level, newId, itemToRespawn.originalPosition);
                newNpcs.push(newNpc);
            });

            if (newNpcs.length > 0) {
                setPlayerState(p => {
                    if (!p) return null;
                    const currentMapNpcs = p.generatedNpcs[currentMapId] || [];
                    const updatedNpcs = [...currentMapNpcs, ...newNpcs];
                    return { 
                        ...p, 
                        respawningNpcs: remainingNpcRespawnQueue,
                        generatedNpcs: { ...p.generatedNpcs, [currentMapId]: updatedNpcs }
                    };
                });
            } else {
                 setPlayerState(p => p ? { ...p, respawningNpcs: remainingNpcRespawnQueue } : p);
            }
        }


        // --- World Object Loading ---
        const interactablesForMap = JSON.parse(JSON.stringify(dataSource.interactables[currentMapId] || []));
        
        if (playerState.plantedPlots) {
            const currentTimeMins = gameTimeToMinutes(playerState.time);
            playerState.plantedPlots.forEach(plot => {
                if (plot.mapId === currentMapId) {
                    const interactable = interactablesForMap.find((i: Interactable) => i.id === plot.plotId);
                    if (interactable) {
                        const seedDef = ALL_ITEMS.find(item => item.id === plot.seedId);
                        const grownItemDef = ALL_ITEMS.find(item => item.id === seedDef?.growsIntoItemId);
                        if (seedDef && seedDef.growthTimeMinutes && grownItemDef) {
                             const plantedTimeMins = gameTimeToMinutes(plot.plantedAt);
                             const elapsedMins = currentTimeMins - plantedTimeMins;
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
        }
        
        setCurrentInteractables(interactablesForMap);
        setCurrentTeleportGates(dataSource.teleportGates[currentMapId] || []);
        setCurrentPois(dataSource.pois[currentMapId] || []);
        setCurrentMapAreas(dataSource.mapAreas[currentMapId] || []);

        const loadAndSetNpcs = async () => {
            if (!playerState.generatedNpcs[currentMapId] && !isLoading) {
                setIsLoading(true);
                try {
                    const newNpcs = await loadNpcsForMap(currentMapId, POIS_BY_MAP);
                    setPlayerState(prev => {
                        if (!prev || prev.currentMap !== currentMapId) return prev;
                        const newGeneratedNpcs = { ...prev.generatedNpcs, [currentMapId]: newNpcs };
                        return { ...prev, generatedNpcs: newGeneratedNpcs };
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

    }, [playerState.currentMap, playerState.generatedNpcs, playerState.time, playerState.plantedPlots, playerState.respawningInteractables, playerState.respawningNpcs, dataSource, setPlayerState, isLoading, setGameMessage]); 

    const handleRemoveAndRespawn = useCallback((entity: NPC | Interactable, respawnTimeMultiplier: number = 1) => {
        const mapId = playerState.currentMap;
        const isNpc = 'title' in entity;

        if (isNpc) {
            // Remove NPC from current state immediately
            setPlayerState(p => {
                if (!p) return null;
                const mapNpcs = p.generatedNpcs[mapId] || [];
                if (!mapNpcs.some(npc => npc.id === entity.id)) return p; // already removed
                const updatedNpcs = mapNpcs.filter(npc => npc.id !== entity.id);
                return { ...p, generatedNpcs: { ...p.generatedNpcs, [mapId]: updatedNpcs } };
            });

        } else { // It's an Interactable
            const interactable = entity as Interactable;
            const template = ALL_INTERACTABLES.find(t => t.baseId === interactable.baseId);
            
            // Remove from current view
            const currentMapInteractables = dataSource.interactables[mapId] || [];
            const index = currentMapInteractables.findIndex(item => item.id === interactable.id);
            if (index > -1) {
                currentMapInteractables.splice(index, 1);
                setCurrentInteractables([...currentMapInteractables]);
            }
    
            // If it has a respawn time, add it to the queue in playerState
            if (template && template.respawnTimeMinutes) {
                const finalRespawnTimeMins = template.respawnTimeMinutes * respawnTimeMultiplier;
                setPlayerState(p => {
                    if (!p) return null;
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
                        respawningInteractables: [...(p.respawningInteractables || []), newRespawningItem],
                    };
                });
            }
        }
    }, [playerState.currentMap, setPlayerState, dataSource.interactables]);

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