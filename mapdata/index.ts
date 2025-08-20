import type { MapID, GameMap, PointOfInterest, TeleportLocation, MapArea } from '../types/map';
import type { Interactable } from '../types/interaction';

// Import map definitions from the new hierarchical structure
import * as thienNamData from './thien_nam/index';
import * as hacAmSamLamData from './thien_nam/hac_am_sam_lam/index';
import * as thatHuyenThanhData from './thien_nam/thuong_lan_de_quoc/that_huyen_thanh/index';
import * as moLinhThanhData from './thien_nam/thuong_lan_de_quoc/mo_linh_thanh/index';
import * as luuLyTongData from './thien_nam/thuong_lan_de_quoc/that_huyen_thanh/luu_ly_tong';
import * as vanBaoLauData from './thien_nam/thuong_lan_de_quoc/that_huyen_thanh/van_bao_lau';
import * as thienMaTuuLauData from './thien_nam/thuong_lan_de_quoc/that_huyen_thanh/thien_ma_tuu_lau';
import * as mocGiaData from './thien_nam/thuong_lan_de_quoc/that_huyen_thanh/moc_gia';
import * as tieuGiaData from './thien_nam/thuong_lan_de_quoc/mo_linh_thanh/tieu_gia';
import * as thanhVanMonData from './thien_nam/thien_nguyen_son/thanh_van_mon';
import * as duocVienData from './thien_nam/thien_nguyen_son/thanh_van_mon/duoc_vien';
import * as lucYenThonData from './thien_nam/thuong_lan_de_quoc/luc_yen_thon/index';

import * as bacVucData from './bac_vuc/index';
import * as huyenNgocThanhData from './bac_vuc/huyen_ngoc_thanh/index';
import * as daiHoangData from './dai_hoang/index';
import * as dongHaiData from './dong_hai/index';

import { ALL_INTERACTABLES } from '../data/interactables';
import { SPAWN_DEFINITIONS_BY_MAP } from './interactable_spawns';

const allMapData = {
    THIEN_NAM: thienNamData,
    HAC_AM_SAM_LAM: hacAmSamLamData,
    THAT_HUYEN_THANH: thatHuyenThanhData,
    MO_LINH_THANH: moLinhThanhData,
    LUU_LY_TONG: luuLyTongData,
    VAN_BAO_LAU: vanBaoLauData,
    THIEN_MA_TUU_LAU: thienMaTuuLauData,
    THANH_VAN_MON: thanhVanMonData,
    DUOC_VIEN: duocVienData,
    LUC_YEN_THON: lucYenThonData,
    MOC_GIA: mocGiaData,
    TIEU_GIA: tieuGiaData,
    BAC_VUC: bacVucData,
    HUYEN_NGOC_THANH: huyenNgocThanhData,
    DAI_HOANG: daiHoangData,
    DONG_HAI: dongHaiData
};

// --- Helper function to build aggregate objects ---
const buildDataObject = <T>(fieldName: 'mapDefinition' | 'pois' | 'teleportGates' | 'mapAreas') => {
    const result: Record<string, T> = {};
    for (const mapId in allMapData) {
        const key = mapId as MapID;
        const data = allMapData[key as keyof typeof allMapData];
        if (fieldName in data) {
            result[key] = data[fieldName as keyof typeof data] as T;
        } else if (fieldName.endsWith('s')) { // for plural fields like pois
             result[key] = [] as T;
        }
    }
    return result;
};


// --- Export aggregated data ---
export const MAPS: Record<MapID, GameMap> = buildDataObject<GameMap>('mapDefinition') as Record<MapID, GameMap>;
export const POIS_BY_MAP: Record<MapID, PointOfInterest[]> = buildDataObject<PointOfInterest[]>('pois') as Record<MapID, PointOfInterest[]>;
export const TELEPORT_GATES_BY_MAP: Record<MapID, TeleportLocation[]> = buildDataObject<TeleportLocation[]>('teleportGates') as Record<MapID, TeleportLocation[]>;
export const MAP_AREAS_BY_MAP: Record<MapID, MapArea[]> = buildDataObject<MapArea[]>('mapAreas') as Record<MapID, MapArea[]>;