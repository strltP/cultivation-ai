import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'THAN_THUONG_MON',
    name: 'Thần Thương Môn',
    description: 'Một tông môn lấy thương pháp làm đầu, tọa lạc trên một ngọn núi đá hiểm trở. Kiến trúc của tông môn thô ráp, vững chãi như một pháo đài quân sự, các đệ tử đều có khí thế cương mãnh.',
    type: 'sect_map',
    parentMapId: 'BAC_VUC',
    controllingFactionId: 'THAN_THUONG_MON',
    size: { width: 3200, height: 3000 },
    backgroundStyle: { 
        background: 'linear-gradient(to bottom, #4a5568, #2d3748)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/rocky-wall.png")',
    }
};

export const mapAreas: MapArea[] = [
    { 
        id: 'ttm-area-1', 
        name: 'Thiết Huyết Bảo', 
        type: 'zone',
        position: { x: 1600, y: 1500 }, 
        size: { width: 3000, height: 2800 }, 
        style: { borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.04)' } 
    }
];

export const pois: PointOfInterest[] = [
    { id: 'ttm-poi-dien', name: 'Phá Quân Điện', type: 'building', position: { x: 1600, y: 500 }, size: { width: 1200, height: 700 }, allowedFactionIds: ['THAN_THUONG_MON'] },
    { id: 'ttm-poi-luyencac', name: 'Luyện Binh Các', type: 'building', position: { x: 700, y: 1200 }, size: { width: 800, height: 900 }, allowedFactionIds: ['THAN_THUONG_MON'] },
    { id: 'ttm-poi-dai', name: 'Thiên Quân Đài', type: 'landmark', position: { x: 2200, y: 1500 }, size: { width: 1400, height: 1200 }, allowedFactionIds: ['THAN_THUONG_MON'] },
    { id: 'ttm-poi-dong', name: 'Thương Hồn Động', type: 'dungeon', position: { x: 1600, y: 2200 }, size: { width: 800, height: 600 }, allowedFactionIds: ['THAN_THUONG_MON'] },
    { id: 'ttm-poi-binhxa', name: 'Binh Xá', type: 'building', position: { x: 700, y: 2200 }, size: { width: 900, height: 1000 }, allowedFactionIds: ['THAN_THUONG_MON'] },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-ttm-bv', name: 'Rời Tông Môn', position: { x: 1600, y: 2900 }, targetMap: 'BAC_VUC', targetPosition: { x: 2500, y: 1750 } },
];
