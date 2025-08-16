
import { REALM_PROGRESSION } from '../constants';
import { INITIAL_PLAYER_STATE as BASE_INITIAL_PLAYER_STATE } from '../hooks/usePlayerPersistence';
import type { CultivationState, CharacterAttributes, CombatStats } from '../types/stats';
import type { LearnedSkill, Skill } from '../types/skill';
import type { InventorySlot, Item } from '../types/item';
import type { EquipmentSlot } from '../types/equipment';
import type { LinhCan } from '../types/linhcan';
import { LINH_CAN_DATA } from '../data/linhcan';
import { ALL_SKILLS } from '../data/skills/skills';

export const calculateAllStats = (
    baseAttributes: CharacterAttributes, 
    cultivation: CultivationState,
    baseCultivationStats: Partial<CombatStats & CharacterAttributes>,
    learnedSkills: LearnedSkill[],
    allSkills: Skill[],
    equipment: Partial<Record<EquipmentSlot, InventorySlot>>,
    allItems: Item[],
    linhCan: LinhCan[]
): { finalStats: CombatStats; finalAttributes: CharacterAttributes } => {
    // 1. Start with absolute base stats of a mortal. This is the crucial fix to prevent compounding bonuses.
    const finalStats: Required<Mutable<Partial<CombatStats>>> = { ...BASE_INITIAL_PLAYER_STATE.stats };
    const modifiedAttributes: CharacterAttributes = { ...BASE_INITIAL_PLAYER_STATE.attributes };

    // Apply pre-rolled stats from cultivation
    for(const key in baseCultivationStats) {
        const statKey = key as keyof (CombatStats & CharacterAttributes);
        const value = baseCultivationStats[statKey] || 0;
        if (statKey in finalStats) {
            (finalStats as any)[statKey] += value;
        } else if (statKey in modifiedAttributes) {
            (modifiedAttributes as any)[statKey] += value;
        }
    }
    
    // --- Apply Tam Phap bonuses ---
    learnedSkills.forEach(learnedSkill => {
        const skillDef = allSkills.find(s => s.id === learnedSkill.skillId);
        if (skillDef?.type === 'TAM_PHAP') {
            skillDef.bonuses.forEach(bonus => {
                const bonusValue = bonus.valuePerLevel * learnedSkill.currentLevel;
                if (bonus.targetAttribute) {
                    if (bonus.modifier === 'ADDITIVE') {
                        modifiedAttributes[bonus.targetAttribute] += bonusValue;
                    } else if (bonus.modifier === 'MULTIPLIER') {
                        modifiedAttributes[bonus.targetAttribute] *= (1 + bonusValue);
                    }
                }
                if (bonus.targetStat) {
                    if (bonus.modifier === 'ADDITIVE') {
                        finalStats[bonus.targetStat] += bonusValue;
                    } else if (bonus.modifier === 'MULTIPLIER') {
                        finalStats[bonus.targetStat] *= (1 + bonusValue);
                    }
                }
            });
        }
    });

    // --- Apply Equipment bonuses ---
    Object.values(equipment).forEach(equippedItem => {
        if (!equippedItem) return;
        const itemDef = allItems.find(i => i.id === equippedItem.itemId);
        itemDef?.bonuses?.forEach(bonus => {
            const value = bonus.value;
             if (bonus.targetAttribute) {
                if (bonus.modifier === 'ADDITIVE') {
                    modifiedAttributes[bonus.targetAttribute] += value;
                } else if (bonus.modifier === 'MULTIPLIER') {
                    modifiedAttributes[bonus.targetAttribute] *= (1 + value);
                }
            }
            if (bonus.targetStat) {
                if (bonus.modifier === 'ADDITIVE') {
                    finalStats[bonus.targetStat] += value;
                } else if (bonus.modifier === 'MULTIPLIER') {
                    finalStats[bonus.targetStat] *= (1 + value);
                }
            }
        });
    });

    // --- Apply Linh Can bonuses ---
    linhCan.forEach(lc => {
        const lcData = LINH_CAN_DATA[lc.type];
        lcData.bonuses.forEach(bonus => {
            const bonusValue = bonus.valuePerPurity * lc.purity;
            if (bonus.targetAttribute) {
                 if (bonus.modifier === 'ADDITIVE') {
                    modifiedAttributes[bonus.targetAttribute] += bonusValue;
                } else if (bonus.modifier === 'MULTIPLIER') {
                    modifiedAttributes[bonus.targetAttribute] *= (1 + bonusValue);
                }
            }
            if (bonus.targetStat) {
                 if (bonus.modifier === 'ADDITIVE') {
                    finalStats[bonus.targetStat] += bonusValue;
                } else if (bonus.modifier === 'MULTIPLIER') {
                    finalStats[bonus.targetStat] *= (1 + bonusValue);
                }
            }
        });
    });

    // 4. Finally, add contributions from the final modified attributes to stats
    finalStats.maxHp += modifiedAttributes.canCot * 5;
    finalStats.maxMana += modifiedAttributes.thanThuc * 3 + modifiedAttributes.ngoTinh * 3 + modifiedAttributes.tamCanh * 4;
    finalStats.attackPower += modifiedAttributes.thanThuc * 1;
    finalStats.defensePower += Math.round(modifiedAttributes.canCot * 0.5);
    finalStats.speed += modifiedAttributes.thanPhap * 0.5;
    finalStats.critRate += modifiedAttributes.thanThuc / 400 + modifiedAttributes.coDuyen / 800;
    finalStats.critDamage += modifiedAttributes.coDuyen / 500;
    finalStats.evasionRate += modifiedAttributes.thanPhap / 400;
    finalStats.maxQi = getRealmLevelInfo(cultivation)?.qiRequired || 0;


    // Round the final stats to avoid floating point issues
    Object.keys(finalStats).forEach(key => {
        const statKey = key as keyof CombatStats;
        if (statKey !== 'critRate' && statKey !== 'critDamage' && statKey !== 'evasionRate') {
            finalStats[statKey] = Math.round(finalStats[statKey]);
        }
    });

    // Also round the final attributes to ensure they are integers
    Object.keys(modifiedAttributes).forEach(key => {
        const attrKey = key as keyof CharacterAttributes;
        modifiedAttributes[attrKey] = Math.round(modifiedAttributes[attrKey]);
    });

    return { finalStats, finalAttributes: modifiedAttributes };
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export const getRealmLevelInfo = (cultivation: CultivationState) => {
    // Handle mortal state
    if (cultivation.level < 0) return null;
    return REALM_PROGRESSION[cultivation.realmIndex]?.levels[cultivation.level];
}

export const getCultivationInfo = (cultivation: CultivationState) => {
    if (cultivation.level < 0) {
        return { name: '凡人 (Phàm Nhân)', levelName: '', realmName: 'Phàm Nhân', isMaxLevel: false };
    }

    const realm = REALM_PROGRESSION[cultivation.realmIndex];
    if (!realm) {
        // Fallback for safety, should not happen
        return { name: 'Unknown Realm', levelName: '', realmName: 'Unknown', isMaxLevel: true };
    }
    
    const levelInfo = realm.levels[cultivation.level];
    if (!levelInfo) {
        const lastLevelInRealm = realm.levels[realm.levels.length - 1];
         return { name: `${realm.name} - ${lastLevelInRealm.levelName}`, levelName: lastLevelInRealm.levelName, realmName: realm.name, isMaxLevel: false };
    }

    const name = `${realm.name} - ${levelInfo.levelName}`;
    const isMaxLevel = cultivation.realmIndex === REALM_PROGRESSION.length - 1 && cultivation.level === realm.levels.length - 1;

    return { name, levelName: levelInfo.levelName, realmName: realm.name, isMaxLevel };
};

export const getNextCultivationLevel = (cultivation: CultivationState): CultivationState | null => {
    if (cultivation.level < 0) {
        return { realmIndex: 0, level: 0 };
    }
    
    const currentRealm = REALM_PROGRESSION[cultivation.realmIndex];
    if (!currentRealm) return null;

    if (cultivation.level < currentRealm.levels.length - 1) {
        return {
            realmIndex: cultivation.realmIndex,
            level: cultivation.level + 1,
        };
    }

    if (cultivation.realmIndex < REALM_PROGRESSION.length - 1) {
        return {
            realmIndex: cultivation.realmIndex + 1,
            level: 0,
        };
    }
    
    return null;
}
