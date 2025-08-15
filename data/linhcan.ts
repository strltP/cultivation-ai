
import React from 'react';
import type { LinhCanType } from '../types/linhcan';
import type { CharacterAttributes, CombatStats } from '../types/stats';
import { GiMetalBar, GiSprout, GiWaterDrop, GiFire, GiStoneSphere, GiWindSlap, GiLightningTrio, GiSun } from 'react-icons/gi';
import { FaMoon } from 'react-icons/fa';

interface LinhCanBonus {
    targetStat?: keyof CombatStats;
    targetAttribute?: keyof CharacterAttributes;
    modifier: 'ADDITIVE' | 'MULTIPLIER';
    valuePerPurity: number; // e.g., 0.1 HP per purity point
}

interface LinhCanDefinition {
    name: string;
    description: string;
    icon: React.ReactNode;
    bonuses: LinhCanBonus[];
}

export const LINH_CAN_ICONS: Record<LinhCanType, React.ReactNode> = {
    KIM: React.createElement(GiMetalBar),
    MOC: React.createElement(GiSprout),
    THUY: React.createElement(GiWaterDrop),
    HOA: React.createElement(GiFire),
    THO: React.createElement(GiStoneSphere),
    PHONG: React.createElement(GiWindSlap),
    LOI: React.createElement(GiLightningTrio),
    QUANG: React.createElement(GiSun),
    AM: React.createElement(FaMoon),
};

export const LINH_CAN_DATA: Record<LinhCanType, LinhCanDefinition> = {
    KIM: {
        name: 'Kim Linh Căn',
        description: 'Tăng cường sự sắc bén và vững chắc. Chủ về tấn công và phòng ngự vật lý.',
        icon: React.createElement(GiMetalBar, { className: "text-gray-300" }),
        bonuses: [
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', valuePerPurity: 0.0015 }, // +15% at 100 purity
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', valuePerPurity: 0.0015 }, // +15% at 100 purity
        ]
    },
    MOC: {
        name: 'Mộc Linh Căn',
        description: 'Tăng cường sinh mệnh lực và khả năng hồi phục. Chủ về sinh tồn và trị liệu.',
        icon: React.createElement(GiSprout, { className: "text-green-500" }),
        bonuses: [
            { targetStat: 'maxHp', modifier: 'MULTIPLIER', valuePerPurity: 0.002 }, // +20% at 100 purity
            { targetAttribute: 'canCot', modifier: 'ADDITIVE', valuePerPurity: 0.1 },
        ]
    },
    THUY: {
        name: 'Thủy Linh Căn',
        description: 'Tăng cường sự linh hoạt và trữ lượng linh lực. Chủ về biến hóa và khống chế.',
        icon: React.createElement(GiWaterDrop, { className: "text-blue-400" }),
        bonuses: [
            { targetStat: 'maxMana', modifier: 'MULTIPLIER', valuePerPurity: 0.0015 }, // +15% at 100 purity
            { targetStat: 'evasionRate', modifier: 'MULTIPLIER', valuePerPurity: 0.0005 }, // 5% at 100 purity
        ]
    },
    HOA: {
        name: 'Hỏa Linh Căn',
        description: 'Tăng cường sức mạnh bùng nổ và pháp thuật. Chủ về tấn công hủy diệt.',
        icon: React.createElement(GiFire, { className: "text-red-500" }),
        bonuses: [
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', valuePerPurity: 0.002 }, // +20% at 100 purity
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', valuePerPurity: 0.15 },
        ]
    },
    THO: {
        name: 'Thổ Linh Căn',
        description: 'Tăng cường sự vững chãi và sức bền. Chủ về phòng ngự và sức chịu đựng.',
        icon: React.createElement(GiStoneSphere, { className: "text-yellow-600" }),
        bonuses: [
            { targetStat: 'maxHp', modifier: 'MULTIPLIER', valuePerPurity: 0.0015 },      // +15% at 100 purity
            { targetStat: 'defensePower', modifier: 'MULTIPLIER', valuePerPurity: 0.0025 }, // +25% at 100 purity
        ]
    },
    PHONG: {
        name: 'Phong Linh Căn',
        description: 'Tăng cường tốc độ và sự nhanh nhẹn. Chủ về thân pháp và né tránh.',
        icon: React.createElement(GiWindSlap, { className: "text-teal-300" }),
        bonuses: [
            { targetStat: 'speed', modifier: 'ADDITIVE', valuePerPurity: 0.2 },
            { targetAttribute: 'thanPhap', modifier: 'ADDITIVE', valuePerPurity: 0.15 },
        ]
    },
    LOI: {
        name: 'Lôi Linh Căn',
        description: 'Tăng cường khả năng tấn công bất ngờ và chí mạng. Chủ về tốc độ và sức công phá.',
        icon: React.createElement(GiLightningTrio, { className: "text-yellow-300" }),
        bonuses: [
            { targetStat: 'attackPower', modifier: 'MULTIPLIER', valuePerPurity: 0.0005 }, // +5% at 100 purity
            { targetStat: 'critRate', modifier: 'MULTIPLIER', valuePerPurity: 0.001 }, // 10% at 100 purity
        ]
    },
    QUANG: {
        name: 'Quang Linh Căn',
        description: 'Tăng cường khả năng hồi phục và nhận thức. Chủ về hỗ trợ và nhận biết.',
        icon: React.createElement(GiSun, { className: "text-yellow-200" }),
        bonuses: [
            { targetStat: 'maxHp', modifier: 'MULTIPLIER', valuePerPurity: 0.0005 }, // +5% at 100 purity
            { targetAttribute: 'ngoTinh', modifier: 'ADDITIVE', valuePerPurity: 0.15 },
        ]
    },
    AM: {
        name: 'Ám Linh Căn',
        description: 'Tăng cường sự bí ẩn và sát thương chí mạng. Chủ về ám sát và các hiệu ứng lạ.',
        icon: React.createElement(FaMoon, { className: "text-indigo-400" }),
        bonuses: [
            { targetAttribute: 'thanThuc', modifier: 'ADDITIVE', valuePerPurity: 0.15 },
            { targetStat: 'critDamage', modifier: 'ADDITIVE', valuePerPurity: 0.005 }, // 50% crit damage at 100 purity
        ]
    }
};
