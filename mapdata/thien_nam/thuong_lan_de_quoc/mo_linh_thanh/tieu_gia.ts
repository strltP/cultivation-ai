import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'TIEU_GIA',
    name: 'Tiêu Gia',
    type: 'sect_map',
    parentMapId: 'MO_LINH_THANH',
    controllingFactionId: 'TIEU_GIA',
    size: { width: 2800, height: 2200 },
    backgroundStyle: { background: 'linear-gradient(to bottom, #4a2c2c, #3a1c1c)' }
};

export const mapAreas: MapArea[] = [];

export const pois: PointOfInterest[] = [
    { id: 'tg-poi-1', name: 'Nghị Sự Đường', type: 'building', position: { x: 1400, y: 600 }, size: { width: 900, height: 600 } },
    { id: 'tg-poi-2', name: 'Diễn Võ Trường', type: 'landmark', position: { x: 700, y: 1500 }, size: { width: 1000, height: 800 } },
    { id: 'tg-poi-3', name: 'Khách Viện', type: 'building', position: { x: 2100, y: 1500 }, size: { width: 700, height: 900 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-tg-mlt', name: 'Rời khỏi Gia Tộc', position: { x: 1400, y: 2050 }, targetMap: 'MO_LINH_THANH', targetPosition: { x: 1800, y: 1750 } },
];