import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'LUC_YEN_THON',
    name: 'Lục Yên Thôn',
    type: 'village_map',
    parentMapId: 'THIEN_NAM',
    controllingFactionId: 'LUC_YEN_THON',
    size: { width: 2500, height: 2000 },
    backgroundStyle: {
        background: 'linear-gradient(to bottom, #3a5a40, #2a4a30)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
    }
};

export const mapAreas: MapArea[] = [
    { id: 'lyt-area-main', name: 'Lục Yên Thôn', type: 'zone', position: { x: 1250, y: 1000 }, size: { width: 2300, height: 1800 }, style: { borderColor: 'rgba(74, 222, 128, 0.2)', backgroundColor: 'rgba(74, 222, 128, 0.02)' } }
];

export const pois: PointOfInterest[] = [
    // Original, repositioned
    { id: 'lyt-poi-1', name: 'Nhà Thôn Trưởng', type: 'building', position: { x: 1250, y: 500 }, size: { width: 300, height: 250 } },
    { id: 'lyt-poi-2', name: 'Tiệm Tạp Hóa', type: 'building', position: { x: 800, y: 800 }, size: { width: 250, height: 200 } },
    { id: 'lyt-poi-3', name: 'Nhà Dân', type: 'building', position: { x: 1700, y: 850 }, size: { width: 200, height: 180 } },
    { id: 'lyt-poi-4', name: 'Giếng Cổ', type: 'landmark', position: { x: 1250, y: 1000 }, size: { width: 100, height: 100 } },

    // New POIs
    { id: 'lyt-poi-5', name: 'Nhà Dân', type: 'building', position: { x: 750, y: 1200 }, size: { width: 200, height: 180 } },
    { id: 'lyt-poi-6', name: 'Nhà Dân', type: 'building', position: { x: 1750, y: 1250 }, size: { width: 200, height: 180 } },
    { id: 'lyt-poi-7', name: 'Nhà Dân', type: 'building', position: { x: 1200, y: 1500 }, size: { width: 200, height: 180 } },
    { id: 'lyt-poi-8', name: 'Lò Rèn', type: 'building', position: { x: 400, y: 600 }, size: { width: 280, height: 220 } },
    { id: 'lyt-poi-9', name: 'Ruộng Đồng', type: 'landmark', position: { x: 2000, y: 500 }, size: { width: 600, height: 400 } },
    { id: 'lyt-poi-10', name: 'Miếu Thổ Địa', type: 'building', position: { x: 1250, y: 1800 }, size: { width: 150, height: 150 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-lyt-tn', name: 'Rời khỏi Thôn', position: { x: 1250, y: 1950 }, targetMap: 'THIEN_NAM', targetPosition: { x: 3800, y: 1900 } },
];