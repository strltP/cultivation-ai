import type { Faction } from '../npcs/npc_types';
import { THIENNAM_FACTIONS } from './thiennam_factions';
import { BACVUC_FACTIONS } from './bacvuc_factions';
import { COMMON_FACTIONS } from './common_factions';

export const FACTIONS: Faction[] = [
    ...THIENNAM_FACTIONS,
    ...BACVUC_FACTIONS,
    ...COMMON_FACTIONS,
];
