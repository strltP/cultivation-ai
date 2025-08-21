import type { Position } from './common';
import type { MapID } from './map';
import type { CultivationState, CharacterAttributes, CombatStats } from './stats';
import type { LearnedSkill } from './skill';
import type { InventorySlot } from './item';
import type { EquipmentSlot } from './equipment';
import type { LinhCan, NpcBehavior } from './linhcan';
import type { ActiveStatusEffect } from './combat';
import type { Interactable } from './interaction';

export type ChatMessageRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  role: ChatMessageRole;
  text: string;
}

export interface JournalEntry {
    time: GameTime;
    message: string;
    type: 'player' | 'world';
}

export type NpcIntentType = 'GATHER' | 'HUNT' | 'TRADE' | 'MEDITATE' | 'CHALLENGE' | 'WANDERER';

export interface NpcIntent {
  type: NpcIntentType;
  destinationPoiId: string; // POI to travel to.
  destinationMapId: MapID; // Map where the POI is located.
  destinationPosition: Position; // The specific random point within the POI.
  durationMonths: number;   // Time to spend there.
  description: string;      // Flavor text from AI.
  gatherTargetType?: 'herb' | 'stone'; // To differentiate GATHER_HERBS and GATHER_MINERALS for the AI prompt
  targetNpcId?: string;
  path?: PathStep[]; // NEW: The multi-map path to the destination
}

export interface PathStep {
    mapId: MapID;
    targetPosition: Position;
}

export type RelationshipType = 'father' | 'mother' | 'son' | 'daughter' | 'older_brother' | 'younger_brother' | 'older_sister' | 'younger_sister' | 'sibling' | 'master' | 'disciple' | 'husband' | 'wife';

export interface NpcRelationship {
    targetNpcId: string; // The ID of the NPC this relationship points to
    type: RelationshipType; // The type of relationship from this NPC's perspective
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
  factionId?: string; // ID của thế lực NPC thuộc về
  power?: number; // Chỉ số quyền lực trong một thế lực
  behaviors?: NpcBehavior[]; // Thẻ hành vi AI, ví dụ: ['FIGHTER', 'TRADER']
  personalityTags?: string[]; // Thẻ tính cách, ví dụ: ['Kiêu ngạo', 'Cẩn thận']
  cannotChallengeUntil?: GameTime;
  position: Position;
  currentMap: MapID; // Bản đồ NPC đang ở
  homeMapId: MapID;
  homePoiId?: string; // ID of the Point of Interest that is the NPC's home.
  cannotActUntil?: GameTime; // NPC cannot get a new intent until this time has passed.
  prompt: string;
  birthTime: GameTime;
  relationships?: NpcRelationship[]; // Mối quan hệ của NPC

  // NPC stats
  cultivation?: CultivationState;
  level?: number;
  baseAttributes: CharacterAttributes; // Thuộc tính gốc (thiên phú)
  attributes: CharacterAttributes; // Thuộc tính đã được tính toán (bao gồm cả tu luyện, trang bị)
  stats: CombatStats;
  cultivationStats: Partial<CombatStats & CharacterAttributes>;
  hp: number;
  qi: number;
  mana: number;
  camNgo: number;
  linhThach: number;
  linhCan: LinhCan[];
  activeEffects: ActiveStatusEffect[];
  lootTable?: { itemId: string; chance: number; quantity: [number, number]; }[];

  // NPC Inventory, skills, etc.
  learnedSkills: LearnedSkill[];
  inventory: InventorySlot[];
  equipment: Partial<Record<EquipmentSlot, InventorySlot>>;
  forSale?: { itemId: string; stock: number; priceModifier?: number }[];

  // --- NPC Exploration System Fields (Giai đoạn 1 & 2) ---
  path?: PathStep[];
  currentPathStepIndex?: number;
  currentGoal?: string; // Mục tiêu dài hạn, ví dụ: "Trở nên giàu có"
  currentIntent?: NpcIntent;
  intentProgress?: { // Theo dõi tiến độ của intent
      startTime: GameTime;
      isTraveling: boolean;
      timeAtDestination?: number; // Thời gian còn lại ở đích (tính bằng phút)
  };
  lastDecisionTime?: GameTime; // Lần cuối NPC "suy nghĩ" để ra quyết định mới
  actionHistory?: JournalEntry[]; // Lịch sử các hành động đã hoàn thành
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

export interface ApiUsageStats {
    totalTokens: number;
    calls: {
        getInteractionResponse: number;
        getNpcDefeatDecision: number;
        generateNpcs: number;
        generatePlaceNames: number;
        sendMessage: number; // For chat
    };
}

export type AffinityLevel = 'Thù Địch' | 'Ghét Bỏ' | 'Xa Lạ' | 'Thân Thiện' | 'Tin Tưởng' | 'Tri Kỷ';

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
  initializedMaps?: MapID[];
  defeatedNpcIds: string[]; // Using an array for JSON compatibility
  harvestedInteractableIds: string[]; // IDs of gathered/destroyed interactables
  deathInfo?: Record<string, { age: number }>; // Stores age of NPCs at time of death
  plantedPlots: { plotId: string; mapId: MapID; seedId: string; plantedAt: GameTime; }[];
  respawningNpcs?: {
      originalId: string;
      baseId: string;
      mapId: MapID;
      respawnAt: GameTime;
  }[];
  respawningInteractables: {
      originalId: string;
      baseId: string;
      mapId: MapID;
      areaId?: string;
      originalPosition: Position;
      respawnAt: GameTime;
  }[];
  chatHistories?: Record<string, ChatMessage[]>;
  nextMonsterSpawnCheck?: Record<string, GameTime>; // Key: mapId-areaId for monster population, Value: next check time
  nextInteractableSpawnCheck?: Record<string, GameTime>; // Key: mapId-areaId for interactable population
  lastNpcProgressionCheck?: GameTime; // The last time NPC cultivation was processed
  journal: JournalEntry[];
  affinity: { [npcId: string]: number };
  
  // Game Time
  time: GameTime;

  // Feature flags
  useRandomNames: boolean;
  nameOverrides?: Record<string, string>;
  apiUsageStats?: ApiUsageStats;
}