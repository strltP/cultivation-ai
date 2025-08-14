import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'HUYEN_NGOC_THANH',
    name: 'Huyền Ngọc Thành',
    size: { width: 4000, height: 3500 },
    backgroundStyle: { 
        backgroundColor: '#2d3748',
        backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(203, 213, 225, 0.1) 1px, transparent 0),
            radial-gradient(circle at 100px 100px, rgba(148, 163, 184, 0.08) 2px, transparent 0)
        `,
        backgroundSize: '100px 100px, 200px 200px',
    }
};

export const mapAreas: MapArea[] = [];

export const pois: PointOfInterest[] = [
    { id: 'hth-poi-1', name: 'Thành Chủ Phủ', type: 'building', position: { x: 2000, y: 700 }, size: { width: 1200, height: 800 } },
    { id: 'hth-poi-2', name: 'Ngọc Bích Các', type: 'building', position: { x: 900, y: 1600 }, size: { width: 800, height: 700 } },
    { id: 'hth-poi-3', name: 'Bách Thảo Đường', type: 'building', position: { x: 3100, y: 1600 }, size: { width: 800, height: 700 } },
    { id: 'hth-poi-4', name: 'Thần Binh Các', type: 'building', position: { x: 900, y: 2600 }, size: { width: 800, height: 700 } },
    { id: 'hth-poi-5', name: 'Túy Ngọc Lâu', type: 'building', position: { x: 3100, y: 2600 }, size: { width: 800, height: 700 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-hth-bv', name: 'Rời khỏi Thành', position: { x: 2000, y: 3300 }, targetMap: 'BAC_VUC', targetPosition: { x: 2500, y: 2800 } },
];
