import type { Skill } from '../../types/skill';
import { TAM_PHAP_HOANG } from './tam_phap/hoang';
import { TAM_PHAP_HUYEN } from './tam_phap/huyen';
import { TAM_PHAP_DIA } from './tam_phap/dia';
import { TAM_PHAP_THIEN } from './tam_phap/thien';

export const ALL_TAM_PHAP: Skill[] = [
    ...TAM_PHAP_HOANG,
    ...TAM_PHAP_HUYEN,
    ...TAM_PHAP_DIA,
    ...TAM_PHAP_THIEN,
];
