import type React from 'react';
import type { EquipmentSlot, WeaponType, EquipmentBonus } from './equipment';
import type { SkillTier } from './skill';
import type { LinhCanType } from './linhcan';

export type ItemType = 'material' | 'consumable' | 'quest' | 'book' | 'equipment' | 'seed' | 'recipe' | 'tool';

export type ConsumableEffectType = 'RESTORE_HP' | 'RESTORE_QI' | 'RESTORE_MANA' | 'TELEPORT' | 'OPEN_ALCHEMY_PANEL' | 'INCREASE_LINH_CAN_PURITY';

export interface ConsumableEffect {
    type: ConsumableEffectType;
    value: number;
    linhCanType?: LinhCanType;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    icon: React.ReactNode;
    stackable: number; // Max stack size, 1 for unstackable
    value?: number; // Base value in Linh Thach
    effects?: ConsumableEffect[];

    // --- For Equipment type items ---
    slot?: EquipmentSlot;
    weaponType?: WeaponType;
    bonuses?: EquipmentBonus[];
    tier?: SkillTier;

    // --- For Book type items ---
    skillId?: string;
    
    // --- For Recipe type items ---
    recipeId?: string;

    // --- For Seed type items ---
    growsIntoItemId?: string;
    growthTimeMinutes?: number; // Time in game minutes for the seed to grow
}

export interface InventorySlot {
    itemId: string;
    quantity: number;
}