import type { Skill } from '../../types/skill';
import type { CharacterAttributes, CombatStats } from '../../types/stats';

export const ALL_TAM_PHAP: Skill[] = [
    // -- HOÀNG GIAI --
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

    // -- HUYỀN GIAI --
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
    
    // -- ĐỊA GIAI --
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
    
    // -- THIÊN GIAI --
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