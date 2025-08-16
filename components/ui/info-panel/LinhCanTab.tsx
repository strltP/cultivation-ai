
import React from 'react';
import type { PlayerState } from '../../../types/character';
import { LINH_CAN_DATA } from '../../../data/linhcan';
import { getLinhCanTierInfo } from '../../../services/cultivationService';

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
  const tierInfo = getLinhCanTierInfo(linhCan);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-yellow-200 mb-2 pb-2 border-b-2 border-yellow-200/50">
        Tiên Thiên Linh Căn
      </h2>
      <p className={`text-center text-xl font-semibold ${tierInfo.color} mb-4`}>{tierInfo.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {linhCan.map(lc => {
          const lcData = LINH_CAN_DATA[lc.type];
          return (
            <div key={lc.type} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                <div>
                    <div className="flex gap-4">
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
                        </div>
                    </div>
                    <p className="text-gray-400 mt-3 text-sm italic">{lcData.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-600/50">
                    <h4 className="font-semibold text-gray-200 mb-2">Hiệu Quả Linh Căn:</h4>
                    <ul className="space-y-1 text-green-300 text-sm">
                        {lcData.bonuses.map((bonus, index) => {
                            const key = bonus.targetStat || bonus.targetAttribute;
                            if (!key) return null;

                            const name = ATTRIBUTE_NAMES[key] || key;
                            const totalValue = bonus.valuePerPurity * lc.purity;
                            const isMultiplier = bonus.modifier === 'MULTIPLIER';
                            const displayValue = isMultiplier ? `${(totalValue * 100).toFixed(2)}%` : `${Math.round(totalValue)}`;
                            
                            return (
                                <li key={index} className="flex justify-between">
                                    <span>{name}:</span>
                                    <span className="font-bold text-white">+{displayValue}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LinhCanTab;
