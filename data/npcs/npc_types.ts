import type { Position } from '../../types/common';
import type { CharacterAttributes } from '../../types/stats';
import type { InventorySlot } from '../../types/item';
import type { EquipmentSlot } from '../../types/equipment';

export interface StaticNpcDefinition {
    baseId: string;
    name: string;
    gender: 'Nam' | 'Nữ';
    title?: string; // Danh hiệu (optional)
    role: string;   // Chức vụ (required)
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
    forSale?: { itemId: string; stock: number; priceModifier?: number }[];
}

export interface StaticNpcSpawn {
    type: 'static';
    id: string;
    baseId: string;
    position: Position;
}

// ProceduralNpcRule is now a discriminated union.
// It can either use the new role-based spawning system or the old prompt-based one.
export type ProceduralNpcRule = {
    type: 'procedural';
    poiIds: string[]; // Spawns NPCs within the bounds of these POIs
} & ({
    usePoiRoles: true; // Use the definitions from poi_roles.ts
} | {
    usePoiRoles?: false; // Explicitly use the old system
    npcGenerationPrompt: string;
    count: number;
});

export interface MonsterDefinition {
    baseId: string;
    name: string; // Species name
    attributes: CharacterAttributes; // Base for Lvl 1
    baseStats: { // Base for Lvl 1
        maxHp: number;
        attackPower: number;
        defensePower: number;
        speed: number;
        critRate: number;
        critDamage: number;
        evasionRate: number;
    };
    lootTable: { itemId: string; chance: number; quantity: [number, number]; }[];
    respawnTimeMinutes: [number, number];
}

export interface ProceduralMonsterRule {
    type: 'procedural_monster';
    areaId: string;
    monsterBaseIds: string[]; 
    count: number;
    levelRange: [number, number];
}


export type NpcSpawnDefinition = StaticNpcSpawn | ProceduralNpcRule | ProceduralMonsterRule;