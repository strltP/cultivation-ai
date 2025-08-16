import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'LUU_LY_TONG',
    name: 'Lưu Ly Tông',
    type: 'sect_map',
    size: { width: 3200, height: 2400 },
    backgroundStyle: { background: 'linear-gradient(to bottom, #2c3e50, #34495e)' }
};

export const mapAreas: MapArea[] = [];

export const pois: PointOfInterest[] = [
    { id: 'llt-poi-1', name: 'Trưởng Lão Đường', type: 'building', position: { x: 1600, y: 600 }, size: { width: 1000, height: 600 } },
    { id: 'llt-poi-2', name: 'Đệ Tử Đường', type: 'building', position: { x: 600, y: 1600 }, size: { width: 800, height: 600 } },
    { id: 'llt-poi-3', name: 'Hậu Sơn Cấm Địa', type: 'landmark', position: { x: 2800, y: 1200 }, size: { width: 720, height: 1200 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-llt-tht', name: 'Rời khỏi Tông Môn', position: { x: 1600, y: 2200 }, targetMap: 'THAT_HUYEN_THANH', targetPosition: { x: 750, y: 2100 } },
];
