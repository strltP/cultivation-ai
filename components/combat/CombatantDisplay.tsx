import React from 'react';
import type { PlayerState, NPC } from '../../types/character';
import type { CombatState, ActiveStatusEffect } from '../../types/combat';
import { getCultivationInfo } from '../../services/cultivationService';
import { FaUserShield, FaUserNinja, FaBolt, FaBurn, FaHandPaper, FaPlusCircle } from 'react-icons/fa';
import { EFFECT_TYPE_NAMES } from '../../types/skill';
import { GiWyvern } from 'react-icons/gi';

interface CombatantDisplayProps {
  combatant: PlayerState | NPC;
  isPlayer: boolean;
  isTurn: boolean;
  damageToShow?: CombatState['damageToShow'];
  damageKey: number;
}

const effectIcons: Record<ActiveStatusEffect['type'], React.ReactNode> = {
    STUN: <FaBolt className="text-yellow-300" />,
    BURN: <FaBurn className="text-orange-400" />,
    SLOW: <FaHandPaper className="text-blue-300" />,
    HEAL: <FaPlusCircle className="text-green-400" />,
    POISON: <div />, // Add icon later
    BUFF: <div />,
    DEBUFF: <div />,
};

const CombatantDisplay: React.FC<CombatantDisplayProps> = ({ combatant, isPlayer, isTurn, damageToShow, damageKey }) => {
  const { name, hp, mana, stats, activeEffects } = combatant;
  const hpPercentage = (hp / stats.maxHp) * 100;
  const manaPercentage = (mana / stats.maxMana) * 100;

  const isMonster = 'npcType' in combatant && combatant.npcType === 'monster';
  const cultivationInfo = !isMonster ? getCultivationInfo(combatant.cultivation!) : null;

  const showDamage = damageToShow && damageToShow.target === (isPlayer ? 'player' : 'npc');

  return (
    <div className={`w-2/5 p-4 bg-gray-900/60 border-2 rounded-lg relative transition-all duration-300 ${isTurn ? 'border-yellow-400 turn-indicator' : 'border-gray-700'} ${isPlayer ? 'items-start text-left' : 'items-end text-right'}`}>
      <div className={`flex items-center gap-4 ${isPlayer ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`p-4 rounded-full ${isPlayer ? 'bg-blue-500/30' : 'bg-red-500/30'}`}>
            {isPlayer 
                ? <FaUserShield size={40} className="text-blue-200" /> 
                : isMonster 
                    ? <GiWyvern size={40} className="text-red-200" />
                    : <FaUserNinja size={40} className="text-red-200" />}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white">{name}</h3>
            {isMonster
                ? <p className="text-red-300">Cấp {combatant.level}</p>
                : <p className="text-cyan-300">{cultivationInfo?.name}</p>
            }
        </div>
      </div>
      
      {/* Stat Bars */}
      <div className="mt-4 space-y-2">
        {/* HP Bar */}
        <div className="w-full bg-gray-700/50 rounded-full h-5 border border-black/20 relative overflow-hidden">
          <div
            className="bg-red-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${hpPercentage}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white text-shadow">HP: {hp} / {stats.maxHp}</span>
        </div>
        {/* Mana Bar (hide for monsters) */}
        {!isMonster && (
            <div className="w-full bg-gray-700/50 rounded-full h-5 border border-black/20 relative overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${manaPercentage}%`, filter: 'drop-shadow(0 0 4px #6366f1)' }}
              ></div>
               <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white text-shadow">Linh Lực: {mana} / {stats.maxMana}</span>
            </div>
        )}
      </div>

       {/* Status Effects */}
       <div className={`h-8 mt-2 flex gap-2 items-center ${isPlayer ? 'justify-start' : 'justify-end'}`}>
        {(activeEffects || []).map(effect => (
          <div key={effect.type} className="relative text-2xl" title={`${EFFECT_TYPE_NAMES[effect.type]} - ${effect.duration} lượt`}>
            {effectIcons[effect.type]}
            <span className="absolute -top-1 -right-1.5 bg-gray-800 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-red-500">
                {effect.duration}
            </span>
          </div>
        ))}
      </div>

       {/* Damage Text */}
        {showDamage && (
            <div key={damageKey} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className={`combat-damage-text font-bold text-4xl ${
                    damageToShow.type === 'heal' ? 'text-green-400' : 
                    damageToShow.type === 'critical' ? 'text-red-500' :
                    damageToShow.type === 'evade' ? 'text-blue-300' : 
                    damageToShow.type === 'effect' ? 'text-purple-400' : 'text-yellow-300'
                }`}>
                    {damageToShow.amount}
                </span>
            </div>
        )}
    </div>
  );
};

export default CombatantDisplay;