import type { MapID, GameMap } from '../types/map';
import { MAPS } from '../mapdata';
import { FACTIONS } from '../data/factions';

/**
 * Traverses up the map hierarchy to find the controlling faction for a given map.
 * @param mapId The ID of the map to check.
 * @param maps A record of all game maps.
 * @returns The faction object if a controlling faction is found, otherwise null.
 */
export const getControllingFaction = (mapId: MapID, maps: Record<MapID, GameMap> = MAPS): { id: string; name: string } | null => {
    let currentMap = maps[mapId];
    let recursionGuard = 10; // Prevent infinite loops

    while (currentMap && recursionGuard > 0) {
        if (currentMap.controllingFactionId) {
            const faction = FACTIONS.find(f => f.id === currentMap.controllingFactionId);
            return faction ? { id: faction.id, name: faction.name } : null;
        }
        if (currentMap.parentMapId) {
            currentMap = maps[currentMap.parentMapId];
        } else {
            break; // Reached a root map
        }
        recursionGuard--;
    }

    return null; // No controlling faction found in the hierarchy
};

/**
 * Generates a breadcrumb string representing the map's location in the hierarchy.
 * e.g., "Thiên Nam Đại Lục > Thanh Vân Môn > Dược Viên"
 * @param mapId The ID of the starting map.
 * @param maps A record of all game maps.
 * @returns A string representing the map hierarchy.
 */
export const getMapHierarchyBreadcrumbs = (mapId: MapID, maps: Record<MapID, GameMap> = MAPS): string => {
    const hierarchy: string[] = [];
    let currentMap = maps[mapId];
    let recursionGuard = 10;

    while (currentMap && recursionGuard > 0) {
        hierarchy.unshift(currentMap.name);
        if (currentMap.parentMapId) {
            currentMap = maps[currentMap.parentMapId];
        } else {
            break;
        }
        recursionGuard--;
    }

    return hierarchy.join(' > ');
};

/**
 * Traverses up the map hierarchy to find the top-level parent map (e.g., a continent).
 * @param mapId The ID of the starting map.
 * @param maps A record of all game maps.
 * @returns The top-level GameMap object.
 */
export const getTopLevelMap = (mapId: MapID, maps: Record<MapID, GameMap> = MAPS): GameMap => {
    let currentMap = maps[mapId];
    if (!currentMap) return maps[mapId]; // Should not happen, but a safeguard

    let recursionGuard = 10;
    while (currentMap.parentMapId && recursionGuard > 0) {
        const parentMap = maps[currentMap.parentMapId];
        if (!parentMap) break; // Reached the end of a valid chain
        currentMap = parentMap;
        recursionGuard--;
    }

    return currentMap;
};

/**
 * Traverses up the map hierarchy to find a suitable "origin" map.
 * This prevents NPCs from having origins like "Tavern Interior".
 * @param mapId The ID of the starting map.
 * @param maps A record of all game maps.
 * @returns The most appropriate origin GameMap object.
 */
export const getOriginMap = (mapId: MapID, maps: Record<MapID, GameMap> = MAPS): GameMap => {
    const VALID_ORIGIN_TYPES = ['continent', 'city_map', 'village_map', 'sect_map'];
    let currentMap = maps[mapId];
    if (!currentMap) return maps[mapId]; 

    let recursionGuard = 10;
    while (recursionGuard > 0) {
        if (VALID_ORIGIN_TYPES.includes(currentMap.type)) {
            return currentMap;
        }
        if (currentMap.parentMapId) {
            const parentMap = maps[currentMap.parentMapId];
            if (!parentMap) break;
            currentMap = parentMap;
        } else {
            break;
        }
        recursionGuard--;
    }

    return currentMap; // Fallback to the highest map found
};
