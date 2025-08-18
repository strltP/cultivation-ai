import React, { useMemo } from 'react';
import type { PlayerState, NPC } from '../../../types/character';
import { getCultivationInfo } from '../../../services/cultivationService';
import { MAPS } from '../../../mapdata';
import { FaMapMarkerAlt, FaSkullCrossbones } from 'react-icons/fa';

interface ChungSinhLucTabProps {
  playerState: PlayerState;
}

const NpcCard: React.FC<{ npc: NPC; playerState: PlayerState }> = ({ npc, playerState }) => {
    const isMonster = npc.npcType === 'monster';
    const cultivationInfo = !isMonster ? getCultivationInfo(npc.cultivation!) : null;
    const age = playerState.time.year - npc.birthTime.year;
    const locationName = MAPS[npc.currentMap]?.name || 'Không rõ';
    const isDefeated = playerState.defeatedNpcIds.includes(npc.id);

    return (
        <div className={`bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex flex-col h-full relative overflow-hidden ${isDefeated ? 'opacity-50' : ''}`}>
            {isDefeated && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <FaSkullCrossbones className="text-5xl text-red-500/70" />
                </div>
            )}
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-white">{npc.name}</h3>
                    {npc.title && <span className="text-sm text-cyan-400 italic text-right">« {npc.title} »</span>}
                </div>
                <p className="text-gray-400 text-sm">{npc.role} {!isMonster && `(${npc.gender})`}</p>
                
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
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-semibold">Vị trí:</span>
                        <span className="font-bold text-white flex items-center gap-1"><FaMapMarkerAlt /> {locationName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ChungSinhLucTab: React.FC<ChungSinhLucTabProps> = ({ playerState }) => {
    const allNpcs = useMemo(() => {
        return Object.values(playerState.generatedNpcs).flat();
    }, [playerState.generatedNpcs]);

    const groupedByMap = allNpcs.reduce((acc, npc) => {
        const mapName = MAPS[npc.currentMap]?.name || 'Không rõ';
        if (!acc[mapName]) {
            acc[mapName] = [];
        }
        acc[mapName].push(npc);
        return acc;
    }, {} as Record<string, NPC[]>);

    // Sort map names
    const sortedMapNames = Object.keys(groupedByMap).sort();

    return (
        <div className="space-y-8">
            {sortedMapNames.map(mapName => (
                <div key={mapName}>
                    <h2 className="text-2xl font-bold text-yellow-200 mb-4 pb-2 border-b-2 border-yellow-200/50">{mapName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {groupedByMap[mapName]
                            .sort((a,b) => (b.power || 0) - (a.power || 0))
                            .map(npc => (
                            <NpcCard key={npc.id} npc={npc} playerState={playerState} />
                        ))}
                    </div>
                </div>
            ))}
             {allNpcs.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                    <p>Thế giới vẫn còn trống vắng, chưa có sinh linh nào được ghi nhận.</p>
                </div>
            )}
        </div>
    );
};

export default ChungSinhLucTab;