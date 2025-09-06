import type { Item } from '../../../types/item';
import { ALL_CONG_PHAP_BOOKS } from './cong_phap';
import { ALL_TAM_PHAP_BOOKS } from './tam_phap';

export const ALL_BOOKS: Item[] = [
    ...ALL_CONG_PHAP_BOOKS,
    ...ALL_TAM_PHAP_BOOKS,
];
