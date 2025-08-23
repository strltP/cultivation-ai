import type { Position } from './common';

export type InteractableType = 'herb' | 'stone' | 'chest' | 'spirit_field' | 'alchemy_furnace';

// Defines the potential loot from an interactable object.
export interface InteractableLoot {
  itemId: string;
  quantity: [number, number]; // min, max quantity
  chance: number; // 0 to 1
}

// This defines the "template" for an interactable object.
// The actual instances on the map will be defined in `mapdata/interactable_spawns.ts`.
export interface InteractableTemplate {
  baseId: string;
  name: string;
  prompt: string;
  type: InteractableType;
  loot?: InteractableLoot[];
  repopulationTimeMinutes?: [number, number]; // min, max time for area check
}

export interface Interactable {
  id: string;
  name: string;
  position: Position;
  prompt: string;
  type: InteractableType;
  baseId: string;
  areaId?: string;
  // Planting properties
  isPlanted?: boolean;
  growthPercent?: number;
  isReady?: boolean;
  plantName?: string;
}

export interface Dialogue {
    title: string;
    text: string;
    rewards?: { itemId: string; quantity: number }[];
}
