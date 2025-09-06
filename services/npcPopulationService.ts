import type { PlayerState, NPC, GameTime, JournalEntry } from '../types/character';
import { NPC_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/npc_spawns';
import type { ProceduralNpcRule, AgeCategory, RoleSpawnDefinition } from '../data/npcs/npc_types';
import { FACTIONS } from '../data/factions';
import { createNpcFromData } from './npcService';
import { gameTimeToMinutes, advanceTime } from './timeService';
import { MAPS, POIS_BY_MAP } from '../mapdata';
import type { MapID } from '../types/map';
import type { Position } from '../types/common';

const DEFAULT_AGE_DISTRIBUTION = { young: 0.9, middle: 0.1, old: 0.0 };

const selectAgeCategory = (distribution: { young: number; middle: number; old: number } | undefined): AgeCategory => {
    const dist = distribution || DEFAULT_AGE_DISTRIBUTION;
    const totalWeight = dist.young + dist.middle + dist.old;
    if (totalWeight <= 0) return 'Young'; // Fallback

    let random = Math.random() * totalWeight;

    if (random < dist.young) {
        return 'Young';
    }
    random -= dist.young;

    if (random < dist.middle) {
        return 'Middle';
    }
    
    return 'Old';
};

// Helper to pick a random item based on weight
const weightedRandom = <T>(items: { item: T; weight: number }[]): T | null => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) return items.length > 0 ? items[Math.floor(Math.random() * items.length)].item : null;

    let random = Math.random() * totalWeight;
    for (const { item, weight } of items) {
        if (random < weight) {
            return item;
        }
        random -= weight;
    }
    return null; // Should not be reached if totalWeight > 0
};

export const processNpcPopulationChanges = (
    currentState: PlayerState,
    monthsToSkip: number
): { 
    updatedNpcs: Record<string, NPC[]>, 
    newJournalEntries: JournalEntry[],
    updatedNameUsageCounts: PlayerState['nameUsageCounts'],
    updatedFactionRecruitmentTimers: PlayerState['factionRecruitmentTimers']
} => {
    const updatedNpcs: Record<string, NPC[]> = JSON.parse(JSON.stringify(currentState.generatedNpcs));
    const updatedNameUsageCounts = JSON.parse(JSON.stringify(currentState.nameUsageCounts || { male: {}, female: {} }));
    const newJournalEntries: JournalEntry[] = [];
    const updatedFactionRecruitmentTimers = JSON.parse(JSON.stringify(currentState.factionRecruitmentTimers || {}));
    
    if (monthsToSkip <= 0) {
        return { updatedNpcs, newJournalEntries, updatedNameUsageCounts, updatedFactionRecruitmentTimers };
    }

    for (let month = 0; month < monthsToSkip; month++) {
        const allLivingNpcsForThisMonth = Object.values(updatedNpcs).flat().filter((npc: NPC) => !currentState.defeatedNpcIds.includes(npc.id));
        const currentTimeForThisMonth = advanceTime(currentState.time, month * 30 * 24 * 60);

        for (const mapIdStr in NPC_SPAWN_DEFINITIONS_BY_MAP) {
            const mapId = mapIdStr as MapID;
            const definitions = NPC_SPAWN_DEFINITIONS_BY_MAP[mapId];

            definitions.forEach((rule, index) => {
                if (rule.type !== 'procedural') return;

                const ruleId = `${mapId}-${index}`;

                // --- Recruitment Logic ---
                if (rule.recruitment) {
                    const lastRecruitmentTime = updatedFactionRecruitmentTimers[ruleId] || { year: 1, month: 1, day: 1, season: 'Xuân', hour: 0, minute: 0 };
                    let shouldRecruit = false;
                    let isGuaranteed = false;

                    // Check for guaranteed recruitment based on years passed
                    if (rule.recruitment.guaranteedIntervalYears) {
                        if (currentTimeForThisMonth.year >= lastRecruitmentTime.year + rule.recruitment.guaranteedIntervalYears) {
                            shouldRecruit = true;
                            isGuaranteed = true;
                        }
                    }

                    // If not guaranteed, check for monthly random chance
                    if (!shouldRecruit && rule.recruitment.monthlyChance) {
                        if (Math.random() < rule.recruitment.monthlyChance) {
                            shouldRecruit = true;
                        }
                    }
                    
                    if (shouldRecruit) {
                        const livingNpcsForRule = allLivingNpcsForThisMonth.filter((npc: NPC) => npc.spawnRuleId === ruleId);
                        const currentCount = livingNpcsForRule.length;
                        const targetCount = rule.stableCount || 0;
                        let recruitmentChance = 1.0;
                        let [minBatch, maxBatch] = rule.recruitment.batchSize;

                        if (targetCount > 0) {
                            const ratio = currentCount / targetCount;
                            if (ratio < 0.8) recruitmentChance = 0.95;
                            else if (ratio < 1.0) recruitmentChance = 0.60;
                            else if (ratio < 1.1) { recruitmentChance = 0.25; maxBatch = Math.max(1, Math.floor(minBatch / 2)); }
                            else if (ratio < 1.25) { recruitmentChance = 0.10; minBatch = 1; maxBatch = 1; }
                            else { recruitmentChance = 0.03; minBatch = 1; maxBatch = 1; }
                        }

                        if (Math.random() < recruitmentChance) {
                            const { roleToRecruit } = rule.recruitment;
                            const numToRecruit = Math.floor(Math.random() * (maxBatch - minBatch + 1)) + minBatch;
                            const roleGroup = rule.roles.find(rg => rg.roleDistribution.some(rd => rd.roleName === roleToRecruit));
                            
                            if (roleGroup) {
                                const faction = FACTIONS.find(f => f.id === roleGroup.factionId);
                                const roleDef = faction?.roles.find(r => r.name === roleToRecruit);
                                if (faction && roleDef) {
                                    let recruitedCount = 0;
                                    for (let i = 0; i < numToRecruit; i++) {
                                        const ageCategory = selectAgeCategory(roleGroup.ageDistribution);
                                        const poiId = roleGroup.poiIds.length > 0 ? roleGroup.poiIds[0] : undefined;
                                        const poi = poiId ? POIS_BY_MAP[mapId as MapID]?.find(p => p.id === poiId) : null;
                                        let newNpcPosition: Position;
                                        if (poi) {
                                            newNpcPosition = {
                                                x: poi.position.x - poi.size.width / 2 + Math.random() * poi.size.width,
                                                y: poi.position.y - poi.size.height / 2 + Math.random() * poi.size.height
                                            };
                                        } else {
                                            const mapData = MAPS[mapId as MapID];
                                            newNpcPosition = { x: Math.random() * mapData.size.width, y: Math.random() * mapData.size.height };
                                        }

                                        const newNpc = createNpcFromData(
                                            { role: roleDef.name, personalityTags: [] },
                                            `recruit-npc-${mapId}-${Date.now()}-${i}`,
                                            newNpcPosition,
                                            currentTimeForThisMonth,
                                            mapId,
                                            updatedNameUsageCounts,
                                            roleGroup.factionId,
                                            poiId,
                                            ageCategory,
                                            roleDef,
                                            ruleId
                                        );
                                        
                                        if (!updatedNpcs[mapId]) updatedNpcs[mapId] = [];
                                        updatedNpcs[mapId].push(newNpc);
                                        allLivingNpcsForThisMonth.push(newNpc);
                                        recruitedCount++;
                                    }

                                    if (recruitedCount > 0) {
                                        updatedFactionRecruitmentTimers[ruleId] = currentTimeForThisMonth;
                                        const journalMessage = isGuaranteed
                                            ? `${faction.name} đã mở đại hội thu nhận đệ tử, có ${recruitedCount} tài năng trẻ gia nhập.`
                                            : `${faction.name} đã thu nhận ${recruitedCount} đệ tử mới.`;

                                        const journalEntry: JournalEntry = {
                                            time: currentTimeForThisMonth,
                                            message: journalMessage,
                                            type: 'world'
                                        };
                                        newJournalEntries.push(journalEntry);
                                    }
                                }
                            }
                        }
                    }
                }
                
                // --- Population Stability Logic ---
                if (rule.stableCount) {
                    const STABILITY_CHECK_CHANCE_PER_MONTH = 0.04; // Check roughly every 2 years
                    if (Math.random() < STABILITY_CHECK_CHANCE_PER_MONTH) {
                        const livingNpcsForRule = allLivingNpcsForThisMonth.filter((npc: NPC) => npc.spawnRuleId === ruleId);
                        if (livingNpcsForRule.length < rule.stableCount) {
                            const numToSpawn = rule.stableCount - livingNpcsForRule.length;
                            
                            const weightedRoles: { item: { roleDef: RoleSpawnDefinition, roleName: string }, weight: number }[] = [];
                            rule.roles.forEach(roleGroup => {
                                roleGroup.roleDistribution.forEach(dist => {
                                    weightedRoles.push({ item: { roleDef: roleGroup, roleName: dist.roleName }, weight: dist.count });
                                });
                            });

                            if (weightedRoles.length > 0) {
                                for (let i = 0; i < numToSpawn; i++) {
                                    const selectedRoleInfo = weightedRandom(weightedRoles);
                                    if (selectedRoleInfo) {
                                        const { roleDef: roleGroup, roleName } = selectedRoleInfo;
                                        const faction = FACTIONS.find(f => f.id === roleGroup.factionId);
                                        const roleDefinition = faction?.roles.find(r => r.name === roleName);

                                        if (faction && roleDefinition) {
                                            const ageCategory = selectAgeCategory(roleGroup.ageDistribution);
                                            const poiId = roleGroup.poiIds.length > 0 ? roleGroup.poiIds[Math.floor(Math.random() * roleGroup.poiIds.length)] : undefined;
                                            const poi = poiId ? POIS_BY_MAP[mapId as MapID]?.find(p => p.id === poiId) : null;
                                            let newNpcPosition: Position;
                                            if (poi) {
                                                newNpcPosition = {
                                                    x: poi.position.x - poi.size.width / 2 + Math.random() * poi.size.width,
                                                    y: poi.position.y - poi.size.height / 2 + Math.random() * poi.size.height
                                                };
                                            } else {
                                                const mapData = MAPS[mapId as MapID];
                                                newNpcPosition = { x: Math.random() * mapData.size.width, y: Math.random() * mapData.size.height };
                                            }

                                            const newNpc = createNpcFromData(
                                                { role: roleDefinition.name, personalityTags: [] },
                                                `respawn-npc-${mapId}-${Date.now()}-${i}`,
                                                newNpcPosition,
                                                currentTimeForThisMonth,
                                                mapId,
                                                updatedNameUsageCounts,
                                                roleGroup.factionId,
                                                poiId,
                                                ageCategory,
                                                roleDefinition,
                                                ruleId
                                            );
                                            
                                            if (!updatedNpcs[mapId]) updatedNpcs[mapId] = [];
                                            updatedNpcs[mapId].push(newNpc);
                                            allLivingNpcsForThisMonth.push(newNpc);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    return { updatedNpcs, newJournalEntries, updatedNameUsageCounts, updatedFactionRecruitmentTimers };
};