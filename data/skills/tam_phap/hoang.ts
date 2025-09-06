import type { Skill } from '../../../types/skill';

export const TAM_PHAP_HOANG: Skill[] = [
    {
        id: 'tam-phap-hoang-1',
        name: 'Dưỡng Khí Quyết',
        description: 'Một tâm pháp cơ bản giúp ổn định khí tức, từ từ gia tăng trữ lượng Linh Lực để thi triển pháp thuật.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        maxLevel: 5,
        enlightenmentBaseCost: 40,
        enlightenmentCostPerLevel: 15,
        enlightenmentCostExponent: 1.5,
        bonuses: [
            { targetStat: 'maxMana', modifier: 'MULTIPLIER', value: 0.02 },
        ],
        levelBonuses: Array.from({ length: 4 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxMana', modifier: 'MULTIPLIER', value: 0.02 } }
        }))
    },
    {
        id: 'tam-phap-hoang-2',
        name: 'Thối Thể Kinh',
        description: 'Rèn luyện thân thể, giúp tăng cường Sinh Lực, khiến cơ thể trở nên dẻo dai hơn.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        maxLevel: 10,
        enlightenmentBaseCost: 40,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.45,
        bonuses: [
            { targetStat: 'maxHp', modifier: 'MULTIPLIER', value: 0.01 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxHp', modifier: 'MULTIPLIER', value: 0.01 } }
        }))
    },
    {
        id: 'tam-phap-hoang-3',
        name: 'Tụ Linh Quyết',
        description: 'Tăng tốc độ hấp thụ linh khí khi đả toạ, giúp tăng hiệu quả tu luyện.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        maxLevel: 10,
        enlightenmentBaseCost: 60,
        enlightenmentCostPerLevel: 20,
        enlightenmentCostExponent: 1.6,
        bonuses: [
            { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 2 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 2 } }
        }))
    },
    {
        id: 'tam-phap-hoang-4',
        name: 'Trường Sinh Quyết',
        description: 'Hấp thu mộc linh khí, tăng cường Căn Cốt, giúp thân thể thêm bền bỉ.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['MOC'],
        maxLevel: 10,
        enlightenmentBaseCost: 45,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.48,
        bonuses: [
            { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 1 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 1 } }
        }))
    },
    {
        id: 'tam-phap-hoang-5',
        name: 'Phi Vân Bộ',
        description: 'Mô phỏng bước chân trên mây, tăng Thân Pháp, giúp di chuyển nhẹ nhàng hơn.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['PHONG'],
        maxLevel: 10,
        enlightenmentBaseCost: 45,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.48,
        bonuses: [
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 1 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 1 } }
        }))
    },
    {
        id: 'tam-phap-hoang-6',
        name: 'Luyện Thần Thuật',
        description: 'Rèn luyện thần hồn, giúp Thần Thức trở nên nhạy bén hơn.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        maxLevel: 10,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 12,
        enlightenmentCostExponent: 1.52,
        bonuses: [
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 1 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 1 } }
        }))
    },
    {
        id: 'tam-phap-hoang-7',
        name: 'Thông Tuệ Kinh',
        description: 'Khai mở trí óc, tăng Ngộ Tính, giúp việc lĩnh hội công pháp dễ dàng hơn.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        maxLevel: 10,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 12,
        enlightenmentCostExponent: 1.52,
        bonuses: [
            { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 1 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 1 } }
        }))
    },
    {
        id: 'tam-phap-hoang-8',
        name: 'Nhất Kích Quyết',
        description: 'Tập trung toàn bộ sức mạnh vào một đòn, tăng nhẹ tỉ lệ bạo kích.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['KIM'],
        maxLevel: 5,
        enlightenmentBaseCost: 80,
        enlightenmentCostPerLevel: 20,
        enlightenmentCostExponent: 1.55,
        bonuses: [
            { targetStat: 'critRate', modifier: 'ADDITIVE', value: 0.002 }, // +0.2% per level
        ],
        levelBonuses: Array.from({ length: 4 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'critRate', modifier: 'ADDITIVE', value: 0.002 } }
        }))
    },
    {
        id: 'tam-phap-hoang-9',
        name: 'Linh Hầu Bộ',
        description: 'Bước chân nhanh nhẹn khó đoán như loài vượn, tăng tốc độ chiến đấu.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['PHONG'],
        maxLevel: 5,
        enlightenmentBaseCost: 80,
        enlightenmentCostPerLevel: 20,
        enlightenmentCostExponent: 1.55,
        bonuses: [
            { targetStat: 'speed', modifier: 'ADDITIVE', value: 1 },
        ],
        levelBonuses: Array.from({ length: 4 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'speed', modifier: 'ADDITIVE', value: 1 } }
        }))
    },
    {
        id: 'tam-phap-hoang-10',
        name: 'Bàn Thạch Công',
        description: 'Vận công khiến cơ thể cứng như đá, tăng Lực Thủ.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['THO'],
        maxLevel: 10,
        enlightenmentBaseCost: 40,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.46,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 2 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 2 } }
        }))
    },
    {
        id: 'tam-phap-hoang-11',
        name: 'Lực Bạt Sơn',
        description: 'Tâm pháp rèn luyện cơ bắp, giúp tăng Lực Công.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        maxLevel: 10,
        enlightenmentBaseCost: 40,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.46,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 2 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 2 } }
        }))
    },
    {
        id: 'tam-phap-hoang-12',
        name: 'Thiết Giáp Công',
        description: 'Tâm pháp luyện thể cơ bản, giúp tăng cường khả năng phòng ngự và sinh mệnh lực.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['KIM'],
        maxLevel: 10,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 15,
        enlightenmentCostExponent: 1.49,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 5 },
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 10 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => {
            const level = i + 2;
            const isHpLevel = level % 2 === 1; // Levels 3, 5, 7, 9 add HP
            return {
                level,
                upgrade: {
                    addBonus: isHpLevel
                        ? { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 10 }
                        : { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 5 }
                }
            };
        })
    },
];
