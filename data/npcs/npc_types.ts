import type { Position } from '../../types/common';
import type { CharacterAttributes, CombatStats } from '../../types/stats';
import type { InventorySlot } from '../../types/item';
import type { EquipmentSlot } from '../../types/equipment';

export interface StaticNpcDefinition {
    baseId: string;
    name: string;
    gender: 'Nam' | 'Nữ';
    title?: string; // Danh hiệu (optional)
    role: string;   // Chức vụ (required)
    factionId?: string;
    power?: number;
    behaviors?: string[]; // Thẻ hành vi AI, ví dụ: ['FIGHTER', 'TRADER']
    prompt: string;
    realmName: string;
    levelDescription: string;
    attributes: CharacterAttributes;
    age: number;
    linhCan?: { type: string; purity: number }[];
    learnedSkillIds?: string[];
    initialInventory?: InventorySlot[];
    equipment?: Partial<Record<EquipmentSlot, { itemId: string }>>;
    linhThach?: number;
    camNgo?: number;
    forSale?: { itemId: string; stock: number; priceModifier?: number }[];
}

export interface StaticNpcSpawn {
    type: 'static';
    id: string;
    baseId: string;
    position: Position;
}

// Role definition used within a procedural spawn rule.
export interface RoleSpawnDefinition {
    factionId: string;
    roleNames: string[]; // An array of role names from the faction to be spawned. The service will randomly pick from this list for each NPC.
    count: number;
    poiIds: string[]; // Spawns NPCs for this role within the bounds of these POIs. Can be an empty array to spawn anywhere on the map.
    titleChance?: number;
}


// A single, unified rule for procedural NPC generation.
export interface ProceduralNpcRule {
    type: 'procedural';
    // An array of role definitions. Allows spawning multiple types of NPCs
    // with different prompts and in different locations within a single rule.
    roles: RoleSpawnDefinition[];
}


export interface MonsterDefinition {
    baseId: string;
    name: string; // Species name
    attributes: CharacterAttributes; // Base for Lvl 1
    baseStats: Omit<CombatStats, 'maxQi' | 'maxMana' | 'maxThoNguyen'>; // Base for Lvl 1, some stats are irrelevant for monsters
    lootTable: { itemId: string; chance: number; quantity: [number, number]; }[];
    repopulationTimeMinutes: [number, number];
}

export interface ProceduralMonsterRule {
    type: 'procedural_monster';
    areaId: string;
    monsterBaseIds: string[]; 
    initialCount: number;
    maxCount: number;
    levelRange: [number, number];
}


export type NpcSpawnDefinition = StaticNpcSpawn | ProceduralNpcRule | ProceduralMonsterRule;