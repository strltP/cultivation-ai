import React, { useState, useMemo } from 'react';
import type { NPC, PlayerState, RelationshipType } from '../../types/character';
import { getCultivationInfo, getLinhCanTierInfo } from '../../services/cultivationService';
import AttributeDisplay from './AttributeDisplay';
import CombatStatDisplay from './CombatStatDisplay';
import { ALL_SKILLS, SKILL_TIER_INFO } from '../../data/skills/skills';
import { FaBookDead, FaBook, FaGem, FaHourglassHalf, FaLock, FaShoePrints, FaInfoCircle, FaFistRaised, FaUsers, FaHeart, FaLongArrowAltRight, FaMale, FaFemale, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ALL_ITEMS } from '../../data/items/index';
import type { EquipmentSlot } from '../../types/equipment';
import { EQUIPMENT_SLOT_NAMES } from '../../types/equipment';
import { GiDiamondHard, GiBackpack, GiGalaxy, GiTwoCoins, GiBrain, GiPaintBrush } from 'react-icons/gi';
import { LINH_CAN_DATA } from '../../data/linhcan';
import { formatCurrentIntentStatus } from '../../services/npcActionService';
import { getAffinityLevel } from '../../services/affinityService';
import { FACTIONS } from '../../data/factions';

// --- Relationship Logic ---

interface ProcessedRelationship {
    targetNpc: NPC;
    type: RelationshipType;
}

const RELATIONSHIP_MAP: Partial<Record<RelationshipType, RelationshipType>> = {
    father: 'son',
    mother: 'son',
    master: 'disciple',
    disciple: 'master',
    husband: 'wife',
    wife: 'husband',
    adopted_father: 'adopted_son',
    adopted_mother: 'adopted_son', // Gender is handled dynamically
    adopted_son: 'adopted_father', // Gender is handled dynamically
    adopted_daughter: 'adopted_father', // Gender is handled dynamically
    sworn_sibling: 'sworn_sibling',
};

const RELATIONSHIP_CATEGORY_MAP: Record<RelationshipType, 'GIA TỘC' | 'TÔNG MÔN & THẾ LỰC'> = {
    father: 'GIA TỘC', mother: 'GIA TỘC', son: 'GIA TỘC', daughter: 'GIA TỘC',
    older_brother: 'GIA TỘC', younger_brother: 'GIA TỘC', older_sister: 'GIA TỘC', younger_sister: 'GIA TỘC',
    sibling: 'GIA TỘC', husband: 'GIA TỘC', wife: 'GIA TỘC',
    master: 'GIA TỘC', disciple: 'GIA TỘC',
    sworn_sibling: 'GIA TỘC',
    adopted_father: 'GIA TỘC', adopted_mother: 'GIA TỘC', adopted_son: 'GIA TỘC', adopted_daughter: 'GIA TỘC',
    superior: 'TÔNG MÔN & THẾ LỰC', subordinate: 'TÔNG MÔN & THẾ LỰC',
    peer_same_role: 'TÔNG MÔN & THẾ LỰC', peer_different_role: 'TÔNG MÔN & THẾ LỰC',
};

const RELATIONSHIP_TEXT_MAP_CARD: Record<RelationshipType, string> = {
    father: 'Phụ Thân', mother: 'Mẫu Thân',
    son: 'Con Trai', daughter: 'Con Gái',
    older_brother: 'Huynh Trưởng', younger_brother: 'Đệ Đệ',
    older_sister: 'Tỷ Tỷ', younger_sister: 'Muội Muội',
    sibling: 'Huynh Đệ/Tỷ Muội', husband: 'Phu Quân', wife: 'Thê Tử',
    master: 'Sư Phụ', disciple: 'Đệ Tử',
    superior: 'Cấp Trên', subordinate: 'Cấp Dưới',
    peer_same_role: 'Đồng Môn', peer_different_role: 'Đồng Cấp',
    sworn_sibling: 'Huynh Đệ/Tỷ Muội Kết Nghĩa',
    adopted_father: 'Nghĩa Phụ', adopted_mother: 'Nghĩa Mẫu',
    adopted_son: 'Nghĩa Tử', adopted_daughter: 'Nghĩa Nữ',
};


// --- Main Component ---

interface NpcInfoPanelProps {
  npc: NPC;
  onClose: () => void;
  playerState: PlayerState;
  onMarkNpc: (npc: NPC) => void;
}

const PersonalRelationshipCard: React.FC<{ relationship: ProcessedRelationship; playerState: PlayerState; viewedNpcName: string }> = ({ relationship, playerState, viewedNpcName }) => {
    const { targetNpc, type } = relationship;
    const cultivationInfo = getCultivationInfo(targetNpc.cultivation!);
    const affinityWithPlayer = playerState.affinity?.[targetNpc.id] || 0;
    const affinityWithPlayerInfo = getAffinityLevel(affinityWithPlayer);

    return (
        <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700 flex flex-col gap-2 transition-colors hover:bg-gray-700/50">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 border-2 border-gray-600 text-2xl">
                     {targetNpc.gender === 'Nữ' ? <FaFemale className="text-pink-300" /> : <FaMale className="text-blue-300" />}
                </div>
                <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-bold text-yellow-300">{RELATIONSHIP_TEXT_MAP_CARD[type] || type}</p>
                    <p className="text-base font-semibold text-white truncate" title={targetNpc.name}>{targetNpc.name}</p>
                    {targetNpc.title && <p className="text-xs text-cyan-400 italic truncate" title={targetNpc.title}>« {targetNpc.title} »</p>}
                    <p className="text-xs text-gray-400 truncate">{cultivationInfo.name}</p>
                </div>
            </div>
             <div className="mt-1 pt-2 border-t border-gray-700/50 space-y-1 text-xs">
                 <div className="flex justify-between" title={`Thiện cảm của bạn với ${targetNpc.name}: ${affinityWithPlayer}`}>
                    <span className="text-gray-400">Quan hệ với bạn:</span>
                    <div className="flex items-center gap-1.5">
                        <FaHeart className={affinityWithPlayerInfo.color} />
                        <span className={`font-semibold ${affinityWithPlayerInfo.color}`}>{affinityWithPlayerInfo.level} ({affinityWithPlayer})</span>
                    </div>
                 </div>
             </div>
        </div>
    );
};

const SocialRelationshipCard: React.FC<{ relationship: ProcessedRelationship }> = ({ relationship }) => {
    const { targetNpc, type } = relationship;
    const relationshipName = RELATIONSHIP_TEXT_MAP_CARD[type] || type;

    return (
        <div className="bg-gray-800/60 p-2 rounded-lg border border-gray-700 flex items-center justify-between transition-colors hover:bg-gray-700/50">
            <p className="text-sm font-semibold text-white truncate" title={targetNpc.name}>{targetNpc.name}</p>
            <span className={`font-semibold text-sm text-gray-300`}>{relationshipName}</span>
        </div>
    );
};


const NpcInfoPanel: React.FC<NpcInfoPanelProps> = ({ npc, onClose, playerState, onMarkNpc }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'relationships'>('info');
  const isMonster = npc.npcType === 'monster';
  const cultivationInfo = !isMonster ? getCultivationInfo(npc.cultivation!) : null;
  const age = playerState.time.year - npc.birthTime.year;
  const agePercentage = (age / npc.stats.maxThoNguyen) * 100;
  const ageColorClass = agePercentage > 90 ? 'text-red-400 animate-pulse' : agePercentage > 75 ? 'text-yellow-400' : 'text-gray-400';
  const faction = npc.factionId ? FACTIONS.find(f => f.id === npc.factionId) : null;

  const hpPercentage = (npc.hp / npc.stats.maxHp) * 100;
  const manaPercentage = (npc.mana / npc.stats.maxMana) * 100;
  const qiPercentage = (npc.qi / npc.stats.maxQi) * 100;

  const affinityScore = playerState.affinity?.[npc.id] || 0;
  const affinityInfo = getAffinityLevel(affinityScore);
  
  const isMarked = playerState.markedNpcIds?.includes(npc.id);
  const realmDiff = (npc.cultivation?.realmIndex ?? 0) - playerState.cultivation.realmIndex;
  let markCost = 150;
  if (realmDiff < 0) markCost = 50;
  else if (realmDiff > 0) markCost = 150 + 200 * Math.pow(realmDiff, 2);
  const canAffordMark = playerState.mana >= markCost;

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
    
    const linhCanTierInfo = !isMonster ? getLinhCanTierInfo(npc.linhCan) : null;
    
    const { personalRelationships, otherRelationships } = useMemo(() => {
        if (npc.npcType === 'monster') return { personalRelationships: [], otherRelationships: [] };
    
        const allNpcs = Object.values(playerState.generatedNpcs).flat();
        const npcMap = new Map(allNpcs.map(n => [n.id, n]));
    
        const relationshipsMap = new Map<string, { types: Set<RelationshipType> }>();
    
        // 1. Get all formal relationships (from `npc.relationships`)
        (npc.relationships || []).forEach(rel => {
            const targetNpc = npcMap.get(rel.targetNpcId);
            if (targetNpc && !playerState.defeatedNpcIds.includes(targetNpc.id)) {
                if (!relationshipsMap.has(rel.targetNpcId)) {
                    relationshipsMap.set(rel.targetNpcId, { types: new Set() });
                }
                relationshipsMap.get(rel.targetNpcId)!.types.add(rel.type);
            }
        });
    
        // 2. Get all reciprocal formal relationships
        allNpcs.forEach(otherNpc => {
            if (otherNpc.id === npc.id) return;
            (otherNpc.relationships || []).forEach(rel => {
                if (rel.targetNpcId === npc.id) {
                    let reciprocalType = RELATIONSHIP_MAP[rel.type];
                    if (reciprocalType) {
                        if ((rel.type === 'father' || rel.type === 'mother') && npc.gender === 'Nữ') reciprocalType = 'daughter';
                        if ((rel.type === 'adopted_father' || rel.type === 'adopted_mother') && npc.gender === 'Nữ') reciprocalType = 'adopted_daughter';
                        
                        if (!playerState.defeatedNpcIds.includes(otherNpc.id)) {
                             if (!relationshipsMap.has(otherNpc.id)) {
                                relationshipsMap.set(otherNpc.id, { types: new Set() });
                            }
                            relationshipsMap.get(otherNpc.id)!.types.add(reciprocalType);
                        }
                    }
                }
            });
        });
    
        // 3. Convert map to ProcessedRelationship array
        const finalRelationships: ProcessedRelationship[] = [];
        relationshipsMap.forEach((data, targetNpcId) => {
            const targetNpc = npcMap.get(targetNpcId);
            if (!targetNpc) return;
    
            if (data.types.size > 0) {
                 data.types.forEach(type => {
                    finalRelationships.push({ targetNpc, type });
                 });
            }
        });
        
        const giaTocRelationships = finalRelationships.filter(r => RELATIONSHIP_CATEGORY_MAP[r.type] === 'GIA TỘC');
        const theLucRelationships = finalRelationships.filter(r => RELATIONSHIP_CATEGORY_MAP[r.type] === 'TÔNG MÔN & THẾ LỰC');
        
        return {
            personalRelationships: giaTocRelationships,
            otherRelationships: theLucRelationships,
        };
    }, [npc, playerState]);

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
            <div className="flex-grow">
                <h2 className="text-2xl font-bold text-yellow-300">{npc.name}</h2>
                {!isMonster && npc.title && <p className="text-lg text-cyan-400 mt-1 italic">« {npc.title} »</p>}
                <p className="text-base text-gray-400">
                    {faction && <span className="font-semibold text-amber-300">{faction.name} - </span>}
                    {npc.role} {!isMonster && `(${npc.gender})`}
                </p>
                 {isMonster ? (
                    <p className="text-base text-red-300 mt-1">Cấp {npc.level}</p>
                ) : (
                    <>
                        <div className="flex items-center gap-x-4 mt-1">
                            <p className="text-base text-gray-300">{cultivationInfo?.name}</p>
                            {npc.power && (
                                <div className="flex items-center gap-x-1.5 text-base text-red-300" title={`Quyền lực: ${npc.power}/100`}>
                                    <FaFistRaised />
                                    <span className="font-bold">{npc.power}</span>
                                </div>
                            )}
                        </div>
                         {npc.stats.maxThoNguyen > 0 && (
                            <div className={`flex items-center gap-x-2 text-sm mt-1 ${ageColorClass}`} title="Tuổi / Thọ Nguyên Tối Đa">
                                <FaHourglassHalf className={agePercentage > 90 ? 'text-red-400' : agePercentage > 75 ? 'text-yellow-400' : 'text-purple-300'} />
                                <span>Tuổi: {age} / {npc.stats.maxThoNguyen}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-x-2 text-sm mt-2" title="Thiện cảm">
                            <FaHeart className={affinityInfo.color} />
                            <span className={`font-semibold ${affinityInfo.color}`}>{affinityInfo.level} ({affinityScore})</span>
                        </div>
                        {npc.personalityTags && npc.personalityTags.length > 0 && (
                            <div className="flex items-start gap-2 mt-2" title="Tính cách">
                                <GiPaintBrush className="text-blue-300 mt-1" />
                                <div className="flex flex-wrap gap-1.5">
                                    {npc.personalityTags.map(tag => (
                                        <span key={tag} className="bg-blue-900/50 text-blue-300 text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="flex items-center gap-2">
                 {!isMonster && (
                    <button
                        onClick={() => onMarkNpc(npc)}
                        disabled={!isMarked && !canAffordMark}
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
                        title={isMarked ? 'Hủy tiêu kí' : `Tiêu kí (Tốn ${markCost} Linh Lực)`}
                    >
                        {isMarked ? <FaEyeSlash size={22} className="text-cyan-300" /> : <FaEye size={22} className="text-cyan-300" />}
                    </button>
                 )}
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
                <>
                    <div>
                        <p className="text-xs text-indigo-200 mb-1 text-right">{npc.mana} / {npc.stats.maxMana} Linh Lực</p>
                        <div className="w-full bg-gray-700/50 rounded-full h-3.5 border border-black/20">
                            <div
                                className="bg-indigo-500 h-full rounded-full"
                                style={{ width: `${manaPercentage}%`, filter: 'drop-shadow(0 0 4px #6366f1)' }}
                            ></div>
                        </div>
                    </div>
                     <div>
                        <p className="text-xs text-cyan-200 mb-1 text-right">{npc.qi} / {npc.stats.maxQi} Tu Vi</p>
                        <div className="w-full bg-gray-700/50 rounded-full h-3.5 border border-black/20">
                            <div
                                className="bg-cyan-400 h-full rounded-full qi-bar-glow"
                                style={{ width: `${qiPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </>
            )}
        </div>

        {!isMonster && (
            <div className="flex border-b-2 border-gray-700 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`flex items-center gap-2 px-4 py-2 text-lg font-semibold transition-colors duration-200 border-b-4 ${
                        activeTab === 'info' ? 'text-yellow-300 border-yellow-400' : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                    <FaInfoCircle />
                    <span>Thông Tin</span>
                </button>
                 <button
                    onClick={() => setActiveTab('relationships')}
                    className={`flex items-center gap-2 px-4 py-2 text-lg font-semibold transition-colors duration-200 border-b-4 ${
                        activeTab === 'relationships' ? 'text-yellow-300 border-yellow-400' : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                    <FaUsers />
                    <span>Quan Hệ</span>
                </button>
            </div>
        )}

        <div className="overflow-y-auto space-y-4 pr-2 -mr-4 scrollbar-thin">
            {activeTab === 'info' && (
             <>
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
                        <h3 className="flex items-center gap-2 text-lg text-yellow-300 font-semibold mb-2"><GiTwoCoins /> Tài Sản</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-md">
                                <div className="text-2xl"><FaGem className="text-yellow-300"/></div>
                                <div className="text-sm">
                                    <p className="font-semibold text-white">Linh Thạch</p>
                                    <p className="text-xs text-gray-400">{npc.linhThach.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-md">
                                <div className="text-2xl"><GiBrain className="text-cyan-300"/></div>
                                <div className="text-sm">
                                    <p className="font-semibold text-white">Cảm Ngộ</p>
                                    <p className="text-xs text-gray-400">{npc.camNgo.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 pt-4 border-t border-yellow-400/20">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="flex items-center gap-2 text-lg text-purple-300 font-semibold"><GiGalaxy /> Linh Căn</h3>
                            {linhCanTierInfo && <span className={`font-semibold ${linhCanTierInfo.color}`}>{linhCanTierInfo.name}</span>}
                        </div>
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
             </>
            )}
             {activeTab === 'relationships' && (
                <div className="space-y-6 pt-2">
                    {personalRelationships.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-500/50 pb-2 mb-3">
                                Quan Hệ Gia Tộc & Sư Môn
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {personalRelationships
                                    .sort((a,b) => (b.targetNpc.power || 0) - (a.targetNpc.power || 0))
                                    .map((rel, index) => (
                                    <PersonalRelationshipCard key={index} relationship={rel} playerState={playerState} viewedNpcName={npc.name} />
                                ))}
                            </div>
                        </div>
                    )}

                    {otherRelationships.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-500/50 pb-2 mb-3 mt-6">
                                Quan Hệ Xã Giao
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {otherRelationships
                                    .sort((a,b) => (b.targetNpc.power || 0) - (a.targetNpc.power || 0))
                                    .map((rel, index) => (
                                    <SocialRelationshipCard key={index} relationship={rel} />
                                ))}
                            </div>
                        </div>
                    )}

                    {personalRelationships.length === 0 && otherRelationships.length === 0 && (
                         <p className="text-gray-500 italic text-center pt-8">Người này không có mối quan hệ nào đáng chú ý.</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NpcInfoPanel;