import React, { useState, useEffect } from 'react';
import type { CombatState, PlayerAction } from '../../types/combat';
import type { Skill } from '../../types/skill';
import { ALL_SKILLS } from '../../data/skills/skills';
import CombatantDisplay from './CombatantDisplay';
import CombatLog from './CombatLog';
import EndScreen from './EndScreen';
import { FaBook, FaRunning, FaTimes, FaHourglassHalf } from 'react-icons/fa';
import { GiBroadsword } from 'react-icons/gi';

interface CombatUIProps {
  combatState: CombatState;
  onAction: (action: PlayerAction) => void;
  onClose: () => void;
  onKill: () => void;
  onSpare: () => void;
  onPlayerDeath: () => void;
}

const CombatUI: React.FC<CombatUIProps> = ({ combatState, onAction, onClose, onKill, onSpare, onPlayerDeath }) => {
    const { player, npc, isPlayerTurn, combatEnded, isProcessing } = combatState;
    const [activeSubMenu, setActiveSubMenu] = useState<'skills' | null>(null);
    const [damageKey, setDamageKey] = useState(0);

    useEffect(() => {
        if (combatState.damageToShow) {
            setDamageKey(prev => prev + 1);
        }
    }, [combatState.damageToShow]);

    const handleAction = (action: PlayerAction) => {
        if (!isPlayerTurn || isProcessing || combatEnded) return;
        setActiveSubMenu(null);
        onAction(action);
    };

    const playerSkills = player.learnedSkills
        .map(ls => ALL_SKILLS.find(s => s.id === ls.skillId))
        .filter((s): s is Skill => !!(s && s.type === 'CONG_PHAP' && s.damage));

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
            {/* Combatants */}
            <div className="w-full max-w-6xl flex justify-between items-start mb-4 gap-8 px-8">
                <CombatantDisplay combatant={player} isPlayer={true} isTurn={isPlayerTurn && !combatEnded} damageToShow={combatState.damageToShow} damageKey={damageKey} />
                <div className="text-4xl font-bold text-red-500 pt-16">VS</div>
                <CombatantDisplay combatant={npc} isPlayer={false} isTurn={!isPlayerTurn && !combatEnded} damageToShow={combatState.damageToShow} damageKey={damageKey} />
            </div>

            {/* Main container for log and actions */}
            <div className="w-full max-w-6xl flex-grow flex gap-4 min-h-0">
                 {/* Log */}
                <CombatLog log={combatState.log} />

                {/* Actions */}
                <div className="w-1/3 flex flex-col gap-2 relative">
                    {activeSubMenu === 'skills' ? (
                        <div className="absolute inset-0 bg-gray-900/90 border-2 border-yellow-500/50 rounded-lg p-4 flex flex-col animate-fade-in">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-yellow-300">Chọn Kỹ Năng</h3>
                                <button onClick={() => setActiveSubMenu(null)} className="p-1 text-gray-400 hover:text-white"><FaTimes/></button>
                            </div>
                            <div className="overflow-y-auto flex-grow pr-2">
                                {playerSkills.map(skill => {
                                    const manaCost = skill.manaCost || 0;
                                    const canCast = player.mana >= manaCost;
                                    return (
                                    <button
                                        key={skill.id}
                                        onClick={() => handleAction({ type: 'SKILL', skillId: skill.id })}
                                        disabled={!canCast || !isPlayerTurn || isProcessing}
                                        className="w-full text-left p-2 rounded-md mb-1 flex justify-between items-center transition-colors bg-gray-800/50 hover:bg-yellow-600/50 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        <span>{skill.name}</span>
                                        <span className={`font-semibold ${canCast ? 'text-indigo-300' : 'text-red-400'}`}>{manaCost} Linh Lực</span>
                                    </button>
                                )})}
                            </div>
                        </div>
                    ) : (
                         <div className={`grid grid-cols-2 gap-2 transition-opacity duration-300 ${isProcessing || !isPlayerTurn || combatEnded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <ActionButton icon={<GiBroadsword />} label="Tấn Công" onClick={() => handleAction({ type: 'ATTACK' })} disabled={!isPlayerTurn || isProcessing || combatEnded} />
                            <ActionButton icon={<FaBook />} label="Kỹ Năng" onClick={() => setActiveSubMenu('skills')} disabled={!isPlayerTurn || isProcessing || combatEnded} />
                            <ActionButton icon={<FaHourglassHalf />} label="Bỏ Qua" onClick={() => handleAction({ type: 'SKIP' })} disabled={!isPlayerTurn || isProcessing || combatEnded} />
                            <ActionButton icon={<FaRunning />} label="Bỏ Chạy" onClick={() => handleAction({ type: 'FLEE' })} disabled={!isPlayerTurn || isProcessing || combatEnded} />
                        </div>
                    )}
                </div>
            </div>

            {combatEnded && (
                <EndScreen 
                    combatState={combatState} 
                    onClose={onClose}
                    onKill={onKill}
                    onSpare={onSpare}
                    onPlayerDeath={onPlayerDeath}
                />
            )}
        </div>
    );
};

const ActionButton: React.FC<{icon: React.ReactNode, label: string, onClick: () => void, disabled: boolean}> = ({ icon, label, onClick, disabled }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className="flex flex-col items-center justify-center p-4 bg-gray-900/80 border-2 border-yellow-500/50 rounded-lg h-32 hover:bg-yellow-400/20 hover:border-yellow-400 transition-all duration-200 disabled:bg-gray-800/50 disabled:border-gray-600/50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50"
    >
        <div className="text-4xl text-yellow-300 mb-2">{icon}</div>
        <span className="text-lg font-semibold text-white">{label}</span>
    </button>
);


export default CombatUI;