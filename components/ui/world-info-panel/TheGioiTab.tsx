import React, { useState } from 'react';
import { MAPS, MAP_AREAS_BY_MAP, POIS_BY_MAP } from '../../../../mapdata';
import type { MapID, PointOfInterestType } from '../../../../types/map';
import { FaGlobeAsia, FaMap, FaCity, FaLandmark, FaGopuram, FaHome, FaSkullCrossbones, FaUniversity, FaChevronRight } from 'react-icons/fa';

const POI_ICONS: Record<PointOfInterestType, React.ReactNode> = {
    village: <FaHome className="inline-block text-green-300" />,
    city: <FaCity className="inline-block text-yellow-300" />,
    sect: <FaGopuram className="inline-block text-blue-300" />,
    dungeon: <FaSkullCrossbones className="inline-block text-red-400" />,
    landmark: <FaLandmark className="inline-block text-gray-300" />,
    building: <FaUniversity className="inline-block text-purple-300" />,
};

const TheGioiTab: React.FC = () => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const continentIds = (Object.keys(MAPS) as MapID[]).filter(id => MAPS[id].type === 'continent');

    return (
        <div className="space-y-4">
            {continentIds.map(continentId => {
                const continent = MAPS[continentId];
                const areas = MAP_AREAS_BY_MAP[continentId] || [];
                const pois = POIS_BY_MAP[continentId] || [];
                const isContinentExpanded = !!expandedItems[continentId];

                const poisInAreas = new Set<string>();
                areas.forEach(area => {
                    pois.forEach(poi => {
                        if (
                            poi.position.x >= area.position.x - area.size.width / 2 &&
                            poi.position.x <= area.position.x + area.size.width / 2 &&
                            poi.position.y >= area.position.y - area.size.height / 2 &&
                            poi.position.y <= area.position.y + area.size.height / 2
                        ) {
                            poisInAreas.add(poi.id);
                        }
                    });
                });
                
                const poisOutsideAreas = pois.filter(poi => !poisInAreas.has(poi.id));

                return (
                    <div key={continentId} className="bg-black/20 rounded-lg border border-gray-700">
                        <button 
                            onClick={() => toggleItem(continentId)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors rounded-t-lg"
                            aria-expanded={isContinentExpanded}
                        >
                            <h2 className="text-3xl font-bold text-yellow-200 flex items-center gap-3">
                                <FaGlobeAsia /> {continent.name}
                            </h2>
                            <FaChevronRight className={`text-2xl text-gray-400 transition-transform duration-300 ${isContinentExpanded ? 'rotate-90' : 'rotate-0'}`} />
                        </button>
                        
                        {isContinentExpanded && (
                            <div className="p-4 pl-8 space-y-4 border-t border-gray-700">
                                {areas.map(area => {
                                    const poisInThisArea = pois.filter(poi => 
                                        poi.position.x >= area.position.x - area.size.width / 2 &&
                                        poi.position.x <= area.position.x + area.size.width / 2 &&
                                        poi.position.y >= area.position.y - area.size.height / 2 &&
                                        poi.position.y <= area.position.y + area.size.height / 2
                                    );
                                    const isAreaExpanded = !!expandedItems[area.id];

                                    return (
                                        <div key={area.id} className="pl-4 border-l-2 border-gray-600">
                                            <button 
                                                onClick={() => toggleItem(area.id)}
                                                className="w-full flex items-center justify-between text-left py-2 hover:bg-gray-800/50 rounded"
                                                aria-expanded={isAreaExpanded}
                                            >
                                                <h3 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
                                                    <FaMap /> {area.name}
                                                </h3>
                                                 <FaChevronRight className={`text-lg text-gray-500 transition-transform duration-300 ${isAreaExpanded ? 'rotate-90' : 'rotate-0'}`} />
                                            </button>
                                            {isAreaExpanded && poisInThisArea.length > 0 && (
                                                <ul className="pl-8 mt-2 space-y-2">
                                                    {poisInThisArea.map(poi => (
                                                        <li key={poi.id} className="text-gray-300 flex items-center gap-3">
                                                            {POI_ICONS[poi.type]}
                                                            <span>{poi.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                })}
                                {poisOutsideAreas.length > 0 && (
                                    <div className="pl-4 border-l-2 border-gray-600/50 border-dashed">
                                        <h3 className="text-xl font-semibold text-cyan-400/80 italic py-2">Địa điểm khác</h3>
                                        <ul className="pl-8 mt-2 space-y-2">
                                            {poisOutsideAreas.map(poi => (
                                                <li key={poi.id} className="text-gray-300 flex items-center gap-3">
                                                    {POI_ICONS[poi.type]}
                                                    <span>{poi.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TheGioiTab;
