import type { Item } from '../../types/item';
import { WEAPONS } from './weapons';
import { HELMETS } from './helmets';
import { ARMORS } from './armors';
import { LEGS } from './legs';
import { ACCESSORIES } from './accessories';

export const ALL_EQUIPMENT: Item[] = [
    ...WEAPONS,
    ...HELMETS,
    ...ARMORS,
    ...LEGS,
    ...ACCESSORIES,
];
