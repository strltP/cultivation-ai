import type { Skill } from '../../../types/skill';
import type { CharacterAttributes } from '../../../types/stats';

export const TAM_PHAP_THIEN: Skill[] = [
    {
        id: 'tam-phap-thien-1',
        name: 'Bất Diệt Kim Thân',
        description: 'Tâm pháp luyện thể tối thượng, thân thể trở nên bất hoại, tăng mạnh Sinh Lực và Lực Thủ.',
        type: 'TAM_PHAP',
        tier: 'THIEN',
        origin: { type: 'UNKNOWN', description: 'Công pháp luyện thể tối thượng, tương truyền do một vị Thể Tu thượng cổ sáng tạo.' },
        requiredLinhCan: ['KIM', 'THO'],
        maxLevel: 4,
        enlightenmentBaseCost: 5000,
        enlightenmentCostPerLevel: 1000,
        enlightenmentCostExponent: 2.3,
        bonuses: [
            { targetStat: 'maxHp', modifier: 'MULTIPLIER', value: 0.2 }, // +20% HP
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', value: 0.15 }, // +15% Def
        ],
        levelBonuses: Array.from({ length: 3 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxHp', modifier: 'MULTIPLIER', value: 0.2 } }
        }))
    },
    {
        id: 'tam-phap-thien-2',
        name: 'Thánh Linh Tâm Pháp',
        description: 'Tâm pháp thượng cổ, tương truyền do Thánh Nhân sáng tạo, tăng toàn bộ thuộc tính và trữ lượng Linh Lực.',
        type: 'TAM_PHAP',
        tier: 'THIEN',
        origin: { type: 'UNKNOWN', description: 'Tâm pháp do Thánh Nhân viễn cổ lưu lại, đã thất truyền.' },
        requiredLinhCan: ['QUANG'],
        maxLevel: 4,
        enlightenmentBaseCost: 8000,
        enlightenmentCostPerLevel: 2000,
        enlightenmentCostExponent: 2.5,
        bonuses: [
            { targetAttribute: 'canCot', modifier: 'MULTIPLIER', value: 0.1 },
            { targetAttribute: 'thanPhap', modifier: 'MULTIPLIER', value: 0.1 },
            { targetAttribute: 'thanThuc', modifier: 'MULTIPLIER', value: 0.1 },
            { targetAttribute: 'ngoTinh', modifier: 'MULTIPLIER', value: 0.1 },
            { targetStat: 'maxMana', modifier: 'MULTIPLIER', value: 0.2 },
        ],
        levelBonuses: Array.from({ length: 3 }, (_, i) => {
             const level = i + 2;
            const attributesToCycle: (keyof CharacterAttributes)[] = ['canCot', 'thanPhap', 'thanThuc', 'ngoTinh', 'tamCanh'];
            const attribute = attributesToCycle[i % attributesToCycle.length];
            return {
                level,
                upgrade: {
                    addBonus: { targetAttribute: attribute, modifier: 'MULTIPLIER', value: 0.1 }
                }
            };
        })
    },
    {
        id: 'tam-phap-thien-3',
        name: 'Đấu Chiến Thánh Pháp',
        description: 'Pháp môn chiến đấu chí cao, càng chiến càng mạnh, giúp người tu luyện có được ý chí và sức mạnh chiến đấu vô song.',
        type: 'TAM_PHAP',
        tier: 'THIEN',
        origin: { type: 'UNKNOWN', description: 'Pháp môn của một vị chiến thần cổ đại, càng chiến càng mạnh.' },
        requiredLinhCan: ['KIM', 'LOI'],
        maxLevel: 4,
        enlightenmentBaseCost: 6000,
        enlightenmentCostPerLevel: 1500,
        enlightenmentCostExponent: 2.4,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.25 },
            { targetStat: 'critRate', modifier: 'MULTIPLIER', value: 0.04 },
        ],
        levelBonuses: Array.from({ length: 3 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.25 } }
        }))
    },
];
