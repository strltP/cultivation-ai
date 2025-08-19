import type { NPC, GameTime } from '../types/character';
import type { MapID, PointOfInterest } from '../types/map';
import type { LearnedSkill } from '../types/skill';
import type { InventorySlot } from '../types/item';
import { NPC_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/npc_spawns';
import { ALL_STATIC_NPCS } from '../data/npcs/static_npcs';
import { ALL_MONSTERS } from '../data/npcs/monsters';
import type { StaticNpcSpawn, ProceduralNpcRule, StaticNpcDefinition, ProceduralMonsterRule, MonsterDefinition, RoleSpawnDefinition } from '../data/npcs/npc_types';
import { generateNpcs, GeneratedNpcData } from './geminiService';
import { REALM_PROGRESSION } from '../constants';
import { MAPS, MAP_AREAS_BY_MAP } from '../mapdata';
import { calculateAllStats, getCultivationInfo } from './cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { ALL_ITEMS } from '../data/items/index';
import { EquipmentSlot, ITEM_TIER_NAMES } from '../types/equipment';
import type { LinhCan, LinhCanType, NpcBehavior } from '../types/linhcan';
import { LINH_CAN_TYPES } from '../types/linhcan';
import type { CharacterAttributes, CombatStats } from '../types/stats';
import { FACTIONS, type FactionRole } from '../data/factions';

function createNpcFromData(data: (GeneratedNpcData | StaticNpcDefinition) & { power?: number }, id: string, position: {x:number, y:number}, gameTime: GameTime, homeMapId: MapID, factionId?: string): NPC {
    const realmIndex = REALM_PROGRESSION.findIndex(r => r.name === data.realmName);
    const realm = realmIndex !== -1 ? REALM_PROGRESSION[realmIndex] : REALM_PROGRESSION[0];
    
    let level = 0;
    const levelIndex = realm.levels.findIndex(l => l.levelName === data.levelDescription);

    if (levelIndex !== -1) {
        level = levelIndex;
    } else {
        const parsedLevel = parseInt(data.levelDescription.replace(/\D/g, ''));
        if (!isNaN(parsedLevel)) {
            level = parsedLevel - 1; // "Tầng 1" -> index 0
        }
    }
    level = Math.max(0, Math.min(level, realm.levels.length - 1));

    const cultivation = { realmIndex: realmIndex !== -1 ? realmIndex : 0, level };
    
    // --- Simulate level-ups to get accumulated bonuses ---
    const baseAttributes: CharacterAttributes = { ...data.attributes }; // Store the original "talent"
    const npcCultivationBonuses: Partial<CombatStats & CharacterAttributes> = {};
    
    for (let r_idx = 0; r_idx <= cultivation.realmIndex; r_idx++) {
        const currentRealm = REALM_PROGRESSION[r_idx];
        if (!currentRealm) continue;

        const maxLevelInThisRealm = (r_idx === cultivation.realmIndex) ? cultivation.level : currentRealm.levels.length - 1;
        
        for (let l_idx = 0; l_idx <= maxLevelInThisRealm; l_idx++) {
            const levelData = currentRealm.levels[l_idx];
            if (levelData?.bonuses) {
                for (const key in levelData.bonuses) {
                    const statKey = key as keyof (CombatStats & CharacterAttributes);
                    const value = levelData.bonuses[statKey];
                    let rolledValue = 0;

                    if (typeof value === 'number') {
                        rolledValue = value;
                    } else if (Array.isArray(value)) {
                        rolledValue = Math.floor(Math.random() * (value[1] - value[0] + 1)) + value[0];
                    }

                    if (rolledValue !== 0) {
                       (npcCultivationBonuses as any)[statKey] = ((npcCultivationBonuses as any)[statKey] || 0) + rolledValue;
                    }
                }
            }
        }
    }
    // --- End of simulation ---

    const learnedSkillIds = ('learnedSkillIds' in data && data.learnedSkillIds) ? data.learnedSkillIds : [];
    const learnedSkills: LearnedSkill[] = learnedSkillIds
        .map(skillId => {
            const skillDef = ALL_SKILLS.find(s => s.id === skillId);
            if (!skillDef) return null;
            const randomLevel = Math.min(skillDef.maxLevel, Math.floor(Math.random() * 3) + 1);
            return {
                skillId,
                currentLevel: randomLevel
            };
        })
        .filter((s): s is LearnedSkill => s !== null);

    const inventoryData = ('inventory' in data && data.inventory) 
        ? data.inventory 
        : ('initialInventory' in data && data.initialInventory) 
            ? data.initialInventory 
            : [];
            
    const inventory: InventorySlot[] = Array.isArray(inventoryData) 
        ? inventoryData.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
          }))
        : [];

    const equipment: Partial<Record<EquipmentSlot, InventorySlot>> = {};
    const equipmentData = 'equipment' in data ? data.equipment : undefined;
    if (equipmentData) {
        for (const key in equipmentData) {
            const slot = key as EquipmentSlot;
            const item = (equipmentData as any)[slot];
            if (item && item.itemId) {
                equipment[slot] = { itemId: item.itemId, quantity: 1 };
            }
        }
    }

    const forSaleDefinition = 'forSale' in data ? data.forSale : [];
    const forSale = (forSaleDefinition || []).map(item => ({
        itemId: item.itemId,
        stock: item.stock,
        priceModifier: item.priceModifier || 1.0,
    }));
    
    const linhCanData = 'linhCan' in data ? data.linhCan : [];
    const linhCan: LinhCan[] = (linhCanData || [])
        .map(lc => ({
            type: lc.type.toUpperCase() as LinhCanType,
            purity: lc.purity,
        }))
        .filter(lc => LINH_CAN_TYPES.includes(lc.type));
    
    if (linhCan.length === 0) {
        linhCan.push({ type: 'THO', purity: 20 });
    }

    const { finalStats, finalAttributes } = calculateAllStats(baseAttributes, cultivation, npcCultivationBonuses, learnedSkills, ALL_SKILLS, equipment, ALL_ITEMS, linhCan);
    
    const npcCultivationStats = npcCultivationBonuses;
    
    const age = data.age;

    const birthTime: GameTime = {
        year: gameTime.year - age,
        season: 'Xuân',
        month: 1,
        day: 1,
        hour: 0,
        minute: 0
    };
    
    const behaviors = ('behaviors' in data && data.behaviors && data.behaviors.length > 0) ? data.behaviors : ['WANDERER'];

    return {
        name: data.name,
        gender: data.gender,
        npcType: 'cultivator',
        title: data.title,
        role: data.role,
        factionId: factionId,
        power: data.power,
        behaviors: behaviors as NpcBehavior[],
        prompt: data.prompt,
        id,
        position,
        currentMap: homeMapId,
        homeMapId,
        homePosition: { ...position },
        birthTime,
        cultivation,
        baseAttributes: baseAttributes,
        attributes: finalAttributes,
        stats: finalStats,
        cultivationStats: npcCultivationStats,
        linhCan,
        activeEffects: [],
        hp: finalStats.maxHp,
        qi: Math.floor(Math.random() * finalStats.maxQi), // Start with a random amount of Qi
        mana: finalStats.maxMana,
        camNgo: 'camNgo' in data && typeof data.camNgo === 'number' ? data.camNgo : 0,
        linhThach: 'linhThach' in data && typeof data.linhThach === 'number' ? data.linhThach : 0,
        learnedSkills,
        inventory,
        equipment,
        forSale,
    };
}

export function createMonsterFromData(template: MonsterDefinition, level: number, id: string, position: {x:number, y:number}, spawnRuleId: string | undefined, gameTime: GameTime, currentMap: MapID): NPC {
    const levelMultiplier = Math.pow(1.15, level - 1);

    const baseAttributes: CharacterAttributes = template.attributes;
    const finalAttributes: CharacterAttributes = {
        canCot: Math.round(template.attributes.canCot * levelMultiplier),
        thanPhap: Math.round(template.attributes.thanPhap * levelMultiplier),
        thanThuc: Math.round(template.attributes.thanThuc * levelMultiplier),
        ngoTinh: Math.round(template.attributes.ngoTinh * levelMultiplier),
        coDuyen: Math.round(template.attributes.coDuyen * levelMultiplier),
        tamCanh: Math.round(template.attributes.tamCanh * levelMultiplier),
    };

    const finalStats: CombatStats = {
        maxHp: Math.round(template.baseStats.maxHp * levelMultiplier),
        attackPower: Math.round(template.baseStats.attackPower * levelMultiplier),
        defensePower: Math.round(template.baseStats.defensePower * levelMultiplier),
        speed: Math.round(template.baseStats.speed * levelMultiplier),
        critRate: template.baseStats.critRate + (level - 1) * 0.005,
        critDamage: template.baseStats.critDamage + (level - 1) * 0.05,
        armorPenetration: template.baseStats.armorPenetration + (level - 1) * 0.001,
        maxQi: 0,
        maxMana: 0,
        maxThoNguyen: 0,
    };
    
    const age = Math.floor(Math.random() * 10) + 1; // a random age for monsters
    const birthTime: GameTime = {
        year: gameTime.year - age,
        season: 'Xuân',
        month: 1,
        day: 1,
        hour: 0,
        minute: 0
    };

    return {
        id,
        baseId: template.baseId,
        name: `${template.name} (Cấp ${level})`,
        gender: 'Nam', // Monsters don't have a meaningful gender in this context
        npcType: 'monster',
        spawnRuleId,
        role: 'Yêu Thú',
        prompt: `Một con ${template.name} cấp ${level} hung dữ đang chắn đường.`,
        position,
        currentMap: currentMap,
        homeMapId: currentMap,
        homePosition: { ...position },
        level,
        baseAttributes,
        attributes: finalAttributes,
        stats: finalStats,
        hp: finalStats.maxHp,
        qi: 0,
        mana: 0,
        camNgo: 0,
        birthTime,
        cultivationStats: {},
        linhCan: [],
        activeEffects: [],
        linhThach: Math.round(level * (Math.random() * 5 + 2)),
        learnedSkills: [],
        inventory: [],
        equipment: {},
        lootTable: template.lootTable,
    };
}


export const loadNpcsForMap = async (mapId: MapID, poisByMap: Record<MapID, PointOfInterest[]>, gameTime: GameTime): Promise<NPC[]> => {
    const spawnDefinitions = NPC_SPAWN_DEFINITIONS_BY_MAP[mapId] || [];
    if (!spawnDefinitions.length) return [];

    const finalNpcs: NPC[] = [];
    const staticNpcTemplates = new Map(ALL_STATIC_NPCS.map(npc => [npc.baseId, npc]));
    const monsterTemplates = new Map(ALL_MONSTERS.map(m => [m.baseId, m]));

    const poisForMap = poisByMap[mapId] || [];
    const mapData = MAPS[mapId];

    // Handle static spawns
    const staticSpawns = spawnDefinitions.filter((def): def is StaticNpcSpawn => def.type === 'static');
    for (const spawn of staticSpawns) {
        const template = staticNpcTemplates.get(spawn.baseId);
        if (template) {
            const containingPoi = poisForMap.find(poi => 
                spawn.position.x >= poi.position.x - poi.size.width / 2 &&
                spawn.position.x <= poi.position.x + poi.size.width / 2 &&
                spawn.position.y >= poi.position.y - poi.size.height / 2 &&
                spawn.position.y <= poi.position.y + poi.size.height / 2
            );

            let finalPosition = spawn.position;
            if (containingPoi) {
                const randomX = containingPoi.position.x - containingPoi.size.width / 2 + Math.random() * containingPoi.size.width;
                const randomY = containingPoi.position.y - containingPoi.size.height / 2 + Math.random() * containingPoi.size.height;
                finalPosition = { x: randomX, y: randomY };
            }
            finalNpcs.push(createNpcFromData(template, spawn.id, finalPosition, gameTime, mapId, template.factionId));
        } else {
            console.warn(`Could not find static NPC template for baseId: ${spawn.baseId}`);
        }
    }

    // Handle procedural monster spawns
    const monsterRules = spawnDefinitions.filter((def): def is ProceduralMonsterRule => def.type === 'procedural_monster');
    for (const rule of monsterRules) {
        const area = (MAPS[mapId] && MAP_AREAS_BY_MAP[mapId] || []).find(a => a.id === rule.areaId);
        if (!area) continue;

        for (let i = 0; i < rule.initialCount; i++) {
            const baseId = rule.monsterBaseIds[Math.floor(Math.random() * rule.monsterBaseIds.length)];
            const template = monsterTemplates.get(baseId);
            if (!template) continue;

            const level = Math.floor(Math.random() * (rule.levelRange[1] - rule.levelRange[0] + 1)) + rule.levelRange[0];
            const x = area.position.x - area.size.width / 2 + Math.random() * area.size.width;
            const y = area.position.y - area.size.height / 2 + Math.random() * area.size.height;
            const id = `proc-monster-${mapId}-${baseId}-${Date.now()}-${i}`;
            
            const spawnRuleId = `${mapId}-${rule.areaId}`;
            finalNpcs.push(createMonsterFromData(template, level, id, {x, y}, spawnRuleId, gameTime, mapId));
        }
    }

    // Handle procedural cultivator spawns
    const proceduralRules = spawnDefinitions.filter((def): def is ProceduralNpcRule => def.type === 'procedural');
    const generationPromises: Promise<NPC[]>[] = [];

    for (const rule of proceduralRules) {
        for (const roleDef of rule.roles) {
            const faction = FACTIONS.find(f => f.id === roleDef.factionId);
            if (!faction) {
                console.warn(`Could not find faction with ID: ${roleDef.factionId}`);
                continue;
            }

            const rolesToSpawnFrom = faction.roles.filter(r => roleDef.roleNames.includes(r.name));
            if (rolesToSpawnFrom.length === 0) {
                console.warn(`No valid roles found for names [${roleDef.roleNames.join(', ')}] in faction ${faction.name}`);
                continue;
            }
            
            const generationGroups: Record<string, { role: FactionRole, count: number }> = {};
            for(let i = 0; i < roleDef.count; i++) {
                const selectedRole = rolesToSpawnFrom[i % rolesToSpawnFrom.length];
                if (!generationGroups[selectedRole.name]) {
                    generationGroups[selectedRole.name] = { role: selectedRole, count: 0 };
                }
                generationGroups[selectedRole.name].count++;
            }

            for (const groupName in generationGroups) {
                const { role, count } = generationGroups[groupName];

                const minRealm = REALM_PROGRESSION[role.rangeRealm.min.realmIndex];
                const minLevel = minRealm.levels[role.rangeRealm.min.level];
                const maxRealm = REALM_PROGRESSION[role.rangeRealm.max.realmIndex];
                const maxLevel = maxRealm.levels[role.rangeRealm.max.level];

                const promptParts = [
                    `Bối cảnh: ${faction.name}.`,
                    `Hãy tạo ra ${count} NPC với vai trò là "${role.name}" và cấp độ quyền lực (power level) là ${role.power}.`,
                    `**Yêu cầu nghiêm ngặt:**`,
                    `- Cảnh giới tu luyện: từ ${minRealm.name} ${minLevel.levelName} đến ${maxRealm.name} ${maxLevel.levelName}.`,
                    `- Tuổi: từ ${role.ageRange[0]} đến ${role.ageRange[1]}. Hãy tạo ra sự đa dạng, có thể có thiên tài trẻ tuổi hoặc người già tư chất kém.`,
                    `- Tính cách: Dựa trên các từ khóa sau: ${role.personalityTags.join(', ')}.`,
                    `- Danh hiệu: Có ${Math.round((role.titleChance || 0) * 100)}% khả năng có danh hiệu. Nếu có, chủ đề nên là: ${role.titleThemes.join(', ')}.`,
                    `- Trang bị: Phẩm chất trang bị nên từ ${ITEM_TIER_NAMES[role.equipmentTierRange[0]]} đến ${ITEM_TIER_NAMES[role.equipmentTierRange[1]]}.`
                ];
                
                const generationPrompt = promptParts.join('\n');
                
                const promise = generateNpcs(generationPrompt, count)
                    .then(generatedData => {
                        const spawnablePOIs = roleDef.poiIds.map(id => poisForMap.find(p => p.id === id)).filter((p): p is PointOfInterest => !!p);
                        
                        return generatedData.map((npcData, index) => {
                            npcData.role = role.name;
                            npcData.power = role.power; 
                            
                            let x: number, y: number;
                            if (spawnablePOIs.length > 0) {
                                const poi = spawnablePOIs[index % spawnablePOIs.length]!;
                                x = poi.position.x - poi.size.width / 2 + Math.random() * poi.size.width;
                                y = poi.position.y - poi.size.height / 2 + Math.random() * poi.size.height;
                            } else {
                                x = Math.random() * mapData.size.width;
                                y = Math.random() * mapData.size.height;
                            }
                            const id = `proc-npc-${mapId}-${role.name.replace(/\s/g, '')}-${Date.now()}-${index}`;
                            return createNpcFromData(npcData, id, { x, y }, gameTime, mapId, roleDef.factionId);
                        });
                    });
                generationPromises.push(promise);
            }
        }
    }

    const proceduralNpcGroups = await Promise.all(generationPromises);
    proceduralNpcGroups.forEach(group => finalNpcs.push(...group));

    return finalNpcs;
};