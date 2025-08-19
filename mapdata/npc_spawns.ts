import type { MapID } from '../types/map';
import type { NpcSpawnDefinition } from '../data/npcs/npc_types';

export const NPC_SPAWN_DEFINITIONS_BY_MAP: Record<MapID, NpcSpawnDefinition[]> = {
    THIEN_NAM: [
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleNames: ['Tán tu'],
                    count: 10, // Thêm 10 Tán tu lang thang trên đại lục
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
                    roleNames: ['Tán tu', 'Vệ binh', 'Thường dân'],
                    count: 15,
                    poiIds: [],
                },
                 {
                    factionId: 'THAT_HUYEN_THANH',
                    roleNames: ['Chủ tiệm lớn'],
                    count: 2,
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
                    roleNames: ['Tán tu', 'Vệ binh', 'Thường dân', 'Tiểu nhị'],
                    count: 12,
                    poiIds: ['mlt-poi-1', 'mlt-poi-2', 'mlt-poi-3', 'mlt-poi-4'],
                }
            ]
        }
    ],
    THIEN_MA_TUU_LAU: [
        {
            type: 'static',
            id: 'npc-ly-tieu-nhi-1',
            baseId: 'ly_tieu_nhi',
            position: { x: 300, y: 350 }
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'THAT_HUYEN_THANH',
                    roleNames: ['Tán tu', 'Thường dân'],
                    count: 4,
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
            position: { x: 1000, y: 600 }
        },
        {
            type: 'procedural',
            roles: [
                {
                    factionId: 'LUC_YEN_THON',
                    roleNames: ['Lão bản'],
                    count: 1,
                    poiIds: ['lyt-poi-2']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleNames: ['Thợ săn'],
                    count: 2,
                    poiIds: ['lyt-poi-3']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleNames: ['Nông dân'],
                    count: 5,
                    poiIds: ['lyt-poi-3']
                },
                {
                    factionId: 'LUC_YEN_THON',
                    roleNames: ['Nguyên anh ẩn tu'],
                    count: 1,
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
                    roleNames: ['Tán tu', 'Vệ binh', 'Thường dân'],
                    count: 10,
                    poiIds: ['hth-poi-1', 'hth-poi-2', 'hth-poi-3', 'hth-poi-4', 'hth-poi-5'],
                }
            ]
        }
    ],
    THANH_VAN_MON: [
        {
            type: 'procedural',
            roles: [
                { factionId: 'THANH_VAN_MON', roleNames: ['Môn chủ'], count: 1, poiIds: ['tvm-poi-1'] },
                { factionId: 'THANH_VAN_MON', roleNames: ['Phó môn chủ'], count: 2, poiIds: ['tvm-poi-1', 'tvm-poi-5'] },
                { factionId: 'THANH_VAN_MON', roleNames: ['Trưởng lão'], count: 3, poiIds: ['tvm-poi-1', 'tvm-poi-2', 'tvm-poi-3', 'tvm-poi-5'] },
                { factionId: 'THANH_VAN_MON', roleNames: ['Chân truyền đệ tử'], count: 4, poiIds: ['tvm-poi-2', 'tvm-poi-4'] },
                { factionId: 'THANH_VAN_MON', roleNames: ['Nội môn đệ tử'], count: 8, poiIds: ['tvm-poi-4'] },
                { factionId: 'THANH_VAN_MON', roleNames: ['Ngoại môn đệ tử'], count: 12, poiIds: ['tvm-poi-4', 'tvm-poi-7'] }
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
                    roleNames: ['Ngoại môn đệ tử'],
                    count: 2,
                    poiIds: [],
                }
            ]
        }
    ],
};