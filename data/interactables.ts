import type { InteractableTemplate } from '../types/interaction';
import { HERBS } from './interactables/herbs';
import { ORES } from './interactables/ores';
import { OTHERS } from './interactables/others';

export const ALL_INTERACTABLES: InteractableTemplate[] = [
    ...HERBS,
    ...ORES,
    ...OTHERS,
];
