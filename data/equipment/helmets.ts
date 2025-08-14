import React from 'react';
import type { Item } from '../../types/item';
import { FaQuestion } from 'react-icons/fa';
import { GiStahlhelm, GiHornedHelm, GiCrown } from 'react-icons/gi';

export const HELMETS: Item[] = [
    // --- HOÀNG GIAI ---
    {
        id: 'armor_da_mao',
        name: 'Tân Thủ Bì Mão',
        description: 'Một chiếc mũ da đơn giản, khả năng phòng ngự có hạn nhưng vẫn tốt hơn là không có gì.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(FaQuestion, { className: 'text-yellow-700' }),
        slot: 'HEAD',
        tier: 'HOANG',
        value: 30,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 3 }
        ]
    },
    {
        id: 'helmet_thiet_khuy',
        name: 'Thiết Khôi',
        description: 'Mũ giáp bằng sắt, khá nặng nhưng cung cấp sự bảo vệ tốt cho phần đầu.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiStahlhelm, { className: 'text-gray-400' }),
        slot: 'HEAD',
        tier: 'HOANG',
        value: 60,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 5 },
            { targetStat: 'maxHp', modifier: 'ADDITIVE', value: 10 }
        ]
    },
    
    // --- HUYỀN GIAI ---
    {
        id: 'helmet_minh_tam_khuy',
        name: 'Minh Tâm Khôi',
        description: 'Mũ giáp được khắc các phù văn giúp người đội giữ vững tinh thần, tăng nhẹ Thần Thức.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiStahlhelm, { className: 'text-blue-400' }),
        slot: 'HEAD',
        tier: 'HUYEN',
        value: 400,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 12 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 8 }
        ]
    },

    // --- ĐỊA GIAI ---
    {
        id: 'helmet_ma_giac_khuy',
        name: 'Ma Giác Khôi',
        description: 'Chiếc mũ được chế tạo từ sừng của Ma Vương, ẩn chứa ma khí, tăng mạnh Lực Công và Thần Thức.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiHornedHelm, { className: 'text-purple-500' }),
        slot: 'HEAD',
        tier: 'DIA',
        value: 2800,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 25 },
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 15 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 15 }
        ]
    },
    
    // --- THIÊN GIAI ---
    {
        id: 'helmet_thien_de_quan',
        name: 'Thiên Đế Quan',
        description: 'Vương miện của Thiên Đế cổ xưa, người đội nó sẽ có được sự uy nghiêm và trí tuệ vô song.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiCrown, { className: 'text-yellow-400' }),
        slot: 'HEAD',
        tier: 'THIEN',
        value: 20000,
        bonuses: [
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', value: 0.1 }, // +10%
            { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', value: 30 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 30 }
        ]
    }
];