import type { Faction } from '../npcs/npc_types';

export const COMMON_FACTIONS: Faction[] = [
    {
        id: "UNAFFILIATED",
        name: "Tán Tu",
        roles: [
          {
            name: "Tán tu",
            power: 15,
            realmDistribution: [
                // Luyen Khi (Realm 0) - Total Weight: 65
                { realmIndex: 0, level: 0, weight: 6 }, { realmIndex: 0, level: 1, weight: 6 }, { realmIndex: 0, level: 2, weight: 6 }, 
                { realmIndex: 0, level: 3, weight: 6 }, { realmIndex: 0, level: 4, weight: 6 }, { realmIndex: 0, level: 5, weight: 5 }, 
                { realmIndex: 0, level: 6, weight: 5 }, { realmIndex: 0, level: 7, weight: 5 }, { realmIndex: 0, level: 8, weight: 4 }, 
                { realmIndex: 0, level: 9, weight: 4 }, { realmIndex: 0, level: 10, weight: 3 }, { realmIndex: 0, level: 11, weight: 2 }, { realmIndex: 0, level: 12, weight: 1 },
                // Truc Co (Realm 1) - Total Weight: 25
                { realmIndex: 1, level: 0, weight: 8 }, { realmIndex: 1, level: 1, weight: 7 }, { realmIndex: 1, level: 2, weight: 6 }, { realmIndex: 1, level: 3, weight: 4 },
                // Ket Tinh (Realm 2) - Total Weight: 10
                { realmIndex: 2, level: 0, weight: 4 }, { realmIndex: 2, level: 1, weight: 3 }, { realmIndex: 2, level: 2, weight: 2 }, { realmIndex: 2, level: 3, weight: 1 },
                // Kim Dan (Realm 3) - Total Weight: 4
                { realmIndex: 3, level: 0, weight: 2 }, { realmIndex: 3, level: 1, weight: 1 }, { realmIndex: 3, level: 2, weight: 0.5 }, { realmIndex: 3, level: 3, weight: 0.5 },
                // Nguyen Anh (Realm 4) - Total Weight: 1
                { realmIndex: 4, level: 0, weight: 1 },
            ],
            titleChance: { base: 0.05, perRealm: 0.01 },
            titleThemes: ['lãng du', 'cô độc', 'ẩn dật', 'giang hồ'],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          }
        ]
    }
];