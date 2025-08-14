import type { Position } from './common';

export type InteractableType = 'herb' | 'stone' | 'chest' | 'spirit_field' | 'alchemy_furnace';

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