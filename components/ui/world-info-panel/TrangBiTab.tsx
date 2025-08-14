

import React from 'react';
import { ALL_EQUIPMENT } from '../../../data/equipment';
import type { Item } from '../../../types/item';
import type { EquipmentSlot } from '../../../types/equipment';
import { EQUIPMENT_SLOT_NAMES } from '../../../types/equipment';
import { SKILL_TIER_INFO } from '../../../data/skills/skills';

const ATTRIBUTE_NAMES: Record<string, string> = {
    canCot: 'Căn Cốt',
    thanPhap: 'Thân Pháp',
    thanThuc: 'Thần Thức',
    ngoTinh: 'Ngộ Tính',
    maxHp: 'Sinh Lực Tối đa',
    maxQi: 'Chân Khí Tối đa',
    maxMana: 'Linh Lực Tối đa',
    attackPower: 'Lực Công',
    defensePower: 'Lực Thủ',
    speed: 'Tốc Độ',
    critRate: 'Tỉ lệ Bạo kích',
    critDamage: 'ST Bạo kích',
    evasionRate: 'Tỉ lệ Né tránh',
};

const EquipmentInfoCard: React.FC<{ itemDef: Item }> = ({ itemDef }) => {
    if (itemDef.type !== 'equipment' || !itemDef.tier) return null;
    const tierInfo = SKILL_TIER_INFO[itemDef.tier];
    
    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex gap-4 h-full">
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-black/30 rounded-lg text-4xl">
                {itemDef.icon}
            </div>
            <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-lg ${tierInfo.color}`}>{itemDef.name}</h3>
                    <span className={`text-sm font-semibold ${tierInfo.color} border px-2 py-0.5 rounded-full ${tierInfo.color.replace('text-', 'border-')}`}>{tierInfo.name}</span>
                </div>
                <p className="text-gray-400 mt-1 text-sm italic flex-grow">{itemDef.description}</p>
                 <div className="mt-2 pt-2 border-t border-gray-700/50">
                    <h4 className="text-gray-300 font-semibold text-sm mb-1">Thuộc tính:</h4>
                     <ul className="space-y-1 text-sm">
                        {itemDef.bonuses?.map((bonus, i) => {
                            const targetKey = bonus.targetStat || bonus.targetAttribute;
                            if (!targetKey) return null;
                            const name = ATTRIBUTE_NAMES[targetKey] || targetKey;
                            const valueText = bonus.modifier === 'ADDITIVE' ? `+${bonus.value}` : `+${bonus.value * 100}%`;
                            return (
                                <li key={i} className="text-green-300">
                                    {name}: {valueText}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const TrangBiTab: React.FC = () => {
    const groupedItems = ALL_EQUIPMENT.reduce((acc, item) => {
        const slot = item.slot;
        if (!slot) return acc;
        if (!acc[slot]) {
            acc[slot] = [];
        }
        acc[slot].push(item);
        return acc;
    }, {} as Record<EquipmentSlot, Item[]>);

    const slotOrder: EquipmentSlot[] = ['WEAPON', 'HEAD', 'ARMOR', 'LEGS', 'ACCESSORY'];

    return (
        <div className="space-y-8">
            {slotOrder.map(slot => {
                if (!groupedItems[slot] || groupedItems[slot].length === 0) return null;
                
                return (
                    <div key={slot}>
                        <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">
                            {EQUIPMENT_SLOT_NAMES[slot]}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {groupedItems[slot].map(item => (
                                <EquipmentInfoCard key={item.id} itemDef={item} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TrangBiTab;