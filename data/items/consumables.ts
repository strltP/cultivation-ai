import React from 'react';
import type { Item } from '../../types/item';
import { GiMagicPortal, GiCrystalGrowth, GiStoneSphere, GiFire, GiWaterDrop } from 'react-icons/gi';
import { FaLeaf } from 'react-icons/fa';

export const CONSUMABLES: Item[] = [
    {
        id: 'consumable_tu_khi_dan',
        name: 'Tụ Khí Đan',
        description: 'Đan dược cấp thấp, có thể giúp tu sĩ Luyện Khí Kỳ nhanh chóng hồi phục và tích lũy tu vi.',
        type: 'consumable',
        icon: React.createElement("div", { className: "w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-200" }),
        stackable: 20,
        value: 100,
        effects: [{ type: 'RESTORE_QI', value: 500 }],
    },
    {
        id: 'consumable_hoi_xuan_dan',
        name: 'Hồi Xuân Đan',
        description: 'Đan dược trị thương, có thể nhanh chóng chữa lành vết thương ngoài da và hồi phục một phần sinh lực.',
        type: 'consumable',
        icon: React.createElement("div", { className: "w-4 h-4 rounded-full bg-green-500 border-2 border-green-200" }),
        stackable: 20,
        value: 100,
        effects: [{ type: 'RESTORE_HP', value: 200 }],
    },
    {
        id: 'consumable_truyen_tong_phu',
        name: 'Truyền Tống Phù',
        description: 'Một lá bùa cổ xưa chứa đựng không gian chi lực, có thể xé rách không gian để dịch chuyển đến một đại lục xa xôi. Cần cẩn thận khi sử dụng.',
        type: 'consumable',
        icon: React.createElement(GiMagicPortal, { className: "text-purple-400" }),
        stackable: 10,
        value: 5000,
        effects: [{ type: 'TELEPORT', value: 0 }],
    },
    // Địa Giai
    {
        id: 'consumable_thai_bach_kim_tinh_qua',
        name: 'Thái Bạch Kim Tinh Quả',
        description: 'Một loại linh quả hiếm có sinh ra từ quặng kim loại ngàn năm, hấp thụ kim khí tinh thuần của trời đất. Dùng nó có thể gột rửa linh căn, tăng độ thuần khiết của Kim Linh Căn.',
        type: 'consumable',
        icon: React.createElement(GiCrystalGrowth, { className: "text-yellow-300" }),
        stackable: 5,
        value: 10000,
        effects: [{ type: 'INCREASE_LINH_CAN_PURITY', value: 1, linhCanType: 'KIM' }],
    },
    {
        id: 'consumable_bat_tu_than_moc_diep',
        name: 'Bất Tử Thần Mộc Diệp',
        description: 'Một chiếc lá từ cây thần mộc cổ đại, chứa đựng sinh mệnh lực vô tận. Có thể tinh luyện linh căn, tăng độ thuần khiết của Mộc Linh Căn.',
        type: 'consumable',
        icon: React.createElement(FaLeaf, { className: "text-emerald-300" }),
        stackable: 5,
        value: 10000,
        effects: [{ type: 'INCREASE_LINH_CAN_PURITY', value: 1, linhCanType: 'MOC' }],
    },
    // Thiên Giai
    {
        id: 'consumable_cuu_u_huyen_thuy_tinh',
        name: 'Cửu U Huyền Thủy Tinh',
        description: 'Kết tinh của nước huyền âm từ đáy vực Cửu U, ẩn chứa thủy nguyên lực tinh khiết nhất. Có thể tẩy rửa linh căn, tăng độ thuần khiết của Thủy Linh Căn.',
        type: 'consumable',
        icon: React.createElement(GiWaterDrop, { className: "text-blue-200" }),
        stackable: 5,
        value: 25000,
        effects: [{ type: 'INCREASE_LINH_CAN_PURITY', value: 1, linhCanType: 'THUY' }],
    },
    {
        id: 'consumable_phuong_hoang_niet_ban_hoa',
        name: 'Phượng Hoàng Niết Bàn Hoa',
        description: 'Đóa hoa sinh ra từ lửa Niết Bàn của Phượng Hoàng, chứa đựng hỏa diễm bản nguyên. Có thể tôi luyện linh căn, tăng độ thuần khiết của Hỏa Linh Căn.',
        type: 'consumable',
        icon: React.createElement(GiFire, { className: "text-red-400" }),
        stackable: 5,
        value: 25000,
        effects: [{ type: 'INCREASE_LINH_CAN_PURITY', value: 1, linhCanType: 'HOA' }],
    },
    {
        id: 'consumable_hon_don_tuc_nhuong',
        name: 'Hỗn Độn Tức Nhưỡng',
        description: 'Một nắm đất thần trong truyền thuyết, có khả năng tự sinh sôi, chứa đựng bản nguyên của đại địa. Có thể bồi bổ linh căn, tăng độ thuần khiết của Thổ Linh Căn.',
        type: 'consumable',
        icon: React.createElement(GiStoneSphere, { className: "text-orange-400" }),
        stackable: 5,
        value: 25000,
        effects: [{ type: 'INCREASE_LINH_CAN_PURITY', value: 1, linhCanType: 'THO' }],
    },
];