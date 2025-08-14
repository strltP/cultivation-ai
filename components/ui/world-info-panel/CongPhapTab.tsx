import React from 'react';
import { SKILL_TIER_INFO } from '../../../data/skills/skills';
import { ALL_CONG_PHAP } from '../../../data/skills/cong_phap';
import type { Skill, SkillEffect } from '../../../types/skill';
import { EFFECT_TYPE_NAMES } from '../../../types/skill';
import { FaBolt, FaBurn, FaHandPaper, FaHourglassHalf, FaPlusCircle } from 'react-icons/fa';
import { GiBroadsword } from 'react-icons/gi';
import { WEAPON_TYPE_NAMES } from '../../../types/equipment';

const EffectDisplay: React.FC<{ effect: SkillEffect }> = ({ effect }) => {
    let icon = null;
    let text = '';
    const effectName = EFFECT_TYPE_NAMES[effect.type];

    switch (effect.type) {
        case 'BURN':
            icon = <FaBurn className="text-orange-400" />;
            text = `Có ${effect.chance * 100}% cơ hội gây ${effectName} trong ${effect.duration} hiệp.`;
            break;
        case 'STUN':
            icon = <FaBolt className="text-yellow-300" />;
            text = `Có ${effect.chance * 100}% cơ hội gây ${effectName} trong ${effect.duration} hiệp.`;
            break;
        case 'SLOW':
            icon = <FaHandPaper className="text-blue-300" />;
            text = `Có ${effect.chance * 100}% cơ hội ${effectName} ${effect.value}% trong ${effect.duration} hiệp.`;
            break;
        case 'HEAL':
            icon = <FaPlusCircle className="text-green-400" />;
            text = `${effectName} ${effect.value} Sinh Lực.`;
            break;
        default:
            return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm text-gray-300">
            {icon}
            <span>{text}</span>
        </div>
    );
};

const SkillInfoCard: React.FC<{ skillDef: Skill }> = ({ skillDef }) => {
    const tierInfo = SKILL_TIER_INFO[skillDef.tier];
    const { damage, manaCost, effects } = skillDef;

    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col h-full">
            <div className="flex justify-between items-start gap-2">
                <h3 className={`font-bold text-lg ${tierInfo.color}`}>{skillDef.name}</h3>
                <span className={`text-sm font-semibold ${tierInfo.color} border px-2 py-0.5 rounded-full ${tierInfo.color.replace('text', 'border')}`}>{tierInfo.name}</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm italic whitespace-pre-wrap flex-grow">{skillDef.description}</p>
            
            <div className="mt-4 pt-3 border-t border-gray-700/50 space-y-2">
                {skillDef.weaponType && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-semibold flex items-center gap-2"><GiBroadsword /> Loại Vũ Khí:</span>
                        <span className="text-white font-bold">{WEAPON_TYPE_NAMES[skillDef.weaponType]}</span>
                    </div>
                )}
                {manaCost !== undefined && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-semibold">Tiêu hao Linh Lực:</span>
                        <span className="text-cyan-300 font-bold">{manaCost}</span>
                    </div>
                )}
                {damage && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-semibold">Sát thương cơ bản:</span>
                        <span className="text-red-400 font-bold">{damage.baseValue}</span>
                    </div>
                )}
                {effects && effects.length > 0 && (
                    <div className="space-y-1 pt-1">
                        <h4 className="text-gray-300 font-semibold text-sm">Hiệu ứng đặc biệt:</h4>
                        {effects.map((eff, index) => <EffectDisplay key={index} effect={eff} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

const CongPhapTab: React.FC = () => {
    const congPhapList = ALL_CONG_PHAP;

    const groupedByTier = congPhapList.reduce((acc, skill) => {
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

export default CongPhapTab;
