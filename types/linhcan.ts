
export const LINH_CAN_TYPES = ['KIM', 'MOC', 'THUY', 'HOA', 'THO', 'PHONG', 'LOI', 'QUANG', 'AM', 'BĂNG'] as const;

export type LinhCanType = typeof LINH_CAN_TYPES[number];

export const NPC_BEHAVIOR_TAGS = ['FIGHTER', 'HUNTER', 'GATHERER_HERB', 'GATHERER_ORE', 'TRADER', 'MEDITATOR', 'SCHOLAR', 'WANDERER'] as const;
export type NpcBehavior = typeof NPC_BEHAVIOR_TAGS[number];

export interface LinhCan {
    type: LinhCanType;
    purity: number; // A value from 1 to 100
}