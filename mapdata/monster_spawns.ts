import type { MapID } from '../types/map';
import type { ProceduralMonsterRule } from '../data/npcs/npc_types';

export const MONSTER_SPAWN_DEFINITIONS_BY_MAP: Record<MapID, ProceduralMonsterRule[]> = {
    THIEN_NAM: [],
    HAC_AM_SAM_LAM: [
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-1',
            monsterBaseIds: ['monster_da_lang'],
            initialCount: 5,
            maxCount: 10,
        },
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-2',
            monsterBaseIds: ['monster_hac_ma_chu'],
            initialCount: 4,
            maxCount: 8,
        },
        {
            type: 'procedural_monster',
            areaId: 'hasl-area-3',
            monsterBaseIds: ['monster_da_lang', 'monster_hac_ma_chu'],
            initialCount: 2,
            maxCount: 5,
        }
    ],
    THAT_HUYEN_THANH: [],
    MO_LINH_THANH: [],
    THIEN_MA_TUU_LAU: [],
    VAN_BAO_LAU: [],
    LUC_YEN_THON: [],
    BAC_VUC: [],
    HUYEN_NGOC_THANH: [],
    HUYEN_THIEN_KIEM_TONG: [],
    CUU_TUYET_MON: [],
    THAN_THUONG_MON: [],
    THANH_VAN_MON: [],
    DAI_HOANG: [],
    DONG_HAI: [],
    LUU_LY_TONG: [],
    DUOC_VIEN: [],
    MOC_GIA: [],
    TIEU_GIA: [],
};