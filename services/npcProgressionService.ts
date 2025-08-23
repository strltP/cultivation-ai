import type { PlayerState, NPC, JournalEntry } from '../types/character';
import { DAYS_PER_MONTH, REALM_PROGRESSION } from '../constants';
import { getNextCultivationLevel, getRealmLevelInfo, calculateAllStats, getCultivationInfo } from './cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { ALL_ITEMS } from '../data/items/index';
import type { CharacterAttributes, CombatStats } from '../types/stats';

/**
 * Processes the cultivation progression for all NPCs over a specified number of months.
 * This handles passive Qi/Cam Ngo gain, breakthroughs, and skill level-ups.
 * It does NOT handle NPC movement or complex actions, which are handled by the more frequent game loop.
 * @param currentState The current state of the player, containing all NPC data.
 * @param monthsToSkip The number of months to simulate progression for.
 * @returns An object containing the updated NPC records and any new journal entries generated.
 */
export const processNpcTimeSkip = (
    currentState: PlayerState,
    monthsToSkip: number
): { updatedNpcs: Record<string, NPC[]>, newJournalEntries: JournalEntry[] } => {
    
    if (monthsToSkip <= 0) {
        return { updatedNpcs: currentState.generatedNpcs, newJournalEntries: [] };
    }

    const newGeneratedNpcs = JSON.parse(JSON.stringify(currentState.generatedNpcs));
    const newJournalEntries: JournalEntry[] = [];
    const totalHoursPassed = monthsToSkip * DAYS_PER_MONTH * 24;

    for (const mapId_str in newGeneratedNpcs) {
        for (const npc of newGeneratedNpcs[mapId_str]) {
            if (npc.npcType !== 'cultivator' || !npc.cultivation) continue;
            if (currentState.defeatedNpcIds.includes(npc.id)) continue;

            // --- Part 1: Passive Cultivation Gain ---
            let intentMultiplier = 1.0;
            if (npc.currentIntent) {
                switch (npc.currentIntent.type) {
                    case 'MEDITATE':  intentMultiplier = 1.2; break; // Giảm từ 2.0
                    case 'GATHER':    intentMultiplier = 0.5; break;
                    case 'HUNT':      intentMultiplier = 0.5; break;
                    case 'TRADE':     intentMultiplier = 0.3; break;
                    case 'CHALLENGE': intentMultiplier = 0.2; break;
                }
            }
            const BASE_QI_PER_HOUR = 0.08;
            const NGO_TINH_QI_FACTOR = 0.003;
            const BASE_CAM_NGO_PER_HOUR = 1 / 90; // ~0.0111, giảm từ 0.1
            const NGO_TINH_CAM_NGO_FACTOR = 1 / 450; // ~0.0022, giảm từ 0.02
            const realmMultiplier = 1 + (npc.cultivation.realmIndex * 0.15);
            
            const qiPerHour = (BASE_QI_PER_HOUR + (npc.attributes.ngoTinh * NGO_TINH_QI_FACTOR)) * realmMultiplier * intentMultiplier;
            const camNgoPerHour = (BASE_CAM_NGO_PER_HOUR + (npc.attributes.ngoTinh * NGO_TINH_CAM_NGO_FACTOR)) * realmMultiplier * intentMultiplier;
            
            const passiveQiGained = Math.round(qiPerHour * totalHoursPassed);
            const passiveCamNgoGained = Math.round(camNgoPerHour * totalHoursPassed);

            if (passiveQiGained > 0) npc.qi = Math.min(npc.stats.maxQi, (npc.qi || 0) + passiveQiGained);
            if (passiveCamNgoGained > 0) npc.camNgo = (npc.camNgo || 0) + passiveCamNgoGained;

            // --- Part 2: Active Progression (Breakthrough & Skill Up) ---
            if (npc.qi >= npc.stats.maxQi) {
                const nextLevel = getNextCultivationLevel(npc.cultivation);
                if (nextLevel) {
                    const newLevelInfo = getRealmLevelInfo(nextLevel);
                    for (const key in newLevelInfo?.bonuses) {
                        const statKey = key as keyof (CombatStats & CharacterAttributes);
                        const value = newLevelInfo!.bonuses[statKey];
                        let rolledValue = typeof value === 'number' ? value : Math.floor(Math.random() * (value![1] - value![0] + 1)) + value![0];
                        (npc.cultivationStats as any)[statKey] = ((npc.cultivationStats as any)[statKey] || 0) + rolledValue;
                    }
                    npc.cultivation = nextLevel;
                    const { finalStats, finalAttributes } = calculateAllStats(npc.baseAttributes, npc.cultivation, npc.cultivationStats, npc.learnedSkills, ALL_SKILLS, npc.equipment, ALL_ITEMS, npc.linhCan);
                    npc.stats = finalStats;
                    npc.attributes = finalAttributes;
                    npc.hp = finalStats.maxHp;
                    npc.mana = finalStats.maxMana;
                    npc.qi = 0;
                    
                    const newCultivationInfo = getCultivationInfo(nextLevel);
                    const journalEntry: JournalEntry = { time: currentState.time, message: `${npc.name} bế quan khổ tu, cuối cùng đã thành công đột phá đến ${newCultivationInfo.name}!`, type: 'world' };
                    if (!npc.actionHistory) npc.actionHistory = [];
                    npc.actionHistory.push(journalEntry);
                    newJournalEntries.push(journalEntry);
                }
            } else if (npc.camNgo > 0) {
                const upgradableSkills = npc.learnedSkills
                    .map(ls => ({ def: ALL_SKILLS.find(s => s.id === ls.skillId), learned: ls }))
                    .filter(s => s.def && s.learned.currentLevel < s.def.maxLevel)
                    .map(s => {
                        const exponent = s.def!.enlightenmentCostExponent || 1;
                        const cost = Math.round(s.def!.enlightenmentBaseCost + s.def!.enlightenmentCostPerLevel * Math.pow(s.learned.currentLevel, exponent));
                        return { ...s, cost };
                    });
                
                if (upgradableSkills.length > 0) {
                    upgradableSkills.sort((a, b) => a.cost - b.cost);
                    const cheapestUpgrade = upgradableSkills[0];
                    if (npc.camNgo >= cheapestUpgrade.cost) {
                        npc.camNgo -= cheapestUpgrade.cost;
                        cheapestUpgrade.learned.currentLevel++;
                        if (cheapestUpgrade.def!.type === 'TAM_PHAP') {
                             const { finalStats, finalAttributes } = calculateAllStats(npc.baseAttributes, npc.cultivation, npc.cultivationStats, npc.learnedSkills, ALL_SKILLS, npc.equipment, ALL_ITEMS, npc.linhCan);
                             npc.stats = finalStats;
                             npc.attributes = finalAttributes;
                        }
                        const journalEntry: JournalEntry = { time: currentState.time, message: `${npc.name} miệt mài nghiên cứu, đã lĩnh ngộ "${cheapestUpgrade.def!.name}" đến tầng thứ ${cheapestUpgrade.learned.currentLevel}.`, type: 'world' };
                        if (!npc.actionHistory) npc.actionHistory = [];
                        npc.actionHistory.push(journalEntry);
                        newJournalEntries.push(journalEntry);
                    }
                }
            }
        }
    }
    
    return { updatedNpcs: newGeneratedNpcs, newJournalEntries };
};