import type { MonsterDefinition } from './npc_types';

export const ALL_MONSTERS: MonsterDefinition[] = [
    {
        baseId: 'monster_da_lang',
        name: 'Dã Lang',
        levelRange: [1, 2],
        attributes: { canCot: 8, thanPhap: 15, thanThuc: 5, ngoTinh: 2, coDuyen: 1, tamCanh: 1 },
        baseStats: {
            maxHp: 40, attackPower: 4, defensePower: 2, speed: 12, critRate: 0.05, critDamage: 1.5, armorPenetration: 0,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_monster_bone_1', chance: 0.5, quantity: [1, 2] },
            { itemId: 'material_monster_blood_1', chance: 0.2, quantity: [1, 1] },
        ],
        repopulationTimeMinutes: [43200, 86400], // 1-2 months
    },
    {
        baseId: 'monster_hac_ma_chu',
        name: 'Hắc Ma Chu',
        levelRange: [1, 3],
        attributes: { canCot: 6, thanPhap: 12, thanThuc: 8, ngoTinh: 3, coDuyen: 1, tamCanh: 1 },
        baseStats: {
            maxHp: 30, attackPower: 5, defensePower: 4, speed: 10, critRate: 0.08, critDamage: 1.6, armorPenetration: 0.02,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_monster_blood_1', chance: 0.3, quantity: [1, 2] },
            { itemId: 'material_monster_core_1', chance: 0.1, quantity: [1, 1] },
        ],
        repopulationTimeMinutes: [129600, 216000], // 3-5 months
    },
    {
        baseId: 'monster_huyet_nha_thu',
        name: 'Huyết Nha Thử',
        levelRange: [1, 3],
        attributes: { canCot: 10, thanPhap: 18, thanThuc: 6, ngoTinh: 2, coDuyen: 1, tamCanh: 1 },
        baseStats: {
            maxHp: 50, attackPower: 6, defensePower: 3, speed: 15, critRate: 0.1, critDamage: 1.6, armorPenetration: 0.01,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_monster_bone_1', chance: 0.4, quantity: [1, 1] },
            { itemId: 'material_monster_blood_1', chance: 0.4, quantity: [1, 2] },
            { itemId: 'material_monster_core_1', chance: 0.15, quantity: [1, 1] },
        ],
        repopulationTimeMinutes: [64800, 108000], // 1.5 - 2.5 months
    },
    {
        baseId: 'monster_nham_thach_cu_nhan',
        name: 'Nham Thạch Cự Nhân',
        levelRange: [3, 5],
        attributes: { canCot: 30, thanPhap: 4, thanThuc: 10, ngoTinh: 1, coDuyen: 1, tamCanh: 5 },
        baseStats: {
            maxHp: 200, attackPower: 15, defensePower: 25, speed: 5, critRate: 0.01, critDamage: 1.5, armorPenetration: 0,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_thanh_cuong_thach', chance: 0.6, quantity: [1, 3] },
            { itemId: 'material_monster_core_1', chance: 0.3, quantity: [1, 1] },
        ],
        repopulationTimeMinutes: [216000, 302400], // 5-7 months
    },
    {
        baseId: 'monster_loi_dieu',
        name: 'Lôi Điểu',
        levelRange: [4, 6],
        attributes: { canCot: 15, thanPhap: 25, thanThuc: 18, ngoTinh: 5, coDuyen: 2, tamCanh: 3 },
        baseStats: {
            maxHp: 120, attackPower: 25, defensePower: 12, speed: 22, critRate: 0.15, critDamage: 1.8, armorPenetration: 0.05,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_monster_blood_1', chance: 0.4, quantity: [1, 3] },
            { itemId: 'material_monster_core_1', chance: 0.4, quantity: [1, 2] },
        ],
        repopulationTimeMinutes: [259200, 388800], // 6-9 months
    },
    {
        baseId: 'monster_bang_hon_ho',
        name: 'Băng Hồn Hổ',
        levelRange: [5, 7],
        attributes: { canCot: 25, thanPhap: 22, thanThuc: 20, ngoTinh: 6, coDuyen: 3, tamCanh: 8 },
        baseStats: {
            maxHp: 350, attackPower: 40, defensePower: 28, speed: 18, critRate: 0.12, critDamage: 1.7, armorPenetration: 0.08,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_han_bang_thao', chance: 0.7, quantity: [1, 3] },
            { itemId: 'material_monster_bone_1', chance: 0.5, quantity: [2, 4] },
            { itemId: 'material_monster_core_1', chance: 0.5, quantity: [1, 2] },
        ],
        repopulationTimeMinutes: [345600, 432000], // 8-10 months
    },
    {
        baseId: 'monster_kim_giap_yeu_tuong',
        name: 'Kim Giáp Yêu Tướng',
        levelRange: [7, 9],
        attributes: { canCot: 40, thanPhap: 15, thanThuc: 25, ngoTinh: 8, coDuyen: 4, tamCanh: 15 },
        baseStats: {
            maxHp: 800, attackPower: 70, defensePower: 60, speed: 14, critRate: 0.1, critDamage: 1.8, armorPenetration: 0.15,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_tinh_ngan_khoang', chance: 0.5, quantity: [1, 2] },
            { itemId: 'material_kim_tinh', chance: 0.2, quantity: [1, 1] },
            { itemId: 'material_monster_core_1', chance: 0.8, quantity: [2, 4] },
        ],
        repopulationTimeMinutes: [432000, 604800], // 10-14 months
    },
    {
        baseId: 'monster_thai_co_long_hon',
        name: 'Thái Cổ Long Hồn',
        levelRange: [10, 10],
        attributes: { canCot: 60, thanPhap: 30, thanThuc: 50, ngoTinh: 15, coDuyen: 10, tamCanh: 25 },
        baseStats: {
            maxHp: 2000, attackPower: 150, defensePower: 100, speed: 25, critRate: 0.2, critDamage: 2.0, armorPenetration: 0.25,
            kimDamageBonus: 0, mocDamageBonus: 0, thuyDamageBonus: 0, hoaDamageBonus: 0, thoDamageBonus: 0,
            phongDamageBonus: 0, loiDamageBonus: 0, bangDamageBonus: 0, quangDamageBonus: 0, amDamageBonus: 0,
        },
        lootTable: [
            { itemId: 'material_kim_tinh', chance: 0.6, quantity: [1, 2] },
            { itemId: 'material_han_ngoc', chance: 0.4, quantity: [1, 1] },
            { itemId: 'material_monster_core_1', chance: 1.0, quantity: [5, 10] },
        ],
        repopulationTimeMinutes: [525600, 1051200], // 1-2 years
    },
];
