import type { Skill } from '../../types/skill';
import { CONG_PHAP_HOANG } from './cong_phap/hoang';
import { CONG_PHAP_HUYEN } from './cong_phap/huyen';
import { CONG_PHAP_DIA } from './cong_phap/dia';
import { CONG_PHAP_THIEN } from './cong_phap/thien';

export const ALL_CONG_PHAP: Skill[] = [
    ...CONG_PHAP_HOANG,
    ...CONG_PHAP_HUYEN,
    ...CONG_PHAP_DIA,
    ...CONG_PHAP_THIEN,
];
