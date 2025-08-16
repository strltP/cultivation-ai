
import React from 'react';
import type { PlayerState } from '../../../types/character';
import type { Skill as SkillDef } from '../../../types/skill';
import { ALL_SKILLS, SKILL_TIER_INFO } from '../../../data/skills/skills';
import { FaBookDead, FaBook, FaPlus, FaBolt, FaExclamationCircle } from 'react-icons/fa';
import { GiBrain, GiMuscleUp, GiCrossedSwords, GiBroadsword } from 'react-icons/gi';
import { WEAPON_TYPE_NAMES } from '../../../types/equipment';
import { EFFECT_TYPE_NAMES } from '../../../types/skill';

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
};

const SkillCard: React.FC<{ playerState: PlayerState; skillDef: SkillDef; currentLevel: number; onLevelUp: () => void }> = ({ playerState, skillDef, currentLevel, onLevelUp }) => {
    const tierInfo = SKILL_TIER_INFO[skillDef.tier];
    const isMaxLevel = currentLevel >= skillDef.maxLevel;
    const cost = skillDef.enlightenmentBaseCost + currentLevel * skillDef.enlightenmentCostPerLevel;
    const canAfford = playerState.camNgo >= cost;


    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-white">{skillDef.name}</h3>
                    <span className={`text-sm font-semibold ${tierInfo.color} border px-2 py-0.5 rounded-full ${tierInfo.color.replace('text-', 'border-')}`}>{tierInfo.name}</span>
                </div>
                <p className="text-gray-400 mt-2 text-sm italic whitespace-pre-wrap">{skillDef.description}</p>
                
                 {/* Details Section */}
                <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-1 text-sm">
                    {skillDef.weaponType && (
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-gray-400"><GiBroadsword className="text-gray-400" /> Yêu Cầu:</span>
                            <span className="font-semibold text-white">{WEAPON_TYPE_NAMES[skillDef.weaponType]}</span>
                        </div>
                    )}
                    {skillDef.type === 'CONG_PHAP' && (
                        <>
                            {skillDef.manaCost !== undefined && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-gray-400"><FaBolt className="text-cyan-400" /> Linh Lực:</span>
                                    <span className="font-semibold text-cyan-300">{skillDef.manaCost + (skillDef.manaCostPerLevel || 0) * (currentLevel - 1)}</span>
                                </div>
                            )}
                            {skillDef.damage && (() => {
                                const baseDmg = skillDef.damage.baseValue + skillDef.damage.valuePerLevel * (currentLevel - 1);
                                const attackPowerDmg = playerState.stats.attackPower * (skillDef.damage.attackPowerFactor || 0);
                                const scalingDmg = skillDef.damage.scalingAttribute ? playerState.attributes[skillDef.damage.scalingAttribute] * (skillDef.damage.scalingFactor || 0) : 0;
                                const totalDmg = Math.round(baseDmg + attackPowerDmg + scalingDmg);
                                const titleText = `Cơ bản: ${Math.round(baseDmg)}\nLực Công: ${Math.round(attackPowerDmg)}\nThuộc tính: ${Math.round(scalingDmg)}`;
                                return (
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-gray-400"><GiCrossedSwords className="text-red-400" /> Sát Thương:</span>
                                        <span className="font-semibold text-red-400" title={titleText}>
                                            {totalDmg}
                                        </span>
                                    </div>
                                );
                            })()}
                            {skillDef.effects?.map((effect, index) => {
                                let text = `${EFFECT_TYPE_NAMES[effect.type]} (${effect.chance * 100}%)`;
                                if(effect.duration) text += `, ${effect.duration} hiệp`;
                                return (
                                    <div key={index} className="flex items-center justify-between text-yellow-400/90">
                                        <span className="flex items-center gap-2 text-gray-400"><FaExclamationCircle /> Hiệu ứng:</span>
                                        <span>{text}</span>
                                    </div>
                                )
                            })}
                        </>
                    )}

                    {skillDef.type === 'TAM_PHAP' && skillDef.bonuses.map((bonus, index) => {
                        const targetKey = bonus.targetStat || bonus.targetAttribute;
                        if (!targetKey) return null;
                        const name = ATTRIBUTE_NAMES[targetKey] || targetKey;
                        const value = bonus.valuePerLevel * currentLevel;
                        const isMultiplier = bonus.modifier === 'MULTIPLIER';
                        const displayValue = isMultiplier ? `${(value * 100).toFixed(1)}%` : `${Math.round(value)}`;

                        return (
                             <div key={index} className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-gray-400"><FaPlus className="text-green-400" />{name}:</span>
                                <span className="font-semibold text-green-300">+{displayValue}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-cyan-300">
                    Tầng: <span className="text-xl text-white">{currentLevel}</span> / {skillDef.maxLevel}
                </div>
                <button 
                    onClick={onLevelUp}
                    disabled={isMaxLevel || !canAfford}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-yellow-900 font-bold py-1.5 px-4 rounded-lg shadow-md hover:scale-105 transition-transform disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    <GiMuscleUp />
                    {isMaxLevel ? (
                        <span>Tối đa</span>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <span>Luyện</span>
                            <span className="flex items-center gap-1 text-xs">({cost} <GiBrain/>)</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

interface SkillsTabProps {
    playerState: PlayerState;
    onLevelUpSkill: (skillId: string) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ playerState, onLevelUpSkill }) => {
    const { learnedSkills } = playerState;

    const getSkillDetails = (skillId: string) => ALL_SKILLS.find(s => s.id === skillId);

    const congPhapList = learnedSkills
        .map(ls => ({ learned: ls, def: getSkillDetails(ls.skillId) }))
        .filter(item => item.def?.type === 'CONG_PHAP');
    
    const tamPhapList = learnedSkills
        .map(ls => ({ learned: ls, def: getSkillDetails(ls.skillId) }))
        .filter(item => item.def?.type === 'TAM_PHAP');

    return (
        <div className="space-y-6">
            <div>
                <h3 className="flex items-center gap-3 text-2xl font-semibold text-red-400 mb-3"><FaBookDead /> Công Pháp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {congPhapList.length > 0 ? congPhapList.map(({ learned, def }) => 
                        def ? <SkillCard key={def.id} playerState={playerState} skillDef={def} currentLevel={learned.currentLevel} onLevelUp={() => onLevelUpSkill(def.id)} /> : null
                    ) : <p className="text-gray-500 italic col-span-full">Chưa học được công pháp nào.</p>}
                </div>
            </div>

            <div>
                <h3 className="flex items-center gap-3 text-2xl font-semibold text-blue-400 mb-3"><FaBook /> Tâm Pháp</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tamPhapList.length > 0 ? tamPhapList.map(({ learned, def }) => 
                        def ? <SkillCard key={def.id} playerState={playerState} skillDef={def} currentLevel={learned.currentLevel} onLevelUp={() => onLevelUpSkill(def.id)} /> : null
                    ) : <p className="text-gray-500 italic col-span-full">Chưa học được tâm pháp nào.</p>}
                </div>
            </div>
        </div>
    );
};

export default SkillsTab;
