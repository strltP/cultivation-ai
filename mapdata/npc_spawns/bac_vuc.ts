import type { MapID } from '../../types/map';
import type { NpcSpawnDefinition } from '../../data/npcs/npc_types';

export const BAC_VUC_NPC_SPAWNS: Partial<Record<MapID, NpcSpawnDefinition[]>> = {
    BAC_VUC: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    roleDistribution: [{ roleName: 'Tán tu', count: 15 }],
                    poiIds: ['bv-poi-tlt', 'bv-poi-dnt', 'bv-poi-tlth', 'bv-poi-dlth'],
                }
            ],
            stableCount: 25,
        }
    ],
    HUYEN_NGOC_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH', 
                    roleDistribution: [
                        { roleName: 'Vệ binh', count: 3 },
                        { roleName: 'Thường dân', count: 3 }
                    ],
                    poiIds: ['hth-poi-1', 'hth-poi-2', 'hth-poi-3', 'hth-poi-4', 'hth-poi-5'],
                }
            ],
            stableCount: 12,
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    roleDistribution: [{ roleName: 'Tán tu', count: 4 }],
                    poiIds: [],
                }
            ],
            stableCount: 8,
        }
    ],
    HUYEN_THIEN_KIEM_TONG: [
        {
            type: 'procedural',
            roles: [{ 
                factionId: 'HUYEN_THIEN_KIEM_TONG', 
                roleDistribution: [
                    { roleName: 'Tông chủ', count: 1 },
                    { roleName: 'Kiếm Trưởng Lão', count: 2 },
                    { roleName: 'Chân truyền đệ tử', count: 6 },
                    { roleName: 'Nội môn đệ tử', count: 15 },
                    { roleName: 'Ngoại môn đệ tử', count: 21 }
                ], 
                poiIds: ['htkt-poi-dien', 'htkt-poi-kinhcac', 'htkt-poi-luyendai', 'htkt-poi-detu-1', 'htkt-poi-detu-2'] 
            }],
            stableCount: 45,
            recruitment: {
                guaranteedIntervalYears: 5,
                monthlyChance: 0.008,
                batchSize: [4, 7],
                roleToRecruit: 'Ngoại môn đệ tử'
            }
        }
    ],
    CUU_TUYET_MON: [
         {
            type: 'procedural',
            roles: [{ 
                factionId: 'CUU_TUYET_MON', 
                roleDistribution: [
                    { roleName: 'Môn chủ', count: 1 },
                    { roleName: 'Trưởng lão', count: 3 },
                    { roleName: 'Nội môn đệ tử', count: 12 },
                    { roleName: 'Ngoại môn đệ tử', count: 17 }
                ], 
                poiIds: ['ctm-poi-cung', 'ctm-poi-huyenanh', 'ctm-poi-ho', 'ctm-poi-lau'] 
            }],
            stableCount: 33,
            recruitment: {
                guaranteedIntervalYears: 7,
                monthlyChance: 0.005,
                batchSize: [2, 4],
                roleToRecruit: 'Ngoại môn đệ tử'
            }
        }
    ],
    THAN_THUONG_MON: [
         {
            type: 'procedural',
            roles: [{ 
                factionId: 'THAN_THUONG_MON', 
                roleDistribution: [
                    { roleName: 'Môn chủ', count: 1 },
                    { roleName: 'Trưởng lão', count: 2 },
                    { roleName: 'Đệ tử tinh anh', count: 16 },
                    { roleName: 'Đệ tử', count: 23 }
                ], 
                poiIds: ['ttm-poi-dien', 'ttm-poi-luyencac', 'ttm-poi-dai', 'ttm-poi-binhxa'] 
            }],
            stableCount: 42,
            recruitment: {
                guaranteedIntervalYears: 3,
                monthlyChance: 0.01,
                batchSize: [5, 10],
                roleToRecruit: 'Đệ tử'
            }
        }
    ],
};
