import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'DUOC_VIEN',
    name: 'Dược Viên',
    description: 'Khu vườn trồng linh dược của Thanh Vân Môn, được bố trí Tụ Linh Trận, khiến cho linh thảo ở đây phát triển cực tốt.',
    type: 'zone_map',
    parentMapId: 'THANH_VAN_MON',
    size: { width: 2000, height: 1500 },
    backgroundStyle: { 
        background: 'linear-gradient(to bottom, #2b4d3c, #1a3a2b)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/farmer.png")',
    }
};

export const mapAreas: MapArea[] = [];

export const pois: PointOfInterest[] = [
    { id: 'dv-poi-1', name: 'Nhà Kho', type: 'building', position: { x: 300, y: 250 }, size: { width: 300, height: 250 } },
    { id: 'dv-poi-2', name: 'Linh Tuyền', type: 'landmark', position: { x: 1000, y: 200 }, size: { width: 200, height: 200 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-dv-tvm', name: 'Rời khỏi Dược Viên', position: { x: 1000, y: 1400 }, targetMap: 'THANH_VAN_MON', targetPosition: { x: 2400, y: 2650 } },
];