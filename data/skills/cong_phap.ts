import type { Skill } from '../../types/skill';

export const ALL_CONG_PHAP: Skill[] = [
    // -- HOÀNG GIAI --
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

    // -- HUYỀN GIAI --
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

    // -- ĐỊA GIAI --
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

    // -- THIÊN GIAI --
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