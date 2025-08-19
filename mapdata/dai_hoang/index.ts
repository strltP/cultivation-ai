import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../types/map';

export const mapDefinition: GameMap = {
    id: 'DAI_HOANG',
    name: 'Đại Hoang Cổ Lão',
    type: 'continent',
    size: { width: 8000, height: 6000 },
    backgroundStyle: { background: 'radial-gradient(ellipse at center, rgba(255, 169, 118, 0.1) 0%, rgba(255, 169, 118, 0) 70%), linear-gradient(to bottom, #3a2a1a, #2a1a0a)' }
};

export const mapAreas: MapArea[] = [
    { 
        id: 'dh-area-1', 
        name: 'Phong Sa Châu', 
        type: 'region',
        position: { x: 2000, y: 3000 }, 
        size: { width: 3800, height: 5800 }, 
        style: { borderColor: 'rgba(234, 179, 8, 0.4)', backgroundColor: 'rgba(234, 179, 8, 0.05)' },
        dangerLevel: 2,
    },
    { 
        id: 'dh-area-2', 
        name: 'Hoàng Long Vực', 
        type: 'region',
        position: { x: 6000, y: 3000 }, 
        size: { width: 3800, height: 5800 }, 
        style: { borderColor: 'rgba(249, 115, 22, 0.4)', backgroundColor: 'rgba(249, 115, 22, 0.05)' },
        dangerLevel: 3,
    },
];
export const pois: PointOfInterest[] = [
    { id: 'dh-poi-1', name: 'Phế Tích Sa Thành', type: 'landmark', position: { x: 1500, y: 2500 }, size: { width: 1000, height: 800 } },
    { id: 'dh-poi-2', name: 'Lạc Đà Trấn', type: 'village', position: { x: 3000, y: 4500 }, size: { width: 800, height: 600 } },
    { id: 'dh-poi-3', name: 'Thông Thiên Thạch Trụ', type: 'landmark', position: { x: 1500, y: 5000 }, size: { width: 300, height: 1200 } },
    { id: 'dh-poi-4', name: 'Hoàng Long Cốc', type: 'dungeon', position: { x: 6500, y: 2500 }, size: { width: 1200, height: 900 } },
    { id: 'dh-poi-5', name: 'Vạn Yêu Quật', type: 'dungeon', position: { x: 5500, y: 4500 }, size: { width: 900, height: 900 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-dh-tn', name: 'Trận Pháp về Thiên Nam', position: { x: 100, y: 3000 }, targetMap: 'THIEN_NAM', targetPosition: { x: 120, y: 4000 } },
];