import React from 'react';
import type { Item } from '../../types/item';
import { GiLeatherArmor, GiShoulderArmor, GiArmorUpgrade, GiScaleMail } from 'react-icons/gi';

export const ARMORS: Item[] = [
    // --- HOÀNG GIAI ---
    {
        id: 'armor_da_giap',
        name: 'Tân Thủ Bì Giáp',
        description: 'Áo giáp làm từ da thú, giúp chống lại những đòn tấn công vật lý thông thường.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiLeatherArmor, { className: 'text-yellow-800' }),
        slot: 'ARMOR',
        tier: 'HOANG',
        value: 50,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 5 },
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 10 }
        ]
    },
    {
        id: 'armor_thiet_giap',
        name: 'Thiết Giáp',
        description: 'Áo giáp sắt nặng nề, khả năng phòng ngự tốt nhưng ảnh hưởng đến tốc độ.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiShoulderArmor, { className: 'text-gray-500' }),
        slot: 'ARMOR',
        tier: 'HOANG',
        value: 80,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 8 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: -2 }
        ]
    },

    // --- HUYỀN GIAI ---
    {
        id: 'armor_huyen_thiet_giap',
        name: 'Huyền Thiết Giáp',
        description: 'Áo giáp được rèn từ Huyền Thiết, cứng rắn và bền bỉ, là trang bị phòng ngự tuyệt vời ở giai đoạn đầu.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiArmorUpgrade, { className: 'text-slate-400' }),
        slot: 'ARMOR',
        tier: 'HUYEN',
        value: 500,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 20 },
            { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 10 }
        ]
    },

    // --- ĐỊA GIAI ---
    {
        id: 'armor_kim_ti_giap',
        name: 'Kim Ti Giáp',
        description: 'Áo giáp được dệt từ tơ của Kim Tằm ngàn năm, vừa nhẹ nhàng vừa dẻo dai, đao thương bất nhập.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiArmorUpgrade, { className: 'text-yellow-500' }),
        slot: 'ARMOR',
        tier: 'DIA',
        value: 3000,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 45 },
            { targetStat: 'speed', modifier: 'ADDITIVE', value: 10 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 15 }
        ]
    },
    
    // --- THIÊN GIAI ---
    {
        id: 'armor_long_than_giap',
        name: 'Long Thần Giáp',
        description: 'Giáp được làm từ vảy của Chân Long, có khả năng tự phục hồi và chống lại mọi loại pháp thuật.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiScaleMail, { className: 'text-green-500' }),
        slot: 'ARMOR',
        tier: 'THIEN',
        value: 22000,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', value: 0.25 }, // +25%
            { targetAttribute: 'canCot', modifier: 'MULTIPLIER', value: 0.15 }, // +15%
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 500 }
        ]
    }
];