import type { Skill } from '../../../types/skill';

export const CONG_PHAP_HUYEN: Skill[] = [
    {
        id: 'cong-phap-huyen-1',
        name: 'Phong Nhận Kiếm',
        description: 'Tạo ra những lưỡi kiếm bằng gió sắc bén, tấn công liên tục. Tiêu hao nhiều chân khí nhưng uy lực kinh người. Ở cấp độ cao, nó rút thêm linh lực dựa trên tu vi của người thi triển.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'FACTION', factionId: 'THANH_VAN_MON', factionName: 'Thanh Vân Môn' },
        weaponType: 'SWORD',
        requiredLinhCan: ['PHONG'],
        maxLevel: 8,
        manaCost: 50,
        enlightenmentBaseCost: 200,
        enlightenmentCostPerLevel: 40,
        enlightenmentCostExponent: 1.6,
        damage: {
            baseValue: 40,
            attackPowerFactor: 0.8, // Kiếm pháp, hưởng lợi nhiều từ Lực Công
            scalingAttribute: 'thanPhap',
            scalingFactor: 0.5
        },
        effects: [],
        bonuses: [],
        levelBonuses: [
            { level: 2, upgrade: { damageIncrease: 15, manaCostIncrease: 10 } },
            { level: 3, upgrade: { damageIncrease: 15, manaCostIncrease: 10 } },
            { level: 4, upgrade: { damageIncrease: 20, manaCostIncrease: 10, manaCostPercentIncrease: 0.03 } },
            { level: 5, upgrade: { damageIncrease: 20, manaCostIncrease: 10 } },
            { level: 6, upgrade: { damageIncrease: 25, manaCostIncrease: 15 } },
            { level: 7, upgrade: { damageIncrease: 25, manaCostIncrease: 15 } },
            { level: 8, upgrade: { damageIncrease: 30, manaCostIncrease: 20, manaCostPercentIncrease: 0.02 } },
        ]
    },
    {
        id: 'cong-phap-huyen-2',
        name: 'Lôi Minh Quyết',
        description: 'Triệu hồi một tia sét đánh xuống kẻ địch, gây sát thương và có thể làm đối phương tê liệt trong thoáng chốc.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'UNKNOWN', description: 'Một công pháp Lôi hệ cổ xưa, được tìm thấy trong một hang động.' },
        requiredLinhCan: ['LOI'],
        maxLevel: 8,
        manaCost: 60,
        enlightenmentBaseCost: 250,
        enlightenmentCostPerLevel: 50,
        enlightenmentCostExponent: 1.65,
        damage: {
            baseValue: 60,
            attackPowerFactor: 0.3,
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.5
        },
        effects: [
            { type: 'STUN', chance: 0.4, duration: 1 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 20, manaCostIncrease: 12 }
        }))
    },
    {
        id: 'cong-phap-huyen-3',
        name: 'Kim Quang Kiếm',
        description: 'Ngưng tụ kim linh khí trên vũ khí, tạo ra một luồng kiếm quang sắc bén vô song.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        weaponType: 'SWORD',
        requiredLinhCan: ['KIM'],
        maxLevel: 8,
        manaCost: 45,
        enlightenmentBaseCost: 220,
        enlightenmentCostPerLevel: 45,
        enlightenmentCostExponent: 1.62,
        damage: {
            baseValue: 70,
            attackPowerFactor: 1.0, // Kiếm quang, hưởng 100% từ Lực Công
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.2
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 25, manaCostIncrease: 8 }
        }))
    },
    {
        id: 'cong-phap-huyen-4',
        name: 'Huyết Hồn Chú',
        description: 'Ma công hút một phần sinh lực của đối phương để bổ sung cho bản thân.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'UNKNOWN', description: 'Ma công bị cấm, lai lịch không rõ ràng, được cho là có liên quan đến Huyết Sát Tông đã bị diệt vong.' },
        requiredLinhCan: ['AM'],
        maxLevel: 8,
        manaCost: 55,
        enlightenmentBaseCost: 300,
        enlightenmentCostPerLevel: 60,
        enlightenmentCostExponent: 1.7,
        damage: {
            baseValue: 30,
            attackPowerFactor: 0.2,
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.0
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 10, manaCostIncrease: 10 }
        }))
    },
    {
        id: 'cong-phap-huyen-5',
        name: 'Đoạt Mệnh Liên Hoàn Kiếm',
        description: 'Xuất ra những đường kiếm liên hoàn, hiểm hóc, có tỉ lệ bạo kích cao.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        weaponType: 'SWORD',
        maxLevel: 8,
        manaCost: 65,
        enlightenmentBaseCost: 320,
        enlightenmentCostPerLevel: 65,
        enlightenmentCostExponent: 1.68,
        damage: {
            baseValue: 80,
            attackPowerFactor: 1.2,
            scalingAttribute: 'thanPhap',
            scalingFactor: 0.8
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 30, manaCostIncrease: 15 }
        }))
    },
    {
        id: 'cong-phap-huyen-6',
        name: 'Bàn Thạch Hộ Thuẫn',
        description: 'Triệu hồi một tấm khiên đá khổng lồ lao về phía trước, vừa có thể phòng ngự vừa có sức công phá mạnh mẽ.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['THO'],
        maxLevel: 8,
        manaCost: 80,
        enlightenmentBaseCost: 350,
        enlightenmentCostPerLevel: 70,
        enlightenmentCostExponent: 1.66,
        damage: {
            baseValue: 100,
            attackPowerFactor: 0.5,
            scalingAttribute: 'canCot',
            scalingFactor: 1.5
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 35, manaCostIncrease: 20 }
        }))
    },
    {
        id: 'cong-phap-huyen-7',
        name: 'Cửu U Minh Hỏa',
        description: 'Ngọn lửa đến từ địa ngục, không chỉ thiêu đốt da thịt mà còn cả linh hồn, gây ra hiệu ứng Thiêu Đốt kéo dài.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'UNKNOWN', description: 'Loại ma hỏa này được cho là bắt nguồn từ Cửu U Minh Giới.' },
        requiredLinhCan: ['HOA', 'AM'],
        maxLevel: 8,
        manaCost: 70,
        enlightenmentBaseCost: 380,
        enlightenmentCostPerLevel: 75,
        enlightenmentCostExponent: 1.72,
        damage: {
            baseValue: 50,
            attackPowerFactor: 0.3,
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.3
        },
        effects: [
            { type: 'BURN', chance: 0.8, duration: 3, value: 10 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 15, manaCostIncrease: 15, modifyEffect: { type: 'BURN', valueIncrease: 3} }
        }))
    },
    {
        id: 'cong-phap-huyen-8',
        name: 'Băng Phong Phá',
        description: 'Tạo ra một vụ nổ băng giá, gây sát thương lớn và làm kẻ địch đóng băng, giảm mạnh tốc độ.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['BĂNG', 'THUY'],
        maxLevel: 8,
        manaCost: 75,
        enlightenmentBaseCost: 360,
        enlightenmentCostPerLevel: 72,
        enlightenmentCostExponent: 1.69,
        damage: {
            baseValue: 65,
            attackPowerFactor: 0.4,
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.4
        },
        effects: [
            { type: 'SLOW', chance: 0.9, duration: 3, value: 30 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 22, manaCostIncrease: 18 }
        }))
    },
    {
        id: 'cong-phap-huyen-9',
        name: 'Vạn Mộc Triền Thân',
        description: 'Vô số dây leo trỗi dậy, quấn chặt lấy đối thủ, gây sát thương và có khả năng trói chân (Choáng).',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'FACTION', factionId: 'MOC_GIA', factionName: 'Mộc Gia' },
        requiredLinhCan: ['MOC'],
        maxLevel: 8,
        manaCost: 90,
        enlightenmentBaseCost: 400,
        enlightenmentCostPerLevel: 80,
        enlightenmentCostExponent: 1.71,
        damage: {
            baseValue: 40,
            attackPowerFactor: 0.2,
            scalingAttribute: 'canCot',
            scalingFactor: 1.2
        },
        effects: [
            { type: 'STUN', chance: 0.5, duration: 1 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 10, manaCostIncrease: 25 }
        }))
    },
    {
        id: 'cong-phap-huyen-10',
        name: 'Tử Tiêu Thần Lôi',
        description: 'Một tia sét màu tím mang theo sức mạnh thần thánh, uy lực vượt xa Lôi Minh Quyết.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'UNKNOWN', description: 'Tương truyền là thần thông do một vị tán tiên thượng cổ sáng tạo.' },
        requiredLinhCan: ['LOI'],
        maxLevel: 8,
        manaCost: 85,
        enlightenmentBaseCost: 420,
        enlightenmentCostPerLevel: 85,
        enlightenmentCostExponent: 1.75,
        damage: {
            baseValue: 90,
            attackPowerFactor: 0.3,
            scalingAttribute: 'thanThuc',
            scalingFactor: 1.8
        },
        effects: [
            { type: 'STUN', chance: 0.6, duration: 1 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 30, manaCostIncrease: 20 }
        }))
    },
    {
        id: 'cong-phap-huyen-15',
        name: 'Hồi Thiên Thuật',
        description: 'Hấp thu linh khí trời đất, chuyển hóa thành sinh mệnh lực tinh khiết để chữa trị vết thương, hồi phục một lượng lớn sinh lực dựa trên giới hạn của bản thân.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        requiredLinhCan: ['MOC', 'QUANG'],
        maxLevel: 6,
        manaCost: 80,
        enlightenmentBaseCost: 250,
        enlightenmentCostPerLevel: 50,
        enlightenmentCostExponent: 1.7,
        effects: [
            { type: 'HEAL', chance: 1, value: 0.15, valueIsPercent: true }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { manaCostIncrease: 15, modifyEffect: { type: 'HEAL', valueIncrease: 0.05, valueIsPercent: true } }
        }))
    },
      // -- HUYỀN GIAI - WEAPON SKILLS --
    {
        id: 'cong-phap-huyen-11',
        name: 'Lạc Anh Kiếm Pháp',
        description: 'Kiếm pháp như hoa rơi, đẹp đẽ nhưng ẩn chứa sát cơ. Yêu cầu trang bị Kiếm.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'FACTION', factionId: 'LUU_LY_TONG', factionName: 'Lưu Ly Tông' },
        weaponType: 'SWORD',
        maxLevel: 8,
        manaCost: 50,
        enlightenmentBaseCost: 240,
        enlightenmentCostPerLevel: 48,
        enlightenmentCostExponent: 1.6,
        damage: {
            baseValue: 55,
            attackPowerFactor: 1.3,
            scalingAttribute: 'thanPhap',
            scalingFactor: 0.6
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 20, manaCostIncrease: 10 }
        }))
    },
    {
        id: 'cong-phap-huyen-12',
        name: 'Long Xà Thương Pháp',
        description: 'Mũi thương xuất ra như rồng bay rắn lượn, biến ảo khôn lường. Yêu cầu trang bị Thương.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'FACTION', factionId: 'TIEU_GIA', factionName: 'Tiêu Gia' },
        weaponType: 'SPEAR',
        maxLevel: 8,
        manaCost: 60,
        enlightenmentBaseCost: 260,
        enlightenmentCostPerLevel: 52,
        enlightenmentCostExponent: 1.61,
        damage: {
            baseValue: 65,
            attackPowerFactor: 1.2,
            scalingAttribute: 'canCot',
            scalingFactor: 0.8
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 25, manaCostIncrease: 12 }
        }))
    },
     {
        id: 'cong-phap-huyen-13',
        name: 'Cuồng Phong Đao',
        description: 'Đao pháp cuồng bạo, mỗi nhát chém đều mang theo sức mạnh kinh người. Yêu cầu trang bị Đao.',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'UNKNOWN', description: 'Một bộ đao pháp bá đạo được tìm thấy trong một lăng mộ cổ.' },
        weaponType: 'BLADE',
        maxLevel: 8,
        manaCost: 40,
        enlightenmentBaseCost: 300,
        enlightenmentCostPerLevel: 60,
        enlightenmentCostExponent: 1.63,
        damage: {
            baseValue: 90,
            attackPowerFactor: 1.5,
            scalingAttribute: 'canCot',
            scalingFactor: 0.5
        },
        effects: [],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 30, manaCostIncrease: 8 }
        }))
    },
    {
        id: 'cong-phap-huyen-14',
        name: 'Băng Tâm Phiến',
        description: 'Vung quạt tạo ra hàn khí, gây sát thương băng giá và làm chậm đối thủ. Yêu cầu trang bị Phiến (Quạt).',
        type: 'CONG_PHAP',
        tier: 'HUYEN',
        origin: { type: 'BASIC' },
        weaponType: 'FAN',
        maxLevel: 8,
        manaCost: 55,
        enlightenmentBaseCost: 280,
        enlightenmentCostPerLevel: 56,
        enlightenmentCostExponent: 1.64,
        damage: {
            baseValue: 45,
            attackPowerFactor: 0.6,
            scalingAttribute: 'thanThuc',
            scalingFactor: 0.9
        },
        effects: [
            { type: 'SLOW', chance: 0.7, duration: 2, value: 20 }
        ],
        bonuses: [],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { damageIncrease: 15, manaCostIncrease: 11 }
        }))
    },
];
