
import React from 'react';
import type { MapID, GameMap } from '../../types/map';
import { FaTimes } from 'react-icons/fa';
import { MAPS } from '../../mapdata';

interface TeleportationTalismanUIProps {
    currentMapId: MapID;
    allMaps: Record<string, GameMap>;
    onTeleport: (mapId: MapID) => void;
    onClose: () => void;
}

const DESTINATIONS: MapID[] = ['THIEN_NAM', 'BAC_VUC', 'DAI_HOANG', 'DONG_HAI'];

const TeleportationTalismanUI: React.FC<TeleportationTalismanUIProps> = ({ currentMapId, allMaps, onTeleport, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900/80 border-2 border-purple-400/50 rounded-lg shadow-2xl shadow-purple-500/20 p-8 w-full max-w-md flex flex-col items-center gap-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FaTimes size={24} /></button>
                <h2 className="text-3xl font-bold text-purple-300">Chọn Điểm Đến</h2>
                <p className="text-gray-400 text-center">Năng lượng không gian trong bùa đang dao động. Hãy chọn nơi bạn muốn đến.</p>
                <div className="w-full flex flex-col gap-4">
                    {DESTINATIONS.filter(id => id !== currentMapId).map(mapId => {
                        const map = allMaps[mapId];
                        let mapName = map.name; // Default to the name from props (can be randomized)

                        // Per request, keep original names for these specific continents in this UI.
                        if (mapId === 'BAC_VUC' || mapId === 'DAI_HOANG' || mapId === 'DONG_HAI') {
                            mapName = MAPS[mapId].name;
                        }

                        return (
                            <button
                                key={mapId}
                                onClick={() => onTeleport(mapId)}
                                className="w-full bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-purple-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-lg transform transition-transform hover:scale-105 hover:border-purple-300 hover:shadow-purple-400/30"
                            >
                                {mapName}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TeleportationTalismanUI;
