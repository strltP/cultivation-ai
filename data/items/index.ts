

import type { Item } from '../../types/item';
import { MATERIALS } from './materials';
import { HERBS } from './herbs';
import { ORES } from './ores';
import { CONSUMABLES } from './consumables';
import { ALL_CONG_PHAP_BOOKS } from './cong_phap_books';
import { ALL_TAM_PHAP_BOOKS } from './tam_phap_books';
import { QUEST_ITEMS } from './quests';
import { SEEDS } from './seeds';
import { RECIPES } from './recipes';
import { ALL_EQUIPMENT } from '../equipment';
import { TOOLS } from './tools';

export const ALL_ITEMS: Item[] = [
    ...MATERIALS,
    ...HERBS,
    ...ORES,
    ...CONSUMABLES,
    ...ALL_CONG_PHAP_BOOKS,
    ...ALL_TAM_PHAP_BOOKS,
    ...QUEST_ITEMS,
    ...SEEDS,
    ...RECIPES,
    ...TOOLS,
    ...ALL_EQUIPMENT,
];