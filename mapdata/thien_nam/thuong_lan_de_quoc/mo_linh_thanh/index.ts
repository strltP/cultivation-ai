import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../../../types/map';

export const mapDefinition: GameMap = {
    id: 'MO_LINH_THANH',
    name: 'Mộ Linh Thành',
    description: 'Một thành trì cổ kính nằm gần biên giới, nổi tiếng với những khu lăng mộ và di tích cổ xưa, thu hút nhiều tu sĩ đến tìm kiếm cơ duyên.',
    type: 'city_map',
    parentMapId: 'THIEN_NAM',
    size: { width: 3600, height: 3000 },
    backgroundStyle: { 
        backgroundColor: '#5a5266',
        backgroundImage: `
            linear-gradient(rgba(255,255,255,.06) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,.06) 2px, transparent 2px),
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
        backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px'
    }
};

export const mapAreas: MapArea[] = [];

export const pois: PointOfInterest[] = [
    { id: 'mlt-poi-1', name: 'Túy Tiên Lâu', type: 'building', position: { x: 1050, y: 750 }, size: { width: 660, height: 540 } },
    { id: 'mlt-poi-2', name: 'Diễn Võ Trường', type: 'landmark', position: { x: 2400, y: 900 }, size: { width: 900, height: 750 } },
    { id: 'mlt-poi-3', name: 'Yên Vũ Các', type: 'building', position: { x: 900, y: 1950 }, size: { width: 750, height: 600 } },
    { id: 'mlt-poi-4', name: 'Lạc Âm Phường', type: 'building', position: { x: 2250, y: 2040 }, size: { width: 600, height: 540 } },
    { id: 'mlt-poi-tieu-gia', name: 'Tiêu Gia', type: 'clan', position: { x: 1800, y: 1600 }, size: { width: 1000, height: 800 }, targetMap: 'TIEU_GIA', targetPosition: { x: 1400, y: 1900 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-mlt-tn', name: 'Rời khỏi Thành', position: { x: 1800, y: 2850 }, targetMap: 'THIEN_NAM', targetPosition: { x: 6200, y: 1150 } },
];