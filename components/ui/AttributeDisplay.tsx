

import React from 'react';
import type { CharacterAttributes } from '../../types/stats';
import { FaBone, FaEye, FaDice } from 'react-icons/fa';
import { GiRunningShoe, GiInspiration, GiHeartShield } from 'react-icons/gi';

interface AttributeDisplayProps {
    attributes: CharacterAttributes;
}

const AttributeDisplay: React.FC<AttributeDisplayProps> = ({ attributes }) => {
    const attributeList = [
        { name: 'Căn Cốt', value: attributes.canCot, icon: <FaBone title="Căn Cốt" /> },
        { name: 'Thân Pháp', value: attributes.thanPhap, icon: <GiRunningShoe title="Thân Pháp" /> },
        { name: 'Thần Thức', value: attributes.thanThuc, icon: <FaEye title="Thần Thức" /> },
        { name: 'Ngộ Tính', value: attributes.ngoTinh, icon: <GiInspiration title="Ngộ Tính" /> },
        { name: 'Tâm Cảnh', value: attributes.tamCanh, icon: <GiHeartShield title="Tâm Cảnh" /> },
        { name: 'Cơ Duyên', value: attributes.coDuyen, icon: <FaDice title="Cơ Duyên" /> },
    ];

    return (
        <div className="grid grid-cols-3 gap-x-6 gap-y-3 pt-2 border-t border-blue-400/20 mt-3">
            {attributeList.map(attr => (
                 <div key={attr.name} className="flex items-center gap-x-2 text-gray-300" title={`${attr.name}: ${attr.value}`}>
                    <div className="text-blue-300 text-lg">{attr.icon}</div>
                    <span className="font-semibold text-sm">{attr.value}</span>
                </div>
            ))}
        </div>
    );
};

export default AttributeDisplay;