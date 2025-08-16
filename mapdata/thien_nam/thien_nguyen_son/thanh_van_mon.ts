import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'THANH_VAN_MON',
    name: 'Thanh Vân Môn',
    type: 'sect_map',
    size: { width: 3000, height: 4000 },
    backgroundStyle: { 
        background: 'linear-gradient(to bottom, #4a6a8a, #7a9aa9)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/mountain-road.png")',
    }
};

export const mapAreas: MapArea[] = [
    { 
        id: 'tvm-area-1', 
        name: 'Ngoại Vi Tông Môn', 
        type: 'zone',
        position: { x: 1500, y: 2000 }, 
        size: { width: 2800, height: 3800 }, 
        style: { borderColor: 'rgba(74, 222, 128, 0.2)', backgroundColor: 'rgba(74, 222, 128, 0.02)' } 
    }
];

export const pois: PointOfInterest[] = [
    { id: 'tvm-poi-1', name: 'Chính Điện', type: 'building', position: { x: 1500, y: 800 }, size: { width: 1200, height: 800 } },
    { id: 'tvm-poi-2', name: 'Tàng Kinh Các', type: 'building', position: { x: 600, y: 1800 }, size: { width: 800, height: 700 } },
    { id: 'tvm-poi-3', name: 'Luyện Đan Phường', type: 'building', position: { x: 2400, y: 1800 }, size: { width: 800, height: 700 } },
    { id: 'tvm-poi-4', name: 'Đệ Tử Xá', type: 'building', position: { x: 1500, y: 2800 }, size: { width: 1500, height: 900 } },
    { id: 'tvm-poi-5', name: 'Trưởng Lão Viện', type: 'building', position: { x: 2400, y: 500 }, size: { width: 900, height: 600 } },
    { id: 'tvm-poi-6', name: 'Hậu Sơn Cấm Địa', type: 'dungeon', position: { x: 1500, y: 100 }, size: { width: 1000, height: 400 } },
    { id: 'tvm-poi-7', name: 'Dược Viên', type: 'landmark', position: { x: 2400, y: 2500 }, size: { width: 700, height: 600 }, targetMap: 'DUOC_VIEN', targetPosition: { x: 1000, y: 1300 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-tvm-tn', name: 'Hạ Sơn', position: { x: 1500, y: 3850 }, targetMap: 'THIEN_NAM', targetPosition: { x: 4800, y: 4000 } },
];
