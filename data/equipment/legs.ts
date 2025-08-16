import React from 'react';
import type { Item } from '../../types/item';
import { GiLegArmor, GiBootStomp } from 'react-icons/gi';

export const LEGS: Item[] = [
    // --- HOÀNG GIAI ---
    {
        id: 'armor_da_quan',
        name: 'Tân Thủ Bì Quần',
        description: 'Quần da chắc chắn, giúp bảo vệ phần dưới cơ thể.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiLegArmor, { className: 'text-yellow-700' }),
        slot: 'LEGS',
        tier: 'HOANG',
        value: 20,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 2 }
        ]
    },
    {
        id: 'legs_thiet_ha_giap',
        name: 'Thiết Hạ Giáp',
        description: 'Giáp chân bằng sắt, tăng cường phòng ngự cho đôi chân.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiLegArmor, { className: 'text-gray-400' }),
        slot: 'LEGS',
        tier: 'HOANG',
        value: 40,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 4 }
        ]
    },

    // --- HUYỀN GIAI ---
    {
        id: 'legs_truy_phong_hai',
        name: 'Truy Phong Hài',
        description: 'Đôi giày được yểm bùa chú, giúp người mang có thân pháp nhanh nhẹn như gió.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiBootStomp, { className: 'text-blue-300' }),
        slot: 'LEGS',
        tier: 'HUYEN',
        value: 350,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 8 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 12 }
        ]
    },

    // --- ĐỊA GIAI ---
    {
        id: 'legs_dat_thien_quan',
        name: 'Đạp Thiên Quần',
        description: 'Chiếc quần được dệt từ lông vũ của Thần Điểu, giúp người mặc đi mây về gió.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiLegArmor, { className: 'text-white' }),
        slot: 'LEGS',
        tier: 'DIA',
        value: 2500,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 20 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 25 },
            { targetStat: 'speed', modifier: 'ADDITIVE', value: 15 }
        ]
    },
    
    // --- THIÊN GIAI ---
    {
        id: 'legs_bat_hu_chien_ngo',
        name: 'Bất Hủ Chiến Ngoa',
        description: 'Đôi giày chiến của một vị thần cổ đại, tương truyền có thể đạp nát cả tinh thần.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiBootStomp, { className: 'text-amber-500' }),
        slot: 'LEGS',
        tier: 'THIEN',
        value: 18000,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', value: 0.1 }, // +10%
            { targetAttribute: 'thanPhap', modifier: 'MULTIPLIER', value: 0.15 }, // +15%
            { targetStat: 'speed', modifier: 'ADDITIVE', value: 20 }
        ]
    }
];