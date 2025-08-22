import type { PlayerState, NPC, GameTime, JournalEntry } from '../types/character';
import { NPC_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/npc_spawns';
import type { ProceduralNpcRule } from '../data/npcs/npc_types';
import { FACTIONS } from '../data/factions';
import { createNpcFromData } from './npcService';
import { gameTimeToMinutes, advanceTime } from './timeService';
import { MAPS, POIS_BY_MAP } from '../mapdata';
import type { MapID } from '../types/map';

export const processNpcPopulationChanges = (
    currentState: PlayerState
): { 
    updatedNpcs: Record<string, NPC[]>, 
    updatedNextNpcSpawnCheck: Record<string, GameTime>, 
    newJournalEntries: JournalEntry[] 
} => {
    const updatedNpcs: Record<string, NPC[]> = JSON.parse(JSON.stringify(currentState.generatedNpcs));
    const updatedNextNpcSpawnCheck = JSON.parse(JSON.stringify(currentState.nextNpcSpawnCheck || {}));
    const newJournalEntries: JournalEntry[] = [];
    
    const nowMinutes = gameTimeToMinutes(currentState.time);
    let hasChanges = false;
    
    const allLivingNpcs = Object.values(updatedNpcs).flat().filter((npc: NPC) => !currentState.defeatedNpcIds.includes(npc.id));

    // Iterate through all maps' spawn definitions
    for (const mapIdStr in NPC_SPAWN_DEFINITIONS_BY_MAP) {
        const mapId = mapIdStr as MapID;
        const definitions = NPC_SPAWN_DEFINITIONS_BY_MAP[mapId];

        let ruleIndex = -1;
        for (const rule of definitions) {
            ruleIndex++;
            if (rule.type !== 'procedural' || !rule.stableCount || !rule.respawnTimeYears) continue;

            const ruleId = `${mapId}-${ruleIndex}`;

            let nextCheckTime = updatedNextNpcSpawnCheck[ruleId];
            if (!nextCheckTime) {
                nextCheckTime = currentState.time;
                updatedNextNpcSpawnCheck[ruleId] = nextCheckTime;
            }
            
            const nextCheckMinutes = gameTimeToMinutes(nextCheckTime);

            if (nowMinutes >= nextCheckMinutes) {
                const livingNpcsForRule = allLivingNpcs.filter((npc: NPC) => npc.spawnRuleId === ruleId);
                const count = livingNpcsForRule.length;

                if (count < rule.stableCount) {
                    hasChanges = true;
                    const npcsToSpawn = rule.stableCount - count;
                    const numToCreate = Math.min(npcsToSpawn, Math.floor(Math.random() * 3) + 1);

                    const neededRolesPool: { roleName: string; factionId: string; poiIds: string[] }[] = [];
                    const currentRoleCounts: Record<string, number> = {};
                    livingNpcsForRule.forEach(npc => {
                        currentRoleCounts[npc.role] = (currentRoleCounts[npc.role] || 0) + 1;
                    });
                    
                    rule.roles.forEach(roleGroup => {
                        roleGroup.roleDistribution.forEach(dist => {
                            const deficit = dist.count - (currentRoleCounts[dist.roleName] || 0);
                            for (let i = 0; i < deficit; i++) {
                                neededRolesPool.push({ roleName: dist.roleName, factionId: roleGroup.factionId, poiIds: roleGroup.poiIds });
                            }
                        });
                    });

                    // If specific roles are missing, prioritize them. Otherwise, add from the most common role (usually 'Thường dân').
                    if (neededRolesPool.length === 0 && rule.roles.length > 0 && rule.roles[0].roleDistribution.length > 0) {
                        const mostCommonRole = rule.roles.flatMap(rg => rg.roleDistribution).sort((a,b) => b.count - a.count)[0];
                        const roleGroup = rule.roles.find(rg => rg.roleDistribution.some(rd => rd.roleName === mostCommonRole.roleName))!;
                        for (let i = 0; i < numToCreate; i++) {
                            neededRolesPool.push({ roleName: mostCommonRole.roleName, factionId: roleGroup.factionId, poiIds: roleGroup.poiIds });
                        }
                    }
                    
                    if (neededRolesPool.length > 0) {
                        for (let i = 0; i < numToCreate; i++) {
                            const roleToSpawn = neededRolesPool[Math.floor(Math.random() * neededRolesPool.length)];
                            const faction = FACTIONS.find(f => f.id === roleToSpawn.factionId);
                            const roleDef = faction?.roles.find(r => r.name === roleToSpawn.roleName);

                            if (!roleDef) continue;
                            
                            const homePoiId = roleToSpawn.poiIds.length > 0 ? roleToSpawn.poiIds[Math.floor(Math.random() * roleToSpawn.poiIds.length)] : undefined;
                            
                            const newNpc = createNpcFromData(
                                {
                                    role: roleDef.name,
                                    power: roleDef.power,
                                    attributes: {
                                        canCot: 5 + Math.floor(Math.random() * 11),
                                        thanPhap: 5 + Math.floor(Math.random() * 11),
                                        thanThuc: 5 + Math.floor(Math.random() * 11),
                                        ngoTinh: 5 + Math.floor(Math.random() * 11),
                                        coDuyen: 5 + Math.floor(Math.random() * 11),
                                        tamCanh: 5 + Math.floor(Math.random() * 11),
                                    },
                                    personalityTags: [],
                                },
                                `respawn-npc-${mapId}-${Date.now()}-${i}`,
                                { x: 0, y: 0 },
                                currentState.time,
                                mapId,
                                currentState.nameUsageCounts,
                                roleToSpawn.factionId,
                                homePoiId,
                                undefined,
                                roleDef
                            );
                            newNpc.spawnRuleId = ruleId;
                            
                             if (!updatedNpcs[mapId]) {
                                updatedNpcs[mapId] = [];
                            }
                            updatedNpcs[mapId].push(newNpc);
                            
                            const poi = homePoiId ? POIS_BY_MAP[mapId as MapID]?.find(p => p.id === homePoiId) : null;
                            const locationName = poi ? poi.name : MAPS[mapId as MapID].name;

                            const journalEntry: JournalEntry = {
                                time: currentState.time,
                                message: `Một người mới, ${newNpc.name}, đã đến định cư tại ${locationName}.`,
                                type: 'world'
                            };
                            newJournalEntries.push(journalEntry);
                        }
                    }
                }
                
                // Set next check time
                const [minYears, maxYears] = rule.respawnTimeYears;
                const yearsToAdd = Math.floor(Math.random() * (maxYears - minYears + 1)) + minYears;
                const minutesToAdd = yearsToAdd * 12 * 30 * 24 * 60;
                updatedNextNpcSpawnCheck[ruleId] = advanceTime(currentState.time, minutesToAdd);
            }
        }
    }

    if (!hasChanges) {
        return {
            updatedNpcs: currentState.generatedNpcs,
            updatedNextNpcSpawnCheck: currentState.nextNpcSpawnCheck || {},
            newJournalEntries: [],
        }
    }

    return { updatedNpcs, updatedNextNpcSpawnCheck, newJournalEntries };
}