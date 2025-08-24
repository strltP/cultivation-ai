import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'MOC_GIA',
    name: 'Mộc Gia',
    type: 'sect_map',
    parentMapId: 'THAT_HUYEN_THANH',
    controllingFactionId: 'MOC_GIA',
    size: { width: 2500, height: 2000 },
    backgroundStyle: { background: 'linear-gradient(to bottom, #2b4d3c, #1a3a2b)' }
};

export const mapAreas: MapArea[] = [];

export const pois: PointOfInterest[] = [
    { id: 'mg-poi-1', name: 'Chính Đường', type: 'building', position: { x: 1250, y: 500 }, size: { width: 800, height: 500 } },
    { id: 'mg-poi-2', name: 'Dược Viên', type: 'landmark', position: { x: 500, y: 1200 }, size: { width: 600, height: 800 } },
    { id: 'mg-poi-3', name: 'Đệ Tử Xá', type: 'building', position: { x: 2000, y: 1200 }, size: { width: 700, height: 900 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-mg-tht', name: 'Rời khỏi Gia Tộc', position: { x: 1250, y: 1850 }, targetMap: 'THAT_HUYEN_THANH', targetPosition: { x: 1500, y: 2550 } },
];