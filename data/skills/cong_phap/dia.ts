import type { Skill } from '../../../types/skill';

export const CONG_PHAP_DIA: Skill[] = [
    {
        id: 'cong-phap-dia-1',
        name: 'Địa Long Quyển',
        description: 'Vận chuyển thổ linh khí, triệu hồi một con rồng đất từ mặt đất tấn công kẻ địch, sức mạnh kinh hoàng.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Thần thông Thổ hệ thượng cổ, uy lực kinh người.' },
        requiredLinhCan: ['THO'],
        maxLevel: 6,
        manaCost: 200,
        enlightenmentBaseCost: 1000,
        enlightenmentCostPerLevel: 200,
        enlightenmentCostExponent: 1.85,
        damage: {
            baseValue: 150,
            attackPowerFactor: 0.6,
            scalingAttribute: 'canCot',
            scalingFactor: 1.5
        },
        effects: [
             { type: 'STUN', chance: 0.3, duration: 2 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 50, manaCostIncrease: 50 }
        }))
    },
    {
        id: 'cong-phap-dia-2',
        name: 'Thiên Lôi Nộ',
        description: 'Hô phong hoán vũ, gọi xuống chín tầng trời một tia Thiên Lôi cuồng nộ, hủy diệt mục tiêu.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Tương truyền là một trong những pháp thuật trấn phái của Lôi Thần Điện đã biến mất.' },
        requiredLinhCan: ['LOI'],
        maxLevel: 6,
        manaCost: 250,
        enlightenmentBaseCost: 1200,
        enlightenmentCostPerLevel: 250,
        enlightenmentCostExponent: 1.9,
        damage: {
            baseValue: 200,
            attackPowerFactor: 0.2,
            scalingAttribute: 'thanThuc',
            scalingFactor: 2.5
        },
        effects: [
            { type: 'STUN', chance: 0.8, duration: 1 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 70, manaCostIncrease: 70 }
        }))
    },
    {
        id: 'cong-phap-dia-3',
        name: 'Băng Phách Thần Châm',
        description: 'Ngưng tụ hàn khí của cửu u thành một cây kim băng, bắn ra với tốc độ kinh người, có khả năng đóng băng linh hồn đối thủ.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Tuyệt kỹ thất truyền của Băng Cung.' },
        requiredLinhCan: ['BĂNG', 'THUY'],
        maxLevel: 6,
        manaCost: 220,
        enlightenmentBaseCost: 1100,
        enlightenmentCostPerLevel: 220,
        enlightenmentCostExponent: 1.88,
        damage: {
            baseValue: 180,
            attackPowerFactor: 0.4,
            scalingAttribute: 'thanThuc',
            scalingFactor: 2.0
        },
        effects: [
            { type: 'STUN', chance: 0.6, duration: 1 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 60, manaCostIncrease: 60 }
        }))
    },
    {
        id: 'cong-phap-dia-4',
        name: 'Cửu Chuyển Phong Sát Trận',
        description: 'Tạo ra một trận pháp bằng gió xoáy, nhốt kẻ địch bên trong và dùng vô số phong nhận cắt xé.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'FACTION', factionId: 'THANH_VAN_MON', factionName: 'Thanh Vân Môn', requiredRole: 'Trưởng lão' },
        requiredLinhCan: ['PHONG'],
        maxLevel: 6,
        manaCost: 300,
        enlightenmentBaseCost: 1300,
        enlightenmentCostPerLevel: 260,
        enlightenmentCostExponent: 1.86,
        damage: {
            baseValue: 220,
            attackPowerFactor: 0.5,
            scalingAttribute: 'thanPhap',
            scalingFactor: 2.2
        },
        effects: [
            { type: 'SLOW', chance: 1.0, duration: 2, value: 20 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 75, manaCostIncrease: 80 }
        }))
    },
    {
        id: 'cong-phap-dia-5',
        name: 'Phá Không Nhất Thương',
        description: 'Dồn toàn bộ chân khí vào một mũi thương, đâm ra với sức mạnh có thể xuyên thủng không gian.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Một chiêu thương pháp được khắc trên vách đá của một không gian dị độ.' },
        weaponType: 'SPEAR',
        maxLevel: 6,
        manaCost: 280,
        enlightenmentBaseCost: 1400,
        enlightenmentCostPerLevel: 280,
        enlightenmentCostExponent: 1.92,
        damage: {
            baseValue: 250,
            attackPowerFactor: 1.5,
            scalingAttribute: 'canCot',
            scalingFactor: 1.0
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 80, manaCostIncrease: 75 }
        }))
    },
     // -- ĐỊA GIAI - WEAPON SKILLS --
    {
        id: 'cong-phap-dia-6',
        name: 'Vô Tình Kiếm',
        description: 'Một kiếm vô tình, dứt khoát và lạnh lùng, có tỉ lệ bạo kích cực cao. Yêu cầu trang bị Kiếm.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Kiếm pháp của một kiếm khách vô danh, chỉ theo đuổi kiếm đạo cực hạn.' },
        weaponType: 'SWORD',
        maxLevel: 6,
        manaCost: 300,
        enlightenmentBaseCost: 1500,
        enlightenmentCostPerLevel: 300,
        enlightenmentCostExponent: 1.91,
        damage: {
            baseValue: 200,
            attackPowerFactor: 1.8,
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.2
        },
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 70, manaCostIncrease: 80 }
        }))
    },
    {
        id: 'cong-phap-dia-7',
        name: 'Bá Vương Thương',
        description: 'Một thương đâm thẳng tới, mang theo khí thế của bá vương, có khả năng làm choáng kẻ địch. Yêu cầu trang bị Thương.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'FACTION', factionId: 'TIEU_GIA', factionName: 'Tiêu Gia', requiredRole: 'Trưởng lão' },
        weaponType: 'SPEAR',
        maxLevel: 6,
        manaCost: 320,
        enlightenmentBaseCost: 1600,
        enlightenmentCostPerLevel: 320,
        enlightenmentCostExponent: 1.89,
        damage: {
            baseValue: 220,
            attackPowerFactor: 1.6,
            scalingAttribute: 'canCot',
            scalingFactor: 1.5
        },
        effects: [
            { type: 'STUN', chance: 0.4, duration: 1 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 75, manaCostIncrease: 85 }
        }))
    },
    {
        id: 'cong-phap-dia-8',
        name: 'Tu La Đao',
        description: 'Đao pháp tà dị, chém trúng kẻ địch có thể hút một phần sinh lực. Yêu cầu trang bị Đao.',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'UNKNOWN', description: 'Ma đao thất truyền, có khả năng hút sinh lực của đối thủ.' },
        weaponType: 'BLADE',
        maxLevel: 6,
        manaCost: 280,
        enlightenmentBaseCost: 1800,
        enlightenmentCostPerLevel: 350,
        enlightenmentCostExponent: 1.95,
        damage: {
            baseValue: 180,
            attackPowerFactor: 1.7,
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.0
        },
        bonuses: [],
         levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 60, manaCostIncrease: 70 }
        }))
    },
    {
        id: 'cong-phap-dia-9',
        name: 'Huyễn Ảnh Phiến',
        description: 'Tạo ra ảo ảnh từ chiếc quạt, gây sát thương và làm giảm khả năng né tránh của đối thủ. Yêu cầu trang bị Phiến (Quạt).',
        type: 'CONG_PHAP',
        tier: 'DIA',
        origin: { type: 'FACTION', factionId: 'LUU_LY_TONG', factionName: 'Lưu Ly Tông' },
        weaponType: 'FAN',
        maxLevel: 6,
        manaCost: 260,
        enlightenmentBaseCost: 1400,
        enlightenmentCostPerLevel: 280,
        enlightenmentCostExponent: 1.87,
        damage: {
            baseValue: 160,
            attackPowerFactor: 0.8,
            scalingAttribute: 'thanPhap',
            scalingFactor: 1.8
        },
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 55, manaCostIncrease: 65 }
        }))
    },
];
