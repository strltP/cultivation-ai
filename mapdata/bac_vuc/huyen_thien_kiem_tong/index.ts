import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'HUYEN_THIEN_KIEM_TONG',
    name: 'Huyền Thiên Kiếm Tông',
    description: 'Tông môn kiếm đạo hùng mạnh nhất Bắc Vực, tọa lạc trên đỉnh Vân Hàn Sơn, quanh năm mây mù bao phủ, kiếm khí lăng lệ.',
    type: 'sect_map',
    parentMapId: 'BAC_VUC',
    controllingFactionId: 'HUYEN_THIEN_KIEM_TONG',
    size: { width: 3500, height: 4500 },
    backgroundStyle: { 
        background: 'linear-gradient(to bottom, #4a6a8a, #7a9aa9)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/az-subtle.png")',
    }
};

export const mapAreas: MapArea[] = [
    { 
        id: 'htkt-area-1', 
        name: 'Ngoại Môn', 
        type: 'zone',
        position: { x: 1750, y: 3500 }, 
        size: { width: 3300, height: 2000 }, 
        style: { borderColor: 'rgba(203, 213, 225, 0.2)', backgroundColor: 'rgba(203, 213, 225, 0.02)' } 
    },
    { 
        id: 'htkt-area-2', 
        name: 'Nội Môn', 
        type: 'zone',
        position: { x: 1750, y: 1250 }, 
        size: { width: 3000, height: 2500 }, 
        style: { borderColor: 'rgba(107, 114, 128, 0.3)', backgroundColor: 'rgba(107, 114, 128, 0.03)' },
        allowedFactionIds: ['HUYEN_THIEN_KIEM_TONG']
    }
];

export const pois: PointOfInterest[] = [
    { id: 'htkt-poi-dien', name: 'Huyền Thiên Điện', type: 'building', position: { x: 1750, y: 800 }, size: { width: 1200, height: 800 }, allowedFactionIds: ['HUYEN_THIEN_KIEM_TONG'] },
    { id: 'htkt-poi-kinhcac', name: 'Tàng Kinh Các', type: 'building', position: { x: 800, y: 1800 }, size: { width: 800, height: 700 }, allowedFactionIds: ['HUYEN_THIEN_KIEM_TONG'] },
    { id: 'htkt-poi-luyendai', name: 'Luyện Kiếm Đài', type: 'landmark', position: { x: 2700, y: 1800 }, size: { width: 900, height: 900 }, allowedFactionIds: ['HUYEN_THIEN_KIEM_TONG'] },
    { id: 'htkt-poi-bachthao', name: 'Bách Thảo Viên', type: 'landmark', position: { x: 800, y: 3000 }, size: { width: 1000, height: 800 }, allowedFactionIds: ['HUYEN_THIEN_KIEM_TONG'] },
    { id: 'htkt-poi-tinhhuyen', name: 'Tịnh Huyền Cốc', type: 'landmark', position: { x: 1750, y: 300 }, size: { width: 1500, height: 500 }, allowedFactionIds: ['HUYEN_THIEN_KIEM_TONG'] },
    { id: 'htkt-poi-detu-1', name: 'Đệ Tử Xá (Nội môn)', type: 'building', position: { x: 1750, y: 2500 }, size: { width: 1500, height: 800 }, allowedFactionIds: ['HUYEN_THIEN_KIEM_TONG'] },
    { id: 'htkt-poi-detu-2', name: 'Đệ Tử Xá (Ngoại môn)', type: 'building', position: { x: 1750, y: 3800 }, size: { width: 2000, height: 1000 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-htkt-bv', name: 'Hạ Sơn', position: { x: 1750, y: 4400 }, targetMap: 'BAC_VUC', targetPosition: { x: 3500, y: 1200 } },
];