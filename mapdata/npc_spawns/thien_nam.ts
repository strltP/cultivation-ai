import type { MapID } from '../types/map';
import type { NpcSpawnDefinition } from '../data/npcs/npc_types';

export const THIEN_NAM_NPC_SPAWNS: Partial<Record<MapID, NpcSpawnDefinition[]>> = {
    THIEN_NAM: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    roleDistribution: [{ roleName: 'Tán tu', count: 10 }],
                    poiIds: [], // Sinh ra ngẫu nhiên ở bất kỳ đâu
                }
            ],
            stableCount: 25,
        }
    ],
    HAC_AM_SAM_LAM: [],
    THAT_HUYEN_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [
                        { roleName: 'Vệ binh', count: 5 },
                        { roleName: 'Thường dân', count: 5 }
                    ],
                    poiIds: [],
                },
                 {
                    factionId: 'THAT_HUYEN_THANH',
                    ageDistribution: { young: 0.1, middle: 0.5, old: 0.4 }, // Chủ tiệm thường lớn tuổi hơn
                    roleDistribution: [{ roleName: 'Chủ tiệm lớn', count: 2 }],
                    poiIds: ['tht-poi-1', 'tht-poi-2'],
                }
            ],
            stableCount: 20,
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    roleDistribution: [{ roleName: 'Tán tu', count: 5 }],
                    poiIds: [],
                }
            ],
            stableCount: 10,
        }
    ],
    MO_LINH_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [
                        { roleName: 'Vệ binh', count: 3 },
                        { roleName: 'Thường dân', count: 3 },
                        { roleName: 'Tiểu nhị', count: 2 }
                    ],
                    poiIds: ['mlt-poi-1', 'mlt-poi-2', 'mlt-poi-3', 'mlt-poi-4'],
                }
            ],
            stableCount: 15,
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
    THIEN_MA_TUU_LAU: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [
                        { roleName: 'Thường dân', count: 2 }
                    ],
                    poiIds: [], 
                }
            ],
            stableCount: 5,
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    roleDistribution: [{ roleName: 'Tán tu', count: 2 }],
                    poiIds: [],
                }
            ],
            stableCount: 5,
        }
    ],
    VAN_BAO_LAU: [],
    LUC_YEN_THON: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'LUC_YEN_THON',
                    ageDistribution: { young: 0.1, middle: 0.4, old: 0.5 }, // Lão bản thường già
                    roleDistribution: [{ roleName: 'Lão bản', count: 1 }],
                    poiIds: ['lyt-poi-2']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleDistribution: [
                        { roleName: 'Thợ săn', count: 2 },
                        { roleName: 'Nông dân', count: 3 },
                        { roleName: 'Thường dân', count: 4 }
                    ],
                    poiIds: ['lyt-poi-9', 'lyt-poi-3', 'lyt-poi-5', 'lyt-poi-6', 'lyt-poi-7']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    ageDistribution: { young: 0.0, middle: 0.2, old: 0.8 }, // Ẩn thế tu sĩ phải già
                    roleDistribution: [{ roleName: 'Ẩn thế tu sĩ', count: 1 }],
                    poiIds: []
                }
            ],
            stableCount: 15,
        }
    ],
    THANH_VAN_MON: [
        {
            type: 'procedural',
            roles: [
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [
                        { roleName: 'Môn chủ', count: 1 },
                        { roleName: 'Phó môn chủ', count: 2 },
                        { roleName: 'Trưởng lão', count: 3 },
                        { roleName: 'Chân truyền đệ tử', count: 4 },
                        { roleName: 'Nội môn đệ tử', count: 5 },
                        { roleName: 'Ngoại môn đệ tử', count: 8 }
                    ], 
                    poiIds: ['tvm-poi-1', 'tvm-poi-2', 'tvm-poi-3', 'tvm-poi-4', 'tvm-poi-5', 'tvm-poi-7'] 
                }
            ],
            stableCount: 23,
            recruitment: {
                guaranteedIntervalYears: 4,
                monthlyChance: 0.007,
                batchSize: [3, 6],
                roleToRecruit: 'Ngoại môn đệ tử'
            }
        }
    ],
    LUU_LY_TONG: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'LUU_LY_TONG',
                    roleDistribution: [
                        { roleName: 'Tông chủ', count: 1 },
                        { roleName: 'Trưởng lão', count: 2 },
                        { roleName: 'Đệ tử', count: 10 }
                    ],
                    poiIds: ['llt-poi-1', 'llt-poi-2', 'llt-poi-3']
                }
            ],
            stableCount: 13,
            recruitment: {
                guaranteedIntervalYears: 6,
                monthlyChance: 0.006,
                batchSize: [2, 5],
                roleToRecruit: 'Đệ tử'
            }
        }
    ],
    DUOC_VIEN: [
         {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THANH_VAN_MON',
                    roleDistribution: [{ roleName: 'Ngoại môn đệ tử', count: 2 }],
                    poiIds: [],
                }
            ]
        }
    ],
    MOC_GIA: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'MOC_GIA',
                    roleDistribution: [
                        { roleName: 'Tộc trưởng', count: 1 },
                        { roleName: 'Trưởng lão', count: 2 },
                        { roleName: 'Dược sư', count: 2 },
                        { roleName: 'Đệ tử', count: 3 }
                    ],
                    poiIds: ['mg-poi-1', 'mg-poi-2', 'mg-poi-3'],
                }
            ]
        }
    ],
    TIEU_GIA: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'TIEU_GIA',
                    roleDistribution: [
                        { roleName: 'Tộc trưởng', count: 1 },
                        { roleName: 'Trưởng lão', count: 2 },
                        { roleName: 'Đệ tử tinh anh', count: 3 },
                        { roleName: 'Đệ tử', count: 4 }
                    ],
                    poiIds: ['tg-poi-1', 'tg-poi-2', 'tg-poi-3'],
                }
            ]
        }
    ],
};
