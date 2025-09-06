import type { CSSProperties } from 'react';
import type { Position } from './common';

export type MapID = 'THIEN_NAM' | 'BAC_VUC' | 'DAI_HOANG' | 'DONG_HAI' | 'THAT_HUYEN_THANH' | 'LUU_LY_TONG' | 'VAN_BAO_LAU' | 'THIEN_MA_TUU_LAU' | 'MO_LINH_THANH' | 'HUYEN_NGOC_THANH' | 'HUYEN_THIEN_KIEM_TONG' | 'THANH_VAN_MON' | 'DUOC_VIEN' | 'LUC_YEN_THON' | 'HAC_AM_SAM_LAM' | 'MOC_GIA' | 'TIEU_GIA' | 'CUU_TUYET_MON' | 'THAN_THUONG_MON';

export type GameMapType = 'continent' | 'city_map' | 'village_map' | 'dungeon_map' | 'sect_map' | 'zone_map' | 'building_interior';
export type MapAreaType = 'nation' | 'province' | 'region' | 'zone';
export type PointOfInterestType = 'village' | 'city' | 'sect' | 'dungeon' | 'landmark' | 'building' | 'clan';

export interface MapArea {
  id: string;
  name: string;
  type: MapAreaType;
  position: Position; // Center position
  size: { width: number; height: number };
  style: CSSProperties;
  allowedFactionIds?: string[]; // Chỉ những phe phái này được vào
  dangerLevel?: number; // Cảnh giới tối thiểu để vào an toàn (tương ứng realmIndex)
  depletesMana?: boolean; // Nếu true, di chuyển trong khu vực này sẽ tốn linh lực
}

export interface PointOfInterest {
  id:string;
  name: string;
  type: PointOfInterestType;
  position: Position; // Center position
  size: { width: number; height: number }; // Bounding box size
  targetMap?: MapID; // Map to teleport to when entered
  targetPosition?: Position; // Position to land at in the new map
  minRealmIndex?: number; // Cảnh giới tối thiểu để vào
  dangerLevel?: number; // Cảnh giới tối thiểu để vào an toàn (tương ứng realmIndex)
  allowedFactionIds?: string[]; // Chỉ những phe phái này được vào
}

export interface GameMap {
    id: MapID;
    name: string;
    description?: string;
    type: GameMapType;
    size: { width: number; height: number };
    backgroundStyle: CSSProperties;
    parentMapId?: MapID;
    controllingFactionId?: string;
}

export interface TeleportLocation {
    id: string;
    name: string;
    position: Position;
    targetMap: MapID;
    targetPosition: Position;
}