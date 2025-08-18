
import type { StaticNpcDefinition } from './npc_types';

export const ALL_STATIC_NPCS: StaticNpcDefinition[] = [
    {
        baseId: 'lao_ma',
        name: 'Lão Mã',
        gender: 'Nam',
        role: 'Chủ Tiệm Rèn',
        factionId: 'THAT_HUYEN_THANH',
        power: 40,
        behaviors: ['TRADER', 'GATHERER_ORE'],
        prompt: 'Lão Mã đang cặm cụi bên lò rèn, mồ hôi nhễ nhại. Thấy bạn, lão chỉ gật đầu rồi lại tiếp tục công việc. "Cần rèn gì không, tiểu hữu?"',
        realmName: 'Luyện Khí',
        levelDescription: 'Tầng 9',
        attributes: { canCot: 30, thanPhap: 5, thanThuc: 20, ngoTinh: 13, coDuyen: 10, tamCanh: 15 },
        age: 58,
        linhCan: [
            { type: 'HOA', purity: 45 },
            { type: 'THO', purity: 60 },
        ],
        learnedSkillIds: ['tam-phap-hoang-2', 'cong-phap-hoang-1'],
        equipment: {
            ARMOR: { itemId: 'armor_thiet_giap' }
        },
        linhThach: 150,
        camNgo: 800,
        forSale: [
            { itemId: 'weapon_thiet_kiem', stock: 5, priceModifier: 1.2 },
            { itemId: 'armor_thiet_giap', stock: 3, priceModifier: 1.2 },
            { itemId: 'material_huyen_thiet', stock: 99, priceModifier: 1.4 },
        ]
    },
    {
        baseId: 'ly_tieu_nhi',
        name: 'Lý Tiểu Nhị',
        gender: 'Nam',
        role: 'Tiểu Nhị Tửu Lâu',
        factionId: 'THAT_HUYEN_THANH',
        power: 8,
        behaviors: ['WANDERER'],
        prompt: 'Lý Tiểu Nhị nhanh nhẹn lau bàn, thấy bạn liền đon đả mời chào. "Khách quan, ngài muốn dùng chút rượu hay đồ ăn gì không? Thiên Mã Tửu Lâu của chúng tôi có đủ cả."',
        realmName: 'Luyện Khí',
        levelDescription: 'Tầng 3',
        attributes: { canCot: 8, thanPhap: 15, thanThuc: 14, ngoTinh: 18, coDuyen: 12, tamCanh: 10 },
        age: 19,
        linhCan: [
            { type: 'PHONG', purity: 70 },
        ],
        learnedSkillIds: ['tam-phap-huyen-2', 'tam-phap-hoang-3', 'cong-phap-hoang-2'],
        initialInventory: [
            { itemId: 'material_linh_thach', quantity: 20 }
        ],
        equipment: {
            ACCESSORY: { itemId: 'accessory_binh_an_phu' }
        },
        linhThach: 50,
        camNgo: 250,
    },
    {
        baseId: 'van_bao_chuong_quy',
        name: 'Vạn Bảo Chưởng Quầy',
        gender: 'Nam',
        role: 'Chủ Vạn Bảo Lâu',
        factionId: 'THAT_HUYEN_THANH',
        power: 60,
        behaviors: ['TRADER', 'SCHOLAR'],
        prompt: 'Vị chưởng quầy vuốt râu mỉm cười, ánh mắt tinh anh đảo qua người bạn. "Tiểu hữu muốn tìm bảo vật gì? Vạn Bảo Lâu của ta trên thông thiên văn, dưới tường địa lý, không gì không có."',
        realmName: 'Kim Đan',
        levelDescription: 'Sơ Kì',
        attributes: { canCot: 50, thanPhap: 40, thanThuc: 100, ngoTinh: 110, coDuyen: 30, tamCanh: 40 },
        age: 450,
        linhCan: [
            { type: 'KIM', purity: 80 },
            { type: 'MOC', purity: 65 },
            { type: 'THUY', purity: 65 },
            { type: 'HOA', purity: 65 },
            { type: 'THO', purity: 65 },
        ],
        learnedSkillIds: ['tam-phap-dia-2', 'cong-phap-huyen-1'],
        linhThach: 100000,
        camNgo: 50000,
        forSale: [
            { itemId: 'material_linh_thao', stock: 999, priceModifier: 1.5 },
            { itemId: 'material_huyen_thiet', stock: 999, priceModifier: 1.5 },
            { itemId: 'consumable_tu_khi_dan', stock: 50, priceModifier: 2 },
            { itemId: 'consumable_hoi_xuan_dan', stock: 50, priceModifier: 2 },
            { itemId: 'consumable_truyen_tong_phu', stock: 5, priceModifier: 2.5 },
            { itemId: 'weapon_han_phong_dao', stock: 1, priceModifier: 1.8 },
            { itemId: 'armor_huyen_thiet_giap', stock: 1, priceModifier: 1.8 },
            { itemId: 'accessory_tu_linh_boi', stock: 2, priceModifier: 2.2 },
            { itemId: 'book_hoa_cau_thuat', stock: 3, priceModifier: 2.0 },
            { itemId: 'book_thoi_the_kinh', stock: 3, priceModifier: 2.0 },
            { itemId: 'book_thiet_bo_sam', stock: 1, priceModifier: 2.5 },
            { itemId: 'recipe_item_hoi_xuan_dan', stock: 3, priceModifier: 1.5 },
            { itemId: 'recipe_item_tu_khi_dan', stock: 2, priceModifier: 1.8 },
        ]
    },
    {
        baseId: 'luc_thon_truong',
        name: 'Lục Thôn Trưởng',
        gender: 'Nam',
        role: 'Trưởng thôn',
        factionId: 'LUC_YEN_THON',
        power: 100,
        behaviors: ['MEDITATOR', 'WANDERER'],
        prompt: 'Vị thôn trưởng già nua đang ngồi bên hiên nhà hút tẩu thuốc, ánh mắt hiền từ nhìn bạn. "Người trẻ tuổi, ngươi từ đâu tới? Lục Yên Thôn chúng ta đã lâu không có khách lạ ghé thăm."',
        realmName: 'Luyện Khí',
        levelDescription: 'Tầng 7',
        attributes: { canCot: 25, thanPhap: 10, thanThuc: 15, ngoTinh: 20, coDuyen: 15, tamCanh: 25 },
        age: 72,
        linhCan: [
            { type: 'MOC', purity: 55 },
        ],
        learnedSkillIds: ['tam-phap-hoang-2'],
        linhThach: 120,
        camNgo: 600,
        forSale: [
            { itemId: 'consumable_hoi_xuan_dan', stock: 5, priceModifier: 1.1 },
            { itemId: 'material_linh_thao', stock: 20, priceModifier: 1.0 },
            { itemId: 'seed_linh_thao', stock: 10, priceModifier: 1.0 },
        ]
    },
];
