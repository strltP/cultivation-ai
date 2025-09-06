import type { MapID } from '../types/map';
import type { NpcSpawnDefinition } from '../data/npcs/npc_types';
import { THIEN_NAM_NPC_SPAWNS } from './npc_spawns_thien_nam';
import { BAC_VUC_NPC_SPAWNS } from './npc_spawns_bac_vuc';
import { DAI_HOANG_NPC_SPAWNS } from './npc_spawns_dai_hoang';
import { DONG_HAI_NPC_SPAWNS } from './npc_spawns_dong_hai';

// Combine all continent-specific spawn definitions into a single object.
// The empty definitions are kept to ensure all map IDs are present in the final object,
// preventing potential 'undefined' errors if a map has no spawns defined.
export const NPC_SPAWN_DEFINITIONS_BY_MAP: Record<MapID, NpcSpawnDefinition[]> = {
    // Thien Nam Continent and Sub-maps
    ...THIEN_NAM_NPC_SPAWNS,
    
    // Bac Vuc Continent and Sub-maps
    ...BAC_VUC_NPC_SPAWNS,

    // Other Continents
    ...DAI_HOANG_NPC_SPAWNS,
    ...DONG_HAI_NPC_SPAWNS,
} as Record<MapID, NpcSpawnDefinition[]>;
