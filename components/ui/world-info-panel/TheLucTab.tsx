import React, { useMemo, useState } from 'react';
import type { PlayerState, NPC } from '../../../types/character';
import { FACTIONS } from '../../../data/factions';
import { FaChevronDown } from 'react-icons/fa';
import { GiFamilyTree, GiScrollQuill } from 'react-icons/gi';

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
    const [activeSubTab, setActiveSubTab] = useState<'sodo' | 'tuyethoc'>('sodo');
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
            <nav className="flex-shrink-0 flex border-b-2 border-gray-700 bg-black/20 px-4">
                <button
                    onClick={() => setActiveSubTab('sodo')}
                    className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-200 border-b-4 ${
                        activeSubTab === 'sodo'
                            ? 'text-yellow-300 border-yellow-400'
                            : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                    <GiFamilyTree /> Sơ Đồ Thế Lực
                </button>
                <button
                    onClick={() => setActiveSubTab('tuyethoc')}
                    className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-200 border-b-4 ${
                        activeSubTab === 'tuyethoc'
                            ? 'text-yellow-300 border-yellow-400'
                            : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                    <GiScrollQuill /> Tuyệt Học
                </button>
            </nav>
            <div className="flex-grow overflow-y-auto p-4 scrollbar-thin chat-history">
                {activeSubTab === 'sodo' && (
                     <div className="space-y-4">
                        {sortedFactions.map(faction => {
                            const data = factionData[faction.id];
                            if (!data || data.memberCount === 0) return null;

                            const isExpanded = !!expandedFactions[faction.id];

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
                                        <div className="p-4 border-t border-gray-700 overflow-x-auto">
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
                                </div>
                            );
                        })}
                    </div>
                )}
                 {activeSubTab === 'tuyethoc' && (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                            <GiScrollQuill className="text-7xl mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-300">Tính Năng Sắp Ra Mắt</h3>
                            <p className="mt-2">Tuyệt học của các thế lực sẽ được cập nhật trong tương lai.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TheLucTab;