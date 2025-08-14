
import React from 'react';
import type { Item } from '../../types/item';
import { GiCrystalEarrings, GiDiamondRing, GiGemPendant, GiStoneTablet } from 'react-icons/gi';

export const ACCESSORIES: Item[] = [
    // --- HOÀNG GIAI ---
    {
        id: 'accessory_binh_an_phu',
        name: 'Bình An Phù',
        description: 'Một lá bùa cầu bình an, mang theo bên người có thể cảm thấy an tâm hơn một chút.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiStoneTablet, { className: 'text-yellow-600' }),
        slot: 'ACCESSORY',
        tier: 'HOANG',
        value: 100,
        bonuses: [
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 20 }
        ]
    },
    
    // --- HUYỀN GIAI ---
    {
        id: 'accessory_tu_linh_boi',
        name: 'Tụ Linh Bội',
        description: 'Miếng ngọc bội có khả năng thu thập linh khí xung quanh, giúp tăng cường linh lực cho người đeo.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiCrystalEarrings, { className: 'text-green-400' }),
        slot: 'ACCESSORY',
        tier: 'HUYEN',
        value: 800,
        bonuses: [
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 8 },
            { targetStat: 'maxMana', modifier: 'ADDITIVE', value: 50 }
        ]
    },

    // --- ĐỊA GIAI ---
    {
        id: 'accessory_ngưng_than_nhan',
        name: 'Ngưng Thần Giới',
        description: 'Chiếc nhẫn giúp ngưng tụ thần thức, làm cho các đòn tấn công trở nên hiểm hóc hơn.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiDiamondRing, { className: 'text-indigo-400' }),
        slot: 'ACCESSORY',
        tier: 'DIA',
        value: 4000,
        bonuses: [
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 20 },
            { targetStat: 'critRate', modifier: 'ADDITIVE', value: 0.08 } // +8% crit rate
        ]
    },

    // --- THIÊN GIAI ---
    {
        id: 'accessory_hon_don_chi_tam',
        name: 'Hỗn Độn Chi Tâm',
        description: 'Trái tim của một sinh vật Hỗn Độn, chứa đựng quy tắc của đại đạo. Người đeo nó có thể lĩnh ngộ được sức mạnh vượt ngoài lẽ thường.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiGemPendant, { className: 'text-gray-200' }),
        slot: 'ACCESSORY',
        tier: 'THIEN',
        value: 30000,
        bonuses: [
            { targetAttribute: 'canCot', modifier: 'ADDITIVE', value: 25 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 25 },
            { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 25 },
        ]
    }
];