
import React from 'react';
import type { Item } from '../../types/item';
import { GiMagicPortal } from 'react-icons/gi';

export const CONSUMABLES: Item[] = [
    {
        id: 'consumable_tu_khi_dan',
        name: 'Tụ Khí Đan',
        description: 'Đan dược cấp thấp, có thể giúp tu sĩ Luyện Khí Kỳ nhanh chóng hồi phục và tích lũy chân khí.',
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
];
