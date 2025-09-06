import type { NPC, GameTime, PlayerState } from '../types/character';
import type { MapID, PointOfInterest } from '../types/map';
import type { LearnedSkill, SkillTier } from '../types/skill';
import type { InventorySlot } from '../types/item';
// FIX: Corrected import path from deprecated file to the correct module.
import { NPC_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/npc_spawns/index';
import { MONSTER_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/monster_spawns';
import { ALL_STATIC_NPCS } from '../data/npcs/static_npcs';
import { ALL_MONSTERS } from '../data/npcs/monsters';
import type { StaticNpcSpawn, ProceduralNpcRule, StaticNpcDefinition, ProceduralMonsterRule, MonsterDefinition, RoleSpawnDefinition, AgeCategory, FactionRole } from '../data/npcs/npc_types';
import { getAIClient } from './geminiService';
import { Type } from '@google/genai';
import { REALM_PROGRESSION } from '../constants';
import { MAPS, MAP_AREAS_BY_MAP, POIS_BY_MAP } from '../mapdata';
import { calculateAllStats, getCultivationInfo } from './cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { ALL_ITEMS } from '../data/items/index';
import { ALL_EQUIPMENT } from '../data/equipment';
import { EquipmentSlot, ITEM_TIER_NAMES } from '../types/equipment';
import type { LinhCan, LinhCanType, NpcBehavior } from '../types/linhcan';
import { LINH_CAN_TYPES, NPC_BEHAVIOR_TAGS } from '../types/linhcan';
import type { CharacterAttributes, CombatStats } from '../types/stats';
import { FACTIONS } from '../data/factions';
import { generateRandomLinhCan } from '../hooks/usePlayerPersistence';
import { FAMILY_NAMES, MALE_GIVEN_NAMES, FEMALE_GIVEN_NAMES } from '../data/names';
import { CHINH_TAGS, TRUNG_LAP_TAGS, TA_TAGS } from '../data/personality_tags';

const SYSTEM_INSTRUCTION_ONESHOT = `Bạn là một người quản trò (game master) sáng tạo và am hiểu cho một trò chơi nhập vai 'Tu Tiên'. Phản hồi của bạn phải có không khí, huyền bí và đúng với nhân vật. Hãy mô tả các sự kiện và đối thoại một cách sống động. Giữ cho câu trả lời ngắn gọn, thường là 2-3 câu. Luôn luôn nhập vai và sử dụng ngôn ngữ tiếng Việt phù hợp với bối cảnh tu tiên (ví dụ: lão phu, tại hạ, đạo hữu, linh khí...). Hãy xem xét thời gian trong ngày và mùa trong năm để điều chỉnh không khí của lời thoại.`;

interface GeneratedNpcData {
    title?: string | null;
    personalityTags: string[];
}


type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

const MAX_NAME_USAGE = 3;

// Phân bổ tuổi mặc định cho các NPC được tạo ngẫu nhiên.
const DEFAULT_AGE_DISTRIBUTION = { young: 0.6, middle: 0.2, old: 0.2 };

const getEstimatedLifespan = (realmIndex: number, level: number): number => {
    let totalLifespan = 80; // Mortal base from INITIAL_PLAYER_STATE
    
    // Sum up bonuses for all full realms before the target realm
    for (let r_idx = 0; r_idx < realmIndex; r_idx++) {
        const realm = REALM_PROGRESSION[r_idx];
        if (!realm) continue;
        for (const levelData of realm.levels) {
            const lifespanBonus = levelData?.bonuses?.maxThoNguyen;
            if (lifespanBonus && Array.isArray(lifespanBonus)) {
                totalLifespan += (lifespanBonus[0] + lifespanBonus[1]) / 2;
            }
        }
    }

    // Sum up bonuses for levels within the target realm
    const targetRealm = REALM_PROGRESSION[realmIndex];
    if (targetRealm) {
        for (let l_idx = 0; l_idx <= level; l_idx++) {
            const levelData = targetRealm.levels[l_idx];
            if (!levelData) continue;
            const lifespanBonus = levelData.bonuses.maxThoNguyen;
            if (lifespanBonus && Array.isArray(lifespanBonus)) {
                totalLifespan += (lifespanBonus[0] + lifespanBonus[1]) / 2;
            }
        }
    }
    
    return totalLifespan;
};

interface WeightedCultivation {
    realmIndex: number;
    level: number;
    weight: number;
}

const selectWeightedCultivation = (distribution: WeightedCultivation[]): { realmIndex: number, level: number } | null => {
    if (!distribution || distribution.length === 0) {
        return null;
    }

    const totalWeight = distribution.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) {
        // Fallback to a random choice if weights are bad
        return distribution[Math.floor(Math.random() * distribution.length)];
    }

    let random = Math.random() * totalWeight;

    for (const item of distribution) {
        if (random < item.weight) {
            return { realmIndex: item.realmIndex, level: item.level };
        }
        random -= item.weight;
    }

    return distribution[distribution.length - 1]; // Fallback in case of floating point issues
};

const generateAttributesForRole = (roleDef: FactionRole): CharacterAttributes => {
    const TOTAL_POINTS = 60;
    const MIN_PER_ATTRIBUTE = 5;
    const attributes: CharacterAttributes = { canCot: 0, thanPhap: 0, thanThuc: 0, ngoTinh: 0, coDuyen: 0, tamCanh: 0 };
    const attrKeys = Object.keys(attributes) as (keyof CharacterAttributes)[];
    
    // 1. Assign minimum points
    attrKeys.forEach(key => attributes[key] = MIN_PER_ATTRIBUTE);
    let pointsRemaining = TOTAL_POINTS - (MIN_PER_ATTRIBUTE * attrKeys.length);

    // 2. Distribute remaining points based on weights
    const weights = roleDef.attributeProfile;
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    if (totalWeight > 0) {
        const weightedKeys: (keyof CharacterAttributes)[] = [];
        for (const key of attrKeys) {
            for (let i = 0; i < weights[key]; i++) {
                weightedKeys.push(key);
            }
        }
        
        for (let i = 0; i < pointsRemaining; i++) {
            const randomKey = weightedKeys[Math.floor(Math.random() * weightedKeys.length)];
            attributes[randomKey]++;
        }
    } else {
        // Fallback to pure random if no weights are defined
        for (let i = 0; i < pointsRemaining; i++) {
            const randomKey = attrKeys[Math.floor(Math.random() * attrKeys.length)];
            attributes[randomKey]++;
        }
    }

    return attributes;
};


export function createNpcFromData(
    data: (GeneratedNpcData | StaticNpcDefinition) & { 
        role: string;
        name?: string;
        power?: number; 
        gender?: 'Nam' | 'Nữ';
        behaviors?: string[]; 
        realmName?: string; 
        levelDescription?: string;
        skillTiers?: { tamPhapTier: SkillTier; congPhapTiers: SkillTier[]; };
        equipmentTier?: SkillTier;
        linhThach?: number;
        camNgo?: number;
        attributes?: CharacterAttributes; // Keep for static NPCs
    }, 
    id: string, 
    position: {x:number, y:number}, 
    gameTime: GameTime, 
    homeMapId: MapID, 
    nameUsageCounts: PlayerState['nameUsageCounts'],
    factionId?: string, 
    homePoiId?: string, 
    ageCategory?: AgeCategory,
    roleDef?: FactionRole,
    spawnRuleId?: string,
): NPC {
    // --- NEW LOGIC FOR PROCEDURAL NPCS ---
    if (roleDef && !('realmName' in data)) {
        // 1. Generate Gender
        data.gender = Math.random() < 0.5 ? 'Nam' : 'Nữ';

        // 2. Generate Behaviors
        const numBehaviors = Math.floor(Math.random() * 2) + 1; // 1 to 2
        const shuffledBehaviors = [...NPC_BEHAVIOR_TAGS].sort(() => 0.5 - Math.random());
        data.behaviors = shuffledBehaviors.slice(0, numBehaviors);

        // 3. Generate Realm & Level using Weighted Distribution
        const chosenCultivation = selectWeightedCultivation(roleDef.realmDistribution);
        if (chosenCultivation) {
            data.realmName = REALM_PROGRESSION[chosenCultivation.realmIndex].name;
            data.levelDescription = REALM_PROGRESSION[chosenCultivation.realmIndex].levels[chosenCultivation.level].levelName;
        } else {
            // Fallback for safety
            data.realmName = REALM_PROGRESSION[0].name;
            data.levelDescription = REALM_PROGRESSION[0].levels[0].levelName;
        }
        
        const { realmIndex, level } = chosenCultivation!;

        // 4. Generate Tiers (PHASE 2 LOGIC)
        const [minTier, maxTier] = roleDef.equipmentTierRange;
        let chosenTier: SkillTier;

        if (minTier === maxTier) {
            chosenTier = minTier;
        } else {
            const minRealmIndex = Math.min(...roleDef.realmDistribution.map(d => d.realmIndex));
            const maxRealmIndex = Math.max(...roleDef.realmDistribution.map(d => d.realmIndex));
            const realmProgress = maxRealmIndex > minRealmIndex 
                ? (realmIndex - minRealmIndex) / (maxRealmIndex - minRealmIndex)
                : 0.5; // If only one realm is possible for the role.
            
            chosenTier = (Math.random() < realmProgress) ? maxTier : minTier;
        }
        data.equipmentTier = chosenTier;
        
        const tierMap: Record<SkillTier, number> = { HOANG: 0, HUYEN: 1, DIA: 2, THIEN: 3 };
        const tierIndexes = Object.keys(tierMap) as SkillTier[];
        const chosenEquipmentTierIndex = tierMap[chosenTier];

        const tamPhapTier = tierIndexes[Math.floor(Math.random() * (chosenEquipmentTierIndex + 1))];
        const congPhapTiers: SkillTier[] = [];
        const numCongPhap = Math.random() > 0.3 ? 2 : 1;
        for(let i = 0; i < numCongPhap; i++) {
            congPhapTiers.push(tierIndexes[Math.floor(Math.random() * (chosenEquipmentTierIndex + 1))]);
        }
        data.skillTiers = { tamPhapTier, congPhapTiers };

        // 5. Generate Assets (PHASE 2 FORMULAS)
        data.linhThach = Math.floor((Math.random() * 50 + 20) * Math.pow(realmIndex + 1, 4) * (level + 1));
        data.camNgo = Math.floor((Math.random() * 100 + 50) * Math.pow(realmIndex + 1, 1.5) * (level + 1));
        
        // 6. NEW: Generate attributes from code
        data.attributes = generateAttributesForRole(roleDef);
    }

    // --- Name Generation ---
    const gender = data.gender || 'Nam';

    // Find faction to check for familyName
    const faction = FACTIONS.find(f => f.id === factionId);
    
    const familyName = faction?.familyName || FAMILY_NAMES[Math.floor(Math.random() * FAMILY_NAMES.length)];
    
    // NEW Name Generation with Usage Counter
    let givenName = '';
    const isMale = gender === 'Nam';
    const nameList = isMale ? MALE_GIVEN_NAMES : FEMALE_GIVEN_NAMES;
    const counts = isMale ? nameUsageCounts!.male : nameUsageCounts!.female;
    
    let availableNames = nameList.filter(name => (counts[name] || 0) < MAX_NAME_USAGE);
    
    if (availableNames.length === 0) {
        // Reset if all names are exhausted
        if (isMale) nameUsageCounts!.male = {};
        else nameUsageCounts!.female = {};
        availableNames = nameList;
    }
    
    givenName = availableNames[Math.floor(Math.random() * availableNames.length)];
    counts[givenName] = (counts[givenName] || 0) + 1; // Increment the counter

    const npcName = data.name || `${familyName} ${givenName}`;
    
    const realmIndex = REALM_PROGRESSION.findIndex(r => r.name === data.realmName);
    const realm = realmIndex !== -1 ? REALM_PROGRESSION[realmIndex] : REALM_PROGRESSION[0];
    
    let level = 0;
    const levelIndex = realm.levels.findIndex(l => l.levelName === data.levelDescription);

    if (levelIndex !== -1) {
        level = levelIndex;
    } else {
        const parsedLevel = parseInt(data.levelDescription!.replace(/\D/g, ''));
        if (!isNaN(parsedLevel)) {
            level = parsedLevel - 1; // "Tầng 1" -> index 0
        }
    }
    level = Math.max(0, Math.min(level, realm.levels.length - 1));

    const cultivation = { realmIndex: realmIndex !== -1 ? realmIndex : 0, level };
    
    // --- Simulate level-ups to get accumulated bonuses ---
    const baseAttributes: CharacterAttributes = { ...data.attributes! }; // Store the original "talent"
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

    const learnedSkills: LearnedSkill[] = [];
    const equipment: Partial<Record<EquipmentSlot, InventorySlot>> = {};
    const inventory: InventorySlot[] = [];
    const forSale: { itemId: string, stock: number, priceModifier?: number }[] = [];

    // --- NEW: Generate Skills, Equipment, and Inventory from Tiers ---
    if ('skillTiers' in data && data.skillTiers && 'equipmentTier' in data && data.equipmentTier) {
        // Generate Skills
        const { tamPhapTier, congPhapTiers } = data.skillTiers;
        const possibleTamPhap = ALL_SKILLS.filter(s => s.type === 'TAM_PHAP' && s.tier === tamPhapTier);
        if (possibleTamPhap.length > 0) {
            const selected = possibleTamPhap[Math.floor(Math.random() * possibleTamPhap.length)];
            learnedSkills.push({ skillId: selected.id, currentLevel: 1 });
        }
        congPhapTiers.forEach(tier => {
            const possibleCongPhap = ALL_SKILLS.filter(s => s.type === 'CONG_PHAP' && s.tier === tier);
            if(possibleCongPhap.length > 0) {
                 const selected = possibleCongPhap[Math.floor(Math.random() * possibleCongPhap.length)];
                 learnedSkills.push({ skillId: selected.id, currentLevel: 1 });
            }
        });

        // Generate Equipment
        const { equipmentTier } = data;
        const possibleEquipment = ALL_EQUIPMENT.filter(e => e.tier === equipmentTier);
        const slots: EquipmentSlot[] = ['WEAPON', 'HEAD', 'ARMOR', 'LEGS', 'ACCESSORY'];
        slots.forEach(slot => {
            const itemsForSlot = possibleEquipment.filter(e => e.slot === slot);
            if (itemsForSlot.length > 0 && Math.random() > 0.3) { // 70% chance to have an item
                const selected = itemsForSlot[Math.floor(Math.random() * itemsForSlot.length)];
                equipment[slot] = { itemId: selected.id, quantity: 1 };
            }
        });
        
        // Generate Inventory and For Sale items
        const isTrader = (data.behaviors || []).includes('TRADER');
        const numSaleItems = isTrader ? Math.floor(Math.random() * 5) + 3 : 0; // 3-7 for trader
        const numInventoryItems = isTrader ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 3) + 1; // 2-5 for trader, 1-3 for others

        const sellableItems = ALL_ITEMS.filter(i => i.value && i.value > 10 && i.type !== 'quest');
        if (sellableItems.length > 0) {
            for (let i = 0; i < numSaleItems; i++) {
                const item = sellableItems[Math.floor(Math.random() * sellableItems.length)];
                forSale.push({
                    itemId: item.id,
                    stock: Math.floor(Math.random() * 5) + 1,
                    priceModifier: 1.2 + Math.random() * 0.6 // 1.2x to 1.8x
                });
            }
        }
        const commonItems = ALL_ITEMS.filter(i => ['material', 'consumable', 'herb', 'ore'].includes(i.type));
         if (commonItems.length > 0) {
            for (let i = 0; i < numInventoryItems; i++) {
                 const item = commonItems[Math.floor(Math.random() * commonItems.length)];
                 inventory.push({
                     itemId: item.id,
                     quantity: Math.floor(Math.random() * 3) + 1,
                 });
            }
         }


    } else if ('learnedSkillIds' in data) { // Fallback for static NPCs
        (data.learnedSkillIds || []).forEach(id => learnedSkills.push({ skillId: id, currentLevel: 1 }));
        if (data.equipment) {
             for (const key in data.equipment) {
                const slot = key as EquipmentSlot;
                const item = (data.equipment as any)[slot];
                if (item && item.itemId) equipment[slot] = { itemId: item.itemId, quantity: 1 };
             }
        }
        if (data.initialInventory) inventory.push(...data.initialInventory);
        if (data.forSale) forSale.push(...data.forSale);
    }
    
    let linhCan: LinhCan[];

    // If linhCan is provided (static NPC), use it. Otherwise, generate it for procedural NPCs.
    if ('linhCan' in data && Array.isArray(data.linhCan) && data.linhCan.length > 0) {
        linhCan = (data.linhCan || [])
            .map(lc => ({
                type: lc.type.toUpperCase() as LinhCanType,
                purity: lc.purity,
            }))
            .filter(lc => LINH_CAN_TYPES.includes(lc.type));
    } else {
        linhCan = generateRandomLinhCan();
    }

    // Fallback in case generation somehow fails or static NPC has no linh can
    if (linhCan.length === 0) {
        linhCan.push({ type: 'THO', purity: 20 });
    }

    const { finalStats, finalAttributes } = calculateAllStats(baseAttributes, cultivation, npcCultivationBonuses, learnedSkills, ALL_SKILLS, equipment, ALL_ITEMS, linhCan);
    
    const npcCultivationStats = npcCultivationBonuses;
    
    let age: number;
    // Check if age is predefined (for static NPCs)
    if ('age' in data && typeof data.age === 'number') {
        age = data.age;
    } else {
        // --- NEW TALENT-BASED AGE GENERATION ---
        const REALM_TIME_RANGES: [number, number][] = [
            [5, 15],    // Luyện Khí
            [20, 80],   // Trúc Cơ
            [50, 150],  // Kết Tinh
            [100, 200], // Kim Đan
            [200, 400], // Nguyên Anh
            [500, 1000] // Hóa Thần
        ];

        // 1. Calculate Minimum Age (Genius Path)
        let minAge = 7; // Start cultivating at 7
        for (let i = 0; i < cultivation.realmIndex; i++) {
            const range = REALM_TIME_RANGES[i] || [10, 20];
            minAge += range[0]; // Add the minimum time for each completed realm
        }

        // 2. Get Maximum Lifespan (Upper Bound)
        const maxAge = getEstimatedLifespan(cultivation.realmIndex, cultivation.level);

        // 3. Calculate Talent Modifier (Can Cot + Ngo Tinh)
        const talentScore = data.attributes!.canCot + data.attributes!.ngoTinh;
        const minTalent = 10; // Lowest possible (5+5)
        const maxTalent = 30; // Highest possible (15+15)
        
        // Normalize talent score to a 0-1 range. Low talent -> 1, High talent -> 0
        const talentModifier = 1 - ((Math.min(maxTalent, Math.max(minTalent, talentScore)) - minTalent) / (maxTalent - minTalent));
        const clampedModifier = Math.max(0.05, Math.min(0.95, talentModifier));

        // 4. Override talent modifier if an age category is specified
        let finalTalentModifier = clampedModifier;
        if (ageCategory) {
            switch (ageCategory) {
                case 'Young':
                    finalTalentModifier = Math.random() * 0.3; // 0% - 30% of age range
                    break;
                case 'Middle':
                    finalTalentModifier = 0.35 + Math.random() * 0.3; // 35% - 65% of age range
                    break;
                case 'Old':
                    finalTalentModifier = 0.7 + Math.random() * 0.3; // 70% - 100% of age range
                    break;
            }
        }
        
        // 5. Interpolate age based on the final modifier
        const ageRange = (maxAge * 0.98) - minAge; // Use 98% of max age as a buffer
        let calculatedAge = minAge + (ageRange * finalTalentModifier);
        
        // Add some slight randomness
        calculatedAge *= (1 + (Math.random() * 0.1 - 0.05)); // +/- 5%

        age = Math.floor(Math.max(7, calculatedAge));
        
        // Final check to ensure age does not exceed max lifespan
        age = Math.min(age, Math.floor(finalStats.maxThoNguyen * 0.98));
    }

    const birthTime: GameTime = {
        year: gameTime.year - age,
        season: 'Xuân',
        month: 1,
        day: 1,
        hour: 0,
        minute: 0
    };
    
    const behaviors = ('behaviors' in data && data.behaviors && data.behaviors.length > 0) ? data.behaviors : ['WANDERER'];

    const finalTitle = data.title;

    return {
        name: npcName,
        gender: gender,
        npcType: 'cultivator',
        title: finalTitle,
        role: data.role,
        factionId: factionId,
        power: data.power,
        behaviors: behaviors as NpcBehavior[],
        personalityTags: 'personalityTags' in data ? data.personalityTags : [],
        id,
        spawnRuleId,
        position,
        currentMap: homeMapId,
        homeMapId,
        homePoiId: homePoiId,
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
        relationships: 'relationships' in data && data.relationships ? data.relationships : [],
    };
}

const getEquivalentCultivationForMonster = (monsterLevel: number): { realmIndex: number, level: number } => {
    switch (monsterLevel) {
        case 1: return { realmIndex: 0, level: Math.floor(Math.random() * 9) }; // Luyện Khí 1-9
        case 2: return { realmIndex: 0, level: 9 + Math.floor(Math.random() * 4) }; // Luyện Khí 10-13
        case 3: return { realmIndex: 1, level: Math.floor(Math.random() * 2) }; // Trúc Cơ Sơ-Trung
        case 4: return { realmIndex: 1, level: 2 + Math.floor(Math.random() * 2) }; // Trúc Cơ Hậu-Đỉnh
        case 5: return { realmIndex: 2, level: Math.floor(Math.random() * 2) }; // Kết Tinh Sơ-Trung
        case 6: return { realmIndex: 2, level: 2 + Math.floor(Math.random() * 2) }; // Kết Tinh Hậu-Đỉnh
        case 7: return { realmIndex: 3, level: Math.floor(Math.random() * 4) }; // Kim Đan
        case 8: return { realmIndex: 4, level: Math.floor(Math.random() * 4) }; // Nguyên Anh
        case 9: return { realmIndex: 5, level: Math.floor(Math.random() * 3) }; // Hóa Thần Sơ-Hậu
        case 10: return { realmIndex: 5, level: 3 }; // Hóa Thần Đỉnh Phong
        default: return { realmIndex: 0, level: 0 };
    }
}

export function createMonsterFromData(template: MonsterDefinition, level: number, id: string, position: {x:number, y:number}, spawnRuleId: string | undefined, gameTime: GameTime, currentMap: MapID): NPC {
    const equivalentCultivation = getEquivalentCultivationForMonster(level);
    const { realmIndex, level: cultivationLevel } = equivalentCultivation;

    const baseAttributes: CharacterAttributes = { ...template.attributes };
    const finalStats: Mutable<Partial<CombatStats>> = { ...template.baseStats };

    for (let r_idx = 0; r_idx <= realmIndex; r_idx++) {
        const currentRealm = REALM_PROGRESSION[r_idx];
        if (!currentRealm) continue;

        const maxLevelInThisRealm = (r_idx === realmIndex) ? cultivationLevel : currentRealm.levels.length - 1;
        
        for (let l_idx = 0; l_idx <= maxLevelInThisRealm; l_idx++) {
            const levelData = currentRealm.levels[l_idx];
            if (levelData?.bonuses) {
                for (const key in levelData.bonuses) {
                    const statKey = key as keyof (CombatStats & CharacterAttributes);
                    if (statKey in baseAttributes) continue; 
                    
                    const value = levelData.bonuses[statKey];
                    let rolledValue = 0;

                    if (typeof value === 'number') {
                        rolledValue = value;
                    } else if (Array.isArray(value)) {
                        rolledValue = Math.floor(Math.random() * (value[1] - value[0] + 1)) + value[0];
                    }

                    if (rolledValue !== 0) {
                       (finalStats as any)[statKey] = ((finalStats as any)[statKey] || 0) + rolledValue;
                    }
                }
            }
        }
    }

    const finalAttributes = baseAttributes;
    finalStats.maxHp = (finalStats.maxHp || 0) + finalAttributes.canCot * 5;
    finalStats.attackPower = (finalStats.attackPower || 0) + finalAttributes.thanThuc * 1;
    finalStats.defensePower = (finalStats.defensePower || 0) + Math.round(finalAttributes.canCot * 0.5);
    finalStats.speed = (finalStats.speed || 0) + finalAttributes.thanPhap * 0.5;
    finalStats.critRate = (finalStats.critRate || 0) + finalAttributes.thanThuc / 3000 + finalAttributes.coDuyen / 6000;
    finalStats.critDamage = (finalStats.critDamage || 0) + finalAttributes.coDuyen / 500;
    finalStats.armorPenetration = (finalStats.armorPenetration || 0) + (finalAttributes.thanThuc / 3000) + (finalAttributes.coDuyen / 6000);

    const allStatKeys: (keyof CombatStats)[] = ['maxQi', 'maxMana', 'maxThoNguyen', 'kimDamageBonus', 'mocDamageBonus', 'thuyDamageBonus', 'hoaDamageBonus', 'thoDamageBonus', 'phongDamageBonus', 'loiDamageBonus', 'bangDamageBonus', 'quangDamageBonus', 'amDamageBonus'];
    for(const key of allStatKeys) {
        if(!(key in finalStats)) {
            (finalStats as any)[key] = 0;
        }
    }
    
    Object.keys(finalStats).forEach(key => {
        const statKey = key as keyof CombatStats;
        if (statKey !== 'critRate' && statKey !== 'critDamage' && statKey !== 'armorPenetration') {
             if (typeof (finalStats as any)[statKey] === 'number') {
                (finalStats as any)[statKey] = Math.round((finalStats as any)[statKey]);
            }
        }
    });

    const age = Math.floor(Math.random() * 10) + 1;
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
        gender: 'Nam',
        npcType: 'monster',
        spawnRuleId,
        role: 'Yêu Thú',
        position,
        currentMap: currentMap,
        homeMapId: currentMap,
        level,
        baseAttributes,
        attributes: finalAttributes,
        stats: finalStats as CombatStats,
        hp: finalStats.maxHp!,
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

// Helper function to pick random unique elements from an array
const pickRandom = (arr: string[], num: number): string[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const generatePersonalityTags = (): string[] => {
    const combinations = [
        { weights: [3, 0, 0], weight: 15 }, // 3 Chính
        { weights: [0, 0, 3], weight: 15 }, // 3 Tà
        { weights: [0, 3, 0], weight: 10 }, // 3 Trung Lập
        { weights: [2, 1, 0], weight: 15 }, // 2 Chính, 1 Trung Lập
        { weights: [2, 0, 1], weight: 10 }, // 2 Chính, 1 Tà
        { weights: [1, 2, 0], weight: 10 }, // 1 Chính, 2 Trung Lập
        { weights: [0, 2, 1], weight: 10 }, // 2 Trung Lập, 1 Tà
        { weights: [1, 0, 2], weight: 5 },  // 1 Chính, 2 Tà
        { weights: [0, 1, 2], weight: 5 },  // 1 Trung Lập, 2 Tà
        { weights: [1, 1, 1], weight: 15 }, // 1 của mỗi loại
    ];

    const totalWeight = combinations.reduce((sum, combo) => sum + combo.weight, 0);
    let random = Math.random() * totalWeight;
    let chosenCombination = combinations[0].weights;

    for (const combo of combinations) {
        if (random < combo.weight) {
            chosenCombination = combo.weights;
            break;
        }
        random -= combo.weight;
    }

    const [numChinh, numTrungLap, numTa] = chosenCombination;
    
    const tags: string[] = [];
    tags.push(...pickRandom(CHINH_TAGS, numChinh));
    tags.push(...pickRandom(TRUNG_LAP_TAGS, numTrungLap));
    tags.push(...pickRandom(TA_TAGS, numTa));

    return tags;
};

const generateSingleNpcTitle = async (generationPrompt: string, personalityTags: string[]): Promise<{ title: string | null, tokenCount: number }> => {
    try {
        const client = getAIClient();
        const prompt = `${generationPrompt}
Dựa trên bối cảnh và vai trò đã cho, hãy tạo ra MỘT danh hiệu (title) tu tiên độc đáo.
Danh hiệu phải phù hợp với chủ đề và các thẻ tính cách sau: [${personalityTags.join(', ')}].
Nếu không có danh hiệu nào hay, hãy để trống hoặc null.`;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_ONESHOT,
                temperature: 0.9,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Danh hiệu tu tiên của NPC. Có thể là chuỗi rỗng hoặc null.", nullable: true },
                    },
                    required: []
                }
            }
        });
        const tokenCount = response.usageMetadata?.totalTokenCount || 0;
        if (!response.text) { throw new Error("Empty response"); }
        const data = JSON.parse(response.text.trim()) as { title?: string | null };
        return { title: data.title || null, tokenCount };
    } catch (error) {
        console.error("Error generating single NPC title from Gemini:", error);
        return { title: null, tokenCount: 0 };
    }
};


export const loadNpcsForMap = async (mapId: MapID, poisByMap: Record<MapID, PointOfInterest[]>, playerState: PlayerState): Promise<{ npcs: NPC[], totalTokenCount: number, updatedNameCounts: PlayerState['nameUsageCounts'] }> => {
    const spawnDefinitions = NPC_SPAWN_DEFINITIONS_BY_MAP[mapId] || [];
    const monsterRules = MONSTER_SPAWN_DEFINITIONS_BY_MAP[mapId] || [];
    const nameCountsCopy = JSON.parse(JSON.stringify(playerState.nameUsageCounts || { male: {}, female: {} }));

    if (!spawnDefinitions.length && !monsterRules.length) return { npcs: [], totalTokenCount: 0, updatedNameCounts: nameCountsCopy };

    const finalNpcs: NPC[] = [];
    const staticNpcTemplates = new Map(ALL_STATIC_NPCS.map(npc => [npc.baseId, npc]));
    const monsterTemplates = new Map(ALL_MONSTERS.map(m => [m.baseId, m]));
    let totalTokenCount = 0;

    const allPois = Object.values(poisByMap).flat();
    const mapData = MAPS[mapId];

    const getInitialPosition = (homeMapId: MapID, homePoiId?: string): { x: number, y: number } => {
        const homeMapData = MAPS[homeMapId];
        const poi = homePoiId ? allPois.find(p => p.id === homePoiId) : undefined;

        // 70% chance to spawn in home POI if it exists
        if (poi && Math.random() < 0.7) {
            const x = poi.position.x - poi.size.width / 2 + Math.random() * poi.size.width;
            const y = poi.position.y - poi.size.height / 2 + Math.random() * poi.size.height;
            return { x, y };
        }
        
        // 30% chance (or if no POI) to spawn randomly on their home map
        const x = Math.random() * homeMapData.size.width;
        const y = Math.random() * homeMapData.size.height;
        return { x, y };
    };

    // Handle static spawns
    const staticSpawns = spawnDefinitions.filter((def): def is StaticNpcSpawn => def.type === 'static');
    for (const spawn of staticSpawns) {
        const template = staticNpcTemplates.get(spawn.baseId);
        if (template) {
            const initialPosition = getInitialPosition(mapId, template.homePoiId);
            finalNpcs.push(createNpcFromData(template, spawn.id, initialPosition, playerState.time, mapId, nameCountsCopy, template.factionId, template.homePoiId));
        } else {
            console.warn(`Could not find static NPC template for baseId: ${spawn.baseId}`);
        }
    }

    // Handle procedural monster spawns
    for (const rule of monsterRules) {
        const area = (MAPS[mapId] && MAP_AREAS_BY_MAP[mapId] || []).find(a => a.id === rule.areaId);
        if (!area) continue;

        for (let i = 0; i < rule.initialCount; i++) {
            const baseId = rule.monsterBaseIds[Math.floor(Math.random() * rule.monsterBaseIds.length)];
            const template = monsterTemplates.get(baseId);
            if (!template) continue;

            const level = Math.floor(Math.random() * (template.levelRange[1] - template.levelRange[0] + 1)) + template.levelRange[0];
            const x = area.position.x - area.size.width / 2 + Math.random() * area.size.width;
            const y = area.position.y - area.size.height / 2 + Math.random() * area.size.height;
            const id = `proc-monster-${mapId}-${baseId}-${Date.now()}-${i}`;
            
            const spawnRuleId = `${mapId}-${rule.areaId}`;
            finalNpcs.push(createMonsterFromData(template, level, id, {x, y}, spawnRuleId, playerState.time, mapId));
        }
    }

    // Handle procedural cultivator spawns
    const proceduralRules = spawnDefinitions.filter((def): def is ProceduralNpcRule => def.type === 'procedural');
    
    let ruleIndex = -1;
    for (const rule of proceduralRules) {
        ruleIndex++;
        const ruleId = `${mapId}-${ruleIndex}`;
        for (const roleDef of rule.roles) {
            const faction = FACTIONS.find(f => f.id === roleDef.factionId);
            if (!faction) {
                console.warn(`Could not find faction with ID: ${roleDef.factionId}`);
                continue;
            }

            for (const distribution of roleDef.roleDistribution) {
                const role = faction.roles.find(r => r.name === distribution.roleName);
                if (!role) {
                    console.warn(`Role "${distribution.roleName}" not found in faction "${faction.name}".`);
                    continue;
                }

                const count = distribution.count;
                if (count <= 0) continue;

                const ageCategories: (AgeCategory | undefined)[] = [];
                const ageDistribution = roleDef.ageDistribution || DEFAULT_AGE_DISTRIBUTION;
                
                const numYoung = Math.floor(count * ageDistribution.young);
                const numMiddle = Math.floor(count * ageDistribution.middle);
                const numOld = Math.floor(count * ageDistribution.old);

                for (let i = 0; i < numYoung; i++) ageCategories.push('Young');
                for (let i = 0; i < numMiddle; i++) ageCategories.push('Middle');
                for (let i = 0; i < numOld; i++) ageCategories.push('Old');
                
                while (ageCategories.length < count) ageCategories.push('Middle');

                ageCategories.sort(() => 0.5 - Math.random());

                for (let i = 0; i < count; i++) {
                    const personalityTags = generatePersonalityTags();
                    
                    const npcDataForCreation = {
                        role: role.name,
                        power: role.name === 'Tán tu' ? undefined : (role.power),
                        title: null,
                        personalityTags: personalityTags,
                    };

                    const id = `proc-npc-${mapId}-${role.name.replace(/\s/g, '')}-${Date.now()}-${i}`;
                    const homePoiId = roleDef.poiIds.length > 0 ? roleDef.poiIds[0] : undefined;
                    const initialPosition = getInitialPosition(mapId, homePoiId);

                    let newNpc = createNpcFromData(
                        npcDataForCreation,
                        id,
                        initialPosition,
                        playerState.time,
                        mapId,
                        nameCountsCopy,
                        roleDef.factionId,
                        homePoiId,
                        ageCategories[i],
                        role,
                        ruleId
                    );

                    const titleChance = role.titleChance.base + ((newNpc.cultivation?.realmIndex || 0) * role.titleChance.perRealm);
                    
                    if (Math.random() < titleChance) {
                        const isUnaffiliated = role.name === 'Tán tu';
                        const powerInstruction = role.power && !isUnaffiliated ? `và cấp độ quyền lực (power level) là ${role.power}` : 'và không có cấp độ quyền lực';
                        const promptParts = [
                            `Bối cảnh: ${faction.name}.`,
                            `Vai trò NPC: "${role.name}" ${powerInstruction}.`,
                            `Chủ đề gợi ý cho danh hiệu: ${role.titleThemes.join(', ')}.`,
                        ];
                        const generationPrompt = promptParts.join('\n');
                        
                        const { title, tokenCount } = await generateSingleNpcTitle(generationPrompt, personalityTags);
                        totalTokenCount += tokenCount;
                        if (title) {
                            newNpc.title = title;
                        }
                    }

                    newNpc.spawnRuleId = ruleId;
                    finalNpcs.push(newNpc);
                }
            }
        }
    }

    return { npcs: finalNpcs, totalTokenCount, updatedNameCounts: nameCountsCopy };
};