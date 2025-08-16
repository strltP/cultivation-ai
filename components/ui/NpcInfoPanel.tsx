
import React from 'react';
import type { NPC } from '../../types/character';
import { getCultivationInfo } from '../../services/cultivationService';
import AttributeDisplay from './AttributeDisplay';
import CombatStatDisplay from './CombatStatDisplay';
import { ALL_SKILLS, SKILL_TIER_INFO } from '../../data/skills/skills';
import { FaBookDead, FaBook, FaGem, FaHourglassHalf, FaLock } from 'react-icons/fa';
import { ALL_ITEMS } from '../../data/items/index';
import type { EquipmentSlot } from '../../types/equipment';
import { EQUIPMENT_SLOT_NAMES } from '../../types/equipment';
import { GiDiamondHard, GiBackpack, GiGalaxy, GiTwoCoins } from 'react-icons/gi';
import { LINH_CAN_DATA } from '../../data/linhcan';

interface NpcInfoPanelProps {
  npc: NPC;
  onClose: () => void;
}

const NpcInfoPanel: React.FC<NpcInfoPanelProps> = ({ npc, onClose }) => {
  const isMonster = npc.npcType === 'monster';
  const cultivationInfo = !isMonster ? getCultivationInfo(npc.cultivation!) : null;
  const agePercentage = (npc.age / npc.stats.maxThoNguyen) * 100;
  const ageColorClass = agePercentage > 90 ? 'text-red-400 animate-pulse' : agePercentage > 75 ? 'text-yellow-400' : 'text-gray-400';

  const hpPercentage = (npc.hp / npc.stats.maxHp) * 100;
  const manaPercentage = (npc.mana / npc.stats.maxMana) * 100;

  const tamPhapList = npc.learnedSkills
    .map(ls => ({ learned: ls, def: ALL_SKILLS.find(s => s.id === ls.skillId) }))
    .filter(item => item.def?.type === 'TAM_PHAP');

  const congPhapList = npc.learnedSkills
    .map(ls => ({ learned: ls, def: ALL_SKILLS.find(s => s.id === ls.skillId) }))
    .filter(item => item.def?.type === 'CONG_PHAP');
        
    const equippedItems = React.useMemo(() => {
        if (isMonster || !npc.equipment) return [];
        const items = [];
        for (const slot in npc.equipment) {
            const equipmentSlot = slot as EquipmentSlot;
            const itemSlot = npc.equipment[equipmentSlot];
            if (itemSlot) {
                const itemDef = ALL_ITEMS.find(i => i.id === itemSlot.itemId);
                if (itemDef) {
                    items.push({ itemDef, slot: equipmentSlot });
                }
            }
        }
        return items;
    }, [npc.equipment, isMonster]);

    const forSaleItems = React.useMemo(() => {
        if (isMonster || !npc.forSale) return [];
        return npc.forSale
            .map(saleItem => {
                const itemDef = ALL_ITEMS.find(i => i.id === saleItem.itemId);
                if (!itemDef) return null;
                const price = Math.floor((itemDef.value || 0) * (saleItem.priceModifier || 1));
                return { itemDef, stock: saleItem.stock, price };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    }, [npc.forSale, isMonster]);

    const personalItems = React.useMemo(() => {
        if (isMonster || !npc.inventory) return [];
        const forSaleIds = new Set(npc.forSale?.map(item => item.itemId) || []);
        return npc.inventory
            .filter(invItem => !forSaleIds.has(invItem.itemId))
            .map(invItem => {
                const itemDef = ALL_ITEMS.find(i => i.id === invItem.itemId);
                return itemDef ? { itemDef, quantity: invItem.quantity } : null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    }, [npc.inventory, npc.forSale, isMonster]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 p-6 backdrop-blur-sm w-full max-w-2xl flex flex-col gap-4 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start flex-shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-yellow-300">{npc.name}</h2>
                {!isMonster && npc.title && <p className="text-lg text-cyan-400 mt-1 italic">« {npc.title} »</p>}
                <p className="text-base text-gray-400">{npc.role} {!isMonster && `(${npc.gender})`}</p>
                {isMonster ? (
                    <p className="text-base text-red-300 mt-1">Cấp {npc.level}</p>
                ) : (
                    <>
                        <p className="text-base text-gray-300 mt-1">{cultivationInfo?.name}</p>
                         {npc.stats.maxThoNguyen > 0 && (
                            <div className={`flex items-center gap-x-2 text-sm mt-1 ${ageColorClass}`} title="Tuổi / Thọ Nguyên Tối Đa">
                                <FaHourglassHalf className={agePercentage > 90 ? 'text-red-400' : agePercentage > 75 ? 'text-yellow-400' : 'text-purple-300'} />
                                <span>Tuổi: {npc.age} / {npc.stats.maxThoNguyen}</span>
                            </div>
                        )}
                    </>
                )}
            </div>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Đóng"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="flex items-center gap-x-2 text-lg text-yellow-300 bg-gray-800/50 px-3 py-1.5 rounded-md self-start flex-shrink-0" title="Linh Thạch Mang Theo">
            <FaGem />
            <span className="font-semibold">{npc.linhThach > 0 ? npc.linhThach.toLocaleString() : 'Không có'}</span>
        </div>

        <div className="flex flex-col gap-y-2 flex-shrink-0">
            <div>
                <p className="text-xs text-red-200 mb-1 text-right">{npc.hp} / {npc.stats.maxHp} Sinh Lực</p>
                <div className="w-full bg-gray-700/50 rounded-full h-3.5 border border-black/20">
                    <div
                        className="bg-red-500 h-full rounded-full"
                        style={{ width: `${hpPercentage}%`, filter: 'drop-shadow(0 0 4px #ef4444)' }}
                    ></div>
                </div>
            </div>
            {!isMonster && (
                <div>
                    <p className="text-xs text-indigo-200 mb-1 text-right">{npc.mana} / {npc.stats.maxMana} Linh Lực</p>
                    <div className="w-full bg-gray-700/50 rounded-full h-3.5 border border-black/20">
                        <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${manaPercentage}%`, filter: 'drop-shadow(0 0 4px #6366f1)' }}
                        ></div>
                    </div>
                </div>
            )}
        </div>

        <div className="overflow-y-auto space-y-4 pr-2 -mr-4 scrollbar-thin">
            <div>
                <h3 className="text-lg text-blue-200 font-semibold mb-[-10px]">Thuộc Tính</h3>
                <AttributeDisplay attributes={npc.attributes} />
            </div>
            
            <div>
                <h3 className="text-lg text-yellow-200 font-semibold mb-[-5px]">Chiến Lực</h3>
                <CombatStatDisplay stats={npc.stats} />
            </div>
            
            {isMonster ? (
                 <div className="mt-2 pt-4 border-t border-yellow-400/20">
                    <h3 className="flex items-center gap-2 text-lg text-orange-300 font-semibold mb-2"><GiBackpack /> Chiến Lợi Phẩm Khả Dĩ</h3>
                    {npc.lootTable && npc.lootTable.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {npc.lootTable.map((loot, index) => {
                                const itemDef = ALL_ITEMS.find(i => i.id === loot.itemId);
                                if (!itemDef) return null;
                                return (
                                    <div key={index} className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-md">
                                        <div className="text-2xl">{itemDef.icon}</div>
                                        <div className="text-sm">
                                            <p className="font-semibold text-white">{itemDef.name}</p>
                                            <p className="text-xs text-gray-400">Tỉ lệ rơi: {loot.chance * 100}%</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic px-2">Yêu thú này không có gì đáng giá.</p>
                    )}
                </div>
            ) : (
            <>
                 <div className="mt-2 pt-4 border-t border-yellow-400/20">
                    <h3 className="flex items-center gap-2 text-lg text-purple-300 font-semibold mb-2"><GiGalaxy /> Linh Căn</h3>
                    <div className="space-y-2">
                        {npc.linhCan.map(lc => {
                            const lcData = LINH_CAN_DATA[lc.type];
                            return (
                                <div key={lc.type} className="flex items-center gap-3 text-sm" title={lcData.description}>
                                    <div className="text-2xl w-6 text-center">{lcData.icon}</div>
                                    <div className="font-semibold text-white w-28">{lcData.name}</div>
                                    <div className="flex-grow bg-gray-700 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full" style={{ width: `${lc.purity}%`}}></div>
                                    </div>
                                    <div className="text-yellow-200 font-bold w-8 text-right">{lc.purity}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-2 pt-4 border-t border-yellow-400/20 space-y-4">
                    {/* Equipped Items */}
                    <div>
                        <h3 className="flex items-center gap-2 text-lg text-green-300 font-semibold mb-2"><GiDiamondHard /> Trang Bị Hiện Tại</h3>
                        {equippedItems.length > 0 ? (
                             <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {equippedItems.map(({ itemDef, slot }, index) => (
                                    <div key={`${itemDef.id}-${index}`} className="flex flex-col items-center gap-1 text-center" title={`${itemDef.name}\n(Đang trang bị: ${EQUIPMENT_SLOT_NAMES[slot]})`}>
                                        <div className="relative w-16 h-16 bg-gray-800/50 rounded-md border border-green-700 flex items-center justify-center text-3xl">
                                            {itemDef.icon}
                                        </div>
                                        <p className="text-xs font-semibold h-8 leading-tight flex items-center justify-center text-green-300">{itemDef.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-500 italic px-2">Không trang bị vật phẩm nào.</p>}
                    </div>

                    {/* For Sale Items */}
                    <div>
                        <h3 className="flex items-center gap-2 text-lg text-yellow-300 font-semibold mb-2"><GiTwoCoins /> Hàng Hóa Giao Dịch</h3>
                         {forSaleItems.length > 0 ? (
                             <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {forSaleItems.map(({ itemDef, stock, price }, index) => (
                                    <div key={`${itemDef.id}-${index}`} className="flex flex-col items-center gap-1 text-center" title={`${itemDef.name}\nGiá: ${price} Linh Thạch`}>
                                        <div className="relative w-16 h-16 bg-gray-800/50 rounded-md border border-yellow-700 flex items-center justify-center text-3xl">
                                            {itemDef.icon}
                                            <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">{stock}</span>
                                            <span className="absolute top-1 left-1 text-[10px] font-bold text-yellow-300 bg-black/60 px-1 rounded-full flex items-center gap-0.5"><FaGem className="text-yellow-400" /> {price}</span>
                                        </div>
                                        <p className="text-xs font-semibold h-8 leading-tight flex items-center justify-center text-yellow-300">{itemDef.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-500 italic px-2">Không bán vật phẩm nào.</p>}
                    </div>
                    
                    {/* Personal Items */}
                    <div>
                        <h3 className="flex items-center gap-2 text-lg text-gray-400 font-semibold mb-2"><FaLock /> Vật Phẩm Cá Nhân (Không Bán)</h3>
                        {personalItems.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {personalItems.map(({ itemDef, quantity }, index) => (
                                    <div key={`${itemDef.id}-${index}`} className="flex flex-col items-center gap-1 text-center" title={itemDef.name}>
                                        <div className="relative w-16 h-16 bg-gray-800/50 rounded-md border border-gray-600 flex items-center justify-center text-3xl">
                                            {itemDef.icon}
                                            <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">{quantity}</span>
                                        </div>
                                        <p className="text-xs font-semibold h-8 leading-tight flex items-center justify-center text-gray-400">{itemDef.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-500 italic px-2">Không có vật phẩm cá nhân nào.</p>}
                    </div>

                </div>

                 <div className="mt-2 pt-4 border-t border-yellow-400/20 space-y-4">
                    <div>
                         <h3 className="flex items-center gap-2 text-lg text-blue-300 font-semibold mb-2"><FaBook /> Tâm Pháp</h3>
                         {tamPhapList.length > 0 ? (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {tamPhapList.map(({ def, learned }, index) => {
                                    if (!def) return null;
                                    const tierInfo = SKILL_TIER_INFO[def.tier];
                                    return (
                                        <div key={index} className="bg-gray-800/50 p-2 rounded-md" title={def.description}>
                                            <p className={`font-semibold ${tierInfo.color}`}>{def.name} <span className="text-white text-sm">(Tầng {learned.currentLevel})</span></p>
                                        </div>
                                    )
                                })}
                              </div>
                         ) : <p className="text-sm text-gray-500 italic px-2">Chưa học tâm pháp nào.</p>}
                    </div>
                    <div>
                        <h3 className="flex items-center gap-2 text-lg text-red-300 font-semibold mb-2"><FaBookDead /> Công Pháp</h3>
                         {congPhapList.length > 0 ? (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {congPhapList.map(({ def, learned }, index) => {
                                    if (!def) return null;
                                    const tierInfo = SKILL_TIER_INFO[def.tier];
                                    return (
                                        <div key={index} className="bg-gray-800/50 p-2 rounded-md" title={def.description}>
                                            <p className={`font-semibold ${tierInfo.color}`}>{def.name} <span className="text-white text-sm">(Tầng {learned.currentLevel})</span></p>
                                        </div>
                                    )
                                })}
                              </div>
                         ) : <p className="text-sm text-gray-500 italic px-2">Chưa học công pháp nào.</p>}
                    </div>
                </div>
            </>
            )}
        </div>
      </div>
    </div>
  );
};

export default NpcInfoPanel;