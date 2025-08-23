import type { InteractableTemplate } from '../../../types/interaction';

export const HERBS: InteractableTemplate[] = [
    // === Thiên Nam - Vô Tận Thảo Nguyên ===
    {
        baseId: 'herb_da_sinh_linh_thao',
        name: 'Dã Sinh Linh Thảo',
        type: 'herb',
        prompt: 'Một cây linh thảo mọc dại trên thảo nguyên, tuy không quý hiếm nhưng linh khí lại khá dồi dào. Có thể hái lượm để luyện đan hoặc trực tiếp hấp thu.',
        loot: [{ itemId: 'material_linh_thao', quantity: [1, 2], chance: 0.95 }],
        repopulationTimeMinutes: [28800, 50400], // 20-35 days
    },
    {
        baseId: 'herb_thanh_phong_hoa',
        name: 'Thanh Phong Hoa',
        type: 'herb',
        prompt: 'Một đóa hoa màu xanh nhạt, lay động theo gió. Tương truyền nó hấp thụ tinh hoa của gió trời, có thể giúp tu sĩ trở nên nhẹ nhàng, thân pháp nhanh nhẹn hơn.',
        loot: [{ itemId: 'material_linh_thao', quantity: [1, 1], chance: 0.5 }],
        repopulationTimeMinutes: [72000, 100800], // ~1.6 - 2.3 months
    },
    {
        baseId: 'herb_nhat_chieu_cuc',
        name: 'Nhật Chiếu Cúc',
        type: 'herb',
        prompt: 'Loài hoa cúc này chỉ nở rộ dưới ánh mặt trời gay gắt. Nó chứa đựng dương khí thuần túy, là dược liệu tốt để luyện chế đan dược chữa thương.',
        loot: [{ itemId: 'material_linh_thao', quantity: [1, 1], chance: 0.6 }],
        repopulationTimeMinutes: [72000, 100800], // ~1.6 - 2.3 months
    },

    // === Bắc Vực ===
    {
        baseId: 'herb_han_bang_thao_node',
        name: 'Hàn Băng Thảo',
        type: 'herb',
        prompt: 'Một cây linh thảo mọc ở nơi cực hàn, tỏa ra hàn khí lạnh lẽo. Dùng để luyện chế đan dược thuộc tính băng.',
        loot: [{ itemId: 'material_han_bang_thao', quantity: [1, 2], chance: 0.9 }],
        repopulationTimeMinutes: [108000, 151200], // ~2.5 - 3.5 months
    },

    // === Other Maps ===
    {
        baseId: 'herb_linh_thao_hiem',
        name: 'Linh Thảo', // Keep name generic as in original file
        type: 'herb',
        prompt: 'Đây là một cây Linh Thảo hiếm có. Nó phát ra ánh sáng mờ ảo và ngân nga với năng lượng tiềm ẩn. Hấp thụ nó có thể tăng cường Tu Vi.',
        loot: [{ itemId: 'material_linh_thao', quantity: [2, 4], chance: 0.9 }],
        repopulationTimeMinutes: [216000, 302400], // ~5 - 7 months
    },

    // === New Tier 1 Herb Nodes ===
    {
        baseId: 'herb_tinh_luc_thao_node',
        name: 'Tinh Lực Thảo',
        type: 'herb',
        prompt: 'Một bụi Tinh Lực Thảo xanh mướt, tràn đầy sinh khí, có thể hái lượm.',
        loot: [{ itemId: 'material_tinh_luc_thao', quantity: [1, 3], chance: 0.95 }],
        repopulationTimeMinutes: [216000, 432000], // 15-30 days
    },
    {
        baseId: 'herb_da_hop_hoa_node',
        name: 'Dạ Hợp Hoa',
        type: 'herb',
        prompt: 'Những đóa Dạ Hợp Hoa đang lặng lẽ khoe sắc dưới ánh trăng, tỏa ra hương thơm dịu nhẹ.',
        loot: [{ itemId: 'material_da_hop_hoa', quantity: [1, 2], chance: 0.9 }],
        repopulationTimeMinutes: [28800, 50400], // 20-35 days
    },
    {
        baseId: 'herb_huyet_tinh_chi_node',
        name: 'Huyết Tinh Chi',
        type: 'herb',
        prompt: 'Một cây nấm Huyết Tinh Chi đỏ thẫm mọc trên thân cây mục, có vẻ đã đủ tuổi để thu hoạch.',
        loot: [{ itemId: 'material_huyet_tinh_chi', quantity: [1, 2], chance: 0.9 }],
        repopulationTimeMinutes: [36000, 57600], // 25-40 days
    },

    // === New Tier 2 Herb Nodes ===
    {
        baseId: 'herb_bach_linh_sam_node',
        name: 'Bạch Linh Sâm',
        type: 'herb',
        prompt: 'Một cây Bạch Linh Sâm quý giá đang ẩn mình dưới tán lá, linh khí lượn lờ.',
        loot: [{ itemId: 'material_bach_linh_sam', quantity: [1, 1], chance: 0.85 }],
        repopulationTimeMinutes: [93600, 122400], // ~2.1 - 2.8 months
    },
    {
        baseId: 'herb_tuyet_ngoc_chi_node',
        name: 'Tuyết Ngọc Chi',
        type: 'herb',
        prompt: 'Cây nấm Tuyết Ngọc Chi trong suốt như băng, tỏa ra hàn khí nhè nhẹ.',
        loot: [{ itemId: 'material_tuyet_ngoc_chi', quantity: [1, 2], chance: 0.8 }],
        repopulationTimeMinutes: [108000, 151200], // ~2.5 - 3.5 months
    },
    {
        baseId: 'herb_ngan_tuy_hoa_node',
        name: 'Ngân Tủy Hoa',
        type: 'herb',
        prompt: 'Đóa Ngân Tủy Hoa lấp lánh ánh bạc, có vẻ rất phi phàm.',
        loot: [{ itemId: 'material_ngan_tuy_hoa', quantity: [1, 1], chance: 0.75 }],
        repopulationTimeMinutes: [129600, 172800], // ~3 - 4 months
    },
    {
        baseId: 'herb_am_cot_hoa_node',
        name: 'Âm Cốt Hoa',
        type: 'herb',
        prompt: 'Một đóa Âm Cốt Hoa đang lặng lẽ nở rộ trong bóng tối, tỏa ra tử khí nhàn nhạt.',
        loot: [{ itemId: 'material_am_cot_hoa', quantity: [1, 2], chance: 0.85 }],
        repopulationTimeMinutes: [115200, 158400], // ~2.6 - 3.6 months
    },

    // === New Tier 3 Herb Nodes ===
    {
        baseId: 'herb_tu_van_thao_node',
        name: 'Tử Vân Thảo',
        type: 'herb',
        prompt: 'Một cây Tử Vân Thảo được bao bọc bởi sương tím, linh khí nồng đậm đến mức mắt thường cũng thấy được.',
        loot: [{ itemId: 'material_tu_van_thao', quantity: [1, 1], chance: 0.7 }],
        repopulationTimeMinutes: [216000, 302400], // ~5 - 7 months
    },
    {
        baseId: 'herb_hoang_kim_qua_node',
        name: 'Hoàng Kim Quả',
        type: 'herb',
        prompt: 'Trên cây có một quả Hoàng Kim Quả duy nhất, tỏa ra ánh sáng vàng rực, hương thơm ngào ngạt.',
        loot: [{ itemId: 'material_hoang_kim_qua', quantity: [1, 1], chance: 0.6 }],
        repopulationTimeMinutes: [259200, 388800], // ~6 - 9 months
    },
    
    // === Divine Tier Herbs (Linh Can Purity) ===
    {
        baseId: 'herb_thai_bach_kim_tinh_qua_node',
        name: 'Thái Bạch Kim Tinh Quả Thụ',
        type: 'herb',
        prompt: 'Một cây linh quả nhỏ mọc ra từ một tảng kim loại, trên cây có một quả duy nhất lấp lánh ánh kim. Dường như là Thái Bạch Kim Tinh Quả trong truyền thuyết.',
        loot: [{ itemId: 'consumable_thai_bach_kim_tinh_qua', quantity: [1, 1], chance: 0.8 }],
        repopulationTimeMinutes: [5184000, 10368000],
    },
    {
        baseId: 'herb_bat_tu_than_moc_diep_node',
        name: 'Bất Tử Thần Mộc',
        type: 'herb',
        prompt: 'Một nhánh nhỏ của cây thần mộc cổ đại, trên đó có một chiếc lá duy nhất tỏa ra sinh mệnh lực dồi dào. Đây chính là Bất Tử Thần Mộc Diệp.',
        loot: [{ itemId: 'consumable_bat_tu_than_moc_diep', quantity: [1, 1], chance: 0.8 }],
        repopulationTimeMinutes: [4147200, 7776000],
    },
    {
        baseId: 'herb_cuu_u_huyen_thuy_tinh_node',
        name: 'Cửu U Hàn Đàm',
        type: 'herb', // Using herb type for consistency of gathering.
        prompt: 'Một hồ nước nhỏ tỏa ra hàn khí cực độ, ở giữa dường như có một viên tinh thể màu xanh sẫm đang ngưng tụ. Đó là Cửu U Huyền Thủy Tinh.',
        loot: [{ itemId: 'consumable_cuu_u_huyen_thuy_tinh', quantity: [1, 1], chance: 0.7 }],
        repopulationTimeMinutes: [3628800, 5184000],
    },
    {
        baseId: 'herb_phuong_hoang_niet_ban_hoa_node',
        name: 'Phượng Hoàng Niết Bàn Hỏa',
        type: 'herb', // Using herb type for consistency of gathering.
        prompt: 'Một đóa hoa sen lửa đang nở rộ giữa không trung, nhiệt độ xung quanh cực cao. Trong nhụy hoa dường như có một hạt châu rực lửa. Đó là tinh hoa của Phượng Hoàng Niết Bàn Hoa.',
        loot: [{ itemId: 'consumable_phuong_hoang_niet_ban_hoa', quantity: [1, 1], chance: 0.7 }],
        repopulationTimeMinutes: [1555200, 3110400],
    },
];
