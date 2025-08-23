import type { InteractableTemplate } from '../../../types/interaction';

export const ORES: InteractableTemplate[] = [
    // === Thiên Nam - Thiên Nguyên Sơn ===
    {
        baseId: 'stone_huyen_thiet',
        name: 'Huyền Thiết Khoáng Mạch',
        type: 'stone',
        prompt: 'Một mỏm đá lộ thiên trên sườn núi, có màu đen bóng và nặng trịch. Đây là một mạch khoáng Huyền Thiết, một vật liệu tuyệt vời để luyện khí.',
        loot: [{ itemId: 'material_huyen_thiet', quantity: [1, 2], chance: 0.8 }],
        repopulationTimeMinutes: [50400, 72000], // ~1.1 - 1.6 months
    },
    {
        baseId: 'stone_xich_dong',
        name: 'Xích Đồng Quặng',
        type: 'stone',
        prompt: 'Mỏ quặng này có màu đỏ như máu, tỏa ra nhiệt khí nhàn nhạt. Xích Đồng là kim loại thuộc tính hỏa, rất được các luyện khí sư ưa chuộng.',
        loot: [{ itemId: 'material_huyen_thiet', quantity: [1, 1], chance: 0.5 }],
        repopulationTimeMinutes: [93600, 122400], // ~2.1 - 2.8 months
    },
    {
        baseId: 'stone_linh_thach_tho',
        name: 'Linh Thạch Thô',
        type: 'stone',
        prompt: 'Một tảng đá lấp lánh với những tinh thể chưa được mài giũa. Dường như bên trong chứa linh khí dao động, có thể khai thác ra Linh Thạch hạ phẩm.',
        loot: [{ itemId: 'material_linh_thach', quantity: [1, 5], chance: 0.2 }],
        repopulationTimeMinutes: [151200, 201600], // ~3.5 - 4.6 months
    },
    
    // === Other Maps ===
    {
        baseId: 'stone_co_bia',
        name: 'Cổ Bia',
        type: 'stone',
        prompt: 'Đây là một Cổ Bia, phủ đầy những ký tự cổ xưa, chạm vào có cảm giác sâu sắc. Dường như nó chứa đựng trí tuệ bị lãng quên về dòng chảy của Tu Vi trong trời đất.',
        loot: [{ itemId: 'material_linh_thach', quantity: [1, 10], chance: 0.1 }],
        repopulationTimeMinutes: [432000, 604800], // ~10 - 14 months
    },
    
    // === New Tier 1 Mineral Nodes ===
    {
        baseId: 'stone_tinh_thiet_node',
        name: 'Mỏ Tinh Thiết',
        type: 'stone',
        prompt: 'Một mạch khoáng Tinh Thiết lộ thiên, có thể khai thác.',
        loot: [{ itemId: 'material_tinh_thiet', quantity: [1, 3], chance: 0.9 }],
        repopulationTimeMinutes: [36000, 57600], // 25-40 days
    },
    {
        baseId: 'stone_thanh_cuong_thach_node',
        name: 'Mỏ Thanh Cương Thạch',
        type: 'stone',
        prompt: 'Những tảng đá màu xanh lam cứng rắn, đây là Thanh Cương Thạch.',
        loot: [{ itemId: 'material_thanh_cuong_thach', quantity: [1, 2], chance: 0.85 }],
        repopulationTimeMinutes: [43200, 64800], // 30-45 days
    },

    // === New Tier 2 Mineral Nodes ===
    {
        baseId: 'stone_lam_ngoc_node',
        name: 'Mỏ Lam Ngọc',
        type: 'stone',
        prompt: 'Một viên Lam Ngọc thô đang ẩn trong vách đá, phát ra ánh sáng xanh dịu mắt.',
        loot: [{ itemId: 'material_lam_ngoc', quantity: [1, 1], chance: 0.8 }],
        repopulationTimeMinutes: [151200, 201600], // ~3.5 - 4.6 months
    },
    {
        baseId: 'stone_tinh_ngan_khoang_node',
        name: 'Mỏ Tinh Ngân',
        type: 'stone',
        prompt: 'Mạch khoáng Tinh Ngân lấp lánh ánh bạc, là một vật liệu luyện khí hiếm có.',
        loot: [{ itemId: 'material_tinh_ngan_khoang', quantity: [1, 2], chance: 0.75 }],
        repopulationTimeMinutes: [172800, 230400], // ~4 - 5.3 months
    },

    // === New Tier 3 Mineral Nodes ===
    {
        baseId: 'stone_kim_tinh_node',
        name: 'Mỏ Kim Tinh',
        type: 'stone',
        prompt: 'Trong mạch khoáng vàng này dường như có chứa Kim Tinh, cực kỳ quý giá.',
        loot: [{ itemId: 'material_kim_tinh', quantity: [1, 1], chance: 0.65 }],
        repopulationTimeMinutes: [345600, 432000], // ~8 - 10 months
    },
    {
        baseId: 'stone_han_ngoc_node',
        name: 'Mỏ Hàn Ngọc',
        type: 'stone',
        prompt: 'Khối ngọc thạch này tỏa ra hàn khí, chắc chắn là Hàn Ngọc trong truyền thuyết.',
        loot: [{ itemId: 'material_han_ngoc', quantity: [1, 1], chance: 0.6 }],
        repopulationTimeMinutes: [388800, 475200], // ~9 - 11 months
    },
    {
        baseId: 'stone_ma_van_moc_node',
        name: 'Cây Ma Vân',
        type: 'stone', // Using 'stone' type for gatherable wood fits the existing structure
        prompt: 'Một cây cổ thụ đã bị ma khí xâm thực, trên thân cây hiện lên những đường vân quỷ dị.',
        loot: [{ itemId: 'material_ma_van_moc', quantity: [1, 1], chance: 0.7 }],
        repopulationTimeMinutes: [259200, 345600], // ~6 - 8 months
    },
    
    // === Divine Tier Herbs (Linh Can Purity) ===
    {
        baseId: 'herb_hon_don_tuc_nhuong_node',
        name: 'Hỗn Độn Tức Nhưỡng',
        type: 'stone', // This one fits 'stone' better.
        prompt: 'Một khối đất nhỏ có năm màu sắc, tựa như đang hô hấp, tỏa ra khí tức hỗn độn nguyên thủy. Đây là Hỗn Độn Tức Nhưỡng trong truyền thuyết.',
        loot: [{ itemId: 'consumable_hon_don_tuc_nhuong', quantity: [1, 1], chance: 0.7 }],
        repopulationTimeMinutes: [2073600, 4665600],
    },
];
