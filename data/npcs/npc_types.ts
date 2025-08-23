import type { Position } from '../../types/common';
import type { CharacterAttributes, CombatStats } from '../../types/stats';
import type { InventorySlot } from '../../types/item';
import type { EquipmentSlot } from '../../types/equipment';
import type { NpcRelationship } from '../../types/character';
import type { SkillTier } from '../../types/skill';

export interface FactionRole {
    name: string;
    power: number;
    realmDistribution: {
        realmIndex: number;
        level: number;
        weight: number;
    }[];
    titleChance: {
        base: number;
        perRealm: number;
    };
    titleThemes: string[];
    equipmentTierRange: [SkillTier, SkillTier];
    attributeProfile: Record<keyof CharacterAttributes, number>;
    fixedPositionChance?: number;
}

export interface Faction {
    id: string;
    name: string;
    familyName?: string;
    roles: FactionRole[];
}

export interface StaticNpcDefinition {
    baseId: string;
    name: string;
    gender: 'Nam' | 'Nữ';
    title?: string; // Danh hiệu (optional)
    role: string;   // Chức vụ (required)
    factionId?: string;
    homePoiId?: string;
    power?: number;
    behaviors?: string[]; // Thẻ hành vi AI, ví dụ: ['FIGHTER', 'TRADER']
    realmName: string;
    levelDescription: string;
    attributes: CharacterAttributes;
    age: number;
    linhCan?: { type: string; purity: number }[];
    learnedSkillIds?: string[];
    initialInventory?: InventorySlot[];
    equipment?: Partial<Record<EquipmentSlot, { itemId: string }>>;
    relationships?: NpcRelationship[];
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

export type AgeCategory = 'Young' | 'Middle' | 'Old';

// Role definition used within a procedural spawn rule.
export interface RoleSpawnDefinition {
    factionId: string;
    roleDistribution: {
        roleName: string;
        count: number;
    }[];
    ageDistribution?: { young: number; middle: number; old: number }; // e.g. { young: 0.3, middle: 0.4, old: 0.3 }
    poiIds: string[]; // Spawns NPCs for this role within the bounds of these POIs. Can be an empty array to spawn anywhere on the map.
}


// A single, unified rule for procedural NPC generation.
export interface ProceduralNpcRule {
    type: 'procedural';
    // An array of role definitions. Allows spawning multiple types of NPCs
    // with different prompts and in different locations within a single rule.
    roles: RoleSpawnDefinition[];
    stableCount?: number;
    respawnTimeYears?: [number, number];
}


export interface MonsterDefinition {
    baseId: string;
    name: string; // Species name
    levelRange: [number, number]; // Typical level range for this monster type. Can be overridden by spawn rules.
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
}


export type NpcSpawnDefinition = StaticNpcSpawn | ProceduralNpcRule;