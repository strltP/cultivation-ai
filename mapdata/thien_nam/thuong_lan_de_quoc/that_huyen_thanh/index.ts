import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'THAT_HUYEN_THANH',
    name: 'Thất Huyền Thành',
    size: { width: 3000, height: 3000 },
    backgroundStyle: { 
        backgroundColor: '#4a5568',
        backgroundImage: `
            linear-gradient(rgba(255,255,255,.07) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,.07) 2px, transparent 2px),
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px'
    }
};

export const mapAreas: MapArea[] = [];

export const pois: PointOfInterest[] = [
    { id: 'tht-poi-1', name: 'Luyện Đan Các', type: 'building', position: { x: 900, y: 900 }, size: { width: 600, height: 540 } },
    { id: 'tht-poi-2', name: 'Tàng Kinh Các', type: 'building', position: { x: 2100, y: 900 }, size: { width: 600, height: 540 } },
    { id: 'tht-poi-3', name: 'Lưu Ly Tông', type: 'sect', position: { x: 750, y: 1950 }, size: { width: 900, height: 750 }, targetMap: 'LUU_LY_TONG', targetPosition: { x: 1600, y: 2000 } },
    { id: 'tht-poi-4', name: 'Vạn Bảo Lâu', type: 'building', position: { x: 2250, y: 1800 }, size: { width: 750, height: 600 }, targetMap: 'VAN_BAO_LAU', targetPosition: { x: 1200, y: 1600 } },
    { id: 'tht-poi-5', name: 'Thiên Mã Tửu Lâu', type: 'building', position: { x: 1500, y: 450 }, size: { width: 660, height: 540 }, targetMap: 'THIEN_MA_TUU_LAU', targetPosition: { x: 1400, y: 1600 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-tht-tn', name: 'Rời khỏi Thành', position: { x: 1500, y: 2850 }, targetMap: 'THIEN_NAM', targetPosition: { x: 5000, y: 1950 } },
];