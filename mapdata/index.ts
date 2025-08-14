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

// --- Build INTERACTABLES_BY_MAP from templates and spawns ---
const buildInteractablesByMap = (): Record<MapID, Interactable[]> => {
    const interactableMap: Record<string, Interactable[]> = {};
    const interactableTemplatesById = new Map(ALL_INTERACTABLES.map(t => [t.baseId, t]));

    for (const mapIdStr in MAPS) {
        const mapId = mapIdStr as MapID;
        const definitions = SPAWN_DEFINITIONS_BY_MAP[mapId];
        const mapAreas = MAP_AREAS_BY_MAP[mapId] || [];
        const poisForCurrentMap = POIS_BY_MAP[mapId] || [];
        const finalInteractables: Interactable[] = [];

        if (definitions) {
            for (const def of definitions) {
                // If 'type' property does not exist, it's a manual spawn.
                if (!('type' in def)) {
                    // This is a manual spawn (InteractableSpawn)
                    const spawn = def;
                    const template = interactableTemplatesById.get(spawn.baseId);
                    if (template) {
                         finalInteractables.push({
                            id: spawn.id,
                            baseId: spawn.baseId,
                            name: template.name,
                            type: template.type,
                            prompt: template.prompt,
                            position: spawn.position,
                        });
                    } else {
                        console.warn(`Could not find interactable template for baseId: ${spawn.baseId}`);
                    }
                } else {
                    // This is a procedural rule (ProceduralSpawnRule)
                    const rule = def;
                    const area = mapAreas.find(a => a.id === rule.areaId);
                    if (!area) {
                        console.warn(`Procedural spawn rule for map ${mapId} has unknown areaId: ${rule.areaId}`);
                        continue;
                    }

                    // Create weighted list for random selection
                    const weightedItems: string[] = [];
                    for (const baseId in rule.itemWeights) {
                        const weight = rule.itemWeights[baseId];
                        for (let i = 0; i < weight; i++) {
                            weightedItems.push(baseId);
                        }
                    }
                    if (weightedItems.length === 0) continue;

                    let generatedCount = 0;
                    let attempts = 0;
                    const MAX_ATTEMPTS_PER_ITEM = 20; // Try 20 times to find a valid spot for each item.

                    while (generatedCount < rule.count && attempts < rule.count * MAX_ATTEMPTS_PER_ITEM) {
                        attempts++;

                        const halfWidth = area.size.width / 2;
                        const halfHeight = area.size.height / 2;
                        const x = Math.floor(area.position.x - halfWidth + Math.random() * area.size.width);
                        const y = Math.floor(area.position.y - halfHeight + Math.random() * area.size.height);

                        const isInsideForbiddenPOI = poisForCurrentMap.some(poi => {
                            const typesToAvoid = ['village', 'city', 'sect', 'building'];
                            if (!typesToAvoid.includes(poi.type)) return false;
                            
                            const poiHalfWidth = poi.size.width / 2;
                            const poiHalfHeight = poi.size.height / 2;
                            return (
                                x >= poi.position.x - poiHalfWidth &&
                                x <= poi.position.x + poiHalfWidth &&
                                y >= poi.position.y - poiHalfHeight &&
                                y <= poi.position.y + poiHalfHeight
                            );
                        });

                        if (isInsideForbiddenPOI) {
                            continue; // This position is invalid, try again.
                        }
                        
                        const randomBaseId = weightedItems[Math.floor(Math.random() * weightedItems.length)];
                        const template = interactableTemplatesById.get(randomBaseId);
                        if (!template) continue;

                        finalInteractables.push({
                            id: `proc-${mapId}-${rule.areaId}-${generatedCount}-${Math.floor(Math.random() * 100000)}`,
                            baseId: template.baseId,
                            areaId: rule.areaId,
                            name: template.name,
                            type: template.type,
                            prompt: template.prompt,
                            position: { x, y },
                        });
                        generatedCount++;
                    }
                     if (generatedCount < rule.count) {
                        console.warn(`Could not spawn all ${rule.count} items for area ${rule.areaId} on map ${mapId}. Spawned ${generatedCount}. This might be due to POIs filling the area.`);
                    }
                }
            }
        }
        interactableMap[mapId] = finalInteractables;
    }
    return interactableMap;
};

// This mutable export is what `useGameState` uses and modifies for respawning.
export const INTERACTABLES_BY_MAP: Record<MapID, Interactable[]> = buildInteractablesByMap();