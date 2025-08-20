import type { MapID } from '../types/map';
import type { NpcSpawnDefinition } from '../data/npcs/npc_types';

export const NPC_SPAWN_DEFINITIONS_BY_MAP: Record<MapID, NpcSpawnDefinition[]> = {
    THIEN_NAM: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [{ roleName: 'Tán tu', count: 10 }],
                    poiIds: [], // Sinh ra ngẫu nhiên ở bất kỳ đâu
                }
            ]
        }
    ],
    HAC_AM_SAM_LAM: [
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-1',
            monsterBaseIds: ['monster_da_lang'],
            initialCount: 5,
            maxCount: 10,
            levelRange: [1, 4]
        },
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-2',
            monsterBaseIds: ['monster_hac_ma_chu'],
            initialCount: 4,
            maxCount: 8,
            levelRange: [2, 5]
        },
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-3',
            monsterBaseIds: ['monster_da_lang', 'monster_hac_ma_chu'],
            initialCount: 2,
            maxCount: 5,
            levelRange: [4, 7]
        }
    ],
    THAT_HUYEN_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [
                        { roleName: 'Tán tu', count: 5 },
                        { roleName: 'Vệ binh', count: 5 },
                        { roleName: 'Thường dân', count: 5 }
                    ],
                    poiIds: [],
                },
                 {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [{ roleName: 'Chủ tiệm lớn', count: 2 }],
                    poiIds: ['tht-poi-1', 'tht-poi-2'],
                }
            ]
        }
    ],
    MO_LINH_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [
                        { roleName: 'Tán tu', count: 4 },
                        { roleName: 'Vệ binh', count: 3 },
                        { roleName: 'Thường dân', count: 3 },
                        { roleName: 'Tiểu nhị', count: 2 }
                    ],
                    poiIds: ['mlt-poi-1', 'mlt-poi-2', 'mlt-poi-3', 'mlt-poi-4'],
                }
            ]
        }
    ],
    THIEN_MA_TUU_LAU: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleDistribution: [
                        { roleName: 'Tán tu', count: 2 },
                        { roleName: 'Thường dân', count: 2 }
                    ],
                    poiIds: [], 
                }
            ]
        }
    ],
    VAN_BAO_LAU: [
        {
            type: 'static',
            id: 'npc-van-bao-chuong-quy-1',
            baseId: 'van_bao_chuong_quy',
            position: { x: 300, y: 150 }
        }
    ],
    LUC_YEN_THON: [
        {
            type: 'static',
            id: 'npc-luc-thon-truong-1',
            baseId: 'luc_thon_truong',
            position: { x: 1250, y: 550 }
        },
        {
            type: 'static',
            id: 'npc-lao-ma-luc-yen-1',
            baseId: 'lao_ma_luc_yen',
            position: { x: 400, y: 600 } // Lò Rèn
        },
        {
            type: 'static',
            id: 'npc-ma-tau-luc-yen-1',
            baseId: 'ma_tau_luc_yen',
            position: { x: 750, y: 1200 } // Nhà Dân
        },
        {
            type: 'static',
            id: 'npc-ly-tieu-nhi-luc-yen-1',
            baseId: 'ly_tieu_nhi_luc_yen',
            position: { x: 1250, y: 1000 } // Giếng Cổ
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'LUC_YEN_THON',
                    roleDistribution: [{ roleName: 'Lão bản', count: 1 }],
                    poiIds: ['lyt-poi-2']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleDistribution: [{ roleName: 'Thợ săn', count: 2 }],
                    poiIds: []
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleDistribution: [{ roleName: 'Nông dân', count: 3 }],
                    poiIds: ['lyt-poi-9']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleDistribution: [{ roleName: 'Thường dân', count: 4 }],
                    poiIds: ['lyt-poi-3', 'lyt-poi-5', 'lyt-poi-6', 'lyt-poi-7']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleDistribution: [{ roleName: 'Ẩn thế tu sĩ', count: 1 }],
                    poiIds: []
                }
            ]
        }
    ],
    BAC_VUC: [],
    HUYEN_NGOC_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH', // Using a generic city dweller faction for now
                    roleDistribution: [
                        { roleName: 'Tán tu', count: 4 },
                        { roleName: 'Vệ binh', count: 3 },
                        { roleName: 'Thường dân', count: 3 }
                    ],
                    poiIds: ['hth-poi-1', 'hth-poi-2', 'hth-poi-3', 'hth-poi-4', 'hth-poi-5'],
                }
            ]
        }
    ],
    THANH_VAN_MON: [
        {
            type: 'procedural',
            roles: [
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [{ roleName: 'Môn chủ', count: 1 }], 
                    poiIds: ['tvm-poi-1'] 
                },
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [{ roleName: 'Phó môn chủ', count: 2 }], 
                    poiIds: ['tvm-poi-1', 'tvm-poi-5'] 
                },
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [{ roleName: 'Trưởng lão', count: 3 }], 
                    poiIds: ['tvm-poi-1', 'tvm-poi-2', 'tvm-poi-3', 'tvm-poi-5'] 
                },
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [{ roleName: 'Chân truyền đệ tử', count: 4 }], 
                    poiIds: ['tvm-poi-2', 'tvm-poi-4'] 
                },
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [{ roleName: 'Nội môn đệ tử', count: 8 }], 
                    poiIds: ['tvm-poi-4'] 
                },
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [{ roleName: 'Ngoại môn đệ tử', count: 12 }], 
                    poiIds: ['tvm-poi-4', 'tvm-poi-7'] 
                }
            ]
        }
    ],
    DAI_HOANG: [],
    DONG_HAI: [],
    LUU_LY_TONG: [],
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