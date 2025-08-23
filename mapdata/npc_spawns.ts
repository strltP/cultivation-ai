import type { MapID } from '../types/map';
import type { NpcSpawnDefinition } from '../data/npcs/npc_types';

export const NPC_SPAWN_DEFINITIONS_BY_MAP: Record<MapID, NpcSpawnDefinition[]> = {
    THIEN_NAM: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    roleDistribution: [{ roleName: 'Tán tu', count: 10 }],
                    ageDistribution: { young: 0.4, middle: 0.3, old: 0.3 },
                    poiIds: [], // Sinh ra ngẫu nhiên ở bất kỳ đâu
                }
            ],
        }
    ],
    HAC_AM_SAM_LAM: [],
    THAT_HUYEN_THANH: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    ageDistribution: { young: 0.3, middle: 0.5, old: 0.2 },
                    roleDistribution: [
                        { roleName: 'Vệ binh', count: 5 },
                        { roleName: 'Thường dân', count: 5 }
                    ],
                    poiIds: [],
                },
                 {
                    factionId: 'THAT_HUYEN_THANH',
                    ageDistribution: { young: 0.1, middle: 0.5, old: 0.4 },
                    roleDistribution: [{ roleName: 'Chủ tiệm lớn', count: 2 }],
                    poiIds: ['tht-poi-1', 'tht-poi-2'],
                }
            ],
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    ageDistribution: { young: 0.4, middle: 0.4, old: 0.2 },
                    roleDistribution: [{ roleName: 'Tán tu', count: 5 }],
                    poiIds: [],
                }
            ],
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
                    ageDistribution: { young: 0.1, middle: 0.4, old: 0.5 },
                    roleDistribution: [{ roleName: 'Lão bản', count: 1 }],
                    poiIds: ['lyt-poi-2']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    ageDistribution: { young: 0.4, middle: 0.5, old: 0.1 },
                    roleDistribution: [
                        { roleName: 'Thợ săn', count: 2 },
                        { roleName: 'Nông dân', count: 3 },
                        { roleName: 'Thường dân', count: 4 }
                    ],
                    poiIds: ['lyt-poi-9', 'lyt-poi-3', 'lyt-poi-5', 'lyt-poi-6', 'lyt-poi-7']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    ageDistribution: { young: 0.0, middle: 0.2, old: 0.8 },
                    roleDistribution: [{ roleName: 'Ẩn thế tu sĩ', count: 1 }],
                    poiIds: []
                }
            ],
        }
    ],
    BAC_VUC: [
        {
            type: 'procedural',
            roles: [
                { 
                    factionId: 'CUU_TUYET_MON', 
                    roleDistribution: [{ roleName: 'Môn chủ', count: 1 }], 
                    poiIds: ['bv-poi-ctm'] 
                },
                { 
                    factionId: 'CUU_TUYET_MON', 
                    roleDistribution: [{ roleName: 'Trưởng lão', count: 3 }], 
                    poiIds: ['bv-poi-ctm'] 
                },
                { 
                    factionId: 'CUU_TUYET_MON', 
                    roleDistribution: [{ roleName: 'Nội môn đệ tử', count: 4 }], 
                    poiIds: ['bv-poi-ctm'] 
                },
                { 
                    factionId: 'CUU_TUYET_MON', 
                    roleDistribution: [{ roleName: 'Ngoại môn đệ tử', count: 5 }], 
                    poiIds: ['bv-poi-ctm'] 
                }
            ]
        },
        {
            type: 'procedural',
            roles: [
                { 
                    factionId: 'HUYEN_THIEN_KIEM_TONG', 
                    roleDistribution: [{ roleName: 'Tông chủ', count: 1 }], 
                    poiIds: ['bv-poi-htkt'] 
                },
                { 
                    factionId: 'HUYEN_THIEN_KIEM_TONG', 
                    roleDistribution: [{ roleName: 'Kiếm Trưởng Lão', count: 2 }], 
                    poiIds: ['bv-poi-htkt'] 
                },
                { 
                    factionId: 'HUYEN_THIEN_KIEM_TONG', 
                    roleDistribution: [{ roleName: 'Chân truyền đệ tử', count: 2 }], 
                    poiIds: ['bv-poi-htkt'] 
                },
                { 
                    factionId: 'HUYEN_THIEN_KIEM_TONG', 
                    roleDistribution: [{ roleName: 'Nội môn đệ tử', count: 5 }], 
                    poiIds: ['bv-poi-htkt'] 
                },
                { 
                    factionId: 'HUYEN_THIEN_KIEM_TONG', 
                    roleDistribution: [{ roleName: 'Ngoại môn đệ tử', count: 6 }], 
                    poiIds: ['bv-poi-htkt'] 
                }
            ]
        },
        {
            type: 'procedural',
            roles: [
                { 
                    factionId: 'THAN_THUONG_MON', 
                    roleDistribution: [{ roleName: 'Môn chủ', count: 1 }], 
                    poiIds: ['bv-poi-ttm'] 
                },
                { 
                    factionId: 'THAN_THUONG_MON', 
                    roleDistribution: [{ roleName: 'Trưởng lão', count: 2 }], 
                    poiIds: ['bv-poi-ttm'] 
                },
                { 
                    factionId: 'THAN_THUONG_MON', 
                    roleDistribution: [{ roleName: 'Đệ tử tinh anh', count: 6 }], 
                    poiIds: ['bv-poi-ttm'] 
                },
                { 
                    factionId: 'THAN_THUONG_MON', 
                    roleDistribution: [{ roleName: 'Đệ tử', count: 8 }], 
                    poiIds: ['bv-poi-ttm'] 
                }
            ]
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'UNAFFILIATED',
                    roleDistribution: [{ roleName: 'Tán tu', count: 15 }],
                    ageDistribution: { young: 0.3, middle: 0.4, old: 0.3 },
                    poiIds: ['bv-poi-tlt', 'bv-poi-dnt', 'bv-poi-tlth', 'bv-poi-dlth'],
                }
            ],
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
                    roleDistribution: [{ roleName: 'Nội môn đệ tử', count: 5 }], 
                    poiIds: ['tvm-poi-4'] 
                },
                { 
                    factionId: 'THANH_VAN_MON', 
                    roleDistribution: [{ roleName: 'Ngoại môn đệ tử', count: 8 }], 
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