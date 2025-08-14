import React from 'react';
import type { PlayerState } from '../../../types/character';
import { LINH_CAN_DATA } from '../../../data/linhcan';

interface LinhCanTabProps {
  playerState: PlayerState;
}

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


const LinhCanTab: React.FC<LinhCanTabProps> = ({ playerState }) => {
  const { linhCan } = playerState;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">
        Tiên Thiên Linh Căn
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {linhCan.map(lc => {
          const lcData = LINH_CAN_DATA[lc.type];
          return (
            <div key={lc.type} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex gap-4">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-black/30 rounded-lg text-5xl">
                {lcData.icon}
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-xl text-white">{lcData.name}</h3>
                <div className="flex justify-between items-baseline my-1">
                    <span className="text-sm text-gray-400">Độ Thuần Khiết:</span>
                    <span className="text-lg font-bold text-yellow-300">{lc.purity}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full" style={{ width: `${lc.purity}%` }}></div>
                </div>
                <p className="text-gray-400 mt-2 text-sm italic">{lcData.description}</p>
              </div>
            </div>
          );
        })}
      </div>
       <div className="mt-6 p-4 bg-black/20 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-200 mb-3">Tổng Hợp Hiệu Quả</h3>
            <ul className="space-y-2 text-green-300">
                {
                    Object.values(linhCan.reduce((acc, lc) => {
                        const lcData = LINH_CAN_DATA[lc.type];
                        lcData.bonuses.forEach(bonus => {
                            const key = bonus.targetStat || bonus.targetAttribute;
                            if (!key) return;
                            if (!acc[key]) {
                                acc[key] = {
                                    name: ATTRIBUTE_NAMES[key] || key,
                                    totalValue: 0,
                                    isMultiplier: bonus.modifier === 'MULTIPLIER'
                                };
                            }
                            acc[key].totalValue += bonus.valuePerPurity * lc.purity;
                        });
                        return acc;
                    }, {} as Record<string, {name: string, totalValue: number, isMultiplier: boolean}>))
                    .map(b => (
                        <li key={b.name} className="text-base">
                            <span className="font-semibold">{b.name}:</span>
                            <span className="font-bold text-white ml-2">
                                +{b.isMultiplier ? `${(b.totalValue * 100).toFixed(2)}%` : Math.round(b.totalValue)}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    </div>
  );
};

export default LinhCanTab;