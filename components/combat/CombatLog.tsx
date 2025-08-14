
import React, { useRef, useEffect } from 'react';
import type { CombatLogEntry } from '../../types/combat';
import { FaExclamationCircle, FaShieldAlt, FaCrosshairs, FaBolt } from 'react-icons/fa';

interface CombatLogProps {
  log: CombatLogEntry[];
}

const CombatLog: React.FC<CombatLogProps> = ({ log }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const getLogStyle = (type: CombatLogEntry['type']) => {
    switch (type) {
        case 'damage': return 'text-yellow-300';
        case 'critical': return 'text-red-400 font-bold';
        case 'heal': return 'text-green-400';
        case 'evade': return 'text-blue-300 italic';
        case 'info':
        default:
            return 'text-gray-400 italic';
    }
  }

  return (
    <div className="w-2/3 bg-gray-900/80 border-2 border-gray-700 rounded-lg p-4 flex flex-col">
        <h3 className="text-xl font-bold text-yellow-300 border-b border-gray-600 pb-2 mb-2 flex-shrink-0">Chiến Báo</h3>
        <div className="overflow-y-auto flex-grow pr-2 space-y-1">
            {log.map((entry, index) => (
                <p key={index} className={`text-sm transition-opacity duration-500 ${getLogStyle(entry.type)}`}>
                   <span className="mr-2 text-gray-500">[{entry.turn}]</span> {entry.message}
                </p>
            ))}
            <div ref={logEndRef} />
        </div>
    </div>
  );
};

export default CombatLog;