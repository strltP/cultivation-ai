import type { Skill } from '../../../types/skill';

export const CONG_PHAP_THIEN: Skill[] = [
    {
        id: 'cong-phap-thien-1',
        name: 'Phần Thiên Hỏa Hải',
        description: 'Pháp thuật trong truyền thuyết, triệu hồi một biển lửa có sức mạnh thiêu đốt vạn vật, biến chiến trường thành luyện ngục.',
        type: 'CONG_PHAP',
        tier: 'THIEN',
        origin: { type: 'UNKNOWN', description: 'Cấm thuật cổ đại, sức mạnh đủ để thiêu đốt cả một vùng đất.' },
        requiredLinhCan: ['HOA'],
        maxLevel: 4,
        manaCost: 1000,
        enlightenmentBaseCost: 5000,
        enlightenmentCostPerLevel: 1000,
        enlightenmentCostExponent: 2.2,
        damage: {
            baseValue: 500,
            attackPowerFactor: 0.1,
            scalingAttribute: 'thanThuc',
            scalingFactor: 3.0
        },
        effects: [
            { type: 'BURN', chance: 1, duration: 5, value: 50 }
        ],
        bonuses: [],
         levelBonuses: Array.from({ length: 3 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 200, manaCostIncrease: 250, modifyEffect: {type: 'BURN', valueIncrease: 20}}
        }))
    },
    {
        id: 'cong-phap-thien-2',
        name: 'Tru Tiên Kiếm Quyết',
        description: 'Kiếm quyết tối thượng trong truyền thuyết, một kiếm tru tiên, một kiếm diệt ma, uy lực vô song, hủy thiên diệt địa.',
        type: 'CONG_PHAP',
        tier: 'THIEN',
        origin: { type: 'UNKNOWN', description: 'Kiếm quyết tối thượng trong truyền thuyết, đã thất lạc từ lâu.' },
        weaponType: 'SWORD',
        maxLevel: 4,
        manaCost: 1200,
        enlightenmentBaseCost: 6000,
        enlightenmentCostPerLevel: 1200,
        enlightenmentCostExponent: 2.3,
        damage: {
            baseValue: 800,
            attackPowerFactor: 2.0,
            scalingAttribute: 'thanThuc',
            scalingFactor: 2.0
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 3 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 300, manaCostIncrease: 300 }
        }))
    },
    {
        id: 'cong-phap-thien-3',
        name: 'Hỗn Độn Khai Thiên',
        description: 'Mô phỏng lại cảnh tượng Bàn Cổ khai thiên, một đòn tấn công mang theo sức mạnh hỗn độn nguyên thủy, phá vỡ mọi quy tắc.',
        type: 'CONG_PHAP',
        tier: 'THIEN',
        origin: { type: 'UNKNOWN', description: 'Cấm thuật mô phỏng lại cảnh tượng khai thiên lập địa, uy lực không thể đo lường.' },
        maxLevel: 4,
        manaCost: 1500,
        enlightenmentBaseCost: 7000,
        enlightenmentCostPerLevel: 1500,
        enlightenmentCostExponent: 2.4,
        damage: {
            baseValue: 1000,
            attackPowerFactor: 1.0,
            scalingAttribute: 'canCot',
            scalingFactor: 2.5
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 3 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 400, manaCostIncrease: 400 }
        }))
    },
];
