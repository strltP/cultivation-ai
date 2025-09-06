import type { Item } from '../../../../types/item';
import { TAM_PHAP_BOOKS_HOANG } from './hoang';
import { TAM_PHAP_BOOKS_HUYEN } from './huyen';
import { TAM_PHAP_BOOKS_DIA } from './dia';
import { TAM_PHAP_BOOKS_THIEN } from './thien';

export const ALL_TAM_PHAP_BOOKS: Item[] = [
    ...TAM_PHAP_BOOKS_HOANG,
    ...TAM_PHAP_BOOKS_HUYEN,
    ...TAM_PHAP_BOOKS_DIA,
    ...TAM_PHAP_BOOKS_THIEN,
];