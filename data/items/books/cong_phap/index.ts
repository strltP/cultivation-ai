import type { Item } from '../../../../types/item';
import { CONG_PHAP_BOOKS_HOANG } from './hoang';
import { CONG_PHAP_BOOKS_HUYEN } from './huyen';
import { CONG_PHAP_BOOKS_DIA } from './dia';
import { CONG_PHAP_BOOKS_THIEN } from './thien';

export const ALL_CONG_PHAP_BOOKS: Item[] = [
    ...CONG_PHAP_BOOKS_HOANG,
    ...CONG_PHAP_BOOKS_HUYEN,
    ...CONG_PHAP_BOOKS_DIA,
    ...CONG_PHAP_BOOKS_THIEN,
];