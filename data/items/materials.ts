import React from 'react';
import type { Item } from '../../types/item';
import { GiCrystalGrowth, GiWaterDrop } from 'react-icons/gi';
import { FaBone } from 'react-icons/fa';

export const MATERIALS: Item[] = [
    {
        id: 'material_yeu_dan',
        name: 'Yêu Đan Luyện Khí',
        description: 'Nội đan của yêu thú cấp Luyện Khí, chứa đựng tinh hoa của yêu thú. Là vật đại bổ nhưng cũng ẩn chứa yêu khí cuồng bạo.',
        type: 'material',
        icon: React.createElement(GiCrystalGrowth, { className: "text-purple-400" }),
        stackable: 99,
        value: 50,
    },
    {
        id: 'material_monster_core_1',
        name: 'Yêu Đan Cấp 1',
        description: 'Nội đan của yêu thú cấp thấp, chứa đựng yêu khí và một ít tinh hoa thiên địa.',
        type: 'material',
        icon: React.createElement(GiCrystalGrowth, { className: "text-red-400" }),
        stackable: 99,
        value: 25,
    },
    {
        id: 'material_monster_bone_1',
        name: 'Yêu Thú Chi Cốt',
        description: 'Xương cốt của yêu thú, cứng rắn và có thể dùng làm vật liệu luyện khí hoặc luyện đan.',
        type: 'material',
        icon: React.createElement(FaBone, { className: "text-gray-200" }),
        stackable: 99,
        value: 10,
    },
    {
        id: 'material_monster_blood_1',
        name: 'Yêu Thú Tinh Huyết',
        description: 'Một giọt tinh huyết của yêu thú, chứa đựng một phần sức mạnh của nó.',
        type: 'material',
        icon: React.createElement(GiWaterDrop, { className: "text-red-600" }),
        stackable: 99,
        value: 15,
    },
];
