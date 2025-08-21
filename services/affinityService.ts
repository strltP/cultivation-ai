import type { NPC } from '../types/character';
import type { Item } from '../types/item';
import type { AffinityLevel } from '../types/character';

export const getAffinityLevel = (score: number): { level: AffinityLevel, color: string, borderColorClass: string } => {
    if (score <= -81) return { level: 'Thù Địch', color: 'text-red-500', borderColorClass: 'border-red-500' };
    if (score <= -31) return { level: 'Ghét Bỏ', color: 'text-orange-400', borderColorClass: 'border-orange-400' };
    if (score <= 30) return { level: 'Xa Lạ', color: 'text-gray-300', borderColorClass: 'border-gray-300' };
    if (score <= 80) return { level: 'Thân Thiện', color: 'text-green-400', borderColorClass: 'border-green-400' };
    if (score <= 99) return { level: 'Tin Tưởng', color: 'text-blue-400', borderColorClass: 'border-blue-400' };
    return { level: 'Tri Kỷ', color: 'text-yellow-300', borderColorClass: 'border-yellow-300' };
};

export const calculateGiftAffinityChange = (npc: NPC, item: Item | null, playerAffinity: number, linhThachAmount: number = 0): number => {
    let baseChange = 0;
    
    if (item) {
        baseChange = (item.value || 0) / 5;
    } else {
        baseChange = linhThachAmount / 20;
    }

    if (baseChange === 0) return 0;

    let multiplier = 1.0;

    // Personality Multipliers
    if (npc.personalityTags?.includes('Tham lam') && (item?.value || linhThachAmount) > 500) {
        multiplier *= 1.5;
    }
    if (npc.personalityTags?.includes('Hào sảng') && playerAffinity > 0) {
        multiplier *= 1.2;
    }
    if (npc.personalityTags?.includes('Đa nghi') && playerAffinity < 0) {
        multiplier *= 0.7; // Harder to win over
    }

    // Role/Item Type Multiplier
    if (item) {
        const isBlacksmith = npc.role.toLowerCase().includes('rèn');
        const isAlchemist = npc.role.toLowerCase().includes('luyện đan') || npc.role.toLowerCase().includes('dược sư');
        
        if (isBlacksmith && item.type === 'material' && (item.id.includes('thiet') || item.id.includes('khoang'))) {
            multiplier *= 1.8;
        }
        if (isAlchemist && item.type === 'material' && (item.id.includes('thao') || item.id.includes('linh_chi'))) {
             multiplier *= 1.8;
        }
        if (npc.role.toLowerCase().includes('tu sĩ') && (item.type === 'consumable' || item.type === 'book')) {
            multiplier *= 1.3;
        }
    }

    // Relationship Multiplier (Diminishing/Catch-up)
    if (playerAffinity > 60) {
        multiplier *= 0.7; // Diminishing returns
    }
    if (playerAffinity < -20) {
        multiplier *= 1.3; // Easier to make amends
    }

    // Final calculation
    const finalChange = Math.round(baseChange * multiplier);
    
    // Clamp the change to a reasonable amount per gift
    return Math.max(1, Math.min(finalChange, 25));
};
