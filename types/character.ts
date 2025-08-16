import type { Position } from './common';
import type { MapID } from './map';
import type { CultivationState, CharacterAttributes, CombatStats } from './stats';
import type { LearnedSkill } from './skill';
import type { InventorySlot } from './item';
import type { EquipmentSlot } from './equipment';
import type { LinhCan } from './linhcan';
import type { ActiveStatusEffect } from './combat';
import type { Interactable } from './interaction';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface NPC {
  id: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  baseId?: string;
  npcType?: 'cultivator' | 'monster';
  title?: string; // Danh hiệu, ví dụ: "Kiếm Thánh" (Optional)
  spawnRuleId?: string; // For procedural monsters, to link them to their spawn rule
  role: string;   // Chức vụ, ví dụ: "Trưởng Lão" (Required)
  cannotChallengeUntil?: GameTime;
  position: Position;
  prompt: string;
  age: number;

  // NPC stats
  cultivation?: CultivationState;
  level?: number;
  attributes: CharacterAttributes;
  stats: CombatStats;
  cultivationStats: Partial<CombatStats & CharacterAttributes>;
  hp: number;
  qi: number;
  mana: number;
  linhThach: number;
  linhCan: LinhCan[];
  activeEffects: ActiveStatusEffect[];
  lootTable?: { itemId: string; chance: number; quantity: [number, number]; }[];

  // NPC Skills and Inventory
  learnedSkills: LearnedSkill[];
  inventory: InventorySlot[];
  equipment: Partial<Record<EquipmentSlot, InventorySlot>>;
  forSale?: { itemId: string; stock: number; priceModifier: number }[];
}

export type Season = 'Xuân' | 'Hạ' | 'Thu' | 'Đông';

export interface GameTime {
    year: number;
    season: Season;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

export interface PlayerState {
  saveVersion: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  cultivation: CultivationState;
  
  hp: number; // Current health
  qi: number; // Current qi/mana
  mana: number;
  camNgo: number; // Enlightenment points
  
  attributes: CharacterAttributes;
  stats: CombatStats;
  cultivationStats: Partial<CombatStats & CharacterAttributes>;
  linhCan: LinhCan[];
  activeEffects: ActiveStatusEffect[];
  
  learnedSkills: LearnedSkill[];
  learnedRecipes: string[];
  inventory: InventorySlot[];
  equipment: Partial<Record<EquipmentSlot, InventorySlot>>;

  position: Position;
  targetPosition: Position;
  currentMap: MapID;
  linhThach: number;
  
  // Persisted world state
  generatedNpcs: Record<string, NPC[]>; // MapID -> NPC list for persistence
  generatedInteractables: Record<string, Interactable[]>; // MapID -> Interactable list
  defeatedNpcIds: string[]; // Using an array for JSON compatibility
  plantedPlots: { plotId: string; mapId: MapID; seedId: string; plantedAt: GameTime; }[];
  respawningInteractables: {
    originalId: string;
    baseId: string;
    mapId: MapID;
    areaId?: string;
    originalPosition: Position;
    respawnAt: GameTime;
  }[];
  respawningNpcs?: {
      originalId: string;
      baseId: string;
      mapId: MapID;
      respawnAt: GameTime;
  }[];
  chatHistories?: Record<string, ChatMessage[]>;
  lastPopCheck?: Record<string, GameTime>; // Key: mapId-areaId for monster population, Value: last check time
  
  // Game Time
  time: GameTime;

  // Feature flags
  useRandomNames: boolean;
  nameOverrides?: Record<string, string>;
}