
import React from 'react';
import { LINH_CAN_DATA, LINH_CAN_ICONS } from '../../../data/linhcan';
import type { LinhCanType } from '../../../types/linhcan';
import { FaPlus } from 'react-icons/fa';

const BASE_ELEMENTS: LinhCanType[] = ['KIM', 'MOC', 'THUY', 'HOA', 'THO'];
const VARIANT_ELEMENTS: LinhCanType[] = ['BĂNG', 'LOI', 'PHONG', 'QUANG', 'AM'];

// These formulas must match the ones in usePlayerPersistence.ts
const VARIANT_FORMULAS: Record<string, [LinhCanType, LinhCanType]> = {
    'BĂNG': ['KIM', 'THUY'],
    'LOI': ['MOC', 'HOA'],
    'PHONG': ['KIM', 'MOC'],
    'QUANG': ['HOA', 'THO'],
    'AM': ['THUY', 'THO'],
};

const LinhCanCard: React.FC<{ linhCanType: LinhCanType }> = ({ linhCanType }) => {
    const data = LINH_CAN_DATA[linhCanType];
    const formula = VARIANT_FORMULAS[linhCanType as keyof typeof VARIANT_FORMULAS];

    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col h-full">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-black/30 rounded-lg text-5xl">
                    {data.icon}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-xl text-white">{data.name}</h3>
                </div>
            </div>
            <p className="text-gray-400 mt-3 text-sm italic flex-grow">{data.description}</p>
            {formula && (
                <div className="mt-4 pt-3 border-t border-gray-600/50">
                    <h4 className="text-gray-300 font-semibold text-sm mb-2">Công thức dung hợp:</h4>
                    <div className="flex items-center justify-center gap-2 bg-black/20 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{LINH_CAN_ICONS[formula[0]]}</span>
                            <span className="text-sm font-semibold">{LINH_CAN_DATA[formula[0]].name}</span>
                        </div>
                        <FaPlus className="text-gray-400"/>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{LINH_CAN_ICONS[formula[1]]}</span>
                            <span className="text-sm font-semibold">{LINH_CAN_DATA[formula[1]].name}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LinhCanWorldInfoTab: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">Ngũ Hành Linh Căn</h2>
                <p className="text-gray-400 mb-4 -mt-2 text-sm">Đây là năm loại linh căn cơ bản nhất, là nền tảng của vạn vật trong trời đất. Hầu hết các tu sĩ đều sở hữu một hoặc nhiều loại linh căn này.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {BASE_ELEMENTS.map(type => <LinhCanCard key={type} linhCanType={type} />)}
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-purple-300 mb-4 pb-2 border-b-2 border-purple-300/50">Dị Linh Căn (Biến Dị)</h2>
                <p className="text-gray-400 mb-4 -mt-2 text-sm">Khi một tu sĩ sở hữu hai linh căn Ngũ Hành đặc định, có một cơ duyên hiếm có để chúng dung hợp và sinh ra một Dị Linh Căn mới. Dị linh căn thường có sức mạnh đặc thù và độ thuần khiết cao hơn các linh căn gốc.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {VARIANT_ELEMENTS.map(type => <LinhCanCard key={type} linhCanType={type} />)}
                </div>
            </div>
        </div>
    );
};

export default LinhCanWorldInfoTab;
