import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'VAN_BAO_LAU',
    name: 'Vạn Bảo Lâu',
    description: 'Tòa lầu giao dịch lớn nhất Thất Huyền Thành, nơi có thể tìm thấy mọi loại kỳ trân dị bảo, từ pháp khí, đan dược đến công pháp.',
    type: 'building_interior',
    parentMapId: 'THAT_HUYEN_THANH',
    size: { width: 2400, height: 2000 },
    backgroundStyle: { background: 'linear-gradient(to bottom, #4a2c50, #6d345b)' }
};

export const mapAreas: MapArea[] = [];
export const pois: PointOfInterest[] = [];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-vbl-tht', name: 'Rời khỏi Lầu', position: { x: 1200, y: 1800 }, targetMap: 'THAT_HUYEN_THANH', targetPosition: { x: 2250, y: 1950 } },
];