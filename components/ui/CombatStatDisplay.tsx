

import React from 'react';
import type { CombatStats } from '../../types/stats';
import { GiCrossedSwords, GiShield, GiRunningShoe, GiTargetShot, GiWhirlwind } from 'react-icons/gi';

interface CombatStatDisplayProps {
    stats: CombatStats;
}

const CombatStatDisplay: React.FC<CombatStatDisplayProps> = ({ stats }) => {
    const statList = [
        { name: 'Lực Công', value: stats.attackPower, icon: <GiCrossedSwords title="Lực Công" /> },
        { name: 'Lực Thủ', value: stats.defensePower, icon: <GiShield title="Lực Thủ" /> },
        { name: 'Tốc Độ', value: stats.speed, icon: <GiRunningShoe title="Tốc Độ" /> },
        { name: 'Bạo Kích', value: `${(stats.critRate * 100).toFixed(0)}%`, icon: <GiTargetShot title="Tỉ Lệ Bạo Kích" /> },
        { name: 'Né Tránh', value: `${(stats.evasionRate * 100).toFixed(0)}%`, icon: <GiWhirlwind title="Tỉ Lệ Né Tránh" /> },
    ];

    return (
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 pt-2 border-t border-blue-400/20 mt-2">
            {statList.map(stat => (
                 <div key={stat.name} className="flex items-center gap-x-2 text-gray-300" title={`${stat.name}: ${stat.value}`}>
                    <div className="text-yellow-300 text-lg">{stat.icon}</div>
                    <span className="font-semibold text-sm">{stat.value}</span>
                </div>
            ))}
        </div>
    );
};

export default CombatStatDisplay;