import type { GameMap, TeleportLocation, PointOfInterest, MapArea } from '../../types/map';

export const mapDefinition: GameMap = {
    id: 'THIEN_NAM',
    name: 'Thiên Nam Đại Lục',
    type: 'continent',
    size: { width: 10000, height: 8000 }, // Expanded map size
    backgroundStyle: { background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0) 70%), linear-gradient(to bottom, #2a3a2b, #1a2a1b)' },
    parentMapId: undefined,
};

export const mapAreas: MapArea[] = [
    // Top - Made wider
    { id: 'area-1', name: 'Thương Lan Đế Quốc', type: 'nation', position: { x: 5000, y: 1250 }, size: { width: 4000, height: 2500 }, style: { borderColor: 'rgba(139, 92, 246, 0.4)', backgroundColor: 'rgba(139, 92, 246, 0.05)' } },
    // Right - Made taller
    { id: 'area-2', name: 'Vô Tận Thảo Nguyên', type: 'region', position: { x: 8500, y: 4000 }, size: { width: 3000, height: 5000 }, style: { borderColor: 'rgba(74, 222, 128, 0.4)', backgroundColor: 'rgba(74, 222, 128, 0.05)' } },
    // Center - Made smaller and more focused
    { id: 'area-3', name: 'Thiên Nguyên Sơn', type: 'region', position: { x: 5000, y: 4000 }, size: { width: 2500, height: 2500 }, style: { borderColor: 'rgba(148, 163, 184, 0.4)', backgroundColor: 'rgba(148, 163, 184, 0.05)' } },
    // Bottom - Different rectangular shape
    { id: 'area-4', name: 'Thủy Nguyệt Đế Quốc', type: 'nation', position: { x: 5000, y: 6750 }, size: { width: 3500, height: 2500 }, style: { borderColor: 'rgba(59, 130, 246, 0.4)', backgroundColor: 'rgba(59, 130, 246, 0.05)' } },
    // Left - Made taller
    { id: 'area-5', name: 'Hoa Phong Châu', type: 'province', position: { x: 1500, y: 4000 }, size: { width: 3000, height: 4000 }, style: { borderColor: 'rgba(217, 70, 239, 0.4)', backgroundColor: 'rgba(217, 70, 239, 0.05)' } },
];


export const pois: PointOfInterest[] = [
    // Thương Lan Đế Quốc (Top) - Re-arranged for better logical flow
    { id: 'tn-poi-tht', name: 'Thất Huyền Thành', type: 'city', position: { x: 5000, y: 1500 }, size: { width: 900, height: 800 }, targetMap: 'THAT_HUYEN_THANH', targetPosition: {x: 500, y: 850}, minRealmIndex: 0 }, // Central Capital
    { id: 'tn-poi-luc-yen-thon', name: 'Lục Yên Thôn', type: 'village', position: { x: 3800, y: 1800 }, size: { width: 400, height: 300 }, targetMap: 'LUC_YEN_THON', targetPosition: {x: 1000, y: 1300}, minRealmIndex: 0 }, // Starter village
    { id: 'tn-poi-ngoc-thanh', name: 'Ngọc Thành', type: 'city', position: { x: 4200, y: 2100 }, size: { width: 700, height: 600 }, minRealmIndex: 0 }, // First major city from starter village
    { id: 'tn-poi-mo-linh-thanh', name: 'Mộ Linh Thành', type: 'city', position: { x: 6200, y: 800 }, size: { width: 650, height: 600 }, targetMap: 'MO_LINH_THANH', targetPosition: { x: 600, y: 850 }, minRealmIndex: 1 }, // NE City
    { id: 'tn-poi-linh-duoc-tran', name: 'Linh Dược Trấn', type: 'village', position: { x: 6000, y: 1800 }, size: { width: 450, height: 350 }, minRealmIndex: 0 }, // SE village
    { id: 'tn-poi-hac-am-sam-lam', name: 'Hắc Ám Sâm Lâm', type: 'dungeon', position: { x: 3500, y: 700 }, size: { width: 400, height: 300 }, targetMap: 'HAC_AM_SAM_LAM', targetPosition: {x: 1500, y: 3800}, minRealmIndex: 0 }, // NW Dungeon
    { id: 'tn-poi-doan-hon-coc', name: 'Đoạn Hồn Cốc', type: 'landmark', position: { x: 6500, y: 2200 }, size: { width: 500, height: 250 }, minRealmIndex: 2 }, // SE Landmark/Dungeon
    
    // Thiên Nguyên Sơn (Center)
    { id: 'tn-poi-3', name: 'Thanh Vân Môn', type: 'sect', position: { x: 4800, y: 3800 }, size: { width: 700, height: 900 }, targetMap: 'THANH_VAN_MON', targetPosition: { x: 1500, y: 3700 }, minRealmIndex: 1 },
    
    // Vô Tận Thảo Nguyên (Right)
    { id: 'tn-poi-4', name: 'Huyết Sắc Cấm Địa', type: 'dungeon', position: { x: 9000, y: 3800 }, size: { width: 600, height: 500 }, minRealmIndex: 2 },
];

export const teleportGates: TeleportLocation[] = [
    // Moved to new map edges
    { id: 'gate-tn-bv', name: 'Trận Pháp đến Bắc Vực', position: { x: 5000, y: 100 }, targetMap: 'BAC_VUC', targetPosition: { x: 400, y: 450 } },
    { id: 'gate-tn-dh', name: 'Trận Pháp đến Đại Hoang', position: { x: 100, y: 4000 }, targetMap: 'DAI_HOANG', targetPosition: { x: 120, y: 2000 } },
    { id: 'gate-tn-dhg', name: 'Trận Pháp đến Đông Phương Hải Vực', position: { x: 9900, y: 4000 }, targetMap: 'DONG_HAI', targetPosition: { x: 100, y: 400 } },
];