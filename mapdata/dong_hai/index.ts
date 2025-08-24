import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../types/map';

export const mapDefinition: GameMap = {
    id: 'DONG_HAI',
    name: 'Đông Phương Hải Vực',
    type: 'continent',
    parentMapId: undefined,
    size: { width: 8000, height: 8000 },
    backgroundStyle: { background: 'radial-gradient(ellipse at center, rgba(118, 255, 239, 0.1) 0%, rgba(118, 255, 239, 0) 70%), linear-gradient(to bottom, #1a3a3a, #0a2a2a)' }
};

export const mapAreas: MapArea[] = [
    // The entire sea
    { 
        id: 'dong-hai-sea', 
        name: 'Đông Phương Hải Vực', 
        type: 'region',
        position: { x: 4000, y: 4000 }, 
        size: { width: 8000, height: 8000 }, 
        style: { borderColor: 'transparent', backgroundColor: 'transparent' },
        depletesMana: true,
    },
    // The islands
    { 
        id: 'poi-nguyet-tinh-dao-area', 
        name: 'Nguyệt Tinh Đảo', 
        type: 'zone',
        position: { x: 2000, y: 2500 }, 
        size: { width: 1200, height: 1000 }, 
        style: { borderColor: 'rgba(200, 200, 255, 0.4)', backgroundColor: 'rgba(50, 50, 100, 0.1)' },
        depletesMana: false,
    },
    { 
        id: 'poi-du-long-dao-area', 
        name: 'Du Long Đảo', 
        type: 'zone',
        position: { x: 5500, y: 1800 }, 
        size: { width: 1500, height: 1200 }, 
        style: { borderColor: 'rgba(100, 255, 150, 0.4)', backgroundColor: 'rgba(50, 100, 75, 0.1)' },
        depletesMana: false,
    },
    { 
        id: 'poi-bao-phong-dao-area', 
        name: 'Bạo Phong Đảo', 
        type: 'zone',
        position: { x: 6000, y: 6000 }, 
        size: { width: 1800, height: 1500 }, 
        style: { borderColor: 'rgba(255, 100, 100, 0.4)', backgroundColor: 'rgba(100, 50, 50, 0.1)' },
        dangerLevel: 2,
        depletesMana: false,
    },
    { 
        id: 'poi-khoi-tinh-dao-area', 
        name: 'Khôi Tinh Đảo', 
        type: 'zone',
        position: { x: 2500, y: 5800 }, 
        size: { width: 1000, height: 1000 }, 
        style: { borderColor: 'rgba(150, 150, 150, 0.4)', backgroundColor: 'rgba(75, 75, 75, 0.1)' },
        depletesMana: false,
    },
];

export const pois: PointOfInterest[] = [

];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-dhg-tn', name: 'Trận Pháp về Thiên Nam', position: { x: 300, y: 4000 }, targetMap: 'THIEN_NAM', targetPosition: { x: 9880, y: 4000 } },
];