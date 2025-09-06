import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'HAC_AM_SAM_LAM',
    name: 'Hắc Ám Sâm Lâm',
    description: 'Khu rừng rậm cổ xưa, âm u và đầy rẫy nguy hiểm. Ánh sáng mặt trời khó lòng xuyên qua tán lá dày đặc, là nơi trú ngụ của nhiều yêu thú và ma vật.',
    type: 'dungeon_map',
    parentMapId: 'THIEN_NAM',
    size: { width: 3000, height: 4000 },
    backgroundStyle: {
        background: 'radial-gradient(ellipse at center, rgba(49, 28, 64, 0.2) 0%, rgba(12, 28, 64, 0) 70%), linear-gradient(to bottom, #1a2a1b, #0a1a0b)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")',
    }
};

export const mapAreas: MapArea[] = [
    { id: 'hasl-area-1', name: 'Rìa Rừng U Ám', type: 'zone', position: { x: 1500, y: 3250 }, size: { width: 2800, height: 1500 }, style: { borderColor: 'rgba(74, 222, 128, 0.2)', backgroundColor: 'rgba(74, 222, 128, 0.03)' }, dangerLevel: 1 },
    { id: 'hasl-area-2', name: 'Đầm Lầy Hủ Hóa', type: 'zone', position: { x: 1500, y: 1750 }, size: { width: 2000, height: 1500 }, style: { borderColor: 'rgba(139, 92, 246, 0.3)', backgroundColor: 'rgba(139, 92, 246, 0.05)' }, dangerLevel: 1 },
    { id: 'hasl-area-3', name: 'Cổ Thụ Lõi', type: 'zone', position: { x: 1500, y: 500 }, size: { width: 2500, height: 1000 }, style: { borderColor: 'rgba(217, 70, 239, 0.2)', backgroundColor: 'rgba(217, 70, 239, 0.04)' }, dangerLevel: 1 },
];

export const pois: PointOfInterest[] = [
    { id: 'hasl-poi-1', name: 'Yêu Thụ Cổ Lão', type: 'landmark', position: { x: 1500, y: 500 }, size: { width: 800, height: 600 } },
    { id: 'hasl-poi-2', name: 'Phế Tích Tế Đàn', type: 'landmark', position: { x: 2300, y: 1800 }, size: { width: 400, height: 400 } },
    { id: 'hasl-poi-3', name: 'Hang Độc Chu', type: 'dungeon', position: { x: 700, y: 2200 }, size: { width: 500, height: 400 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-hasl-tn', name: 'Rời khỏi Sâm Lâm', position: { x: 1500, y: 3900 }, targetMap: 'THIEN_NAM', targetPosition: { x: 3500, y: 800 } },
];