
import React from 'react';
import type { CombatState } from '../../types/combat';
import { ALL_ITEMS } from '../../data/items/index';
import { FaGem, FaSkull, FaHeartbeat } from 'react-icons/fa';
import { GiTwoCoins, GiBrain } from 'react-icons/gi';

interface EndScreenProps {
  combatState: CombatState;
  onClose: () => void;
  onKill: () => void;
  onSpare: () => void;
  onPlayerDeath: () => void;
}

const LootPreview: React.FC<{ combatState: CombatState }> = ({ combatState }) => {
    const { npc, camNgoGained = 0 } = combatState;
    const isMonster = npc.npcType === 'monster';
    
    let lootableItems: { itemDef: any, quantity: number | [number, number], chance?: number }[] = [];

    if (isMonster) {
        lootableItems = (npc.lootTable || []).map(loot => ({
            itemDef: ALL_ITEMS.find(i => i.id === loot.itemId),
            quantity: loot.quantity,
            chance: loot.chance
        })).filter(l => l.itemDef);
    } else {
        const lootableInventory = [...npc.inventory];
        Object.values(npc.equipment).forEach(equippedItem => {
            if (equippedItem && !lootableInventory.find(i => i.itemId === equippedItem.itemId)) {
                lootableInventory.push(equippedItem);
            }
        });
        lootableItems = lootableInventory.map(slot => ({
            itemDef: ALL_ITEMS.find(i => i.id === slot.itemId),
            quantity: slot.quantity
        })).filter(l => l.itemDef);
    }

    if (lootableItems.length === 0 && npc.linhThach === 0 && camNgoGained === 0) {
        return <p className="text-sm text-gray-500 italic">Không có chiến lợi phẩm.</p>
    }

    return (
        <div className="w-full mt-4 pt-4 border-t border-gray-600 text-left">
            <h3 className="text-xl text-yellow-300 mb-2 text-center">Chiến Lợi Phẩm Khả Dĩ</h3>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
              {camNgoGained > 0 && (
                <div className="flex items-center gap-4 bg-gray-800/50 p-2 rounded">
                    <div className="text-2xl"><GiBrain className="text-cyan-300"/></div>
                    <span>Điểm Cảm Ngộ</span>
                    <span className="ml-auto font-bold">+{camNgoGained}</span>
                </div>
              )}
              {npc.linhThach > 0 && (
                <div className="flex items-center gap-4 bg-gray-800/50 p-2 rounded">
                    <div className="text-2xl"><FaGem className="text-yellow-300"/></div>
                    <span>Linh Thạch</span>
                    <span className="ml-auto font-bold">x{npc.linhThach.toLocaleString()}</span>
                </div>
              )}
              {lootableItems.map((loot, index) => {
                const { itemDef, quantity, chance } = loot;
                const quantityText = Array.isArray(quantity) ? `${quantity[0]}-${quantity[1]}` : quantity;
                return (
                  <div key={index} className="flex items-center gap-4 bg-gray-800/50 p-2 rounded">
                    <div className="text-2xl">{itemDef.icon}</div>
                    <div className="flex-grow">
                        <span>{itemDef.name}</span>
                        {isMonster && chance && <span className="text-xs text-gray-400 block">Tỉ lệ rơi: {chance*100}%</span>}
                    </div>
                    <span className="ml-auto font-bold">x{quantityText}</span>
                  </div>
                );
              })}
            </div>
          </div>
    )
}

const EndScreen: React.FC<EndScreenProps> = ({ combatState, onClose, onKill, onSpare, onPlayerDeath }) => {
  const { winner, npc, npcDecision, isProcessing } = combatState;
  
  const baseContainerClasses = "absolute inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in";
  const basePanelClasses = "bg-gray-900/90 border-2 border-yellow-400/50 rounded-lg shadow-2xl p-8 w-full max-w-lg flex flex-col items-center gap-4 text-center";

  if (winner === 'player') {
    return (
        <div className={baseContainerClasses}>
            <div className={basePanelClasses}>
                <h2 className="text-5xl font-bold text-green-400">Chiến Thắng!</h2>
                <p className="text-lg text-gray-300">Bạn đã đánh bại {npc.name}. Số phận của họ nằm trong tay bạn.</p>
                
                <LootPreview combatState={combatState} />

                <div className="flex w-full gap-4 mt-6">
                    <button
                        onClick={onKill}
                        className="w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-red-700 to-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform hover:scale-105"
                    >
                        <FaSkull /> Kết Liễu
                    </button>
                    <button
                        onClick={onSpare}
                        disabled={npc.npcType === 'monster'}
                        className="w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaHeartbeat /> Tha Mạng
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // Player Defeat Logic
  if (isProcessing) {
      return (
         <div className={baseContainerClasses}>
            <div className={`${basePanelClasses} border-red-500/50`}>
                <div className="w-16 h-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin"></div>
                <p className="mt-4 text-xl text-yellow-300">{npc.name} đang quyết định số phận của bạn...</p>
            </div>
         </div>
      );
  }

  if (npcDecision) {
      const isKillDecision = npcDecision.decision === 'kill';
      return (
        <div className={baseContainerClasses}>
            <div className={`${basePanelClasses} ${isKillDecision ? 'border-red-500/50' : 'border-gray-500/50'}`}>
                <h2 className={`text-5xl font-bold ${isKillDecision ? 'text-red-500' : 'text-gray-400'}`}>Thất Bại!</h2>
                
                <p className="text-lg text-gray-300 mt-4 p-4 border border-gray-600 rounded-lg bg-black/20">"{npcDecision.dialogue}"</p>
                
                {isKillDecision ? (
                    <p className="text-red-300">Bạn bị trọng thương, mất 50% Linh Thạch và bị đưa trở về Tân Thủ Thôn.</p>
                ) : (
                    <p className="text-gray-400">Bạn được tha mạng nhưng bị thương nặng.</p>
                )}

                <button
                    onClick={isKillDecision ? onPlayerDeath : onClose}
                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform hover:scale-105"
                    >
                    {isKillDecision ? 'Chấp Nhận Số Phận' : 'Rời Đi'}
                </button>
            </div>
        </div>
      );
  }

  return null;
};

export default EndScreen;