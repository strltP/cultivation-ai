import React, { useMemo, useState } from 'react';
import type { PlayerState, NPC } from '../../../types/character';
import { getCultivationInfo } from '../../../services/cultivationService';
import { MAPS } from '../../../mapdata';
import { FaMapMarkerAlt, FaSkullCrossbones, FaChevronDown, FaUsers, FaMapSigns, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getOriginMap } from '../../../services/mapService';

interface ChungSinhLucTabProps {
  playerState: PlayerState;
}

const ITEMS_PER_PAGE = 12;

const NpcCard: React.FC<{ npc: NPC; playerState: PlayerState; isDeceased: boolean; showLocation: boolean; }> = ({ npc, playerState, isDeceased, showLocation }) => {
    const isMonster = npc.npcType === 'monster';
    const cultivationInfo = !isMonster ? getCultivationInfo(npc.cultivation!) : null;
    const locationName = MAPS[npc.currentMap]?.name || 'Không rõ';
    const deathInfo = isDeceased ? playerState.deathInfo?.[npc.id] : undefined;
    const age = deathInfo ? deathInfo.age : playerState.time.year - npc.birthTime.year;

    return (
        <div className={`bg-gray-800/70 p-3 rounded-lg border border-gray-700 flex flex-col h-full relative overflow-hidden ${isDeceased ? 'opacity-60' : ''}`}>
            {isDeceased && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1 text-center">
                    <FaSkullCrossbones className="text-3xl text-red-500/70" />
                    {deathInfo && <span className="text-[10px] text-red-300 mt-1 font-semibold">Tọa Hóa: {age} tuổi</span>}
                </div>
            )}
            <div className="flex-grow">
                <h4 className="font-bold text-base text-white truncate" title={npc.name}>{npc.name}</h4>
                {npc.title && <p className="text-xs text-cyan-400 italic truncate -mt-1" title={npc.title}>« {npc.title} »</p>}
                <p className="text-gray-400 text-xs mt-1">{npc.role} ({npc.gender})</p>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700/50 space-y-1 text-xs">
                 <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tuổi:</span>
                    <span className="font-semibold text-white">{age}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cảnh giới:</span>
                    <span className="font-semibold text-cyan-300 truncate" title={isMonster ? `Cấp ${npc.level}` : cultivationInfo?.name}>{isMonster ? `Cấp ${npc.level}` : cultivationInfo?.name}</span>
                </div>
                {showLocation && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Vị trí:</span>
                        <span className="font-semibold text-white truncate" title={locationName}>{locationName}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

interface NpcGroupProps {
    groupKey: string;
    title: string;
    npcs: NPC[];
    playerState: PlayerState;
    isDeceased: boolean;
    showLocation: boolean;
    isExpanded: boolean;
    toggleExpand: () => void;
}

const NpcGroup: React.FC<NpcGroupProps> = ({ groupKey, title, npcs, playerState, isDeceased, showLocation, isExpanded, toggleExpand }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(npcs.length / ITEMS_PER_PAGE);
    const paginatedNpcs = npcs.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    // Reset page to 0 if the group is collapsed
    React.useEffect(() => {
        if (!isExpanded) {
            setCurrentPage(0);
        }
    }, [isExpanded]);

    return (
        <div className="bg-black/20 rounded-lg border border-gray-700">
            <button
                onClick={toggleExpand}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/30 transition-colors rounded-t-lg"
                aria-expanded={isExpanded}
            >
                <h2 className="text-2xl font-bold text-yellow-200">{title} ({npcs.length})</h2>
                <FaChevronDown className={`text-2xl text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {paginatedNpcs.map(npc => (
                            <NpcCard key={npc.id} npc={npc} playerState={playerState} isDeceased={isDeceased} showLocation={showLocation} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-4">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 text-white"><FaChevronLeft /></button>
                            <span className="text-gray-300 font-semibold">Trang {currentPage + 1} / {totalPages}</span>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 text-white"><FaChevronRight /></button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const ChungSinhLucTab: React.FC<ChungSinhLucTabProps> = ({ playerState }) => {
    const [activeSubTab, setActiveSubTab] = useState<'xuat_than' | 'hanh_tung'>('xuat_than');
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleItem = (key: string) => {
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const defeatedIds = useMemo(() => new Set(playerState.defeatedNpcIds), [playerState.defeatedNpcIds]);
    
    const { allNpcsByHomeMap, livingNpcs, deceasedNpcs } = useMemo(() => {
        const allNpcs = Object.values(playerState.generatedNpcs).flat();
        const cultivatorsOnly = allNpcs.filter(npc => npc && npc.npcType !== 'monster');
        
        const homeMapGroup = cultivatorsOnly.reduce((acc, npc) => {
            const mapId = npc.homeMapId || npc.currentMap;
            const originMap = getOriginMap(mapId);
            const mapName = originMap.name;
            if (!acc[mapName]) {
                acc[mapName] = [];
            }
            acc[mapName].push(npc);
            return acc;
        }, {} as Record<string, NPC[]>);

        return {
            allNpcsByHomeMap: homeMapGroup,
            livingNpcs: cultivatorsOnly.filter(npc => !defeatedIds.has(npc.id)),
            deceasedNpcs: cultivatorsOnly.filter(npc => defeatedIds.has(npc.id)),
        }
    }, [playerState.generatedNpcs, defeatedIds]);

    const groupNpcsByCurrentMap = (npcs: NPC[]) => {
        return npcs.reduce((acc, npc) => {
            const mapId = npc.currentMap;
            const mapName = MAPS[mapId]?.name || 'Vị trí không rõ';
            if (!acc[mapName]) {
                acc[mapName] = [];
            }
            acc[mapName].push(npc);
            return acc;
        }, {} as Record<string, NPC[]>);
    };

    const groupedLivingNpcs = groupNpcsByCurrentMap(livingNpcs);
    const groupedDeceasedNpcs = groupNpcsByCurrentMap(deceasedNpcs);

    const sortedHomeMapNames = Object.keys(allNpcsByHomeMap).sort();
    const sortedLivingMapNames = Object.keys(groupedLivingNpcs).sort();
    const sortedDeceasedMapNames = Object.keys(groupedDeceasedNpcs).sort();

    return (
        <div className="flex flex-col h-full -m-4">
            <nav className="flex-shrink-0 flex border-b-2 border-gray-700 bg-black/20 px-4">
                <button
                    onClick={() => setActiveSubTab('xuat_than')}
                    className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-200 border-b-4 ${activeSubTab === 'xuat_than' ? 'text-yellow-300 border-yellow-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                >
                    <FaUsers /> Xuất Thân
                </button>
                <button
                    onClick={() => setActiveSubTab('hanh_tung')}
                    className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-200 border-b-4 ${activeSubTab === 'hanh_tung' ? 'text-yellow-300 border-yellow-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                >
                    <FaMapSigns /> Hành Tung
                </button>
            </nav>
            <div className="flex-grow overflow-y-auto p-4 scrollbar-thin chat-history">
                 <div className="text-center mb-6 p-4 bg-black/20 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-yellow-200">Tổng Quan Chúng Sinh</h2>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl text-green-400 font-bold">{livingNpcs.length}</p>
                            <p className="text-sm text-gray-400">Còn Sống</p>
                        </div>
                        <div>
                            <p className="text-2xl text-red-400 font-bold">{deceasedNpcs.length}</p>
                            <p className="text-sm text-gray-400">Đã Tử Vong</p>
                        </div>
                        <div>
                            <p className="text-2xl text-yellow-300 font-bold">{livingNpcs.length + deceasedNpcs.length}</p>
                            <p className="text-sm text-gray-400">Tổng Cộng</p>
                        </div>
                    </div>
                </div>

                {activeSubTab === 'xuat_than' && (
                    <div className="space-y-4">
                        {sortedHomeMapNames.map(mapName => (
                            <NpcGroup
                                key={mapName}
                                groupKey={mapName}
                                title={mapName}
                                npcs={allNpcsByHomeMap[mapName].sort((a,b) => (b.power || 0) - (a.power || 0))}
                                playerState={playerState}
                                isDeceased={false} // This is complex, will render based on actual status
                                showLocation={true}
                                isExpanded={!!expandedItems[mapName]}
                                toggleExpand={() => toggleItem(mapName)}
                            />
                        ))}
                         {sortedHomeMapNames.length === 0 && (
                            <div className="text-center text-gray-500 py-16">
                                <p>Thế giới vẫn còn trống vắng, chưa có sinh linh nào được ghi nhận.</p>
                            </div>
                        )}
                    </div>
                )}
                 {activeSubTab === 'hanh_tung' && (
                     <div className="space-y-4">
                        {sortedLivingMapNames.map(mapName => (
                            <NpcGroup
                                key={`living-${mapName}`}
                                groupKey={`living-${mapName}`}
                                title={mapName}
                                npcs={groupedLivingNpcs[mapName].sort((a,b) => (b.power || 0) - (a.power || 0))}
                                playerState={playerState}
                                isDeceased={false}
                                showLocation={false}
                                isExpanded={!!expandedItems[`living-${mapName}`]}
                                toggleExpand={() => toggleItem(`living-${mapName}`)}
                            />
                        ))}
                         {livingNpcs.length === 0 && (
                            <div className="text-center text-gray-500 py-16">
                                <p>Không có tu sĩ nào còn sống được ghi nhận.</p>
                            </div>
                        )}

                        {deceasedNpcs.length > 0 && (
                             <NpcGroup
                                key="deceased-group"
                                groupKey="deceased-group"
                                title="Danh Sách Đã Tử Vong"
                                npcs={deceasedNpcs.sort((a,b) => (b.power || 0) - (a.power || 0))}
                                playerState={playerState}
                                isDeceased={true}
                                showLocation={true}
                                isExpanded={!!expandedItems['deceased-group']}
                                toggleExpand={() => toggleItem('deceased-group')}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChungSinhLucTab;