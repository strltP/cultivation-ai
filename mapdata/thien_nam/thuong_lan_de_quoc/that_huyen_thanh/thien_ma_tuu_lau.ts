import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'THIEN_MA_TUU_LAU',
    name: 'Thiên Mã Tửu Lâu',
    type: 'building_interior',
    size: { width: 2800, height: 2000 },
    backgroundStyle: { background: 'linear-gradient(to bottom, #503c2c, #5b4a34)' }
};

export const mapAreas: MapArea[] = [];
export const pois: PointOfInterest[] = [];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-tmtl-tht', name: 'Rời khỏi Tửu Lâu', position: { x: 1400, y: 1800 }, targetMap: 'THAT_HUYEN_THANH', targetPosition: { x: 1500, y: 600 } },
];
