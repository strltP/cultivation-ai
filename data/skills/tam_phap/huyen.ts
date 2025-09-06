import type { Skill } from '../../../types/skill';
import type { CharacterAttributes } from '../../../types/stats';

export const TAM_PHAP_HUYEN: Skill[] = [
    {
        id: 'tam-phap-huyen-1',
        name: 'Thiết Bố Sam',
        description: 'Vận chuyển linh khí bảo vệ cơ thể, tạo thành một lớp phòng ngự vững chắc như sắt thép.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['KIM', 'THO'],
        maxLevel: 8,
        enlightenmentBaseCost: 180,
        enlightenmentCostPerLevel: 35,
        enlightenmentCostExponent: 1.7,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', value: 0.015 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'defensePower', modifier: 'MULTIPLIER', value: 0.015 } }
        }))
    },
    {
        id: 'tam-phap-huyen-2',
        name: 'Ngự Phong Quyết',
        description: 'Tâm pháp giúp thân thể trở nên nhẹ nhàng, linh hoạt, tăng mạnh Thân Pháp.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        origin: { type: 'FACTION', factionId: 'THANH_VAN_MON', factionName: 'Thanh Vân Môn' },
        requiredLinhCan: ['PHONG'],
        maxLevel: 8,
        enlightenmentBaseCost: 180,
        enlightenmentCostPerLevel: 35,
        enlightenmentCostExponent: 1.7,
        bonuses: [
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 4 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 4 } }
        }))
    },
    {
        id: 'tam-phap-huyen-3',
        name: 'Huyết Sát Kinh',
        description: 'Tâm pháp ma đạo, kích thích tiềm năng cơ thể, tăng Sinh Lực và Lực Công.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        origin: { type: 'UNKNOWN', description: 'Ma công bị cấm, lai lịch không rõ ràng, được cho là có liên quan đến Huyết Sát Tông đã bị diệt vong.' },
        requiredLinhCan: ['AM'],
        maxLevel: 8,
        enlightenmentBaseCost: 250,
        enlightenmentCostPerLevel: 50,
        enlightenmentCostExponent: 1.75,
        bonuses: [
            { targetStat: 'maxHp', modifier: 'MULTIPLIER', value: 0.02 },
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.01 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => {
            const level = i + 2;
            const isAttackPowerLevel = level % 2 === 1; // Levels 3, 5, 7 add Attack Power
            return {
                level,
                upgrade: {
                    addBonus: isAttackPowerLevel
                        ? { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.01 }
                        : { targetStat: 'maxHp', modifier: 'MULTIPLIER', value: 0.02 }
                }
            };
        })
    },
    {
        id: 'tam-phap-huyen-7',
        name: 'Phá Quân Kinh',
        description: 'Tâm pháp của chiến tướng, mỗi đòn đánh đều mang theo sát khí, tăng Lực Công và sát thương bạo kích.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        origin: { type: 'FACTION', factionId: 'TIEU_GIA', factionName: 'Tiêu Gia' },
        requiredLinhCan: ['KIM'],
        maxLevel: 8,
        enlightenmentBaseCost: 300,
        enlightenmentCostPerLevel: 65,
        enlightenmentCostExponent: 1.76,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.01 },
            { targetStat: 'critDamage', modifier: 'ADDITIVE', value: 0.05 }, // +5% crit damage
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.01 } }
        }))
    },
    {
        id: 'tam-phap-huyen-11',
        name: 'Liệt Hỏa Chân Kinh',
        description: 'Tâm pháp của Hỏa tu, tăng cường uy lực của tất cả công pháp hệ Hỏa.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['HOA'],
        maxLevel: 8,
        enlightenmentBaseCost: 300,
        enlightenmentCostPerLevel: 60,
        enlightenmentCostExponent: 1.7,
        bonuses: [
            { targetStat: 'hoaDamageBonus', modifier: 'ADDITIVE', value: 0.03 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'hoaDamageBonus', modifier: 'ADDITIVE', value: 0.03 } }
        }))
    },
     {
        id: 'tam-phap-huyen-12',
        name: 'Huyền Thủy Quyết',
        description: 'Tâm pháp Thủy tu, tăng hiệu quả của công pháp hệ Thủy và Băng.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['THUY'],
        maxLevel: 8,
        enlightenmentBaseCost: 300,
        enlightenmentCostPerLevel: 60,
        enlightenmentCostExponent: 1.7,
        bonuses: [
            { targetStat: 'thuyDamageBonus', modifier: 'ADDITIVE', value: 0.03 },
            { targetStat: 'bangDamageBonus', modifier: 'ADDITIVE', value: 0.03 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'thuyDamageBonus', modifier: 'ADDITIVE', value: 0.03 } }
        }))
    },
];
