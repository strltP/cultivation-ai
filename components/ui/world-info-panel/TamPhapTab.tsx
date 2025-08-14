

import React from 'react';
import { SKILL_TIER_INFO } from '../../../data/skills/skills';
import { ALL_TAM_PHAP } from '../../../data/skills/tam_phap';
import type { Skill, SkillBonus } from '../../../types/skill';
import { FaArrowUp, FaPlus } from 'react-icons/fa';

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

const BonusDisplay: React.FC<{ bonus: SkillBonus }> = ({ bonus }) => {
    const targetKey = bonus.targetStat || bonus.targetAttribute;
    if (!targetKey) return null;

    const name = ATTRIBUTE_NAMES[targetKey] || targetKey;
    const isMultiplier = bonus.modifier === 'MULTIPLIER';
    const value = isMultiplier ? `${bonus.valuePerLevel * 100}%` : `+${bonus.valuePerLevel}`;
    
    return (
        <div className="flex items-center gap-2 text-sm text-gray-300">
            {isMultiplier ? <FaArrowUp className="text-green-400" /> : <FaPlus className="text-green-400" />}
            <span>Tăng {name}: <span className="font-bold text-white">{value}</span> mỗi tầng</span>
        </div>
    );
};

const SkillInfoCard: React.FC<{ skillDef: Skill }> = ({ skillDef }) => {
    const tierInfo = SKILL_TIER_INFO[skillDef.tier];
    
    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col h-full">
            <div className="flex justify-between items-start gap-2">
                <h3 className={`font-bold text-lg ${tierInfo.color}`}>{skillDef.name}</h3>
                <span className={`text-sm font-semibold ${tierInfo.color} border px-2 py-0.5 rounded-full ${tierInfo.color.replace('text', 'border')}`}>{tierInfo.name}</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm italic whitespace-pre-wrap flex-grow">{skillDef.description}</p>
            
            <div className="mt-4 pt-3 border-t border-gray-700/50 space-y-2">
                {skillDef.bonuses && skillDef.bonuses.length > 0 && (
                    <div className="space-y-1">
                        <h4 className="text-gray-300 font-semibold text-sm">Thuộc tính gia tăng:</h4>
                        {skillDef.bonuses.map((bonus, index) => <BonusDisplay key={index} bonus={bonus} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

const TamPhapTab: React.FC = () => {
    const tamPhapList = ALL_TAM_PHAP;

    const groupedByTier = tamPhapList.reduce((acc, skill) => {
        const tier = skill.tier;
        if (!acc[tier]) {
            acc[tier] = [];
        }
        acc[tier].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    const tierOrder: (keyof typeof SKILL_TIER_INFO)[] = ['HOANG', 'HUYEN', 'DIA', 'THIEN'];

    return (
        <div className="space-y-8">
            {tierOrder.map(tier => {
                if (!groupedByTier[tier] || groupedByTier[tier].length === 0) return null;
                const tierInfo = SKILL_TIER_INFO[tier];
                return (
                    <div key={tier}>
                        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b-2 ${tierInfo.color.replace('text-', 'border-')}/50 ${tierInfo.color}`}>{tierInfo.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {groupedByTier[tier].map(skill => (
                                <SkillInfoCard key={skill.id} skillDef={skill} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TamPhapTab;