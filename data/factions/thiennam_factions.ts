import type { Faction } from '../npcs/npc_types';

export const THIENNAM_FACTIONS: Faction[] = [
    {
        id: "THANH_VAN_MON",
        name: "Thanh Vân Môn",
        roles: [
          { 
            name: "Thái thượng trưởng lão", 
            power: 100, 
            realmDistribution: [
              { realmIndex: 4, level: 3, weight: 6 }, // Nguyen Anh Dinh Phong
              { realmIndex: 5, level: 0, weight: 3 }, // Hoa Than So Ki
              { realmIndex: 5, level: 1, weight: 1 }, // Hoa Than Trung Ki
            ],
            titleChance: { base: 0.7, perRealm: 0.05 },
            titleThemes: ['cổ xưa', 'ẩn thế', 'huyền bí', 'tổ sư'],
            equipmentTierRange: ['DIA', 'THIEN'],
            attributeProfile: { canCot: 10, thanPhap: 8, thanThuc: 15, ngoTinh: 15, coDuyen: 5, tamCanh: 12 },
            fixedPositionChance: 0.9 
          },
          { 
            name: "Môn chủ", 
            power: 90, 
            realmDistribution: [
              { realmIndex: 4, level: 2, weight: 7 }, // Nguyen Anh Hau Ki
              { realmIndex: 4, level: 3, weight: 3 }, // Nguyen Anh Dinh Phong
            ],
            titleChance: { base: 0.6, perRealm: 0.05 },
            titleThemes: ['uy nghiêm', 'chưởng quản', 'tông môn', 'kiếm'],
            equipmentTierRange: ['DIA', 'THIEN'],
            attributeProfile: { canCot: 12, thanPhap: 10, thanThuc: 12, ngoTinh: 10, coDuyen: 6, tamCanh: 15 },
            fixedPositionChance: 0.8 
          },
          { 
            name: "Phó môn chủ", 
            power: 80, 
            realmDistribution: [
              { realmIndex: 4, level: 0, weight: 7 }, // Nguyen Anh So Ki
              { realmIndex: 4, level: 1, weight: 3 }, // Nguyen Anh Trung Ki
            ],
            titleChance: { base: 0.5, perRealm: 0.05 },
            titleThemes: ['phụ tá', 'quản lý', 'trí tuệ'],
            equipmentTierRange: ['DIA', 'DIA'],
            attributeProfile: { canCot: 10, thanPhap: 9, thanThuc: 13, ngoTinh: 14, coDuyen: 5, tamCanh: 12 },
            fixedPositionChance: 0.7 
          },
          { 
            name: "Trưởng lão", 
            power: 70, 
            realmDistribution: [
              { realmIndex: 3, level: 3, weight: 8 }, // Kim Dan Dinh Phong
              { realmIndex: 4, level: 0, weight: 2 }, // Nguyen Anh So Ki
            ],
            titleChance: { base: 0.45, perRealm: 0.05 },
            titleThemes: ['chấp sự', 'thủ các', 'truyền công', 'luyện đan', 'luyện khí'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 10, thanPhap: 8, thanThuc: 11, ngoTinh: 12, coDuyen: 8, tamCanh: 11 },
            fixedPositionChance: 0.6 
          },
          { 
            name: "Chân truyền đệ tử", 
            power: 50, 
            realmDistribution: [
              { realmIndex: 1, level: 3, weight: 10 }, // Truc Co Dinh Phong
              { realmIndex: 2, level: 0, weight: 8 }, // Ket Tinh So Ki
              { realmIndex: 2, level: 1, weight: 6 },
              { realmIndex: 2, level: 2, weight: 4 },
              { realmIndex: 2, level: 3, weight: 2 }, // Ket Tinh Dinh Phong
            ],
            titleChance: { base: 0.05, perRealm: 0.05 },
            titleThemes: ['thiên tài', 'kiếm', 'tinh anh', 'hạt giống'],
            equipmentTierRange: ['HUYEN', 'HUYEN'],
            attributeProfile: { canCot: 9, thanPhap: 12, thanThuc: 11, ngoTinh: 13, coDuyen: 8, tamCanh: 7 },
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
            titleChance: { base: 0, perRealm: 0.01 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          },
          { 
            name: "Ngoại môn đệ tử", 
            power: 10, 
            realmDistribution: [
                { realmIndex: 0, level: 6, weight: 20 },
                { realmIndex: 0, level: 7, weight: 20 },
                { realmIndex: 0, level: 8, weight: 15 },
                { realmIndex: 0, level: 9, weight: 15 },
                { realmIndex: 0, level: 10, weight: 10 },
                { realmIndex: 0, level: 11, weight: 8 },
                { realmIndex: 0, level: 12, weight: 5 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 11, thanPhap: 9, thanThuc: 8, ngoTinh: 8, coDuyen: 12, tamCanh: 12 },
          },
        ]
    },
    {
        id: "LUU_LY_TONG",
        name: "Lưu Ly Tông",
        roles: [
          { 
            name: "Tông chủ", 
            power: 85, 
            realmDistribution: [
              { realmIndex: 3, level: 2, weight: 7 }, { realmIndex: 3, level: 3, weight: 3 }, // Kim Dan
              { realmIndex: 4, level: 0, weight: 1 }, // Nguyen Anh
            ],
            titleChance: { base: 0.5, perRealm: 0.05 },
            titleThemes: ['lưu ly', 'thanh tú', 'phiến', 'kiếm pháp'],
            equipmentTierRange: ['DIA', 'DIA'],
            attributeProfile: { canCot: 9, thanPhap: 14, thanThuc: 13, ngoTinh: 12, coDuyen: 7, tamCanh: 10 },
            fixedPositionChance: 0.75
          },
           { 
            name: "Trưởng lão", 
            power: 70, 
            realmDistribution: [
              { realmIndex: 2, level: 3, weight: 8 }, // Ket Tinh Dinh Phong
              { realmIndex: 3, level: 0, weight: 4 }, // Kim Dan So Ki
              { realmIndex: 3, level: 1, weight: 2 }, // Kim Dan Trung Ki
            ],
            titleChance: { base: 0.4, perRealm: 0.05 },
            titleThemes: ['chấp sự', 'truyền công', 'hộ pháp'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 12, ngoTinh: 11, coDuyen: 8, tamCanh: 9 },
            fixedPositionChance: 0.6 
          },
           { 
            name: "Đệ tử", 
            power: 25, 
            realmDistribution: [
              { realmIndex: 0, level: 8, weight: 8 }, { realmIndex: 0, level: 9, weight: 8 }, { realmIndex: 0, level: 10, weight: 6 }, 
              { realmIndex: 0, level: 11, weight: 4 }, { realmIndex: 0, level: 12, weight: 2 },
              { realmIndex: 1, level: 0, weight: 5 }, { realmIndex: 1, level: 1, weight: 4 }, { realmIndex: 1, level: 2, weight: 2 }, { realmIndex: 1, level: 3, weight: 1 },
            ],
            titleChance: { base: 0, perRealm: 0.01 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 9, thanPhap: 12, thanThuc: 11, ngoTinh: 10, coDuyen: 9, tamCanh: 9 },
          },
        ]
    },
    {
        id: "LUC_YEN_THON",
        name: "Lục Yên Thôn",
        roles: [
          { 
            name: "Trưởng thôn", 
            power: 100, 
            realmDistribution: [
                { realmIndex: 0, level: 0, weight: 10 },
                { realmIndex: 1, level: 1, weight: 5 },
                { realmIndex: 2, level: 0, weight: 1 },
            ],
            titleChance: { base: 0.01, perRealm: 0.01 },
            titleThemes: ['ẩn dật', 'lão nông'],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 10, thanPhap: 8, thanThuc: 10, ngoTinh: 12, coDuyen: 8, tamCanh: 12 },
            fixedPositionChance: 0.95 
          },
          { 
            name: "Ẩn thế tu sĩ", 
            power: 100, 
            realmDistribution: [
              { realmIndex: 2, level: 0, weight: 10 },
              { realmIndex: 3, level: 1, weight: 5 },
              { realmIndex: 4, level: 2, weight: 2 },
              { realmIndex: 4, level: 3, weight: 1 },
            ],
            titleChance: { base: 0.1, perRealm: 0.05 },
            titleThemes: ['ẩn tu', 'tiền bối', 'quy ẩn'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 8, thanPhap: 9, thanThuc: 14, ngoTinh: 15, coDuyen: 4, tamCanh: 10 },
            fixedPositionChance: 0.9 
          },
          { 
            name: "Lão bản", 
            power: 40, 
            realmDistribution: [
              { realmIndex: 0, level: 0, weight: 10 }, { realmIndex: 1, level: 1, weight: 8 }, { realmIndex: 1, level: 2, weight: 6 }, { realmIndex: 1, level: 3, weight: 4 },
              { realmIndex: 2, level: 0, weight: 3 }, { realmIndex: 2, level: 1, weight: 2 }, { realmIndex: 2, level: 2, weight: 1 }, { realmIndex: 2, level: 3, weight: 1 },
            ],
            titleChance: { base: 0, perRealm: 0.005 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 8, thanPhap: 8, thanThuc: 11, ngoTinh: 12, coDuyen: 15, tamCanh: 6 },
            fixedPositionChance: 0.9 
          },
          { 
            name: "Thợ rèn", 
            power: 25, 
            realmDistribution: [
              { realmIndex: 0, level: 5, weight: 10 }, { realmIndex: 0, level: 6, weight: 10 }, { realmIndex: 0, level: 7, weight: 8 }, 
              { realmIndex: 0, level: 8, weight: 6 }, { realmIndex: 0, level: 9, weight: 4 }, { realmIndex: 0, level: 10, weight: 2 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 15, thanPhap: 6, thanThuc: 8, ngoTinh: 8, coDuyen: 8, tamCanh: 15 },
            fixedPositionChance: 0.9
          },
          { 
            name: "Thợ săn", 
            power: 20, 
            realmDistribution: [
              { realmIndex: 0, level: 3, weight: 10 }, { realmIndex: 0, level: 4, weight: 10 }, { realmIndex: 0, level: 5, weight: 8 }, 
              { realmIndex: 0, level: 6, weight: 8 }, { realmIndex: 0, level: 7, weight: 5 }, { realmIndex: 0, level: 8, weight: 3 }, { realmIndex: 0, level: 9, weight: 1 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 12, thanPhap: 14, thanThuc: 10, ngoTinh: 6, coDuyen: 10, tamCanh: 8 },
          },
          { 
            name: "Nông dân", 
            power: 5, 
            realmDistribution: [
              { realmIndex: 0, level: 0, weight: 10 }, { realmIndex: 0, level: 1, weight: 8 }, { realmIndex: 0, level: 2, weight: 5 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 13, thanPhap: 8, thanThuc: 8, ngoTinh: 7, coDuyen: 12, tamCanh: 12 },
          },
          { 
            name: "Thường dân", 
            power: 5, 
            realmDistribution: [
              { realmIndex: 0, level: 0, weight: 10 }, { realmIndex: 0, level: 1, weight: 8 }, { realmIndex: 0, level: 2, weight: 5 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          },
        ]
    },
    {
        id: "THAT_HUYEN_THANH",
        name: "Thất Huyền Thành",
        roles: [
          { 
            name: "Thành chủ", 
            power: 100, 
            realmDistribution: [
              { realmIndex: 4, level: 1, weight: 10 }, { realmIndex: 4, level: 2, weight: 5 }, { realmIndex: 4, level: 3, weight: 2 },
              { realmIndex: 5, level: 0, weight: 1 },
            ],
            titleChance: { base: 0.6, perRealm: 0.05 },
            titleThemes: ['thành chủ', 'cai quản', 'uy dũng'],
            equipmentTierRange: ['DIA', 'THIEN'],
            attributeProfile: { canCot: 12, thanPhap: 10, thanThuc: 12, ngoTinh: 10, coDuyen: 6, tamCanh: 15 },
            fixedPositionChance: 0.85 
          },
          { 
            name: "Trưởng lão khách khanh", 
            power: 85, 
            realmDistribution: [
              { realmIndex: 4, level: 0, weight: 10 }, { realmIndex: 4, level: 1, weight: 8 }, { realmIndex: 4, level: 2, weight: 3 },
            ],
            titleChance: { base: 0.4, perRealm: 0.05 },
            titleThemes: ['khách khanh', 'tự do', 'cường đại'],
            equipmentTierRange: ['DIA', 'DIA'],
            attributeProfile: { canCot: 10, thanPhap: 11, thanThuc: 11, ngoTinh: 11, coDuyen: 12, tamCanh: 5 },
            fixedPositionChance: 0.7 
          },
          { 
            name: "Thống lĩnh vệ binh", 
            power: 75, 
            realmDistribution: [
              { realmIndex: 3, level: 1, weight: 10 }, { realmIndex: 3, level: 2, weight: 8 }, { realmIndex: 3, level: 3, weight: 4 },
            ],
            titleChance: { base: 0.05, perRealm: 0.05 },
            titleThemes: ['thống lĩnh', 'thiết huyết', 'sát phạt'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 14, thanPhap: 12, thanThuc: 9, ngoTinh: 6, coDuyen: 5, tamCanh: 14 },
            fixedPositionChance: 0.5 
          },
          { 
            name: "Chủ tiệm lớn", 
            power: 60, 
            realmDistribution: [
              { realmIndex: 2, level: 3, weight: 10 }, { realmIndex: 3, level: 0, weight: 8 }, { realmIndex: 3, level: 1, weight: 4 }, { realmIndex: 3, level: 2, weight: 1 },
            ],
            titleChance: { base: 0.02, perRealm: 0.02 },
            titleThemes: ['thương nhân', 'giàu có', 'bảo vật'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 8, thanPhap: 8, thanThuc: 12, ngoTinh: 12, coDuyen: 15, tamCanh: 5 },
            fixedPositionChance: 0.9 
          },
          { 
            name: "Chủ tiệm nhỏ", 
            power: 40, 
            realmDistribution: [
              { realmIndex: 0, level: 9, weight: 8 }, { realmIndex: 0, level: 10, weight: 8 }, { realmIndex: 0, level: 11, weight: 6 }, { realmIndex: 0, level: 12, weight: 4 },
              { realmIndex: 1, level: 0, weight: 5 }, { realmIndex: 1, level: 1, weight: 4 }, { realmIndex: 1, level: 2, weight: 2 }, { realmIndex: 1, level: 3, weight: 1 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 9, thanPhap: 9, thanThuc: 10, ngoTinh: 11, coDuyen: 13, tamCanh: 8 },
            fixedPositionChance: 0.85 
          },
          { 
            name: "Tiểu nhị", 
            power: 8, 
            realmDistribution: [
              { realmIndex: 0, level: 1, weight: 10 }, { realmIndex: 0, level: 2, weight: 10 }, { realmIndex: 0, level: 3, weight: 8 }, 
              { realmIndex: 0, level: 4, weight: 5 }, { realmIndex: 0, level: 5, weight: 2 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 10, thanPhap: 11, thanThuc: 9, ngoTinh: 9, coDuyen: 12, tamCanh: 9 },
          },
          { 
            name: "Vệ binh", 
            power: 25, 
            realmDistribution: [
              { realmIndex: 1, level: 0, weight: 10 }, { realmIndex: 1, level: 1, weight: 5 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 13, thanPhap: 12, thanThuc: 8, ngoTinh: 6, coDuyen: 7, tamCanh: 14 },
          },
          { 
            name: "Thường dân", 
            power: 5, 
            realmDistribution: [
              { realmIndex: 0, level: 0, weight: 10 }, { realmIndex: 0, level: 1, weight: 10 }, { realmIndex: 0, level: 2, weight: 8 }, { realmIndex: 0, level: 3, weight: 4 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          },
        ]
    },
    {
        id: "TIEU_GIA",
        name: "Tiêu Gia",
        familyName: "Tiêu",
        roles: [
          { 
            name: "Tộc trưởng", 
            power: 80, 
            realmDistribution: [
                { realmIndex: 1, level: 1, weight: 2 }, { realmIndex: 1, level: 2, weight: 3 }, { realmIndex: 1, level: 3, weight: 5 },
                { realmIndex: 2, level: 0, weight: 8 }, { realmIndex: 2, level: 1, weight: 8 }, { realmIndex: 2, level: 2, weight: 6 }, { realmIndex: 2, level: 3, weight: 4 },
                { realmIndex: 3, level: 0, weight: 3 }, { realmIndex: 3, level: 1, weight: 2 }, { realmIndex: 3, level: 2, weight: 1 }, { realmIndex: 3, level: 3, weight: 1 },
            ],
            titleChance: { base: 0.02, perRealm: 0.02 },
            titleThemes: ['uy mãnh', 'chiến đấu', 'gia tộc'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 13, thanPhap: 12, thanThuc: 10, ngoTinh: 8, coDuyen: 5, tamCanh: 12 },
            fixedPositionChance: 0.8
          },
          { 
            name: "Trưởng lão", 
            power: 65, 
            realmDistribution: [
              { realmIndex: 1, level: 3, weight: 10 },
              { realmIndex: 2, level: 0, weight: 8 }, { realmIndex: 2, level: 1, weight: 8 }, { realmIndex: 2, level: 2, weight: 6 }, { realmIndex: 2, level: 3, weight: 4 },
              { realmIndex: 3, level: 0, weight: 3 }, { realmIndex: 3, level: 1, weight: 1 },
            ],
            titleChance: { base: 0.01, perRealm: 0.01 },
            titleThemes: ['chấp sự', 'truyền công', 'hộ pháp'],
            equipmentTierRange: ['HUYEN', 'HUYEN'],
            attributeProfile: { canCot: 11, thanPhap: 9, thanThuc: 11, ngoTinh: 11, coDuyen: 7, tamCanh: 11 },
            fixedPositionChance: 0.7
          },
          { 
            name: "Đệ tử tinh anh", 
            power: 40, 
            realmDistribution: [
              { realmIndex: 1, level: 0, weight: 10 }, { realmIndex: 1, level: 1, weight: 10 }, { realmIndex: 1, level: 2, weight: 8 }, { realmIndex: 1, level: 3, weight: 5 },
              { realmIndex: 2, level: 0, weight: 3 }, { realmIndex: 2, level: 1, weight: 1 },
            ],
            titleChance: { base: 0, perRealm: 0.01 },
            titleThemes: ['thiên tài', 'hạt giống'],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 10, thanPhap: 11, thanThuc: 10, ngoTinh: 10, coDuyen: 9, tamCanh: 10 },
          },
          { 
            name: "Đệ tử", 
            power: 15, 
            realmDistribution: [
              { realmIndex: 0, level: 3, weight: 10 }, { realmIndex: 0, level: 4, weight: 10 }, { realmIndex: 0, level: 5, weight: 10 }, 
              { realmIndex: 0, level: 6, weight: 9 }, { realmIndex: 0, level: 7, weight: 9 }, { realmIndex: 0, level: 8, weight: 8 }, 
              { realmIndex: 0, level: 9, weight: 7 }, { realmIndex: 0, level: 10, weight: 6 }, { realmIndex: 0, level: 11, weight: 4 }, { realmIndex: 0, level: 12, weight: 2 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          },
        ]
    },
    {
        id: "MOC_GIA",
        name: "Mộc Gia",
        familyName: "Mộc",
        roles: [
          { 
            name: "Tộc trưởng", 
            power: 75, 
            realmDistribution: [
                { realmIndex: 1, level: 1, weight: 2 }, { realmIndex: 1, level: 2, weight: 3 }, { realmIndex: 1, level: 3, weight: 5 },
                { realmIndex: 2, level: 0, weight: 8 }, { realmIndex: 2, level: 1, weight: 8 }, { realmIndex: 2, level: 2, weight: 6 }, { realmIndex: 2, level: 3, weight: 4 },
                { realmIndex: 3, level: 0, weight: 3 }, { realmIndex: 3, level: 1, weight: 2 }, { realmIndex: 3, level: 2, weight: 1 }, { realmIndex: 3, level: 3, weight: 1 },
            ],
            titleChance: { base: 0.02, perRealm: 0.02 },
            titleThemes: ['dược sư', 'ôn hòa', 'linh thảo'],
            equipmentTierRange: ['HUYEN', 'DIA'],
            attributeProfile: { canCot: 9, thanPhap: 8, thanThuc: 12, ngoTinh: 15, coDuyen: 6, tamCanh: 10 },
            fixedPositionChance: 0.8
          },
          { 
            name: "Trưởng lão", 
            power: 60, 
            realmDistribution: [
              { realmIndex: 0, level: 10, weight: 2 }, { realmIndex: 0, level: 11, weight: 2 }, { realmIndex: 0, level: 12, weight: 2 },
              { realmIndex: 1, level: 0, weight: 10 }, { realmIndex: 1, level: 1, weight: 9 }, { realmIndex: 1, level: 2, weight: 8 }, { realmIndex: 1, level: 3, weight: 7 },
              { realmIndex: 2, level: 0, weight: 6 }, { realmIndex: 2, level: 1, weight: 5 }, { realmIndex: 2, level: 2, weight: 4 }, { realmIndex: 2, level: 3, weight: 3 },
              { realmIndex: 3, level: 0, weight: 1 },
            ],
            titleChance: { base: 0.01, perRealm: 0.01 },
            titleThemes: ['luyện đan', 'chăm sóc dược viên', 'hiền từ'],
            equipmentTierRange: ['HUYEN', 'HUYEN'],
            attributeProfile: { canCot: 10, thanPhap: 7, thanThuc: 11, ngoTinh: 14, coDuyen: 8, tamCanh: 10 },
            fixedPositionChance: 0.7
          },
          { 
            name: "Dược sư", 
            power: 45, 
            realmDistribution: [
              { realmIndex: 0, level: 9, weight: 10 }, { realmIndex: 0, level: 10, weight: 9 }, { realmIndex: 0, level: 11, weight: 8 }, { realmIndex: 0, level: 12, weight: 7 },
              { realmIndex: 1, level: 0, weight: 6 }, { realmIndex: 1, level: 1, weight: 5 }, { realmIndex: 1, level: 2, weight: 3 }, { realmIndex: 1, level: 3, weight: 1 },
            ],
            titleChance: { base: 0, perRealm: 0.01 },
            titleThemes: ['luyện đan', 'dược đồng'],
            equipmentTierRange: ['HOANG', 'HUYEN'],
            attributeProfile: { canCot: 8, thanPhap: 8, thanThuc: 12, ngoTinh: 16, coDuyen: 8, tamCanh: 8 },
          },
          { 
            name: "Đệ tử", 
            power: 12, 
            realmDistribution: [
                { realmIndex: 0, level: 2, weight: 10 }, { realmIndex: 0, level: 3, weight: 10 }, { realmIndex: 0, level: 4, weight: 9 }, { realmIndex: 0, level: 5, weight: 9 },
                { realmIndex: 0, level: 6, weight: 8 }, { realmIndex: 0, level: 7, weight: 7 }, { realmIndex: 0, level: 8, weight: 6 }, { realmIndex: 0, level: 9, weight: 5 },
                { realmIndex: 0, level: 10, weight: 4 }, { realmIndex: 0, level: 11, weight: 3 }, { realmIndex: 0, level: 12, weight: 2 },
                { realmIndex: 1, level: 0, weight: 1 }, { realmIndex: 1, level: 1, weight: 1 }, { realmIndex: 1, level: 2, weight: 1 }, { realmIndex: 1, level: 3, weight: 1 },
            ],
            titleChance: { base: 0, perRealm: 0 },
            titleThemes: [],
            equipmentTierRange: ['HOANG', 'HOANG'],
            attributeProfile: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
          },
        ]
    },
];
