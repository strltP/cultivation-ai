import type { Skill } from '../../../types/skill';

export const CONG_PHAP_HOANG: Skill[] = [
    {
        id: 'cong-phap-hoang-1',
        name: 'Hỏa Cầu Thuật',
        description: 'Ngưng tụ linh khí thành một quả cầu lửa, tấn công kẻ địch. Càng ở cấp độ cao, càng tiêu hao nhiều linh lực để duy trì uy thế.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['HOA'],
        maxLevel: 10,
        manaCost: 20,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.4,
        damage: {
            baseValue: 15,
            attackPowerFactor: 0.2, 
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.8
        },
        effects: [],
        bonuses: [],
        levelBonuses: [
            { level: 2, upgrade: { damageIncrease: 10, manaCostIncrease: 5 } },
            { level: 3, upgrade: { damageIncrease: 15, manaCostIncrease: 10 } },
            { level: 4, upgrade: { damageIncrease: 30, manaCostPercentIncrease: 0.02 } },
            { level: 5, upgrade: { manaCostPercentIncrease: 0.03, addEffect: { type: 'BURN', chance: 0.1, duration: 2, value: 15 } } },
            { level: 6, upgrade: { manaCostPercentIncrease: 0.03, modifyEffect: { type: 'BURN', chanceIncrease: 0.1 } } },
            { level: 7, upgrade: { manaCostPercentIncrease: 0.03, modifyEffect: { type: 'BURN', valueIncrease: 10 } } },
            { level: 8, upgrade: { manaCostPercentIncrease: 0.02, modifyEffect: { type: 'BURN', durationIncrease: 3 } } },
            { level: 9, upgrade: { damageIncrease: 50, manaCostPercentIncrease: 0.02 } },
            { level: 10, upgrade: { manaCostPercentIncrease: 0.05, modifyEffect: { type: 'BURN', chanceIncrease: 0.15 } } },
        ]
    },
    {
        id: 'cong-phap-hoang-2',
        name: 'Băng Trùy Thuật',
        description: 'Tạo ra một mũi nhọn bằng băng giá đâm thẳng vào đối thủ, mang theo hàn khí.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['THUY', 'BĂNG'],
        maxLevel: 10,
        manaCost: 12,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.45,
        damage: {
            baseValue: 12,
            attackPowerFactor: 0.2,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.7
        },
        effects: [
            { type: 'SLOW', chance: 0.3, duration: 2, value: 15 } // 15% speed reduction
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 4, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-3',
        name: 'Lạc Thạch Thuật',
        description: 'Điều khiển đất đá xung quanh, tạo thành một tảng đá bay về phía kẻ địch.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['THO'],
        maxLevel: 10,
        manaCost: 15,
        enlightenmentBaseCost: 60,
        enlightenmentCostPerLevel: 12,
        enlightenmentCostExponent: 1.42,
        damage: {
            baseValue: 20,
            attackPowerFactor: 0.4, // Có yếu tố vật lý
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.0
        },
        effects: [
             { type: 'STUN', chance: 0.1, duration: 1 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 6, manaCostIncrease: 2 }
        }))
    },
    {
        id: 'cong-phap-hoang-4',
        name: 'Trường Xuân Công',
        description: 'Pháp thuật trị liệu cơ bản, sử dụng linh khí để hồi phục một lượng nhỏ sinh lực.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['MOC'],
        maxLevel: 5,
        manaCost: 30,
        enlightenmentBaseCost: 80,
        enlightenmentCostPerLevel: 20,
        enlightenmentCostExponent: 1.5,
        effects: [
            { type: 'HEAL', chance: 1, value: 50, scalingAttribute: 'ngoTinh', scalingFactor: 1.2 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 4 }, (_, i) => ({
            level: i + 2,
            upgrade: { manaCostIncrease: 5, modifyEffect: { type: 'HEAL', valueIncrease: 20 } }
        }))
    },
    {
        id: 'cong-phap-hoang-5',
        name: 'Mộc Man Thuật',
        description: 'Triệu hồi dây leo từ mặt đất, tấn công và có khả năng làm chậm kẻ địch.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['MOC'],
        maxLevel: 10,
        manaCost: 14,
        enlightenmentBaseCost: 55,
        enlightenmentCostPerLevel: 11,
        enlightenmentCostExponent: 1.45,
        damage: {
            baseValue: 10,
            attackPowerFactor: 0.1,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.6
        },
        effects: [
            { type: 'SLOW', chance: 0.4, duration: 2, value: 10 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 3, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-6',
        name: 'Phong Tường',
        description: 'Tạo ra một bức tường gió nhỏ đẩy lùi và gây sát thương cho đối thủ.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['PHONG'],
        maxLevel: 10,
        manaCost: 10,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 9,
        enlightenmentCostExponent: 1.4,
        damage: {
            baseValue: 13,
            attackPowerFactor: 0.3,
            scalingAttribute: 'thanPhap',
            scalingFactor: 0.5
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 4, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-7',
        name: 'Kim Châm Thuật',
        description: 'Phóng ra vô số kim châm bằng linh khí, khó lòng né tránh.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['KIM'],
        maxLevel: 10,
        manaCost: 12,
        enlightenmentBaseCost: 60,
        enlightenmentCostPerLevel: 12,
        enlightenmentCostExponent: 1.48,
        damage: {
            baseValue: 18,
            attackPowerFactor: 0.5,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.6
        },
        effects: [],
        bonuses: [],
         levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 5, manaCostIncrease: 2 }
        }))
    },
    {
        id: 'cong-phap-hoang-8',
        name: 'Thủy Tiễn',
        description: 'Ngưng tụ hơi nước thành một mũi tên nước, bắn thẳng vào mục tiêu.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['THUY'],
        maxLevel: 10,
        manaCost: 9,
        enlightenmentBaseCost: 45,
        enlightenmentCostPerLevel: 9,
        enlightenmentCostExponent: 1.38,
        damage: {
            baseValue: 14,
            attackPowerFactor: 0.2,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.7
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 4, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-9',
        name: 'Địa Thứ',
        description: 'Khiến một mũi nhọn bằng đất đá đột ngột trồi lên từ dưới chân kẻ địch.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['THO'],
        maxLevel: 10,
        manaCost: 18,
        enlightenmentBaseCost: 65,
        enlightenmentCostPerLevel: 13,
        enlightenmentCostExponent: 1.43,
        damage: {
            baseValue: 22,
            attackPowerFactor: 0.3,
            scalingAttribute: 'canCot',
            scalingFactor: 0.5
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 7, manaCostIncrease: 2 }
        }))
    },
    {
        id: 'cong-phap-hoang-10',
        name: 'Tiểu Lôi Quang',
        description: 'Tạo ra một tia sét nhỏ, tốc độ cực nhanh, gây sát thương chớp nhoáng.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['LOI'],
        maxLevel: 10,
        manaCost: 8,
        enlightenmentBaseCost: 70,
        enlightenmentCostPerLevel: 15,
        enlightenmentCostExponent: 1.55,
        damage: {
            baseValue: 16,
            attackPowerFactor: 0.1,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.9
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 5, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-11',
        name: 'Quang Minh Thuật',
        description: 'Tạo ra một luồng ánh sáng chói lòa, gây sát thương nhẹ.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['QUANG'],
        maxLevel: 5,
        manaCost: 20,
        enlightenmentBaseCost: 75,
        enlightenmentCostPerLevel: 20,
        enlightenmentCostExponent: 1.52,
        damage: {
            baseValue: 5,
            attackPowerFactor: 0.0,
            scalingAttribute: 'ngoTinh',
            scalingFactor: 0.5
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 4 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 2, manaCostIncrease: 3 }
        }))
    },
    {
        id: 'cong-phap-hoang-12',
        name: 'Ám Ảnh Chú',
        description: 'Một lời nguyền bóng tối, gây sát thương nhỏ theo thời gian.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['AM'],
        maxLevel: 5,
        manaCost: 25,
        enlightenmentBaseCost: 80,
        enlightenmentCostPerLevel: 22,
        enlightenmentCostExponent: 1.53,
        damage: {
            baseValue: 8,
            attackPowerFactor: 0.1,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.4
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 4 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 3, manaCostIncrease: 4 }
        }))
    },
     // -- HOÀNG GIAI - WEAPON SKILLS --
    {
        id: 'cong-phap-hoang-13',
        name: 'Thiết Kiếm Trảm',
        description: 'Một đường kiếm cơ bản, chém thẳng vào đối thủ. Yêu cầu trang bị Kiếm.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        weaponType: 'SWORD',
        maxLevel: 10,
        manaCost: 8,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.35,
        damage: {
            baseValue: 10,
            attackPowerFactor: 1.1,
            scalingAttribute: 'thanPhap',
            scalingFactor: 0.2
        },
        bonuses: [],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 4, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-14',
        name: 'Hoành Tảo Thiên Quân',
        description: 'Vung thương quét ngang một vùng rộng lớn. Yêu cầu trang bị Thương.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        weaponType: 'SPEAR',
        maxLevel: 10,
        manaCost: 12,
        enlightenmentBaseCost: 60,
        enlightenmentCostPerLevel: 12,
        enlightenmentCostExponent: 1.38,
        damage: {
            baseValue: 15,
            attackPowerFactor: 1.0,
            scalingAttribute: 'canCot',
            scalingFactor: 0.3
        },
        bonuses: [],
         levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 5, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-15',
        name: 'Liệt Phong Đao Pháp',
        description: 'Một nhát đao nhanh như gió lốc, khiến đối thủ khó lòng phòng bị. Yêu cầu trang bị Đao.',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        weaponType: 'BLADE',
        maxLevel: 10,
        manaCost: 10,
        enlightenmentBaseCost: 55,
        enlightenmentCostPerLevel: 11,
        enlightenmentCostExponent: 1.36,
        damage: {
            baseValue: 12,
            attackPowerFactor: 1.2,
            scalingAttribute: 'thanPhap',
            scalingFactor: 0.3
        },
        bonuses: [],
         levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 4, manaCostIncrease: 1 }
        }))
    },
    {
        id: 'cong-phap-hoang-16',
        name: 'Thanh Phong Phiến',
        description: 'Phẩy quạt tạo ra một luồng gió nhẹ, vừa gây sát thương vừa đẩy lùi đối thủ. Yêu cầu trang bị Phiến (Quạt).',
        type: 'CONG_PHAP',
        tier: 'HOANG',
        origin: { type: 'BASIC' },
        weaponType: 'FAN',
        maxLevel: 10,
        manaCost: 9,
        enlightenmentBaseCost: 50,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.32,
        damage: {
            baseValue: 8,
            attackPowerFactor: 0.5,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.4
        },
        bonuses: [],
         levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 3, manaCostIncrease: 1 }
        }))
    },
];
