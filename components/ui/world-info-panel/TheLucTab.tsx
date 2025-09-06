import React, { useMemo, useState } from 'react';
import type { PlayerState, NPC } from '../../../types/character';
import { FACTIONS } from '../../../data/factions';
import { FaChevronDown, FaGem } from 'react-icons/fa';
import { GiFamilyTree, GiScrollQuill, GiTreasureMap } from 'react-icons/gi';
import TuyethocTab from './TuyethocTab';
import { ALL_ITEMS } from '../../../data/items';

interface FactionHierarchyLevel {
    roleName: string;
    members: NPC[];
}

const OrgChartNode: React.FC<{ member: NPC }> = ({ member }) => (
    <div className="p-2 rounded-lg border-2 text-center transition-all duration-300 border-gray-600 bg-gray-800/70 min-w-[120px]"
        title={`${member.name}\n${member.role}`}
    >
        <p className="font-bold text-white truncate text-sm">{member.name}</p>
        <p className="text-xs text-gray-400 truncate">{member.role}</p>
    </div>
);


const TheLucTab: React.FC<{ playerState: PlayerState }> = ({ playerState }) => {
    const [activeSubTab, setActiveSubTab] = useState<'sodo' | 'khobau' | 'tuyethoc'>('sodo');
    const [expandedFactions, setExpandedFactions] = useState<Record<string, boolean>>({});

    const factionData = useMemo(() => {
        const defeatedIds = new Set(playerState.defeatedNpcIds);
        const allNpcs = Object.values(playerState.generatedNpcs).flat();
        const livingNpcs = allNpcs.filter(npc => npc && !defeatedIds.has(npc.id) && npc.factionId);

        const npcsByFaction = livingNpcs.reduce((acc, npc) => {
            if (npc.factionId) {
                if (!acc[npc.factionId]) {
                    acc[npc.factionId] = [];
                }
                acc[npc.factionId].push(npc);
            }
            return acc;
        }, {} as Record<string, NPC[]>);
        
        const data: Record<string, { memberCount: number; hierarchy: FactionHierarchyLevel[] }> = {};

        FACTIONS.forEach(faction => {
            const factionMembers = npcsByFaction[faction.id] || [];
            const membersByRole = new Map<string, NPC[]>();
            factionMembers.forEach(member => {
                if (!membersByRole.has(member.role)) {
                    membersByRole.set(member.role, []);
                }
                membersByRole.get(member.role)!.push(member);
            });

            const hierarchy = [...faction.roles]
                .sort((a, b) => b.power - a.power)
                .map(role => ({
                    roleName: role.name,
                    members: (membersByRole.get(role.name) || []).sort((a, b) => a.name.localeCompare(b.name))
                }))
                .filter(level => level.members.length > 0);

            data[faction.id] = {
                memberCount: factionMembers.length,
                hierarchy
            };
        });

        return data;
    }, [playerState.generatedNpcs, playerState.defeatedNpcIds]);

    const toggleFaction = (factionId: string) => {
        setExpandedFactions(prev => ({ ...prev, [factionId]: !prev[factionId] }));
    };

    const sortedFactions = useMemo(() => {
        return [...FACTIONS].sort((a, b) => {
            if (a.id === 'UNAFFILIATED') return 1;
            if (b.id === 'UNAFFILIATED') return -1;
            return a.name.localeCompare(b.name);
        });
    }, []);

    return (
        <div className="flex flex-col h-full -m-4">
             <div className="flex-grow overflow-y-auto p-4 scrollbar-thin chat-history">
                 <div className="space-y-4">
                    {sortedFactions.map(faction => {
                        const data = factionData[faction.id];
                        if (!data || data.memberCount === 0) return null;

                        const isExpanded = !!expandedFactions[faction.id];
                        const assets = playerState.factionAssets?.[faction.id];

                        return (
                            <div key={faction.id} className="bg-black/20 rounded-lg border border-gray-700">
                                <button
                                    onClick={() => toggleFaction(faction.id)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors rounded-t-lg"
                                    aria-expanded={isExpanded}
                                >
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl font-bold text-yellow-200">{faction.name}</h2>
                                        <p className="text-sm text-gray-400">Tổng số thành viên: {data.memberCount}</p>
                                    </div>
                                    <FaChevronDown className={`text-2xl text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-gray-700">
                                         <nav className="flex border-b-2 border-gray-600 bg-black/10">
                                            <button onClick={() => setActiveSubTab('sodo')} className={`flex-1 py-2 text-center font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'sodo' ? 'bg-yellow-600/30 text-yellow-200' : 'text-gray-400 hover:bg-gray-700/50'}`}><GiFamilyTree /> Sơ Đồ</button>
                                            <button onClick={() => setActiveSubTab('khobau')} className={`flex-1 py-2 text-center font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'khobau' ? 'bg-yellow-600/30 text-yellow-200' : 'text-gray-400 hover:bg-gray-700/50'}`}><GiTreasureMap /> Kho Báu</button>
                                            <button onClick={() => setActiveSubTab('tuyethoc')} className={`flex-1 py-2 text-center font-semibold flex items-center justify-center gap-2 ${activeSubTab === 'tuyethoc' ? 'bg-yellow-600/30 text-yellow-200' : 'text-gray-400 hover:bg-gray-700/50'}`}><GiScrollQuill /> Tuyệt Học</button>
                                        </nav>
                                        <div className="p-4">
                                            {activeSubTab === 'sodo' && (
                                                <div className="overflow-x-auto">
                                                    <div className="flex flex-col items-center gap-0 min-w-[600px]">
                                                        {data.hierarchy.map((level) => (
                                                            <div key={level.roleName} className="org-chart-level">
                                                                {level.members.map(member => (
                                                                    <OrgChartNode key={member.id} member={member} />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {activeSubTab === 'khobau' && (
                                                <div>
                                                    {!assets || (assets.linhThach === 0 && assets.inventory.length === 0) ? (
                                                         <p className="text-center text-gray-500 italic p-8">Kho báu của thế lực này trống rỗng.</p>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4 p-3 bg-yellow-900/30 rounded-lg">
                                                                <FaGem className="text-5xl text-yellow-300" />
                                                                <div>
                                                                    <p className="text-gray-400 text-sm">Tổng Linh Thạch</p>
                                                                    <p className="text-2xl font-bold text-yellow-200">{assets.linhThach.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-lg text-amber-200 mb-2">Trân Phẩm Dị Bảo</h4>
                                                                 <div className="grid grid-cols-5 md:grid-cols-8 gap-2 p-2 bg-black/20 rounded-lg border border-gray-700 content-start">
                                                                    {assets.inventory.map((slot, index) => {
                                                                        const itemDef = ALL_ITEMS.find(i => i.id === slot.itemId);
                                                                        if (!itemDef) return null;
                                                                        return (
                                                                            <div key={index} className="relative aspect-square bg-gray-900/50 rounded-md border border-gray-600" title={itemDef.name}>
                                                                                <div className="flex items-center justify-center h-full text-3xl">{itemDef.icon}</div>
                                                                                <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">{slot.quantity}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {activeSubTab === 'tuyethoc' && <TuyethocTab />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TheLucTab;