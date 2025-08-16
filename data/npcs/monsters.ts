import type { MonsterDefinition } from './npc_types';

export const ALL_MONSTERS: MonsterDefinition[] = [
    {
        baseId: 'monster_da_lang',
        name: 'Dã Lang',
        attributes: { canCot: 12, thanPhap: 15, thanThuc: 5, ngoTinh: 2, coDuyen: 1, tamCanh: 1 },
        baseStats: { maxHp: 80, attackPower: 10, defensePower: 5, speed: 12, critRate: 0.05, critDamage: 1.5, armorPenetration: 0 },
        lootTable: [
            { itemId: 'material_monster_bone_1', chance: 0.5, quantity: [1, 2] },
            { itemId: 'material_monster_blood_1', chance: 0.2, quantity: [1, 1] },
        ],
        respawnTimeMinutes: [43200, 86400], // 1-2 months
    },
    {
        baseId: 'monster_hac_ma_chu',
        name: 'Hắc Ma Chu',
        attributes: { canCot: 10, thanPhap: 12, thanThuc: 8, ngoTinh: 3, coDuyen: 1, tamCanh: 1 },
        baseStats: { maxHp: 60, attackPower: 12, defensePower: 8, speed: 10, critRate: 0.08, critDamage: 1.6, armorPenetration: 0.02 },
        lootTable: [
            { itemId: 'material_monster_blood_1', chance: 0.3, quantity: [1, 2] },
            { itemId: 'material_monster_core_1', chance: 0.1, quantity: [1, 1] },
        ],
        respawnTimeMinutes: [129600, 216000], // 3-5 months
    }
];
