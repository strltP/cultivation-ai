
import React from 'react';
import type { Item } from '../../types/item';
import { GiBroadsword, GiBattleAxe, GiTatteredBanner, GiPaper, GiFlangedMace, GiFireBowl, GiSpikyWing, GiZeusSword } from 'react-icons/gi';

export const WEAPONS: Item[] = [
    // --- HOÀNG GIAI ---
    {
        id: 'weapon_thiet_kiem',
        name: 'Tân Thủ Thiết Kiếm',
        description: 'Một thanh kiếm sắt dành cho người mới, tuy bình thường nhưng vẫn đủ sắc bén để tự vệ.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiBroadsword, { className: 'text-gray-400' }),
        slot: 'WEAPON',
        weaponType: 'SWORD',
        tier: 'HOANG',
        value: 100,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 8 }
        ]
    },
    {
        id: 'weapon_thiet_thuong',
        name: 'Thiết Thương',
        description: 'Một cây trường thương bằng sắt, nặng và chắc, thích hợp cho các đòn đâm thẳng đầy uy lực.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiTatteredBanner, { className: 'text-gray-300' }),
        slot: 'WEAPON',
        weaponType: 'SPEAR',
        tier: 'HOANG',
        value: 120,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 10 },
            { targetStat: 'defensePower', modifier: 'ADDITIVE', value: 2 }
        ]
    },

    // --- HUYỀN GIAI ---
    {
        id: 'weapon_han_phong_dao',
        name: 'Hàn Phong Đao',
        description: 'Lưỡi đao tỏa ra hàn khí nhẹ, mỗi nhát chém đều khiến đối thủ cảm thấy lạnh thấu xương.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiBattleAxe, { className: 'text-cyan-400' }),
        slot: 'WEAPON',
        weaponType: 'BLADE',
        tier: 'HUYEN',
        value: 600,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 25 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 5 }
        ]
    },
    {
        id: 'weapon_bach_vu_phien',
        name: 'Bạch Vũ Phiến',
        description: 'Cây quạt làm từ lông vũ trắng muốt, trông thanh nhã nhưng khi vung lên lại tạo ra những luồng gió sắc như dao.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiPaper, { className: 'text-white' }),
        slot: 'WEAPON',
        weaponType: 'FAN',
        tier: 'HUYEN',
        value: 550,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 18 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 10 }
        ]
    },
    {
        id: 'weapon_liet_hoa_kiem',
        name: 'Liệt Hỏa Kiếm',
        description: 'Thân kiếm luôn rực cháy ngọn lửa hừng hực, có thể thiêu đốt kẻ địch.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiBroadsword, { className: 'text-red-500' }),
        slot: 'WEAPON',
        weaponType: 'SWORD',
        tier: 'HUYEN',
        value: 700,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 30 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 8 }
        ]
    },

    // --- ĐỊA GIAI ---
    {
        id: 'weapon_tu_dien_kiem',
        name: 'Tử Điện Kiếm',
        description: 'Thanh kiếm được luyện từ lôi tinh, thân kiếm lấp lánh tia điện màu tím, uy lực kinh người.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiZeusSword, { className: 'text-purple-400' }),
        slot: 'WEAPON',
        weaponType: 'SWORD',
        tier: 'DIA',
        value: 3500,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 80 },
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 20 },
            { targetStat: 'critRate', modifier: 'ADDITIVE', value: 0.05 } // 5% crit rate
        ]
    },
    {
        id: 'weapon_phong_van_phiến',
        name: 'Phong Vân Phiến',
        description: 'Chiếc quạt có khả năng hô phong hoán vũ, mỗi cái phẩy tay đều tạo ra bão tố.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiSpikyWing, { className: 'text-blue-300' }),
        slot: 'WEAPON',
        weaponType: 'FAN',
        tier: 'DIA',
        value: 3200,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'ADDITIVE', value: 65 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', value: 30 },
            { targetStat: 'speed', modifier: 'ADDITIVE', value: 5 }
        ]
    },
    
    // --- THIÊN GIAI ---
    {
        id: 'weapon_phan_thien_chung',
        name: 'Phần Thiên Chung',
        description: 'Pháp bảo thượng cổ, là một cái chuông lửa có thể trấn áp và thiêu đốt vạn vật. Uy lực vô song.',
        type: 'equipment',
        stackable: 1,
        icon: React.createElement(GiFireBowl, { className: 'text-amber-400' }),
        slot: 'WEAPON',
        tier: 'THIEN',
        value: 25000,
        bonuses: [
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', value: 0.2 }, // +20%
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', value: 50 },
            { targetStat: 'critDamage', modifier: 'ADDITIVE', value: 0.5 } // +50% crit damage
        ]
    },
];
