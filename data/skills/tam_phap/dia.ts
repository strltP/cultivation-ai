import type { Skill } from '../../../types/skill';
import type { CharacterAttributes } from '../../../types/stats';

export const TAM_PHAP_DIA: Skill[] = [
    {
        id: 'tam-phap-dia-1',
        name: 'Vạn Kiếm Quy Tông',
        description: 'Tâm pháp của kiếm tu, tăng cường sức mạnh của các đòn tấn công.',
        type: 'TAM_PHAP',
        tier: 'DIA',
        origin: { type: 'FACTION', factionId: 'THANH_VAN_MON', factionName: 'Thanh Vân Môn', requiredRole: 'Chân truyền đệ tử' },
        requiredLinhCan: ['KIM'],
        maxLevel: 6,
        enlightenmentBaseCost: 1000,
        enlightenmentCostPerLevel: 200,
        enlightenmentCostExponent: 1.9,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.05 }, // +5% per level
        ],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.05 } }
        }))
    },
    {
        id: 'tam-phap-dia-2',
        name: 'Thái Cực Tâm Kinh',
        description: 'Tâm pháp đạo gia, chú trọng cân bằng, tăng nhẹ toàn bộ thuộc tính cơ bản.',
        type: 'TAM_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Tâm pháp của một tông môn đạo gia đã ẩn thế từ lâu.' },
        maxLevel: 6,
        enlightenmentBaseCost: 1500,
        enlightenmentCostPerLevel: 300,
        enlightenmentCostExponent: 2.0,
        bonuses: [
            { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 5 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 5 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 5 },
            { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 5 },
        ],
        levelBonuses: Array.from({ length: 5 }, (_, i) => {
            const level = i + 2;
            const attributesToCycle: (keyof CharacterAttributes)[] = ['canCot', 'thanPhap', 'thanThuc', 'ngoTinh', 'tamCanh'];
            const attribute = attributesToCycle[i % attributesToCycle.length];
            return {
                level,
                upgrade: {
                    addBonus: { targetAttribute: attribute, modifier: 'ADDITIVE', value: 5 }
                }
            };
        })
    },
    {
        id: 'tam-phap-dia-4',
        name: 'Hải Vương Kinh',
        description: 'Tâm pháp thượng cổ, giúp người tu luyện có được trữ lượng linh lực dồi dào như biển cả, vô cùng vô tận.',
        type: 'TAM_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Tâm pháp thượng cổ được tìm thấy trong một di tích dưới đáy biển.' },
        requiredLinhCan: ['THUY'],
        maxLevel: 6,
        enlightenmentBaseCost: 2000,
        enlightenmentCostPerLevel: 400,
        enlightenmentCostExponent: 1.95,
        bonuses: [
            { targetStat: 'maxMana', modifier: 'MULTIPLIER', value: 0.1 }, 
        ],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxMana', modifier: 'MULTIPLIER', value: 0.1 } }
        }))
    },
];
