import type { Faction } from '../npcs/npc_types';

export const BACVUC_FACTIONS: Faction[] = [
    {
        id: "CUU_TUYET_MON",
        name: "Cửu Tuyết Môn",
        roles: [
          { 
            name: "Môn chủ", 
            power: 90, 
            realmDistribution: [
              { realmIndex: 4, level: 0, weight: 7 }, // Nguyen Anh Trung Ki
              { realmIndex: 4, level: 1, weight: 3 }, // Nguyen Anh Hau Ki
              { realmIndex: 3, level: 1, weight: 13 },
              { realmIndex: 3, level: 3, weight: 15 },
              { realmIndex: 3, level: 2, weight: 30 },
            ],
            titleChance: { base: 0.1, perRealm: 0.05 },
            titleThemes: ['Băng', 'Tuyết', 'Lạnh giá', 'Cung chủ'],
            equipmentTierRange: ['DIA', 'THIEN'],
            attributeProfile: { canCot: 9, thanPhap: 13, thanThuc: 14, ngoTinh: 11, coDuyen: 6, tamCanh: 12 },
            fixedPositionChance: 0.9 
          },
          { 
            name: "Trưởng lão", 
            power: 70, 
            realmDistribution: [
              { realmIndex: 3, level: 2, weight: 18 }, // Kim Dan Hau Ki
              { realmIndex: 3, level: 3, weight: 20 }, // Kim Dan Dinh Phong
              { realmIndex: 3, level: 1, weight: 15 },
              { realmIndex: 3, level: 0, weight: 30 },
              { realmIndex: 2, level: 3, weight: 15 },
              { realmIndex: 4, level: 0, weight: 1 },
            ],
            titleChance: { base: 0.05, perRealm: 0.03 },
            titleThemes: ['Hàn băng', 'Hộ pháp', 'Chấp sự'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 13, ngoTinh: 12, coDuyen: 7, tamCanh: 8 },
            fixedPositionChance: 0.85 
          },
          { 
            name: "Nội môn đệ tử", 
            power: 30, 
            realmDistribution: [
              { realmIndex: 1, level: 0, weight: 20 }, // Truc Co So Ki
              { realmIndex: 1, level: 1, weight: 15 },
              { realmIndex: 1, level: 2, weight: 10 },
              { realmIndex: 1, level: 3, weight: 5 }, // Truc Co Dinh Phong
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 9, thanPhap: 11, thanThuc: 12, ngoTinh: 10, coDuyen: 9, tamCanh: 9 },
          },
          { 
            name: "Ngoại môn đệ tử", 
            power: 10, 
            realmDistribution: [
                { realmIndex: 0, level: 0, weight: 10 }, { realmIndex: 0, level: 1, weight: 5 }, { realmIndex: 0, level: 2, weight: 15 },
                { realmIndex: 0, level: 3, weight: 15 }, { realmIndex: 0, level: 4, weight: 10 }, { realmIndex: 0, level: 5, weight: 8 },
                { realmIndex: 0, level: 6, weight: 20 }, { realmIndex: 0, level: 7, weight: 20 }, { realmIndex: 0, level: 8, weight: 15 },
                { realmIndex: 0, level: 9, weight: 15 }, { realmIndex: 0, level: 10, weight: 10 }, { realmIndex: 0, level: 11, weight: 8 },
                { realmIndex: 0, level: 12, weight: 15 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          },
        ]
    },
    {
        id: "HUYEN_THIEN_KIEM_TONG",
        name: "Huyền Thiên Kiếm Tông",
        roles: [
          { 
            name: "Tông chủ", 
            power: 95, 
            realmDistribution: [
              { realmIndex: 4, level: 3, weight: 1 }, // Nguyen Anh Hau Ki
              { realmIndex: 4, level: 2, weight: 4 }, // Nguyen Anh Dinh Phong
              { realmIndex: 4, level: 1, weight: 7 },
              { realmIndex: 4, level: 0, weight: 9 },
              { realmIndex: 3, level: 3, weight: 15 },
              { realmIndex: 3, level: 2, weight: 15 },
            ],
            titleChance: { base: 0.1, perRealm: 0.05 },
            titleThemes: ['Kiếm', 'Thiên', 'Chính đạo', 'Kiếm tôn'],
            equipmentTierRange: ['DIA', 'THIEN'],
            attributeProfile: { canCot: 14, thanPhap: 12, thanThuc: 13, ngoTinh: 9, coDuyen: 5, tamCanh: 12 },
            fixedPositionChance: 0.8 
          },
          { 
            name: "Kiếm Trưởng Lão", 
            power: 75, 
            realmDistribution: [
              { realmIndex: 3, level: 3, weight: 8 }, // Kim Dan Dinh Phong
              { realmIndex: 4, level: 0, weight: 2 }, // Nguyen Anh So Ki
              { realmIndex: 3, level: 2, weight: 15 },
              { realmIndex: 3, level: 1, weight: 15 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: ['Kiếm', 'Chấp pháp', 'Sát phạt', 'Trảm yêu'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 13, thanPhap: 11, thanThuc: 12, ngoTinh: 8, coDuyen: 6, tamCanh: 10 },
            fixedPositionChance: 0.8
          },
          { 
            name: "Chân truyền đệ tử", 
            power: 50, 
            realmDistribution: [
              { realmIndex: 2, level: 0, weight: 8 }, { realmIndex: 2, level: 1, weight: 6 },
              { realmIndex: 2, level: 2, weight: 4 }, { realmIndex: 2, level: 3, weight: 2 }, // Ket Tinh
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: ['Kiếm đạo', 'Tinh anh', 'Kiếm si'],
            equipmentTierRange: ['HUYEN', 'HUYEN'],
            attributeProfile: { canCot: 11, thanPhap: 13, thanThuc: 12, ngoTinh: 10, coDuyen: 8, tamCanh: 6 },
          },
          { 
            name: "Nội môn đệ tử", 
            power: 30, 
            realmDistribution: [
              { realmIndex: 1, level: 0, weight: 20 }, { realmIndex: 1, level: 1, weight: 15 },
              { realmIndex: 1, level: 2, weight: 10 }, { realmIndex: 1, level: 3, weight: 5 }, // Truc Co
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          },
          { 
            name: "Ngoại môn đệ tử", 
            power: 10, 
            realmDistribution: [
                { realmIndex: 0, level: 6, weight: 20 }, { realmIndex: 0, level: 7, weight: 20 }, { realmIndex: 0, level: 8, weight: 15 },
                { realmIndex: 0, level: 9, weight: 15 }, { realmIndex: 0, level: 10, weight: 10 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 11, thanPhap: 9, thanThuc: 8, ngoTinh: 8, coDuyen: 12, tamCanh: 12 },
          },
        ]
    },
    {
        id: "THAN_THUONG_MON",
        name: "Thần Thương Môn",
        roles: [
          { 
            name: "Môn chủ", 
            power: 88, 
            realmDistribution: [
              { realmIndex: 4, level: 0, weight: 7 }, // Nguyen Anh So Ki
              { realmIndex: 4, level: 1, weight: 3 }, // Nguyen Anh Trung Ki
            ],
            titleChance: { base: 0.1, perRealm: 0.05 },
            titleThemes: ['Thương', 'Chiến', 'Bá đạo', 'Phá quân'],
            equipmentTierRange: ['DIA', 'DIA'],
            attributeProfile: { canCot: 15, thanPhap: 13, thanThuc: 9, ngoTinh: 7, coDuyen: 6, tamCanh: 15 },
            fixedPositionChance: 0.7 
          },
          { 
            name: "Trưởng lão", 
            power: 68, 
            realmDistribution: [
              { realmIndex: 3, level: 1, weight: 8 }, // Kim Dan Trung Ki
              { realmIndex: 3, level: 2, weight: 2 }, // Kim Dan Hau Ki
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: ['Chiến thương', 'Hộ pháp', 'Thiết huyết'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 14, thanPhap: 11, thanThuc: 8, ngoTinh: 7, coDuyen: 8, tamCanh: 12 },
            fixedPositionChance: 0.5 
          },
          { 
            name: "Đệ tử tinh anh", 
            power: 45, 
            realmDistribution: [
              { realmIndex: 1, level: 2, weight: 8 }, { realmIndex: 1, level: 3, weight: 6 }, // Truc Co
              { realmIndex: 2, level: 0, weight: 4 }, { realmIndex: 2, level: 1, weight: 2 }, // Ket Tinh
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: ['Thương pháp', 'Xung phong', 'Tiên phong'],
            equipmentTierRange: ['HUYEN', 'HUYEN'],
            attributeProfile: { canCot: 13, thanPhap: 12, thanThuc: 9, ngoTinh: 8, coDuyen: 8, tamCanh: 10 },
          },
          { 
            name: "Đệ tử", 
            power: 20, 
            realmDistribution: [
              { realmIndex: 0, level: 8, weight: 10 }, { realmIndex: 0, level: 9, weight: 10 }, { realmIndex: 0, level: 10, weight: 8 },
              { realmIndex: 0, level: 11, weight: 5 }, { realmIndex: 0, level: 12, weight: 3 },
              { realmIndex: 1, level: 0, weight: 2 }, // Truc Co So Ki
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 12, thanPhap: 11, thanThuc: 9, ngoTinh: 8, coDuyen: 10, tamCanh: 10 },
          },
        ]
    },
];