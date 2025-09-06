import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'CUU_TUYET_MON',
    name: 'Cửu Tuyết Môn',
    description: 'Tông môn tọa lạc trong một thung lũng tuyết vĩnh cửu, kiến trúc tinh xảo như băng ngọc, nổi tiếng với các đệ tử thanh lệ thoát tục và pháp thuật hệ băng huyền ảo.',
    type: 'sect_map',
    parentMapId: 'BAC_VUC',
    controllingFactionId: 'CUU_TUYET_MON',
    size: { width: 3000, height: 4000 },
    backgroundStyle: { 
        background: 'linear-gradient(to bottom, #a1c4fd, #c2e9fb)', // Light blue gradient
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/snow.png")',
    }
};

export const mapAreas: MapArea[] = [
    { 
        id: 'ctm-area-1', 
        name: 'Băng Phong Cốc', 
        type: 'zone',
        position: { x: 1500, y: 2000 }, 
        size: { width: 2800, height: 3800 }, 
        style: { borderColor: 'rgba(191, 219, 254, 0.4)', backgroundColor: 'rgba(191, 219, 254, 0.05)' } 
    }
];

export const pois: PointOfInterest[] = [
    { id: 'ctm-poi-cung', name: 'Cửu Tuyết Cung', type: 'building', position: { x: 1500, y: 600 }, size: { width: 1400, height: 800 }, allowedFactionIds: ['CUU_TUYET_MON'] },
    { id: 'ctm-poi-huyenanh', name: 'Huyễn Ảnh Lâm', type: 'landmark', position: { x: 750, y: 1800 }, size: { width: 900, height: 1200 }, allowedFactionIds: ['CUU_TUYET_MON'] },
    { id: 'ctm-poi-ho', name: 'Băng Tâm Hồ', type: 'landmark', position: { x: 2250, y: 1800 }, size: { width: 900, height: 900 }, allowedFactionIds: ['CUU_TUYET_MON'] },
    { id: 'ctm-poi-coc', name: 'Hàn Băng Cốc', type: 'dungeon', position: { x: 2250, y: 3000 }, size: { width: 1200, height: 900 }, allowedFactionIds: ['CUU_TUYET_MON'] },
    { id: 'ctm-poi-lau', name: 'Tuyết Lâu', type: 'building', position: { x: 750, y: 3000 }, size: { width: 900, height: 1200 }, allowedFactionIds: ['CUU_TUYET_MON'] },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-ctm-bv', name: 'Rời Tông Môn', position: { x: 1500, y: 3900 }, targetMap: 'BAC_VUC', targetPosition: { x: 1500, y: 950 } },
];
