import type { CSSProperties } from 'react';
import type { Position } from './common';

export type MapID = 'THIEN_NAM' | 'BAC_VUC' | 'DAI_HOANG' | 'DONG_HAI' | 'THAT_HUYEN_THANH' | 'LUU_LY_TONG' | 'VAN_BAO_LAU' | 'THIEN_MA_TUU_LAU' | 'MO_LINH_THANH' | 'HUYEN_NGOC_THANH' | 'THANH_VAN_MON' | 'DUOC_VIEN' | 'LUC_YEN_THON' | 'HAC_AM_SAM_LAM';

export type GameMapType = 'continent' | 'city_map' | 'village_map' | 'dungeon_map' | 'sect_map' | 'zone_map' | 'building_interior';
export type MapAreaType = 'nation' | 'province' | 'region' | 'zone';
export type PointOfInterestType = 'village' | 'city' | 'sect' | 'dungeon' | 'landmark' | 'building';

export interface MapArea {
  id: string;
  name: string;
  type: MapAreaType;
  position: Position; // Center position
  size: { width: number; height: number };
  style: CSSProperties;
}

export interface PointOfInterest {
  id:string;
  name: string;
  type: PointOfInterestType;
  position: Position; // Center position
  size: { width: number; height: number }; // Bounding box size
  targetMap?: MapID; // Map to teleport to when entered
  targetPosition?: Position; // Position to land at in the new map
}

export interface GameMap {
    id: MapID;
    name: string;
    type: GameMapType;
    size: { width: number; height: number };
    backgroundStyle: CSSProperties;
}

export interface TeleportLocation {
    id: string;
    name: string;
    position: Position;
    targetMap: MapID;
    targetPosition: Position;
}
