
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
import { BsHeadset } from 'react-icons/bs';
import { GiBroadsword, GiLeatherArmor, GiLegArmor, GiCrystalEarrings, GiDiamondHard, GiBackpack, GiGalaxy, GiSwapBag, GiTwoCoins } from 'react-icons/gi';
import { LINH_CAN_DATA } from '../../data/linhcan';

interface NpcInfoPanelProps {
  npc: NPC;
  onClose: () => void;
}

type DisplayItem = {
    itemId: string;
    quantity: number;
    status: 'EQUIPPED' | 'FOR_SALE' | 'PERSONAL';
    price?: number;
    slot?: EquipmentSlot;
};

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
        
    const combinedInventory = React.useMemo<DisplayItem[]>(() => {
        if (isMonster) return [];
        
        const itemMap = new Map<string, DisplayItem>();

        // 1. Process equipped items first
        for (const slot in npc.equipment) {
            const equipmentSlot = slot as EquipmentSlot;
            const itemSlot = npc.equipment[equipmentSlot];
            if (itemSlot) {
                itemMap.set(itemSlot.itemId, {
                    itemId: itemSlot.itemId,
                    quantity: 1,
                    status: 'EQUIPPED',
                    slot: equipmentSlot,
                });
            }
        }

        // 2. Process personal inventory
        (npc.inventory || []).forEach(invItem => {
            if (!itemMap.has(invItem.itemId)) { // Don't overwrite equipped items
                itemMap.set(invItem.itemId, {
                    itemId: invItem.itemId,
                    quantity: invItem.quantity,
                    status: 'PERSONAL',
                });
            }
        });

        // 3. Process items for sale, updating status and price
        (npc.forSale || []).forEach(saleItem => {
            const itemDef = ALL_ITEMS.find(i => i.id === saleItem.itemId);
            if (!itemDef) return;

            const price = Math.floor((itemDef.value || 0) * (saleItem.priceModifier || 1));
            
            if (itemMap.has(saleItem.itemId)) {
                const existingItem = itemMap.get(saleItem.itemId)!;
                if(existingItem.status !== 'EQUIPPED') {
                    existingItem.status = 'FOR_SALE';
                    existingItem.price = price;
                    existingItem.quantity = saleItem.stock === -1 ? Infinity : saleItem.stock;
                }
            } else {
                 itemMap.set(saleItem.itemId, {
                    itemId: saleItem.itemId,
                    quantity: saleItem.stock === -1 ? Infinity : saleItem.stock,
                    status: 'FOR_SALE',
                    price: price,
                });
            }
        });

        return Array.from(itemMap.values());
    }, [npc.equipment, npc.inventory, npc.forSale, isMonster]);

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

        <div className="overflow-y-auto space-y-4 pr-2 -mr-4">
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
                    <h3 className="flex items-center gap-2 text-lg text-orange-300 font-semibold mb-2"><GiSwapBag /> Chiến Lợi Phẩm Khả Dĩ</h3>
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

                <div className="mt-2 pt-4 border-t border-yellow-400/20">
                    <h3 className="flex items-center gap-2 text-lg text-indigo-300 font-semibold mb-2"><GiBackpack /> Túi Đồ & Trang Bị</h3>
                    {combinedInventory.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {combinedInventory.map((displayItem, index) => {
                                const itemDef = ALL_ITEMS.find(i => i.id === displayItem.itemId);
                                if (!itemDef) return null;

                                const tierColor = itemDef.tier ? SKILL_TIER_INFO[itemDef.tier].color : 'text-gray-400';
                                const quantityText = displayItem.quantity === Infinity ? '∞' : displayItem.quantity;
                                let titleText = `${itemDef.name} x${quantityText}`;
                                if (displayItem.status === 'EQUIPPED') titleText += `\n(Đang trang bị: ${EQUIPMENT_SLOT_NAMES[displayItem.slot!]})`;
                                else if (displayItem.status === 'FOR_SALE') titleText += `\nGiá: ${displayItem.price} Linh Thạch`;
                                else titleText += `\n(Vật phẩm cá nhân)`;

                                return (
                                    <div key={`${displayItem.itemId}-${index}`} className="flex flex-col items-center gap-1 text-center">
                                        <div className="relative w-16 h-16 bg-gray-800/50 rounded-md border border-gray-700 flex items-center justify-center text-3xl" title={titleText}>
                                            {itemDef.icon}
                                            {displayItem.quantity > 1 && (
                                                <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">
                                                    {quantityText}
                                                </span>
                                            )}
                                            {displayItem.status === 'EQUIPPED' && (
                                                 <span className="absolute top-1 left-1 text-[10px] font-bold text-white bg-green-700/90 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                    <GiDiamondHard /> Trang Bị
                                                </span>
                                            )}
                                            {displayItem.status === 'FOR_SALE' && (
                                                <span className="absolute top-1 left-1 text-[10px] font-bold text-yellow-300 bg-black/60 px-1 rounded-full flex items-center gap-0.5">
                                                    <FaGem className="text-yellow-400" /> {displayItem.price}
                                                </span>
                                            )}
                                             {displayItem.status === 'PERSONAL' && (
                                                <span className="absolute top-1 left-1 text-[10px] font-bold text-gray-300 bg-red-900/80 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                    <FaLock /> Không Bán
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs font-semibold h-8 leading-tight flex items-center justify-center ${tierColor}`}>
                                            {itemDef.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic px-2">Nhân vật này không mang theo vật phẩm nào.</p>
                    )}
                </div>
                
                <div className="mt-2 pt-4 border-t border-yellow-400/20">
                    <h3 className="flex items-center gap-2 text-lg text-yellow-300 font-semibold mb-2"><FaGem /> Linh Thạch</h3>
                    {npc.linhThach > 0 ? (
                        <div className="bg-gray-800/50 p-3 rounded-md">
                            <span className="font-bold text-white text-lg">{npc.linhThach.toLocaleString()}</span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic px-2">Nhân vật này không mang theo Linh Thạch.</p>
                    )}
                </div>

                <div className="mt-2 pt-4 border-t border-yellow-400/20">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg text-red-300 font-semibold mb-2"><FaBookDead /> Công Pháp Đã Học</h3>
                        {congPhapList.length > 0 ? (
                            <ul className="space-y-1 text-sm">
                                {congPhapList.map(({ learned, def }) => {
                                    if (!def) return null;
                                    const tierInfo = SKILL_TIER_INFO[def.tier];
                                    return (
                                        <li key={def.id} className="flex justify-between items-center bg-gray-800/50 p-2 rounded-md">
                                            <span className={`font-semibold ${tierInfo.color}`}>{def.name}</span>
                                            <span className="text-cyan-300 font-bold">Tầng {learned.currentLevel}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Nhân vật này chưa tu luyện công pháp nào.</p>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="flex items-center gap-2 text-lg text-green-300 font-semibold mb-2"><FaBook /> Tâm Pháp Đã Học</h3>
                        {tamPhapList.length > 0 ? (
                            <ul className="space-y-1 text-sm">
                                {tamPhapList.map(({ learned, def }) => {
                                if (!def) return null;
                                const tierInfo = SKILL_TIER_INFO[def.tier];
                                return (
                                    <li key={def.id} className="flex justify-between items-center bg-gray-800/50 p-2 rounded-md">
                                        <span className={`font-semibold ${tierInfo.color}`}>{def.name}</span>
                                        <span className="text-cyan-300 font-bold">Tầng {learned.currentLevel}</span>
                                    </li>
                                );
                                })}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Nhân vật này chưa tu luyện tâm pháp nào.</p>
                        )}
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
