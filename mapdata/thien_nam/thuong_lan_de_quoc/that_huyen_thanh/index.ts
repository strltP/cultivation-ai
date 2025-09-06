import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'THAT_HUYEN_THANH',
    name: 'Thất Huyền Thành',
    description: 'Thủ đô phồn hoa của Thương Lan Đế Quốc, nơi giao thương sầm uất, tụ hội của các tu sĩ và thế lực khắp nơi.',
    type: 'city_map',
    parentMapId: 'THIEN_NAM',
    controllingFactionId: 'THAT_HUYEN_THANH',
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

export const mapAreas: MapArea[] = [
    { id: 'tht-area-1', name: 'Khu Giao Dịch', type: 'zone', position: { x: 2250, y: 1500 }, size: { width: 1500, height: 3000 }, style: { borderColor: 'rgba(234, 179, 8, 0.2)', backgroundColor: 'rgba(234, 179, 8, 0.03)' } },
    { id: 'tht-area-2', name: 'Khu Dân Cư', type: 'zone', position: { x: 750, y: 1500 }, size: { width: 1500, height: 3000 }, style: { borderColor: 'rgba(59, 130, 246, 0.2)', backgroundColor: 'rgba(59, 130, 246, 0.03)' } },
];

export const pois: PointOfInterest[] = [
    { id: 'tht-poi-1', name: 'Thiên Mã Tửu Lâu', type: 'building', position: { x: 1500, y: 500 }, size: { width: 600, height: 500 }, targetMap: 'THIEN_MA_TUU_LAU', targetPosition: { x: 1400, y: 1600 } },
    { id: 'tht-poi-2', name: 'Vạn Bảo Lâu', type: 'building', position: { x: 2250, y: 1800 }, size: { width: 800, height: 700 }, targetMap: 'VAN_BAO_LAU', targetPosition: { x: 1200, y: 1600 } },
    { id: 'tht-poi-3', name: 'Lưu Ly Tông', type: 'sect', position: { x: 750, y: 2000 }, size: { width: 900, height: 800 }, targetMap: 'LUU_LY_TONG', targetPosition: { x: 1600, y: 2000 } },
    { id: 'tht-poi-moc-gia', name: 'Mộc Gia', type: 'clan', position: { x: 1500, y: 2500 }, size: { width: 1000, height: 800 }, targetMap: 'MOC_GIA', targetPosition: { x: 1250, y: 1700 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-tht-tn', name: 'Rời khỏi Thành', position: { x: 1500, y: 2900 }, targetMap: 'THIEN_NAM', targetPosition: { x: 5000, y: 1800 } },
];