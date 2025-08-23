import type { MapID } from '../types/map';
import type { Position } from '../types/common';

// Định nghĩa cho các vật phẩm được đặt thủ công, có vị trí cố định (ví dụ: rương, vật phẩm nhiệm vụ)
interface InteractableSpawn {
    id: string; 
    baseId: string; 
    position: Position;
}

// Định nghĩa quy tắc để sinh thành ngẫu nhiên các vật phẩm trong một khu vực trên bản đồ
export interface ProceduralSpawnRule {
    type: 'procedural';
    areaId: string; // Tương ứng với 'id' của một MapArea trong file bản đồ
    itemWeights: Record<string, number>; // Ánh xạ từ baseId của vật phẩm đến "trọng số" hiếm của nó
    initialCount: number; // Số lượng vật phẩm ban đầu
    maxCount: number; // Số lượng tối đa mà khu vực này sẽ duy trì
}

// Mỗi bản đồ có thể chứa một danh sách kết hợp cả vật phẩm thủ công và vật phẩm sinh ra ngẫu nhiên
type SpawnDefinition = InteractableSpawn | ProceduralSpawnRule;

export const SPAWN_DEFINITIONS_BY_MAP: Record<MapID, SpawnDefinition[]> = {
    // ---- THIEN NAM & SUBMAPS ----
    THIEN_NAM: [
        // Quy tắc sinh ngẫu nhiên cho Thương Lan Đế Quốc (id: 'area-1')
        {
            type: 'procedural',
            areaId: 'area-1', 
            itemWeights: {
                'herb_da_sinh_linh_thao': 10, // Thảo dược phổ biến
                'herb_tinh_luc_thao_node': 9,
                'herb_huyet_tinh_chi_node': 7,
                'stone_huyen_thiet': 6,      // Khoáng thạch không quá hiếm
                'stone_tinh_thiet_node': 5,
                'herb_thanh_phong_hoa': 3,   // Thảo dược hiếm hơn một chút
                'herb_bach_linh_sam_node': 2,
            },
            initialCount: 150,
            maxCount: 150
        },
        // Quy tắc sinh ngẫu nhiên cho Vô Tận Thảo Nguyên (id: 'area-2')
        {
            type: 'procedural',
            areaId: 'area-2', 
            itemWeights: {
                'herb_da_sinh_linh_thao': 120, // Rất phổ biến
                'herb_tinh_luc_thao_node': 100,
                'herb_thanh_phong_hoa': 40,  // Không phổ biến
                'herb_nhat_chieu_cuc': 20,   // Hiếm
                'herb_bach_linh_sam_node': 10,
                'herb_phuong_hoang_niet_ban_hoa_node': 1, // Cực hiếm
            },
            initialCount: 120,
            maxCount: 120
        },
        // Quy tắc sinh ngẫu nhiên cho Thiên Nguyên Sơn (id: 'area-3')
        {
            type: 'procedural',
            areaId: 'area-3',
            itemWeights: {
                'stone_huyen_thiet': 8, // Phổ biến
                'stone_tinh_thiet_node': 7,
                'stone_xich_dong': 5,   // Không phổ biến
                'stone_thanh_cuong_thach_node': 5,
                'stone_linh_thach_tho': 3, // Tương đối hiếm
                'stone_lam_ngoc_node': 2,
                'herb_ngan_tuy_hoa_node': 2,
                'stone_tinh_ngan_khoang_node': 1,
            },
            initialCount: 80,
            maxCount: 80
        },
        // Quy tắc sinh ngẫu nhiên cho Hoa Phong Châu (id: 'area-5')
        {
            type: 'procedural',
            areaId: 'area-5',
            itemWeights: {
                'herb_thanh_phong_hoa': 10, // Thảo dược gió
                'herb_da_hop_hoa_node': 8,
                'herb_nhat_chieu_cuc': 6,   // Thảo dược dương khí
                'herb_bach_linh_sam_node': 4,
                'herb_linh_thao_hiem': 2,     // Thảo dược hiếm
                'herb_tu_van_thao_node': 1,
            },
            initialCount: 70,
            maxCount: 70 
        },
    ],
    HAC_AM_SAM_LAM: [
        { id: 'interact-hasl-chest-1', baseId: 'chest_bi_lang_quen', position: { x: 2400, y: 1700 } },
        { id: 'interact-hasl-altar-1', baseId: 'stone_co_bia', position: { x: 1550, y: 450 } },
        {
            type: 'procedural',
            areaId: 'hasl-area-1', // Rìa Rừng U Ám
            itemWeights: {
                'herb_da_hop_hoa_node': 10,
                'herb_huyet_tinh_chi_node': 8,
                'herb_am_cot_hoa_node': 4,
            },
            initialCount: 40,
            maxCount: 40,
        },
        {
            type: 'procedural',
            areaId: 'hasl-area-2', // Đầm Lầy Hủ Hóa
            itemWeights: {
                'herb_am_cot_hoa_node': 10,
                'herb_tuyet_ngoc_chi_node': 6,
                'stone_co_bia': 1,
            },
            initialCount: 30,
            maxCount: 30,
        },
        {
            type: 'procedural',
            areaId: 'hasl-area-3', // Cổ Thụ Lõi
            itemWeights: {
                'herb_am_cot_hoa_node': 8,
                'stone_ma_van_moc_node': 5,
                'chest_bi_lang_quen': 2,
            },
            initialCount: 20,
            maxCount: 20,
        }
    ],
    LUC_YEN_THON: [
        { id: 'interact-lyt-chest-1', baseId: 'chest_bi_lang_quen', position: { x: 1800, y: 200 } },
        {
            type: 'procedural',
            areaId: 'lyt-area-main',
            itemWeights: {
                'herb_da_sinh_linh_thao': 10,
                'herb_tinh_luc_thao_node': 8,
                'herb_huyet_tinh_chi_node': 3,
            },
            initialCount: 20,
            maxCount: 20,
        }
    ],
    THAT_HUYEN_THANH: [
        { id: 'dan-lo-tht-1', baseId: 'alchemy_furnace', position: { x: 900, y: 700 } },
    ],
    MO_LINH_THANH: [],
    LUU_LY_TONG: [],
    VAN_BAO_LAU: [],
    THIEN_MA_TUU_LAU: [],
    THANH_VAN_MON: [
        // Tài nguyên ngẫu nhiên
        {
            type: 'procedural',
            areaId: 'tvm-area-1',
            itemWeights: {
                'herb_linh_thao_hiem': 2,
                'stone_linh_thach_tho': 1,
                'herb_bach_linh_sam_node': 3,
                'stone_lam_ngoc_node': 2,
            },
            initialCount: 25,
            maxCount: 25
        }
    ],
    DUOC_VIEN: [
        // Các ô đất trong Dược Viên
        { id: 'plot-dv-1', baseId: 'spirit_field_plot', position: { x: 800, y: 600 } },
        { id: 'plot-dv-2', baseId: 'spirit_field_plot', position: { x: 1000, y: 600 } },
        { id: 'plot-dv-3', baseId: 'spirit_field_plot', position: { x: 1200, y: 600 } },
        { id: 'plot-dv-4', baseId: 'spirit_field_plot', position: { x: 800, y: 800 } },
        { id: 'plot-dv-5', baseId: 'spirit_field_plot', position: { x: 1000, y: 800 } },
        { id: 'plot-dv-6', baseId: 'spirit_field_plot', position: { x: 1200, y: 800 } },
        { id: 'plot-dv-7', baseId: 'spirit_field_plot', position: { x: 800, y: 1000 } },
        { id: 'plot-dv-8', baseId: 'spirit_field_plot', position: { x: 1000, y: 1000 } },
        { id: 'plot-dv-9', baseId: 'spirit_field_plot', position: { x: 1200, y: 1000 } },
    ],
    MOC_GIA: [],
    TIEU_GIA: [],

    // ---- BAC VUC & SUBMAPS ----
    BAC_VUC: [
        { id: 'interact-3', baseId: 'chest_bi_lang_quen', position: { x: 2500, y: 500 } },
        {
            type: 'procedural',
            areaId: 'bv-area-1',
            itemWeights: {
                'herb_han_bang_thao_node': 100,
                'herb_tuyet_ngoc_chi_node': 80,
                'stone_huyen_thiet': 60,
                'stone_tinh_thiet_node': 50,
                'stone_linh_thach_tho': 20,
                'stone_han_ngoc_node': 10,
                'herb_bat_tu_than_moc_diep_node': 5,
                'herb_cuu_u_huyen_thuy_tinh_node': 2,
            },
            initialCount: 100,
            maxCount: 100,
        },
        {
            type: 'procedural',
            areaId: 'bv-area-2',
            itemWeights: {
                'herb_da_sinh_linh_thao': 10,
                'stone_huyen_thiet': 5,
                'stone_thanh_cuong_thach_node': 4,
                'herb_bach_linh_sam_node': 3,
                'stone_lam_ngoc_node': 2,
            },
            initialCount: 120,
            maxCount: 120,
        }
    ],
    HUYEN_NGOC_THANH: [],

    // ---- OTHER CONTINENTS ----
    DAI_HOANG: [
        {
            type: 'procedural',
            areaId: 'dh-area-1', // Phong Sa Châu
            itemWeights: {
                'stone_xich_dong': 10,
                'herb_nhat_chieu_cuc': 8,
                'stone_tinh_thiet_node': 7,
                'stone_thanh_cuong_thach_node': 6,
                'chest_bi_lang_quen': 2,
                'stone_lam_ngoc_node': 3,
            },
            initialCount: 150,
            maxCount: 150
        },
        {
            type: 'procedural',
            areaId: 'dh-area-2', // Hoàng Long Vực
            itemWeights: {
                'stone_tinh_ngan_khoang_node': 80,
                'herb_ngan_tuy_hoa_node': 60,
                'herb_hoang_kim_qua_node': 30,
                'stone_co_bia': 10,
                'herb_thai_bach_kim_tinh_qua_node': 5,
                'herb_hon_don_tuc_nhuong_node': 2,
            },
            initialCount: 100,
            maxCount: 100
        },
    ],
    DONG_HAI: [],
};
