import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../types/map';

export const mapDefinition: GameMap = {
    id: 'BAC_VUC',
    name: 'Bắc Vực Băng Giá',
    size: { width: 5000, height: 4000 },
    backgroundStyle: { background: 'radial-gradient(ellipse at center, rgba(118, 169, 255, 0.15) 0%, rgba(118, 169, 255, 0) 70%), linear-gradient(to bottom, #1a2a3a, #0a1a2a)' }
};

export const mapAreas: MapArea[] = [
    { id: 'bv-area-1', name: 'Vân Hàn Sơn', position: { x: 2500, y: 1000 }, size: { width: 4800, height: 2000 }, style: { borderColor: 'rgba(203, 213, 225, 0.4)', backgroundColor: 'rgba(203, 213, 225, 0.05)' } },
    { id: 'bv-area-2', name: 'Thương Vân Châu', position: { x: 2500, y: 3000 }, size: { width: 4800, height: 1800 }, style: { borderColor: 'rgba(107, 114, 128, 0.4)', backgroundColor: 'rgba(107, 114, 128, 0.05)' } },
];

export const pois: PointOfInterest[] = [
    // Vân Hàn Sơn (North)
    { id: 'bv-poi-ctm', name: 'Cửu Tuyết Môn', type: 'sect', position: { x: 1500, y: 800 }, size: { width: 800, height: 700 } },
    { id: 'bv-poi-htkt', name: 'Huyền Thiên Kiếm Tông', type: 'sect', position: { x: 3500, y: 1000 }, size: { width: 900, height: 800 } },
    { id: 'bv-poi-ttm', name: 'Thần Thương Môn', type: 'sect', position: { x: 2500, y: 1600 }, size: { width: 700, height: 600 } },
    { id: 'bv-poi-tlt', name: 'Thiên Lam Trấn', type: 'village', position: { x: 800, y: 1500 }, size: { width: 500, height: 400 } },
    { id: 'bv-poi-dnt', name: 'Đại Ngọc Trấn', type: 'village', position: { x: 4200, y: 1600 }, size: { width: 500, height: 400 } },

    // Thương Vân Châu (South)
    { id: 'bv-poi-tlth', name: 'Thanh Lam Thành', type: 'city', position: { x: 1000, y: 2800 }, size: { width: 1000, height: 900 } },
    { id: 'bv-poi-hnth', name: 'Huyền Ngọc Thành', type: 'city', position: { x: 2500, y: 2500 }, size: { width: 1200, height: 1000 }, targetMap: 'HUYEN_NGOC_THANH', targetPosition: { x: 2000, y: 1750 } },
    { id: 'bv-poi-dlth', name: 'Dạ Liên Thành', type: 'city', position: { x: 4000, y: 2900 }, size: { width: 900, height: 800 } },
];

export const teleportGates: TeleportLocation[] = [
    { id: 'gate-bv-tn', name: 'Trận Pháp về Thiên Nam', position: { x: 2500, y: 3900 }, targetMap: 'THIEN_NAM', targetPosition: { x: 5000, y: 120 } },
];