import React from 'react';
import type { PlayerState } from '../../../types/character';
import type { Skill as SkillDef, SkillUpgrade } from '../../../types/skill';
import { ALL_SKILLS, SKILL_TIER_INFO } from '../../../data/skills/skills';
import { FaBookDead, FaBook, FaPlus, FaBolt, FaExclamationCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { GiBrain, GiMuscleUp, GiCrossedSwords, GiBroadsword } from 'react-icons/gi';
import { WEAPON_TYPE_NAMES } from '../../../types/equipment';
import { EFFECT_TYPE_NAMES } from '../../../types/skill';
import { calculateSkillAttributesForLevel } from '../../../services/cultivationService';


const ATTRIBUTE_NAMES: Record<string, string> = {
    canCot: 'Căn Cốt',
    thanPhap: 'Thân Pháp',
    thanThuc: 'Thần Thức',
    ngoTinh: 'Ngộ Tính',
    coDuyen: 'Cơ Duyên',
    tamCanh: 'Tâm Cảnh',
    maxHp: 'Sinh Lực Tối đa',
    maxQi: 'Chân Khí Tối đa',
    maxMana: 'Linh Lực Tối đa',
    attackPower: 'Lực Công',
    defensePower: 'Lực Thủ',
    speed: 'Tốc Độ',
    critRate: 'Tỉ lệ Bạo kích',
    critDamage: 'ST Bạo kích',
    armorPenetration: 'Xuyên Giáp',
};

const getUpgradeDescription = (upgrade: SkillUpgrade): { text: string, color: string, icon: React.ReactNode }[] => {
    const descriptions: { text: string, color: string, icon: React.ReactNode }[] = [];
    if (upgrade.damageIncrease) descriptions.push({ text: `Sát thương +${upgrade.damageIncrease}`, color: 'text-red-400', icon: <GiCrossedSwords /> });
    if (upgrade.manaCostIncrease) descriptions.push({ text: `Linh lực tiêu hao +${upgrade.manaCostIncrease}`, color: 'text-cyan-400', icon: <FaBolt /> });
    if (upgrade.manaCostPercentIncrease) descriptions.push({ text: `Linh lực tiêu hao +${upgrade.manaCostPercentIncrease * 100}% tối đa`, color: 'text-cyan-400', icon: <FaBolt /> });
    
    if (upgrade.addEffect) {
        descriptions.push({ text: `Hiệu ứng mới: ${EFFECT_TYPE_NAMES[upgrade.addEffect.type]}`, color: 'text-yellow-300', icon: <FaPlus /> });
    }
    if (upgrade.modifyEffect) {
        const { type, chanceIncrease, durationIncrease, valueIncrease } = upgrade.modifyEffect;
        if (chanceIncrease) descriptions.push({ text: `${EFFECT_TYPE_NAMES[type]} tỉ lệ +${chanceIncrease * 100}%`, color: 'text-yellow-400', icon: <FaArrowUp /> });
        if (durationIncrease) descriptions.push({ text: `${EFFECT_TYPE_NAMES[type]} thời gian +${durationIncrease} hiệp`, color: 'text-yellow-400', icon: <FaArrowUp /> });
        if (valueIncrease) descriptions.push({ text: `${EFFECT_TYPE_NAMES[type]} hiệu quả +${valueIncrease}`, color: 'text-yellow-400', icon: <FaArrowUp /> });
    }

    if(upgrade.addBonus) {
        const { targetStat, targetAttribute, modifier, value } = upgrade.addBonus;
        const targetKey = targetStat || targetAttribute;
        if(targetKey) {
            const name = ATTRIBUTE_NAMES[targetKey] || targetKey;
            const isMultiplier = modifier === 'MULTIPLIER';
            const displayValue = isMultiplier ? `${(value * 100).toFixed(1)}%` : `${Math.round(value)}`;
            descriptions.push({ text: `${name} +${displayValue}`, color: 'text-green-300', icon: <FaArrowUp /> });
        }
    }

    return descriptions;
};

const SkillCard: React.FC<{ playerState: PlayerState; skillDef: SkillDef; currentLevel: number; onLevelUp: () => void }> = ({ playerState, skillDef, currentLevel, onLevelUp }) => {
    const tierInfo = SKILL_TIER_INFO[skillDef.tier];
    const isMaxLevel = currentLevel >= skillDef.maxLevel;

    const exponent = skillDef.enlightenmentCostExponent || 1;
    const cost = Math.round(skillDef.enlightenmentBaseCost + skillDef.enlightenmentCostPerLevel * Math.pow(currentLevel, exponent));
    
    const canAfford = playerState.camNgo >= cost;

    const currentStats = calculateSkillAttributesForLevel(skillDef, currentLevel);
    const nextLevelUnlock = skillDef.levelBonuses.find(lu => lu.level === currentLevel + 1);

    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-white">{skillDef.name}</h3>
                    <span className={`text-sm font-semibold ${tierInfo.color} border px-2 py-0.5 rounded-full ${tierInfo.color.replace('text-', 'border-')}`}>{tierInfo.name}</span>
                </div>
                <p className="text-gray-400 mt-2 text-sm italic whitespace-pre-wrap">{skillDef.description}</p>
                
                 {/* Current Stats Section */}
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
                                    <span className="font-semibold text-cyan-300">
                                        { currentStats.manaCost }
                                        { currentStats.manaCostPercent > 0 && ` + ${Math.round(currentStats.manaCostPercent * 100)}%`}
                                    </span>
                                </div>
                            )}
                            {skillDef.damage && (() => {
                                let totalDmg = currentStats.damage;
                                if (skillDef.damage?.attackPowerFactor) totalDmg += playerState.stats.attackPower * skillDef.damage.attackPowerFactor;
                                if (skillDef.damage?.scalingAttribute && skillDef.damage.scalingFactor) totalDmg += playerState.attributes[skillDef.damage.scalingAttribute] * skillDef.damage.scalingFactor;
                                return (
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-gray-400"><GiCrossedSwords className="text-red-400" /> Sát Thương:</span>
                                        <span className="font-semibold text-red-400">~{Math.round(totalDmg)}</span>
                                    </div>
                                );
                            })()}
                             {currentStats.effects.map((effect, index) => (
                                <div key={index} className="flex items-center justify-between text-yellow-400/90">
                                    <span className="flex items-center gap-2 text-gray-400"><FaExclamationCircle /> Hiệu ứng:</span>
                                    <span>{EFFECT_TYPE_NAMES[effect.type]} ({effect.chance * 100}%, {effect.duration} hiệp)</span>
                                </div>
                            ))}
                        </>
                    )}

                    {skillDef.type === 'TAM_PHAP' && currentStats.bonuses.map((bonus, index) => {
                        const targetKey = bonus.targetStat || bonus.targetAttribute;
                        if (!targetKey) return null;
                        const name = ATTRIBUTE_NAMES[targetKey] || targetKey;
                        const isMultiplier = bonus.modifier === 'MULTIPLIER';
                        const displayValue = isMultiplier ? `${(bonus.value * 100).toFixed(1)}%` : `${Math.round(bonus.value)}`;

                        return (
                             <div key={index} className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-gray-400"><FaPlus className="text-green-400" />{name}:</span>
                                <span className="font-semibold text-green-300">+{displayValue}</span>
                            </div>
                        );
                    })}
                </div>
                
                 {/* Next Level Bonus Section */}
                {!isMaxLevel && nextLevelUnlock && (
                    <div className="mt-3 pt-3 border-t-2 border-dashed border-yellow-700/50">
                        <h4 className="font-semibold text-yellow-200 text-center mb-2">Nâng cấp Tầng {currentLevel + 1}</h4>
                        <div className="space-y-1 text-sm">
                            {getUpgradeDescription(nextLevelUnlock.upgrade).map((desc, i) => (
                                <div key={i} className={`flex items-center gap-2 ${desc.color}`}>
                                    {desc.icon}
                                    <span>{desc.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 flex items-center justify-between pt-2">
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

interface SkillCategoryDisplayProps {
    title: string;
    icon: React.ReactNode;
    skills: { learned: { skillId: string; currentLevel: number; }; def: SkillDef | undefined; }[];
    playerState: PlayerState;
    onLevelUpSkill: (skillId: string) => void;
}

const SkillCategoryDisplay: React.FC<SkillCategoryDisplayProps> = ({ title, icon, skills, playerState, onLevelUpSkill }) => {
    return (
        <div>
            <h3 className="flex items-center gap-3 text-2xl font-semibold mb-3">{icon} {title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.length > 0 ? skills.map(({ learned, def }) => 
                    def ? <SkillCard key={def.id} playerState={playerState} skillDef={def} currentLevel={learned.currentLevel} onLevelUp={() => onLevelUpSkill(def.id)} /> : null
                ) : <p className="text-gray-500 italic col-span-full">Chưa học được công pháp nào.</p>}
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
            <SkillCategoryDisplay
                title="Công Pháp"
                icon={<FaBookDead className="text-red-400" />}
                skills={congPhapList}
                playerState={playerState}
                onLevelUpSkill={onLevelUpSkill}
            />
            <SkillCategoryDisplay
                title="Tâm Pháp"
                icon={<FaBook className="text-blue-400" />}
                skills={tamPhapList}
                playerState={playerState}
                onLevelUpSkill={onLevelUpSkill}
            />
        </div>
    );
};

export default SkillsTab;