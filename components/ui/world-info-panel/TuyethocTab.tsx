import React from 'react';
import { ALL_SKILLS, SKILL_TIER_INFO } from '../../../data/skills/skills';
import { FACTIONS } from '../../../data/factions';
import type { Skill } from '../../../types/skill';
import { WEAPON_TYPE_NAMES } from '../../../types/equipment';
import { LINH_CAN_ICONS, LINH_CAN_DATA } from '../../../data/linhcan';
import { GiBroadsword } from 'react-icons/gi';
import { FaUserShield } from 'react-icons/fa';

const FactionSkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
    const tierInfo = SKILL_TIER_INFO[skill.tier];
    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col h-full">
            <div className="flex justify-between items-start gap-2">
                <h3 className={`font-bold text-lg ${tierInfo.color}`}>{skill.name}</h3>
                <span className={`text-sm font-semibold ${tierInfo.color} border px-2 py-0.5 rounded-full ${tierInfo.color.replace('text-', 'border-')}`}>{tierInfo.name}</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm italic whitespace-pre-wrap flex-grow">{skill.description}</p>
            
            <div className="mt-4 pt-3 border-t border-gray-700/50 space-y-2 text-sm">
                {skill.requiredLinhCan && skill.requiredLinhCan.length > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-300 font-semibold">Yêu Cầu Linh Căn:</span>
                        <div className="flex gap-1 text-lg">
                            {skill.requiredLinhCan.map(lc =>
                                <span key={lc} title={LINH_CAN_DATA[lc].name}>{LINH_CAN_ICONS[lc]}</span>
                            )}
                        </div>
                    </div>
                )}
                 {skill.weaponType && (
                    <div className="flex justify-between">
                        <span className="text-gray-300 font-semibold flex items-center gap-2"><GiBroadsword /> Yêu Cầu Vũ Khí:</span>
                        <span className="text-white font-bold">{WEAPON_TYPE_NAMES[skill.weaponType]}</span>
                    </div>
                )}
                {skill.origin.requiredRole && (
                     <div className="flex justify-between">
                        <span className="text-gray-300 font-semibold flex items-center gap-2"><FaUserShield /> Yêu Cầu Chức Vụ:</span>
                        <span className="text-white font-bold">{skill.origin.requiredRole}</span>
                    </div>
                )}
            </div>
        </div>
    );
};


const TuyethocTab: React.FC = () => {
    const factionSkills = React.useMemo(() => {
        const skillsByFaction = ALL_SKILLS.reduce((acc, skill) => {
            if (skill.origin.type === 'FACTION' && skill.origin.factionId) {
                if (!acc[skill.origin.factionId]) {
                    acc[skill.origin.factionId] = [];
                }
                acc[skill.origin.factionId].push(skill);
            }
            return acc;
        }, {} as Record<string, Skill[]>);

        return skillsByFaction;
    }, []);

    const sortedFactions = React.useMemo(() => {
         return [...FACTIONS].sort((a, b) => {
            if (a.id === 'UNAFFILIATED') return 1;
            if (b.id === 'UNAFFILIATED') return -1;
            return a.name.localeCompare(b.name);
        });
    }, []);

    return (
        <div className="space-y-8">
            {sortedFactions.map(faction => {
                const skills = factionSkills[faction.id];
                if (!skills || skills.length === 0) return null;

                return (
                    <div key={faction.id}>
                        <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">{faction.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {skills.sort((a,b) => a.name.localeCompare(b.name)).map(skill => (
                                <FactionSkillCard key={skill.id} skill={skill} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TuyethocTab;
