import type { CharacterAttributes, CombatStats } from './stats';
import type { WeaponType } from './equipment';
import type { LinhCanType } from './linhcan';

export type SkillTier = 'HOANG' | 'HUYEN' | 'DIA' | 'THIEN';
export type SkillType = 'CONG_PHAP' | 'TAM_PHAP';

export type EffectType = 'STUN' | 'POISON' | 'BURN' | 'SLOW' | 'HEAL' | 'BUFF' | 'DEBUFF' | 'ENVIRONMENTAL_DEBUFF';

export const EFFECT_TYPE_NAMES: Record<EffectType, string> = {
    STUN: 'Choáng',
    POISON: 'Trúng Độc',
    BURN: 'Thiêu Đốt',
    SLOW: 'Làm Chậm',
    HEAL: 'Hồi Phục',
    BUFF: 'Tăng Cường',
    DEBUFF: 'Suy Yếu',
    ENVIRONMENTAL_DEBUFF: 'Linh Khí Áp Chế',
};

export interface SkillOrigin {
  type: 'BASIC' | 'UNKNOWN' | 'FACTION';
  description?: string;     // Dùng cho type: 'UNKNOWN'
  factionId?: string;       // Dùng cho type: 'FACTION'
  factionName?: string;     // Dùng cho type: 'FACTION' (để hiển thị cho tiện)
  requiredRole?: string;    // Dùng cho type: 'FACTION' (vai trò yêu cầu, ví dụ: "Trưởng lão")
}

export interface SkillEffect {
    type: EffectType;
    chance: number; // 0 to 1
    duration?: number; // In turns
    value?: number; // Base value (e.g., damage for POISON, heal amount for HEAL)
    valueIsPercent?: boolean; // If true, value is treated as a percentage (e.g., 0.1 for 10%)
    scalingAttribute?: keyof CharacterAttributes; // Attribute to scale with
    scalingFactor?: number; // How much it scales (e.g., 0.5 * attribute value)
    targetStat?: keyof CombatStats | keyof CharacterAttributes; // For BUFF/DEBUFF
    modifier?: 'ADDITIVE' | 'MULTIPLIER'; // For BUFF/DEBUFF
}

export interface SkillDamage {
    baseValue: number;
    attackPowerFactor?: number; // Hệ số ảnh hưởng từ Lực Công. Ví dụ: 0.5 nghĩa là 50% Lực Công được cộng vào sát thương.
    scalingAttribute?: keyof CharacterAttributes; // e.g., 'linhLuc'
    scalingFactor?: number; // e.g., 0.5 * linhLuc
}

export interface SkillBonus {
    targetStat?: keyof CombatStats;
    targetAttribute?: keyof CharacterAttributes;
    modifier: 'ADDITIVE' | 'MULTIPLIER';
    value: number; // Base value, not per level
}

// This is the core of the new system
export interface SkillUpgrade {
    // Damage modifications
    damageIncrease?: number;
    
    // Mana cost modifications
    manaCostIncrease?: number;
    manaCostPercentIncrease?: number; // As a fraction, e.g., 0.02 for 2%

    // Effect modifications
    addEffect?: SkillEffect; // Add a completely new effect
    modifyEffect?: { // Modify an existing effect
        type: EffectType;
        chanceIncrease?: number;
        durationIncrease?: number;
        valueIncrease?: number;
    };
    
    // Tam Phap modifications
    addBonus?: SkillBonus;
}

export interface SkillLevelDefinition {
    level: number;
    description?: string; // Optional flavor text for this level
    upgrade: SkillUpgrade;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    type: SkillType;
    tier: SkillTier;
    origin: SkillOrigin;
    weaponType?: WeaponType;
    requiredLinhCan?: LinhCanType[];
    maxLevel: number;
    enlightenmentBaseCost: number;
    enlightenmentCostPerLevel: number;
    enlightenmentCostExponent: number; // Số mũ cho công thức tính chi phí đa thức

    // Base values at Level 1
    manaCost?: number;
    damage?: SkillDamage;
    effects?: SkillEffect[]; // Base effects at Lvl 1
    bonuses?: SkillBonus[]; // Base bonuses for Tam Phap at Lvl 1

    // New non-linear progression
    levelBonuses: SkillLevelDefinition[];
}


export interface LearnedSkill {
    skillId: string;
    currentLevel: number;
}