
import type { Skill, SkillTier } from '../../types/skill';
import { ALL_CONG_PHAP } from './cong_phap';
import { ALL_TAM_PHAP } from './tam_phap';

export const SKILL_TIER_INFO: Record<SkillTier, { name: string; color: string; }> = {
    HOANG: { name: 'Hoàng Giai', color: 'text-yellow-400' },
    HUYEN: { name: 'Huyền Giai', color: 'text-indigo-400' },
    DIA: { name: 'Địa Giai', color: 'text-orange-500' },
    THIEN: { name: 'Thiên Giai', color: 'text-red-500' },
};

export const ALL_SKILLS: Skill[] = [
    ...ALL_CONG_PHAP,
    ...ALL_TAM_PHAP,
];