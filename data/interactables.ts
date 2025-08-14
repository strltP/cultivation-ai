import type { InteractableType } from '../types/interaction';

// Defines the potential loot from an interactable object.
export interface InteractableLoot {
  itemId: string;
  quantity: [number, number]; // min, max quantity
  chance: number; // 0 to 1
}

// This defines the "template" for an interactable object.
// The actual instances on the map will be defined in `mapdata/interactable_spawns.ts`.
export interface InteractableTemplate {
  baseId: string;
  name: string;
  prompt: string;
  type: InteractableType;
  loot?: InteractableLoot[];
  respawnTimeMinutes?: number;
}

// 1 month in-game = 30 days * 24 hours * 60 minutes = 43200 minutes

export const ALL_INTERACTABLES: InteractableTemplate[] = [
    // === Thiên Nam - Vô Tận Thảo Nguyên ===
    {
        baseId: 'herb_da_sinh_linh_thao',
        name: 'Dã Sinh Linh Thảo',
        type: 'herb',
        prompt: 'Một cây linh thảo mọc dại trên thảo nguyên, tuy không quý hiếm nhưng linh khí lại khá dồi dào. Có thể hái lượm để luyện đan hoặc trực tiếp hấp thu.',
        loot: [{ itemId: 'material_linh_thao', quantity: [1, 2], chance: 0.95 }],
        respawnTimeMinutes: 43200, // 1 month
    },
    {
        baseId: 'herb_thanh_phong_hoa',
        name: 'Thanh Phong Hoa',
        type: 'herb',
        prompt: 'Một đóa hoa màu xanh nhạt, lay động theo gió. Tương truyền nó hấp thụ tinh hoa của gió trời, có thể giúp tu sĩ trở nên nhẹ nhàng, thân pháp nhanh nhẹn hơn.',
        loot: [{ itemId: 'material_linh_thao', quantity: [1, 1], chance: 0.5 }],
        respawnTimeMinutes: 86400, // 2 months
    },
    {
        baseId: 'herb_nhat_chieu_cuc',
        name: 'Nhật Chiếu Cúc',
        type: 'herb',
        prompt: 'Loài hoa cúc này chỉ nở rộ dưới ánh mặt trời gay gắt. Nó chứa đựng dương khí thuần túy, là dược liệu tốt để luyện chế đan dược chữa thương.',
        loot: [{ itemId: 'material_linh_thao', quantity: [1, 1], chance: 0.6 }],
        respawnTimeMinutes: 86400, // 2 months
    },

    // === Thiên Nam - Thiên Nguyên Sơn ===
    {
        baseId: 'stone_huyen_thiet',
        name: 'Huyền Thiết Khoáng Mạch',
        type: 'stone',
        prompt: 'Một mỏm đá lộ thiên trên sườn núi, có màu đen bóng và nặng trịch. Đây là một mạch khoáng Huyền Thiết, một vật liệu tuyệt vời để luyện khí.',
        loot: [{ itemId: 'material_huyen_thiet', quantity: [1, 2], chance: 0.8 }],
        respawnTimeMinutes: 64800, // 1.5 months
    },
    {
        baseId: 'stone_xich_dong',
        name: 'Xích Đồng Quặng',
        type: 'stone',
        prompt: 'Mỏ quặng này có màu đỏ như máu, tỏa ra nhiệt khí nhàn nhạt. Xích Đồng là kim loại thuộc tính hỏa, rất được các luyện khí sư ưa chuộng.',
        loot: [{ itemId: 'material_huyen_thiet', quantity: [1, 1], chance: 0.5 }],
        respawnTimeMinutes: 108000, // 2.5 months
    },
    {
        baseId: 'stone_linh_thach_tho',
        name: 'Linh Thạch Thô',
        type: 'stone',
        prompt: 'Một tảng đá lấp lánh với những tinh thể chưa được mài giũa. Dường như bên trong chứa linh khí dao động, có thể khai thác ra Linh Thạch hạ phẩm.',
        loot: [{ itemId: 'material_linh_thach', quantity: [1, 5], chance: 0.2 }],
        respawnTimeMinutes: 172800, // 4 months
    },
    
    // === Bắc Vực ===
    {
        baseId: 'herb_han_bang_thao_node',
        name: 'Hàn Băng Thảo',
        type: 'herb',
        prompt: 'Một cây linh thảo mọc ở nơi cực hàn, tỏa ra hàn khí lạnh lẽo. Dùng để luyện chế đan dược thuộc tính băng.',
        loot: [{ itemId: 'material_han_bang_thao', quantity: [1, 2], chance: 0.9 }],
        respawnTimeMinutes: 129600, // 3 months
    },

    // === Dược Viên ===
    {
        baseId: 'spirit_field_plot',
        name: 'Linh Điền',
        type: 'spirit_field',
        prompt: 'Một thửa ruộng màu mỡ, tràn đầy linh khí, thích hợp để trồng linh thảo.',
        // Loot is handled by harvesting, not by direct interaction
    },

    // === Alchemy Furnace ===
    {
        baseId: 'alchemy_furnace',
        name: 'Đan Lô',
        type: 'alchemy_furnace',
        prompt: 'Một chiếc đan lô cổ xưa, tỏa ra mùi thuốc nồng đậm. Có thể dùng để luyện đan.',
    },

    // === Other Maps ===
    {
        baseId: 'herb_linh_thao_hiem',
        name: 'Linh Thảo', // Keep name generic as in original file
        type: 'herb',
        prompt: 'Đây là một cây Linh Thảo hiếm có. Nó phát ra ánh sáng mờ ảo và ngân nga với năng lượng tiềm ẩn. Hấp thụ nó có thể tăng cường Chân Khí.',
        loot: [{ itemId: 'material_linh_thao', quantity: [2, 4], chance: 0.9 }],
        respawnTimeMinutes: 259200, // 6 months
    },
    {
        baseId: 'stone_co_bia',
        name: 'Cổ Bia',
        type: 'stone',
        prompt: 'Đây là một Cổ Bia, phủ đầy những ký tự cổ xưa, chạm vào có cảm giác sâu sắc. Dường như nó chứa đựng trí tuệ bị lãng quên về dòng chảy của Chân Khí trong trời đất.',
        loot: [{ itemId: 'material_linh_thach', quantity: [1, 10], chance: 0.1 }],
        respawnTimeMinutes: 518400, // 1 year
    },
    {
        baseId: 'chest_bi_lang_quen',
        name: 'Rương Bị Lãng Quên',
        type: 'chest',
        prompt: 'Chiếc rương này làm bằng gỗ đen, xù xì và được buộc bằng sắt gỉ. Cảm giác cổ xưa và phát ra một luồng khí bí ẩn mờ nhạt. Ai biết nó chứa đựng bí mật gì bên trong?',
        // No loot table, this will use Gemini API
        respawnTimeMinutes: 216000, // 5 months
    },

    // === New Tier 1 Herb Nodes ===
    {
        baseId: 'herb_tinh_luc_thao_node',
        name: 'Tinh Lực Thảo',
        type: 'herb',
        prompt: 'Một bụi Tinh Lực Thảo xanh mướt, tràn đầy sinh khí, có thể hái lượm.',
        loot: [{ itemId: 'material_tinh_luc_thao', quantity: [1, 3], chance: 0.95 }],
        respawnTimeMinutes: 36000, // ~25 days
    },
    {
        baseId: 'herb_da_hop_hoa_node',
        name: 'Dạ Hợp Hoa',
        type: 'herb',
        prompt: 'Những đóa Dạ Hợp Hoa đang lặng lẽ khoe sắc dưới ánh trăng, tỏa ra hương thơm dịu nhẹ.',
        loot: [{ itemId: 'material_da_hop_hoa', quantity: [1, 2], chance: 0.9 }],
        respawnTimeMinutes: 43200, // 1 month
    },
    {
        baseId: 'herb_huyet_tinh_chi_node',
        name: 'Huyết Tinh Chi',
        type: 'herb',
        prompt: 'Một cây nấm Huyết Tinh Chi đỏ thẫm mọc trên thân cây mục, có vẻ đã đủ tuổi để thu hoạch.',
        loot: [{ itemId: 'material_huyet_tinh_chi', quantity: [1, 2], chance: 0.9 }],
        respawnTimeMinutes: 48000, // ~1.1 months
    },

    // === New Tier 2 Herb Nodes ===
    {
        baseId: 'herb_bach_linh_sam_node',
        name: 'Bạch Linh Sâm',
        type: 'herb',
        prompt: 'Một cây Bạch Linh Sâm quý giá đang ẩn mình dưới tán lá, linh khí lượn lờ.',
        loot: [{ itemId: 'material_bach_linh_sam', quantity: [1, 1], chance: 0.85 }],
        respawnTimeMinutes: 108000, // 2.5 months
    },
    {
        baseId: 'herb_tuyet_ngoc_chi_node',
        name: 'Tuyết Ngọc Chi',
        type: 'herb',
        prompt: 'Cây nấm Tuyết Ngọc Chi trong suốt như băng, tỏa ra hàn khí nhè nhẹ.',
        loot: [{ itemId: 'material_tuyet_ngoc_chi', quantity: [1, 2], chance: 0.8 }],
        respawnTimeMinutes: 129600, // 3 months
    },
    {
        baseId: 'herb_ngan_tuy_hoa_node',
        name: 'Ngân Tủy Hoa',
        type: 'herb',
        prompt: 'Đóa Ngân Tủy Hoa lấp lánh ánh bạc, có vẻ rất phi phàm.',
        loot: [{ itemId: 'material_ngan_tuy_hoa', quantity: [1, 1], chance: 0.75 }],
        respawnTimeMinutes: 151200, // 3.5 months
    },
    {
        baseId: 'herb_am_cot_hoa_node',
        name: 'Âm Cốt Hoa',
        type: 'herb',
        prompt: 'Một đóa Âm Cốt Hoa đang lặng lẽ nở rộ trong bóng tối, tỏa ra tử khí nhàn nhạt.',
        loot: [{ itemId: 'material_am_cot_hoa', quantity: [1, 2], chance: 0.85 }],
        respawnTimeMinutes: 135000, // ~3.1 months
    },

    // === New Tier 3 Herb Nodes ===
    {
        baseId: 'herb_tu_van_thao_node',
        name: 'Tử Vân Thảo',
        type: 'herb',
        prompt: 'Một cây Tử Vân Thảo được bao bọc bởi sương tím, linh khí nồng đậm đến mức mắt thường cũng thấy được.',
        loot: [{ itemId: 'material_tu_van_thao', quantity: [1, 1], chance: 0.7 }],
        respawnTimeMinutes: 259200, // 6 months
    },
    {
        baseId: 'herb_hoang_kim_qua_node',
        name: 'Hoàng Kim Quả',
        type: 'herb',
        prompt: 'Trên cây có một quả Hoàng Kim Quả duy nhất, tỏa ra ánh sáng vàng rực, hương thơm ngào ngạt.',
        loot: [{ itemId: 'material_hoang_kim_qua', quantity: [1, 1], chance: 0.6 }],
        respawnTimeMinutes: 345600, // 8 months
    },

    // === New Tier 1 Mineral Nodes ===
    {
        baseId: 'stone_tinh_thiet_node',
        name: 'Mỏ Tinh Thiết',
        type: 'stone',
        prompt: 'Một mạch khoáng Tinh Thiết lộ thiên, có thể khai thác.',
        loot: [{ itemId: 'material_tinh_thiet', quantity: [1, 3], chance: 0.9 }],
        respawnTimeMinutes: 50400, // ~1.1 months
    },
    {
        baseId: 'stone_thanh_cuong_thach_node',
        name: 'Mỏ Thanh Cương Thạch',
        type: 'stone',
        prompt: 'Những tảng đá màu xanh lam cứng rắn, đây là Thanh Cương Thạch.',
        loot: [{ itemId: 'material_thanh_cuong_thach', quantity: [1, 2], chance: 0.85 }],
        respawnTimeMinutes: 57600, // ~1.3 months
    },

    // === New Tier 2 Mineral Nodes ===
    {
        baseId: 'stone_lam_ngoc_node',
        name: 'Mỏ Lam Ngọc',
        type: 'stone',
        prompt: 'Một viên Lam Ngọc thô đang ẩn trong vách đá, phát ra ánh sáng xanh dịu mắt.',
        loot: [{ itemId: 'material_lam_ngoc', quantity: [1, 1], chance: 0.8 }],
        respawnTimeMinutes: 172800, // 4 months
    },
    {
        baseId: 'stone_tinh_ngan_khoang_node',
        name: 'Mỏ Tinh Ngân',
        type: 'stone',
        prompt: 'Mạch khoáng Tinh Ngân lấp lánh ánh bạc, là một vật liệu luyện khí hiếm có.',
        loot: [{ itemId: 'material_tinh_ngan_khoang', quantity: [1, 2], chance: 0.75 }],
        respawnTimeMinutes: 194400, // 4.5 months
    },

    // === New Tier 3 Mineral Nodes ===
    {
        baseId: 'stone_kim_tinh_node',
        name: 'Mỏ Kim Tinh',
        type: 'stone',
        prompt: 'Trong mạch khoáng vàng này dường như có chứa Kim Tinh, cực kỳ quý giá.',
        loot: [{ itemId: 'material_kim_tinh', quantity: [1, 1], chance: 0.65 }],
        respawnTimeMinutes: 388800, // 9 months
    },
    {
        baseId: 'stone_han_ngoc_node',
        name: 'Mỏ Hàn Ngọc',
        type: 'stone',
        prompt: 'Khối ngọc thạch này tỏa ra hàn khí, chắc chắn là Hàn Ngọc trong truyền thuyết.',
        loot: [{ itemId: 'material_han_ngoc', quantity: [1, 1], chance: 0.6 }],
        respawnTimeMinutes: 432000, // 10 months
    },
    {
        baseId: 'stone_ma_van_moc_node',
        name: 'Cây Ma Vân',
        type: 'stone', // Using 'stone' type for gatherable wood fits the existing structure
        prompt: 'Một cây cổ thụ đã bị ma khí xâm thực, trên thân cây hiện lên những đường vân quỷ dị.',
        loot: [{ itemId: 'material_ma_van_moc', quantity: [1, 1], chance: 0.7 }],
        respawnTimeMinutes: 300000, // ~7 months
    },
];