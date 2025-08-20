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
        maxLevel: 5,
        enlightenmentBaseCost: 40,
        enlightenmentCostPerLevel: 15,
        enlightenmentCostExponent: 1.5,
        bonuses: [
            { targetStat: 'maxMana', modifier: 'ADDITIVE', value: 20 },
        ],
        levelBonuses: Array.from({ length: 4 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxMana', modifier: 'ADDITIVE', value: 20 } }
        }))
    },
    {
        id: 'tam-phap-hoang-2',
        name: 'Thối Thể Kinh',
        description: 'Rèn luyện thân thể, giúp tăng cường Sinh Lực, khiến cơ thể trở nên dẻo dai hơn.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
        maxLevel: 10,
        enlightenmentBaseCost: 40,
        enlightenmentCostPerLevel: 10,
        enlightenmentCostExponent: 1.45,
        bonuses: [
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 15 },
        ],
        levelBonuses: Array.from({ length: 9 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 15 } }
        }))
    },
    {
        id: 'tam-phap-hoang-3',
        name: 'Tụ Linh Quyết',
        description: 'Tăng tốc độ hấp thụ linh khí khi đả toạ, giúp tăng hiệu quả tu luyện.',
        type: 'TAM_PHAP',
        tier: 'HOANG',
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
        maxLevel: 8,
        enlightenmentBaseCost: 180,
        enlightenmentCostPerLevel: 35,
        enlightenmentCostExponent: 1.7,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 5 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 5 } }
        }))
    },
    {
        id: 'tam-phap-huyen-2',
        name: 'Ngự Phong Quyết',
        description: 'Tâm pháp giúp thân thể trở nên nhẹ nhàng, linh hoạt, tăng mạnh Thân Pháp.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
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
        description: 'Tâm pháp ma đạo, kích thích tiềm năng cơ thể, tăng Sinh Lực và một chút Lực Công.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 250,
        enlightenmentCostPerLevel: 50,
        enlightenmentCostExponent: 1.75,
        bonuses: [
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 50 },
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 3 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => {
            const level = i + 2;
            const isAttackPowerLevel = level % 2 === 1; // Levels 3, 5, 7 add Attack Power
            return {
                level,
                upgrade: {
                    addBonus: isAttackPowerLevel
                        ? { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 3 }
                        : { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 50 }
                }
            };
        })
    },
    {
        id: 'tam-phap-huyen-4',
        name: 'Cự Linh Công',
        description: 'Mô phỏng sức mạnh của Cự Linh Thần, tăng mạnh Căn Cốt và Sinh Lực tối đa.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 200,
        enlightenmentCostPerLevel: 40,
        enlightenmentCostExponent: 1.72,
        bonuses: [
            { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 3 },
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 30 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 3 } }
        }))
    },
    {
        id: 'tam-phap-huyen-5',
        name: 'Vô Ảnh Thân Pháp',
        description: 'Thân pháp cao thâm, di chuyển không để lại dấu vết, tăng Thân Pháp và Tốc Độ.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 220,
        enlightenmentCostPerLevel: 45,
        enlightenmentCostExponent: 1.73,
        bonuses: [
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 3 },
            { targetStat: 'speed', modifier: 'ADDITIVE', value: 2 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => {
            const level = i + 2;
            const isSpeedLevel = level % 2 === 1; // Levels 3, 5, 7 add Speed
            return {
                level,
                upgrade: {
                    addBonus: isSpeedLevel
                        ? { targetStat: 'speed', modifier: 'ADDITIVE', value: 2 }
                        : { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 3 }
                }
            };
        })
    },
    {
        id: 'tam-phap-huyen-6',
        name: 'Đại Diễn Thần Quyết',
        description: 'Tâm pháp giúp mở rộng thần thức, suy diễn thiên cơ, tăng mạnh Thần Thức và Ngộ Tính.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 280,
        enlightenmentCostPerLevel: 60,
        enlightenmentCostExponent: 1.78,
        bonuses: [
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 3 },
            { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 3 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 3 } }
        }))
    },
    {
        id: 'tam-phap-huyen-7',
        name: 'Phá Quân Kinh',
        description: 'Tâm pháp của chiến tướng, mỗi đòn đánh đều mang theo sát khí, tăng Lực Công và sát thương bạo kích.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 300,
        enlightenmentCostPerLevel: 65,
        enlightenmentCostExponent: 1.76,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 8 },
            { targetStat: 'critDamage', modifier: 'ADDITIVE', value: 0.05 }, // +5% crit damage
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 8 } }
        }))
    },
    {
        id: 'tam-phap-huyen-8',
        name: 'Bất Động Minh Vương',
        description: 'Thân thể vững như núi, khó lòng lay chuyển. Tăng mạnh Lực Thủ nhưng làm giảm Tốc Độ.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 260,
        enlightenmentCostPerLevel: 55,
        enlightenmentCostExponent: 1.74,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 10 },
            { targetStat: 'speed', modifier: 'ADDITIVE', value: -1 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 10 } }
        }))
    },
    {
        id: 'tam-phap-huyen-9',
        name: 'Ma Kha Vô Lượng',
        description: 'Mở rộng kinh mạch, giúp chứa được lượng lớn linh khí và chân khí.',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 240,
        enlightenmentCostPerLevel: 50,
        enlightenmentCostExponent: 1.77,
        bonuses: [
            { targetStat: 'maxMana', modifier: 'ADDITIVE', value: 40 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxMana', modifier: 'ADDITIVE', value: 40 } }
        }))
    },
    {
        id: 'tam-phap-huyen-10',
        name: 'Sát Lục Tâm Kinh',
        description: 'Ma công lấy việc giết chóc để tu luyện, tăng mạnh Lực Công nhưng làm tổn hại căn cơ (giảm Sinh Lực).',
        type: 'TAM_PHAP',
        tier: 'HUYEN',
        maxLevel: 8,
        enlightenmentBaseCost: 400,
        enlightenmentCostPerLevel: 100,
        enlightenmentCostExponent: 1.8,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 15 },
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: -20 },
        ],
        levelBonuses: Array.from({ length: 7 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 15 } }
        }))
    },
    
    // -- ĐỊA GIAI --
    {
        id: 'tam-phap-dia-1',
        name: 'Vạn Kiếm Quy Tông',
        description: 'Tâm pháp của kiếm tu, tăng cường sức mạnh của các đòn tấn công.',
        type: 'TAM_PHAP',
        tier: 'DIA',
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
        id: 'tam-phap-dia-3',
        name: 'Phá Thiên Kiếm Ý',
        description: 'Ngưng tụ kiếm ý sắc bén, giúp các đòn tấn công trở nên cực kỳ nguy hiểm, tăng mạnh tỉ lệ bạo kích.',
        type: 'TAM_PHAP',
        tier: 'DIA',
        maxLevel: 6,
        enlightenmentBaseCost: 1200,
        enlightenmentCostPerLevel: 250,
        enlightenmentCostExponent: 1.92,
        bonuses: [
            { targetStat: 'critRate', modifier: 'ADDITIVE', value: 0.01 }, // +1% crit rate
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 200 },
        ],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'critRate', modifier: 'ADDITIVE', value: 0.01 } } 
        }))
    },
    {
        id: 'tam-phap-dia-4',
        name: 'Hải Vương Kinh',
        description: 'Tâm pháp thượng cổ, giúp người tu luyện có được trữ lượng linh lực dồi dào như biển cả, vô cùng vô tận.',
        type: 'TAM_PHAP',
        tier: 'DIA',
        maxLevel: 6,
        enlightenmentBaseCost: 2000,
        enlightenmentCostPerLevel: 400,
        enlightenmentCostExponent: 1.95,
        bonuses: [
            { targetStat: 'maxMana', modifier: 'MULTIPLIER', value: 0.2 }, // +20% per level
        ],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'maxMana', modifier: 'MULTIPLIER', value: 0.2 } }
        }))
    },
    {
        id: 'tam-phap-dia-5',
        name: 'Long Tượng Thần Công',
        description: 'Luyện thể công pháp mô phỏng sức mạnh của Long và Tượng, tu luyện đến đại thành sẽ có sức mạnh dời non lấp bể, thân thể vô cùng cứng rắn.',
        type: 'TAM_PHAP',
        tier: 'DIA',
        maxLevel: 6,
        enlightenmentBaseCost: 1800,
        enlightenmentCostPerLevel: 350,
        enlightenmentCostExponent: 1.94,
        bonuses: [
            { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 8 },
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 250 },
        ],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 8 } }
        }))
    },
    {
        id: 'tam-phap-dia-6',
        name: 'Thất Sát Ma Công',
        description: 'Ma công bá đạo, lấy việc kích phát sát khí để tăng sức mạnh hủy diệt, nhưng sẽ làm cho phòng ngự của bản thân trở nên yếu đi.',
        type: 'TAM_PHAP',
        tier: 'DIA',
        maxLevel: 6,
        enlightenmentBaseCost: 2200,
        enlightenmentCostPerLevel: 450,
        enlightenmentCostExponent: 2.05,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 300 },
            { targetStat: 'critDamage', modifier: 'ADDITIVE', value: 0.1 },
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', value: -0.05 },
        ],
        levelBonuses: Array.from({ length: 5 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 300 } }
        }))
    },

    // -- THIÊN GIAI --
    {
        id: 'tam-phap-thien-1',
        name: 'Bất Diệt Kim Thân',
        description: 'Tâm pháp luyện thể tối thượng, thân thể trở nên bất hoại, tăng mạnh Sinh Lực và Lực Thủ.',
        type: 'TAM_PHAP',
        tier: 'THIEN',
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
    {
        id: 'tam-phap-thien-4',
        name: 'Cửu Thiên Thần Hành Bộ',
        description: 'Thân pháp thần diệu, bước một bước là vượt Cửu Thiên, khiến đối thủ không thể nắm bắt được thân hình.',
        type: 'TAM_PHAP',
        tier: 'THIEN',
        maxLevel: 4,
        enlightenmentBaseCost: 5500,
        enlightenmentCostPerLevel: 1300,
        enlightenmentCostExponent: 2.35,
        bonuses: [
            { targetAttribute: 'thanPhap', modifier: 'MULTIPLIER', value: 0.2 },
            { targetStat: 'speed', modifier: 'MULTIPLIER', value: 0.05 },
        ],
        levelBonuses: Array.from({ length: 3 }, (_, i) => ({
            level: i + 2,
            upgrade: { addBonus: { targetAttribute: 'thanPhap', modifier: 'MULTIPLIER', value: 0.2 } }
        }))
    }
];