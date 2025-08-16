import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'LUC_YEN_THON',
    name: 'Lục Yên Thôn',
    type: 'village_map',
    size: { width: 2000, height: 1500 },
    backgroundStyle: {
        background: 'linear-gradient(to bottom, #3a5a40, #2a4a30)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
    }
};

export const mapAreas: MapArea[] = [
    { id: 'lyt-area-main', name: 'Lục Yên Thôn', type: 'zone', position: { x: 1000, y: 750 }, size: { width: 1800, height: 1300 }, style: { borderColor: 'rgba(74, 222, 128, 0.2)', backgroundColor: 'rgba(74, 222, 128, 0.02)' } }
];

export const pois: PointOfInterest[] = [
    { id: 'lyt-poi-1', name: 'Nhà Thôn Trưởng', type: 'building', position: { x: 1000, y: 550 }, size: { width: 300, height: 250 } },
    { id: 'lyt-poi-2', name: 'Tiệm Tạp Hóa', type: 'building', position: { x: 600, y: 800 }, size: { width: 250, height: 200 } },
    { id: 'lyt-poi-3', name: 'Nhà Dân', type: 'building', position: { x: 1400, y: 900 }, size: { width: 200, height: 180 } },
    { id: 'lyt-poi-4', name: 'Giếng Cổ', type: 'landmark', position: { x: 1000, y: 950 }, size: { width: 100, height: 100 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-lyt-tn', name: 'Rời khỏi Thôn', position: { x: 1000, y: 1450 }, targetMap: 'THIEN_NAM', targetPosition: { x: 3800, y: 1900 } },
];
