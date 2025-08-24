import React, { useMemo, useState } from 'react';
import type { PlayerState, NPC } from '../../../types/character';
import { getCultivationInfo } from '../../../services/cultivationService';
import { MAPS } from '../../../mapdata';
import { FaMapMarkerAlt, FaSkullCrossbones, FaChevronDown, FaUsers, FaMapSigns } from 'react-icons/fa';

interface ChungSinhLucTabProps {
  playerState: PlayerState;
}

type ActiveSubTab = 'xuat_than' | 'hanh_tung';

const NpcCard: React.FC<{ npc: NPC; playerState: PlayerState; isDeceased: boolean; showLocation: boolean; }> = ({ npc, playerState, isDeceased, showLocation }) => {
    const isMonster = npc.npcType === 'monster';
    const cultivationInfo = !isMonster ? getCultivationInfo(npc.cultivation!) : null;
    const locationName = MAPS[npc.currentMap]?.name || 'Không rõ';
    const deathInfo = isDeceased ? playerState.deathInfo?.[npc.id] : undefined;
    const age = deathInfo ? deathInfo.age : playerState.time.year - npc.birthTime.year;

    return (
        <div className={`bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col h-full relative overflow-hidden ${isDeceased ? 'opacity-60' : ''}`}>
            {isDeceased && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center">
                    <FaSkullCrossbones className="text-5xl text-red-500/70" />
                    {deathInfo && <span className="text-xs text-red-300 mt-2 font-semibold">Thân tử đạo tiêu lúc {age} tuổi</span>}
                </div>
            )}
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-white">{npc.name}</h3>
                    {npc.title && <span className="text-sm text-cyan-400 italic text-right">« {npc.title} »</span>}
                </div>
                <p className="text-gray-400 text-sm">{`${npc.role}${!isMonster ? ` (${npc.gender})` : ''}`}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-2 text-sm">
                    {!isMonster && (
                         <div className="flex items-center justify-between">
                            <span className="text-gray-300 font-semibold">Tuổi:</span>
                            <span className="font-bold text-white">{age}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-semibold">Cảnh giới:</span>
                        <span className="font-bold text-cyan-300">{isMonster ? `Cấp ${npc.level}` : cultivationInfo?.name}</span>
                    </div>
                     {showLocation && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300 font-semibold">Vị trí hiện tại:</span>
                            <span className="font-bold text-white flex items-center gap-1"><FaMapMarkerAlt /> {locationName}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const ChungSinhLucTab: React.FC<ChungSinhLucTabProps> = ({ playerState }) => {
    const [activeSubTab, setActiveSubTab] = useState<ActiveSubTab>('xuat_than');
    const [deceasedVisible, setDeceasedVisible] = useState(false);
    
    const defeatedIds = useMemo(() => new Set(playerState.defeatedNpcIds), [playerState.defeatedNpcIds]);
    
    const { allNpcsByHomeMap, livingNpcs, deceasedNpcs } = useMemo(() => {
        const allNpcs = Object.values(playerState.generatedNpcs).flat();
        const cultivatorsOnly = allNpcs.filter(npc => npc && npc.npcType !== 'monster');
        
        const homeMapGroup = cultivatorsOnly.reduce((acc, npc) => {
            const mapId = npc.homeMapId || npc.currentMap;
            const mapName = MAPS[mapId]?.name || 'Vị trí không rõ';
            if (!acc[mapName]) acc[mapName] = [];
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
                {activeSubTab === 'xuat_than' && (
                    <div className="space-y-8">
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
                        {sortedHomeMapNames.map(mapName => (
                            <div key={mapName}>
                                <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">{mapName}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {allNpcsByHomeMap[mapName]
                                        .sort((a,b) => (b.power || 0) - (a.power || 0))
                                        .map(npc => (
                                        <NpcCard key={npc.id} npc={npc} playerState={playerState} isDeceased={defeatedIds.has(npc.id)} showLocation={false} />
                                    ))}
                                </div>
                            </div>
                        ))}
                         {sortedHomeMapNames.length === 0 && (
                            <div className="text-center text-gray-500 py-16">
                                <p>Thế giới vẫn còn trống vắng, chưa có sinh linh nào được ghi nhận.</p>
                            </div>
                        )}
                    </div>
                )}
                {activeSubTab === 'hanh_tung' && (
                     <div className="space-y-8">
                        {sortedLivingMapNames.map(mapName => (
                            <div key={mapName}>
                                <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">{mapName}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {groupedLivingNpcs[mapName]
                                        .sort((a,b) => (b.power || 0) - (a.power || 0))
                                        .map(npc => (
                                        <NpcCard key={npc.id} npc={npc} playerState={playerState} isDeceased={false} showLocation={true} />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {livingNpcs.length === 0 && (
                            <div className="text-center text-gray-500 py-16">
                                <p>Không có tu sĩ nào còn sống được ghi nhận.</p>
                            </div>
                        )}
                        
                        {deceasedNpcs.length > 0 && (
                            <div className="mt-12">
                                <div className="bg-black/20 rounded-lg border border-red-800/50">
                                    <button onClick={() => setDeceasedVisible(!deceasedVisible)} className="w-full flex justify-between items-center p-3 text-left hover:bg-red-900/30 transition-colors">
                                        <h2 className="text-2xl font-bold text-red-400">Danh Sách Đã Qua Đời</h2>
                                        <FaChevronDown className={`transition-transform duration-300 ${deceasedVisible ? 'rotate-180' : ''}`} />
                                    </button>
                                    {deceasedVisible && (
                                        <div className="p-4 border-t border-red-800/50 space-y-8">
                                            {sortedDeceasedMapNames.map(mapName => (
                                                <div key={`deceased-${mapName}`}>
                                                    <h3 className="text-xl font-semibold text-red-300 mb-4 pb-2 border-b-2 border-red-300/50">{mapName}</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                        {groupedDeceasedNpcs[mapName]
                                                            .sort((a,b) => (b.power || 0) - (a.power || 0))
                                                            .map(npc => (
                                                            <NpcCard key={npc.id} npc={npc} playerState={playerState} isDeceased={true} showLocation={true} />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChungSinhLucTab;