import type { PlayerState, NPC, LeaderboardEntry, GameTime } from '../types/character';
import type { SkillTier } from '../types/skill';
import type { MapID } from '../types/map';
import { getCultivationInfo } from './cultivationService';
import { ALL_ITEMS } from '../data/items/index';
import { ALL_SKILLS } from '../data/skills/skills';
import { FACTIONS } from '../data/factions';

const TIER_SCORES: Record<SkillTier, number> = {
    HOANG: 100,
    HUYEN: 500,
    DIA: 2000,
    THIEN: 10000,
};

const THIEN_NAM_MAP_IDS: MapID[] = [
    'THIEN_NAM', 'HAC_AM_SAM_LAM', 'THAT_HUYEN_THANH', 'MO_LINH_THANH',
    'LUU_LY_TONG', 'VAN_BAO_LAU', 'THIEN_MA_TUU_LAU', 'THANH_VAN_MON',
    'DUOC_VIEN', 'LUC_YEN_THON', 'MOC_GIA', 'TIEU_GIA'
];

/**
 * Calculates a "Power Score" for a given NPC based on Idea 1.
 * This score is a composite of various stats to determine overall strength.
 */
export const calculatePowerScore = (npc: NPC): number => {
    if (!npc.cultivation) {
        return 0;
    }

    let score = 0;

    // 1. Cảnh giới & Cấp độ (Most important)
    score += npc.cultivation.realmIndex * 20000;
    score += npc.cultivation.level * 1000;

    // 2. Thuộc tính cơ bản
    score += (npc.attributes.canCot + npc.attributes.thanPhap + npc.attributes.thanThuc +
              npc.attributes.ngoTinh + npc.attributes.coDuyen + npc.attributes.tamCanh) * 5;

    // 3. Chỉ số chiến đấu
    score += Math.floor(npc.stats.maxHp / 10);
    score += npc.stats.attackPower * 2;
    score += npc.stats.defensePower * 2;
    score += npc.stats.speed;
    score += Math.floor(npc.stats.critRate * 1000);
    score += Math.floor(npc.stats.critDamage * 100);

    // 4. Trang bị
    for (const slot in npc.equipment) {
        const itemSlot = npc.equipment[slot as keyof typeof npc.equipment];
        if (itemSlot) {
            const itemDef = ALL_ITEMS.find(i => i.id === itemSlot.itemId);
            if (itemDef && itemDef.tier) {
                score += TIER_SCORES[itemDef.tier];
            }
        }
    }

    // 5. Công pháp & Tâm pháp
    for (const learnedSkill of npc.learnedSkills) {
        const skillDef = ALL_SKILLS.find(s => s.id === learnedSkill.skillId);
        if (skillDef) {
            score += TIER_SCORES[skillDef.tier] * (1 + (learnedSkill.currentLevel / 10));
        }
    }

    return Math.floor(score);
};

/**
 * Calculates a "Potential Score" for a young cultivator.
 * The score is based on their power relative to their age.
 */
export const calculatePotentialScore = (npc: NPC, powerScore: number, currentTime: GameTime): number => {
    const age = currentTime.year - npc.birthTime.year;
    if (age <= 0) return powerScore; // Avoid division by zero
    return Math.floor(powerScore / age);
}

/**
 * Updates the "Thập Đại Cường Giả" (Top 10 Strongest) leaderboard.
 * @param currentState The current player state.
 * @returns The updated player state with the new leaderboard.
 */
export const updatePowerLeaderboard = (currentState: PlayerState): PlayerState => {
    const allLivingNpcs = Object.values(currentState.generatedNpcs)
        .flat()
        .filter(npc => npc && npc.npcType === 'cultivator' && !currentState.defeatedNpcIds.includes(npc.id));

    const rankedNpcs = allLivingNpcs.map(npc => {
        const score = calculatePowerScore(npc);
        const age = currentState.time.year - npc.birthTime.year;
        return { npc, score, age };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

    const newLeaderboard: LeaderboardEntry[] = rankedNpcs.map(item => {
        const factionName = FACTIONS.find(f => f.id === item.npc.factionId)?.name || 'Tán Tu';
        return {
            npcId: item.npc.id,
            name: item.npc.name,
            title: item.npc.title,
            factionName: factionName,
            cultivationName: getCultivationInfo(item.npc.cultivation!).name,
            score: item.score,
            age: item.age,
        };
    });

    const updatedState = {
        ...currentState,
        leaderboards: {
            ...currentState.leaderboards,
            CHIEN_THAN_BANG: newLeaderboard,
        },
        lastLeaderboardUpdateYear: currentState.time.year,
    };
    
    return updatedState;
};

/**
 * Updates the "Thiên Nam Thập Nhị Tinh Tú" (Top 12 Young Stars of Thien Nam) leaderboard.
 * @param currentState The current player state.
 * @returns The updated player state with the new leaderboard.
 */
export const updateYoungStarsLeaderboard = (currentState: PlayerState): PlayerState => {
    const allLivingNpcs = Object.values(currentState.generatedNpcs).flat()
        .filter(npc => {
            if (!npc || npc.npcType !== 'cultivator' || currentState.defeatedNpcIds.includes(npc.id)) {
                return false;
            }
            const age = currentState.time.year - npc.birthTime.year;
            return age < 30 && THIEN_NAM_MAP_IDS.includes(npc.homeMapId);
        });

    const rankedNpcs = allLivingNpcs.map(npc => {
        const powerScore = calculatePowerScore(npc);
        const age = currentState.time.year - npc.birthTime.year;
        const potentialScore = calculatePotentialScore(npc, powerScore, currentState.time);
        return { npc, score: potentialScore, age };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

    const newLeaderboard: LeaderboardEntry[] = rankedNpcs.map(item => {
        const factionName = FACTIONS.find(f => f.id === item.npc.factionId)?.name || 'Tán Tu';
        return {
            npcId: item.npc.id,
            name: item.npc.name,
            title: item.npc.title,
            factionName: factionName,
            cultivationName: getCultivationInfo(item.npc.cultivation!).name,
            score: item.score,
            age: item.age,
        };
    });

    const updatedState = {
        ...currentState,
        leaderboards: {
            ...currentState.leaderboards,
            THIEN_NAM_TINH_TU: newLeaderboard,
        },
        lastYoungStarsLeaderboardUpdateYear: currentState.time.year,
    };
    
    return updatedState;
};