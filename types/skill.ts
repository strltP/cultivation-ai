import type { CharacterAttributes, CombatStats } from './stats';
import type { WeaponType } from './equipment';

export type SkillTier = 'HOANG' | 'HUYEN' | 'DIA' | 'THIEN';
export type SkillType = 'CONG_PHAP' | 'TAM_PHAP';

export interface SkillBonus {
    targetStat?: keyof CombatStats;
    targetAttribute?: keyof CharacterAttributes;
    modifier: 'ADDITIVE' | 'MULTIPLIER';
    valuePerLevel: number;
}

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

export interface SkillEffect {
    type: EffectType;
    chance: number; // 0 to 1
    duration?: number; // In turns
    value?: number; // Base value (e.g., damage for POISON, heal amount for HEAL)
    valuePerLevel?: number; // Extra value per skill level
    valueIsPercent?: boolean; // If true, value is treated as a percentage (e.g., 0.1 for 10%)
    scalingAttribute?: keyof CharacterAttributes; // Attribute to scale with
    scalingFactor?: number; // How much it scales (e.g., 0.5 * attribute value)
    targetStat?: keyof CombatStats | keyof CharacterAttributes; // For BUFF/DEBUFF
    modifier?: 'ADDITIVE' | 'MULTIPLIER'; // For BUFF/DEBUFF
}

export interface SkillDamage {
    baseValue: number;
    valuePerLevel: number;
    attackPowerFactor?: number; // Hệ số ảnh hưởng từ Lực Công. Ví dụ: 0.5 nghĩa là 50% Lực Công được cộng vào sát thương.
    scalingAttribute?: keyof CharacterAttributes; // e.g., 'linhLuc'
    scalingFactor?: number; // e.g., 0.5 * linhLuc
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    type: SkillType;
    tier: SkillTier;
    weaponType?: WeaponType;
    maxLevel: number;
    manaCost?: number;
    manaCostPerLevel?: number;
    enlightenmentBaseCost: number;
    enlightenmentCostPerLevel: number;

    // For CONG_PHAP
    damage?: SkillDamage;
    effects?: SkillEffect[];

    // For TAM_PHAP
    bonuses: SkillBonus[];
}


export interface LearnedSkill {
    skillId: string;
    currentLevel: number;
}