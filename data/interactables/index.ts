import type { InteractableTemplate } from '../../types/interaction';
import { HERBS } from './herbs';
import { ORES } from './ores';
import { OTHERS } from './others';

export const ALL_INTERACTABLES: InteractableTemplate[] = [
    ...HERBS,
    ...ORES,
    ...OTHERS,
];