import type { NPC, PlayerState, NpcIntent, PathStep } from '../types/character';
import type { MapID, PointOfInterest, TeleportLocation } from '../types/map';
import { MAPS, POIS_BY_MAP, TELEPORT_GATES_BY_MAP } from '../mapdata';

// Hàm trợ giúp để chọn một mục ngẫu nhiên dựa trên trọng số
const weightedRandom = <T>(items: { item: T; weight: number }[]): T | null => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) return null;

    let random = Math.random() * totalWeight;
    for (const { item, weight } of items) {
        if (random < weight) {
            return item;
        }
        random -= weight;
    }
    return null;
};

// --- Build Adjacency List for Map Graph ---
export const ADJACENCY_LIST: Partial<Record<MapID, Set<MapID>>> = {};

const buildAdjacencyList = () => {
    // Helper to add a bidirectional edge
    const addEdge = (u: MapID, v: MapID) => {
        if (!ADJACENCY_LIST[u]) ADJACENCY_LIST[u] = new Set();
        if (!ADJACENCY_LIST[v]) ADJACENCY_LIST[v] = new Set();
        ADJACENCY_LIST[u]!.add(v);
        ADJACENCY_LIST[v]!.add(u);
    };

    // Build from POIs (parent -> child connections)
    for (const mapIdStr in POIS_BY_MAP) {
        const mapId = mapIdStr as MapID;
        const pois = POIS_BY_MAP[mapId];
        if (pois) {
            for (const poi of pois) {
                if (poi.targetMap) {
                    addEdge(mapId, poi.targetMap);
                }
            }
        }
    }

    // Build from Teleport Gates (child -> parent, continent -> continent)
    for (const mapIdStr in TELEPORT_GATES_BY_MAP) {
        const mapId = mapIdStr as MapID;
        const gates = TELEPORT_GATES_BY_MAP[mapId];
        if (gates) {
            for (const gate of gates) {
                addEdge(mapId, gate.targetMap);
            }
        }
    }
};

// Build the list once when the module loads
buildAdjacencyList();


export const getMapPath = (startMapId: MapID, endMapId: MapID): MapID[] | null => {
    if (startMapId === endMapId) return [startMapId];

    const queue: MapID[][] = [[startMapId]];
    const visited = new Set<MapID>([startMapId]);

    while (queue.length > 0) {
        const path = queue.shift()!;
        const lastNode = path[path.length - 1];

        if (lastNode === endMapId) {
            return path;
        }

        const neighbors = ADJACENCY_LIST[lastNode];
        if (neighbors) {
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    const newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }
    }

    console.error(`Could not find a common path between ${startMapId} and ${endMapId}. They might be on different continents with no connection.`);
    return null;
};


export const generateGlobalNpcIntent = (
    npc: NPC,
    playerState: PlayerState,
    allPoisByMap: Record<MapID, PointOfInterest[]>,
    allTeleportGatesByMap: Record<MapID, TeleportLocation[]>
): NpcIntent | null => {
    if (npc.npcType !== 'cultivator' || !npc.cultivation) {
        return null;
    }

    const behaviors = npc.behaviors || ['WANDERER'];
    const possibleActions: { item: NpcIntent['type']; weight: number }[] = [];
    const allPois = Object.values(allPoisByMap).flat();

    // --- Xác định trọng số cho mỗi hành động ---
    const qiRatio = (npc.qi || 0) / npc.stats.maxQi;
    let meditateWeight = 10;
    if (qiRatio < 0.5) meditateWeight += 30;
    if (behaviors.includes('MEDITATOR') || behaviors.includes('SCHOLAR')) meditateWeight += 30;
    if (npc.cultivation.realmIndex > 2) meditateWeight += 10;
    possibleActions.push({ item: 'MEDITATE', weight: meditateWeight });

    let gatherWeight = 0;
    let gatherType: 'herb' | 'stone' | undefined;
    if (behaviors.includes('GATHERER_HERB')) { gatherWeight = 50; gatherType = 'herb'; }
    else if (behaviors.includes('GATHERER_ORE')) { gatherWeight = 50; gatherType = 'stone'; }
    else if (behaviors.includes('WANDERER')) { gatherWeight = 15; }
    if (gatherWeight > 0) possibleActions.push({ item: 'GATHER', weight: gatherWeight });

    let huntWeight = 0;
    if (behaviors.includes('HUNTER')) huntWeight += 40;
    if (behaviors.includes('FIGHTER')) huntWeight += 20;
    if (behaviors.includes('WANDERER')) huntWeight += 10;
    if (huntWeight > 0) possibleActions.push({ item: 'HUNT', weight: huntWeight });

    let tradeWeight = 0;
    if (behaviors.includes('TRADER')) tradeWeight = 60;
    if ((npc.inventory.length / 30) > 0.8) tradeWeight += 40;
    if (tradeWeight > 0) possibleActions.push({ item: 'TRADE', weight: tradeWeight });

    // --- Chọn một hành động ---
    const selectedAction = weightedRandom(possibleActions);
    if (!selectedAction) return null;

    // --- Tìm các điểm đến phù hợp trên toàn thế giới ---
    let candidatePois: { poi: PointOfInterest, mapId: MapID }[] = [];
    
    for (const mapIdStr in allPoisByMap) {
        const mapId = mapIdStr as MapID;
        for (const poi of allPoisByMap[mapId]) {
            // Lọc theo cảnh giới
            if (poi.minRealmIndex !== undefined && npc.cultivation.realmIndex < poi.minRealmIndex) {
                continue;
            }

            // Lọc theo phe phái
            if (poi.allowedFactionIds && poi.allowedFactionIds.length > 0) {
                if (!npc.factionId || !poi.allowedFactionIds.includes(npc.factionId)) {
                    continue; // NPC không được phép vào đây
                }
            }
            
            // Lọc theo loại hành động
            let isMatch = false;
            switch (selectedAction) {
                case 'MEDITATE': isMatch = poi.type === 'sect' || poi.type === 'landmark'; break;
                case 'GATHER': isMatch = poi.type === 'dungeon' || poi.type === 'landmark'; break;
                case 'HUNT': isMatch = poi.type === 'dungeon'; break;
                case 'TRADE': isMatch = poi.type === 'city' || poi.type === 'village'; break;
            }
            if (isMatch) {
                candidatePois.push({ poi, mapId });
            }
        }
    }

    if (candidatePois.length === 0) return null; // Không tìm thấy điểm đến phù hợp

    // --- Tính điểm và chọn điểm đến tốt nhất ---
    const scoredPois = candidatePois.map(({ poi, mapId }) => {
        // Ưu tiên khoảng cách gần (đơn giản hóa bằng cách tính khoảng cách từ bản đồ nhà)
        const isSameMap = mapId === npc.homeMapId;
        const distanceScore = isSameMap ? 100 : 10;

        // Ưu tiên sự phù hợp
        let relevanceScore = 10;
        if (selectedAction === 'TRADE' && poi.type === 'city') relevanceScore += 20;
        if (selectedAction === 'MEDITATE' && poi.type === 'sect') relevanceScore += 30;

        const randomFactor = Math.random() * 20;
        const totalScore = distanceScore + relevanceScore + randomFactor;
        return { poi, mapId, score: totalScore };
    });

    scoredPois.sort((a, b) => b.score - a.score);
    const { poi: destination, mapId: destinationMapId } = scoredPois[0];

    // --- Tạo Lộ Trình (Path) ---
    const mapPath = getMapPath(npc.currentMap, destinationMapId);
    if (!mapPath) return null;

    const pathSteps: PathStep[] = [];
    for (let i = 0; i < mapPath.length; i++) {
        const currentMapId = mapPath[i];
        
        if (i < mapPath.length - 1) {
            // This is not the last map, so the target is the entry point to the *next* map
            const nextMapId = mapPath[i + 1];
            // Find the POI or gate on the current map that leads to the next map
            const entryPoi = allPoisByMap[currentMapId]?.find(p => p.targetMap === nextMapId);
            const entryGate = allTeleportGatesByMap[currentMapId]?.find(g => g.targetMap === nextMapId);
            
            const exitPoint = entryPoi || entryGate; // Use whichever is found

            if (exitPoint) {
                pathSteps.push({ mapId: currentMapId, targetPosition: exitPoint.position });
            } else {
                 console.warn(`No path from ${currentMapId} to ${nextMapId}`);
                 return null; // Cannot find path
            }
        } else {
            // This is the final destination map
            const randomX = destination.position.x - destination.size.width / 2 + Math.random() * destination.size.width;
            const randomY = destination.position.y - destination.size.height / 2 + Math.random() * destination.size.height;
            pathSteps.push({ mapId: currentMapId, targetPosition: { x: randomX, y: randomY } });
        }
    }
    
    if(pathSteps.length === 0) return null;

    // --- Tạo mô tả ---
    let description = '';
    const destinationName = `${destination.name} (${MAPS[destinationMapId].name})`;
    switch(selectedAction) {
        case 'MEDITATE': description = `Ta cảm thấy tu vi có chút đình trệ, quyết định đến ${destinationName} bế quan một thời gian.`; break;
        case 'GATHER': description = `Ta cần một ít ${gatherType === 'herb' ? 'linh thảo' : 'khoáng thạch'}, quyết định đến ${destinationName} tìm kiếm.`; break;
        case 'HUNT': description = `Gần đây cảm thấy thực chiến có chút lơ là, ta sẽ đến ${destinationName} săn vài con yêu thú luyện tập.`; break;
        case 'TRADE': description = `Túi đồ có chút đầy, ta cần đến ${destinationName} để giao dịch một vài thứ.`; break;
    }

    return {
        type: selectedAction,
        destinationPoiId: destination.id,
        destinationMapId: destinationMapId,
        destinationPosition: pathSteps[pathSteps.length - 1].targetPosition,
        path: pathSteps,
        durationMonths: Math.floor(Math.random() * 3) + 1,
        description: description,
        gatherTargetType: selectedAction === 'GATHER' ? gatherType : undefined,
    };
};