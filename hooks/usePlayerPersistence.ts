import { useState, useEffect, useCallback } from 'react';
import type { PlayerState, NPC } from '../types/character';
import { INITIAL_PLAYER_STATE as BASE_INITIAL_PLAYER_STATE, DAYS_PER_MONTH, MONTHS_PER_YEAR, REALM_PROGRESSION } from '../constants';
import { calculateAllStats, getNextCultivationLevel, getRealmLevelInfo } from '../services/cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { advanceTime } from '../services/timeService';
import { ALL_ITEMS } from '../data/items/index';
import type { LinhCan, LinhCanType } from '../types/linhcan';
import { LINH_CAN_TYPES } from '../types/linhcan';
import type { CharacterAttributes, CombatStats } from '../types/stats';
import { MAPS, POIS_BY_MAP } from '../mapdata';
import { loadNpcsForMap } from '../services/npcService';
import { NPC_SPAWN_DEFINITIONS_BY_MAP } from '../mapdata/npc_spawns';
import type { MapID } from '../types/map';
import { initializeFactionAssets } from '../services/factionService';
import { ALL_STATIC_NPCS } from '../data/npcs/static_npcs';
import LZString from 'lz-string';


const PLAYER_STATE_STORAGE_KEY = 'tu_tien_player_state_v3';
const CURRENT_SAVE_VERSION = '2.2';

export const INITIAL_PLAYER_STATE: PlayerState = {
    ...BASE_INITIAL_PLAYER_STATE,
    // FIX: Provide default attributes for a new character to satisfy the PlayerState type and fix initialization logic.
    attributes: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
    baseAttributes: { canCot: 10, thanPhap: 10, thanThuc: 10, ngoTinh: 10, coDuyen: 10, tamCanh: 10 },
    journal: [],
    saveVersion: CURRENT_SAVE_VERSION,
    nextMonsterSpawnCheck: {},
    nextInteractableSpawnCheck: {},
    harvestedInteractableIds: [],
    lastNpcProgressionCheck: { year: 17, season: 'Xuân', month: 1, day: 1, hour: 8, minute: 0 },
    factionRecruitmentTimers: {},
    deathInfo: {},
    apiUsageStats: {
        totalTokens: 0,
        calls: {
            getInteractionResponse: 0,
            getNpcDefeatDecision: 0,
            generateNpcs: 0,
            generatePlaceNames: 0,
            sendMessage: 0,
        }
    },
    affinity: {},
    npcAffinityStore: {},
    nameUsageCounts: { male: {}, female: {} },
    leaderboards: {},
    lastLeaderboardUpdateYear: 0,
    lastYoungStarsLeaderboardUpdateYear: 0,
    markedNpcIds: [],
    factionAssets: {},
};
export { DAYS_PER_MONTH };


const getSeasonLegacy = (month: number): 'Xuân' | 'Hạ' | 'Thu' | 'Đông' => {
    if (month >= 1 && month <= 3) return 'Xuân';
    if (month >= 4 && month <= 6) return 'Hạ';
    if (month >= 7 && month <= 9) return 'Thu';
    return 'Đông';
};

export const generateRandomLinhCan = (): LinhCan[] => {
    const BASE_ELEMENTS: LinhCanType[] = ['KIM', 'MOC', 'THUY', 'HOA', 'THO'];
    
    const VARIANT_COMBINATIONS: Record<string, LinhCanType> = {
        'KIM-THUY': 'BĂNG', 'THUY-KIM': 'BĂNG',
        'THUY-HOA': 'BĂNG', 'HOA-THUY': 'BĂNG',
        'MOC-HOA': 'LOI', 'HOA-MOC': 'LOI',
        'HOA-KIM': 'LOI', 'KIM-HOA': 'LOI',
        'KIM-MOC': 'PHONG', 'MOC-KIM': 'PHONG',
        'MOC-THO': 'PHONG', 'THO-MOC': 'PHONG',
        'HOA-THO': 'QUANG', 'THO-HOA': 'QUANG',
        'KIM-THO': 'QUANG', 'THO-KIM': 'QUANG',
        'THUY-THO': 'AM', 'THO-THUY': 'AM',
        'THUY-MOC': 'AM', 'MOC-THUY': 'AM',
    };
    
    const roll = Math.random();
    let numBaseRoots = 0;
    let hasVariant = false;

    // Tỉ lệ độ hiếm do người dùng đề xuất
    if (roll < 0.05) { // 5% Thiên Linh Căn (1)
        numBaseRoots = 1;
    } else if (roll < 0.25) { // 20% Chân Linh Căn (2)
        numBaseRoots = 2;
    } else if (roll < 0.30) { // 5% Dị Linh Căn (2+1)
        numBaseRoots = 2;
        hasVariant = true;
    } else if (roll < 0.65) { // 35% Chân Linh Căn (3)
        numBaseRoots = 3;
    } else if (roll < 0.90) { // 25% Ngụy Linh Căn (4)
        numBaseRoots = 4;
    } else { // 10% Ngụy Linh Căn (5)
        numBaseRoots = 5;
    }

    const shuffledBaseElements = [...BASE_ELEMENTS].sort(() => 0.5 - Math.random());
    
    const baseRoots: LinhCan[] = shuffledBaseElements.slice(0, numBaseRoots).map(type => ({
        type: type,
        purity: Math.floor(Math.random() * 91) + 10,
    }));
    
    if (hasVariant) {
        // Đảm bảo có đúng 2 linh căn gốc để tạo biến dị
        const root1 = baseRoots[0];
        const root2 = baseRoots[1];
        
        const combinationKey1 = `${root1.type}-${root2.type}`;
        const combinationKey2 = `${root2.type}-${root1.type}`;
        const variantType = VARIANT_COMBINATIONS[combinationKey1] || VARIANT_COMBINATIONS[combinationKey2];

        if (variantType) {
            const newVariantRoot: LinhCan = {
                type: variantType,
                purity: Math.min(100, Math.max(root1.purity, root2.purity) + Math.floor(Math.random() * 16) + 5)
            };
            return [...baseRoots, newVariantRoot];
        }
    }
    
    return baseRoots;
};

const processLoadedState = (parsed: any): PlayerState | null => {
    try {
        // --- 1. VERSION CHECK ---
        if (!parsed.saveVersion || parsed.saveVersion !== CURRENT_SAVE_VERSION) {
            console.warn(`Save file version mismatch. Expected ${CURRENT_SAVE_VERSION}, found ${parsed.saveVersion}. Discarding save.`);
            return null; // Reject old or invalid save version
        }

        // --- 2. CORE PROPERTY CHECK ---
        if(!parsed || !parsed.name || !parsed.cultivation || !parsed.attributes || !parsed.stats || !parsed.currentMap) {
             console.error("Core properties missing from save file.");
            return null;
        }
        
        // --- 3. BACKWARD COMPATIBILITY & DEFAULTS ---
        if (!parsed.baseAttributes) { // MIGRATION FOR OLD SAVES
            parsed.baseAttributes = { ...parsed.attributes };
        }
        if (!parsed.cultivationStats) parsed.cultivationStats = {};
        if (parsed.cultivation.level === undefined || parsed.cultivation.level === null) parsed.cultivation.level = 0;
        if (parsed.attributes && parsed.attributes.linhLuc !== undefined) delete parsed.attributes.linhLuc; // Migration
        if (parsed.baseAttributes.coDuyen === undefined) parsed.baseAttributes.coDuyen = 10;
        if (parsed.baseAttributes.tamCanh === undefined) parsed.baseAttributes.tamCanh = 10;
        if (!parsed.learnedSkills) parsed.learnedSkills = [];
        if (!parsed.learnedRecipes) parsed.learnedRecipes = [];
        if (!parsed.inventory) parsed.inventory = [];
        if (!parsed.equipment) parsed.equipment = {};
        if (!parsed.linhCan || !Array.isArray(parsed.linhCan) || parsed.linhCan.length === 0) {
            parsed.linhCan = generateRandomLinhCan();
        }
        if (!parsed.generatedNpcs) parsed.generatedNpcs = {};
        if (!parsed.generatedInteractables) parsed.generatedInteractables = {};
        if (!parsed.defeatedNpcIds) parsed.defeatedNpcIds = [];
        if (!parsed.harvestedInteractableIds) parsed.harvestedInteractableIds = [];
        if (!parsed.deathInfo) parsed.deathInfo = {};
        if (!parsed.plantedPlots) parsed.plantedPlots = [];
        // Migration from an old system used an object here. The new system uses an array.
        // Ensure it is always an array. If it's an incompatible format, it will be replaced.
        if (!Array.isArray(parsed.respawningInteractables)) {
            parsed.respawningInteractables = [];
        }
        if (!parsed.initializedMaps) parsed.initializedMaps = [];
        if (parsed.nameOverrides) delete parsed.nameOverrides; // Remove old data
        if (parsed.useRandomNames) delete parsed.useRandomNames; // Remove old data
        if (parsed.camNgo === undefined) parsed.camNgo = 0;
        if (!parsed.chatHistories) parsed.chatHistories = {};
        if (!parsed.gender) parsed.gender = 'Nam';
        if (!parsed.activeEffects) parsed.activeEffects = [];
        if (!parsed.targetPosition) parsed.targetPosition = parsed.position;
        if (!parsed.journal) parsed.journal = [];
        parsed.journal = parsed.journal.map((entry: any) => ({
            ...entry,
            type: entry.type || 'player'
        }));
        if (!parsed.lastNpcProgressionCheck) parsed.lastNpcProgressionCheck = parsed.time;
        if (parsed.lastPopCheck) { // Migration
            parsed.nextMonsterSpawnCheck = parsed.lastPopCheck;
            delete parsed.lastPopCheck;
        }
        if (!parsed.nextMonsterSpawnCheck) parsed.nextMonsterSpawnCheck = {};
        if (parsed.nextRecruitmentCheck) delete parsed.nextRecruitmentCheck; // Remove obsolete property
        if (parsed.nextStableCountCheck) delete parsed.nextStableCountCheck; // Remove obsolete property
        if (parsed.nextNpcSpawnCheck) delete parsed.nextNpcSpawnCheck; // Remove obsolete property
        if (!parsed.nextInteractableSpawnCheck) parsed.nextInteractableSpawnCheck = {};
        if (!parsed.factionRecruitmentTimers) parsed.factionRecruitmentTimers = {};
        if (!parsed.affinity) parsed.affinity = {};
        if (!parsed.npcAffinityStore) parsed.npcAffinityStore = {};
        if (!parsed.apiUsageStats) {
            parsed.apiUsageStats = {
                totalTokens: 0,
                calls: {
                    getInteractionResponse: 0,
                    getNpcDefeatDecision: 0,
                    generateNpcs: 0,
                    generatePlaceNames: 0,
                    sendMessage: 0,
                }
            };
        }
        if (!parsed.nameUsageCounts) parsed.nameUsageCounts = { male: {}, female: {} };
        if (!parsed.leaderboards) parsed.leaderboards = {};
        if (parsed.lastLeaderboardUpdateYear === undefined) parsed.lastLeaderboardUpdateYear = 0;
        if (parsed.lastYoungStarsLeaderboardUpdateYear === undefined) parsed.lastYoungStarsLeaderboardUpdateYear = 0;
        if (!parsed.markedNpcIds) parsed.markedNpcIds = [];
        if (!parsed.factionAssets) parsed.factionAssets = {};

        
        // Add checks for numeric stats that might be missing in old saves.
        if (typeof parsed.hp !== 'number' || isNaN(parsed.hp)) parsed.hp = parsed.stats?.maxHp || 50;
        if (typeof parsed.mana !== 'number' || isNaN(parsed.mana)) parsed.mana = parsed.stats?.maxMana || 10;
        if (typeof parsed.qi !== 'number' || isNaN(parsed.qi)) parsed.qi = 0;
        if (typeof parsed.linhThach !== 'number' || isNaN(parsed.linhThach)) parsed.linhThach = 100;

        if (!parsed.time || !('year' in parsed.time)) {
             const oldTime = parsed.time || { day: 1, hour: 8, minute: 0 };
             const initialTime = INITIAL_PLAYER_STATE.time;
             let year = initialTime.year;
             let month = initialTime.month;
             let day = oldTime.day;

             while (day > DAYS_PER_MONTH) {
                day -= DAYS_PER_MONTH;
                month++;
                if (month > MONTHS_PER_YEAR) {
                    month = 1;
                    year++;
                }
            }

             parsed.time = {
                year: year,
                season: getSeasonLegacy(month),
                month: month,
                day: day,
                hour: oldTime.hour,
                minute: oldTime.minute,
             };
        }
        
        // --- 4. DATA VALIDATION & SANITIZATION ---
        
        // Validate Map
        const mapExists = Object.keys(MAPS).includes(parsed.currentMap);
        if (!mapExists) {
            console.warn(`Saved map "${parsed.currentMap}" no longer exists. Resetting to starting village.`);
            parsed.currentMap = 'LUC_YEN_THON';
            parsed.position = { x: 1000, y: 700 };
            parsed.targetPosition = { x: 1000, y: 700 };
        }

        // Sanitize inventory and skills
        parsed.inventory = Array.isArray(parsed.inventory)
            ? (parsed.inventory as any[]).filter(slot => slot && ALL_ITEMS.find(i => i.id === slot.itemId))
            : [];
        parsed.learnedSkills = Array.isArray(parsed.learnedSkills)
            ? (parsed.learnedSkills as any[]).filter(ls => ls && ALL_SKILLS.find(s => s.id === ls.skillId))
            : [];
        
        // Migrate NPCs in old save files
        for (const mapId in parsed.generatedNpcs) {
            for (const npc of parsed.generatedNpcs[mapId]) {
                if (npc.npcType !== 'monster') {
                    if (!npc.baseAttributes) {
                        npc.baseAttributes = { ...npc.attributes };
                    }
                    if (npc.cultivationProgress !== undefined) {
                        // This is an NPC from an old save file.
                        // Recalculate stats first to get the correct new maxQi.
                        const { finalStats: tempStats } = calculateAllStats(npc.baseAttributes, npc.cultivation, npc.cultivationStats, npc.learnedSkills, ALL_SKILLS, npc.equipment, ALL_ITEMS, npc.linhCan);
                        // Set their qi to a random value to reflect the system change.
                        npc.qi = Math.floor(Math.random() * tempStats.maxQi);
                        // Remove the old property
                        delete npc.cultivationProgress;
                    }
                }
            }
        }

        // --- 5. MIGRATE to npcAffinityStore ---
        // Populate store from existing relationships for faster lookups, handling old saves.
        const allNpcIds = new Set(Object.values(parsed.generatedNpcs).flat().map((npc: any) => npc.id));
        for (const mapId in parsed.generatedNpcs) {
            for (const npc of parsed.generatedNpcs[mapId]) {
                if (npc.relationships && Array.isArray(npc.relationships)) {
                    for (const rel of npc.relationships) {
                        if (rel.score !== undefined && allNpcIds.has(rel.targetNpcId)) {
                            const key = [npc.id, rel.targetNpcId].sort().join('_');
                            // Prioritize the score from the first NPC found in the pair to avoid conflicts
                            if (parsed.npcAffinityStore[key] === undefined) {
                                parsed.npcAffinityStore[key] = rel.score;
                            }
                        }
                    }
                }
            }
        }


        // Always recalculate stats on load to apply balancing changes and new properties.
        const { finalStats, finalAttributes } = calculateAllStats(
            parsed.baseAttributes, 
            parsed.cultivation, 
            parsed.cultivationStats,
            parsed.learnedSkills || [], 
            ALL_SKILLS, 
            parsed.equipment || {}, 
            ALL_ITEMS, 
            parsed.linhCan || []
        );
        parsed.stats = finalStats;
        parsed.attributes = finalAttributes;

        // Cap current values to new max values
        parsed.hp = Math.min(parsed.hp, finalStats.maxHp);
        parsed.mana = Math.min(parsed.mana, finalStats.maxMana);
        parsed.qi = Math.min(parsed.qi, finalStats.maxQi);

        return parsed as PlayerState;
    } catch (error) {
        console.error("Critical error processing player state. The save file might be corrupted. Removing it to prevent crash loops.", error);
        localStorage.removeItem(PLAYER_STATE_STORAGE_KEY);
        return null;
    }
}


const loadPlayerState = (): PlayerState | null => {
  try {
    const savedState = localStorage.getItem(PLAYER_STATE_STORAGE_KEY);
    if (savedState) {
        let jsonString: string | null = null;
        try {
            // Try to decompress first. If it returns null, it's either invalid or an old uncompressed format.
            jsonString = LZString.decompressFromUTF16(savedState);
        } catch (e) {
            // Ignore decompression errors, it might be plain JSON
        }
        
        // If decompression failed, assume it's an old uncompressed save.
        if (jsonString === null || jsonString === '') {
            jsonString = savedState;
        }

        const parsed = JSON.parse(jsonString);
        return processLoadedState(parsed);
    }
    return null;
  } catch (error) {
    console.error("Failed to load or parse player state from localStorage:", error);
    localStorage.removeItem(PLAYER_STATE_STORAGE_KEY);
    return null;
  }
};

export const savePlayerState = (state: PlayerState) => {
  // Defer the expensive save operation to the next event loop tick.
  // This prevents the UI from freezing during frequent state updates.
  setTimeout(() => {
    try {
      // Ensure the state being saved always has the current version
      const stateToSave = { ...state, saveVersion: CURRENT_SAVE_VERSION };
      const jsonString = JSON.stringify(stateToSave);
      const compressedString = LZString.compressToUTF16(jsonString);
      localStorage.setItem(PLAYER_STATE_STORAGE_KEY, compressedString);
    } catch (error) {
      console.error("Failed to save player state:", error);
    }
  }, 0);
};

export const usePlayerPersistence = (): [PlayerState | null, React.Dispatch<React.SetStateAction<PlayerState | null>>] => {
    const [playerState, setPlayerState] = useState<PlayerState | null>(loadPlayerState);
    return [playerState, setPlayerState];
};

export const initializeNewWorld = async (playerState: PlayerState): Promise<PlayerState> => {
    let stateWithNpcs = { ...playerState };

    const mapsToInitialize = (Object.keys(NPC_SPAWN_DEFINITIONS_BY_MAP) as MapID[]).filter(mapId => {
        const defs = NPC_SPAWN_DEFINITIONS_BY_MAP[mapId];
        return defs && defs.length > 0;
    });

    for (const mapId of mapsToInitialize) {
        const { npcs, totalTokenCount, updatedNameCounts } = await loadNpcsForMap(mapId, POIS_BY_MAP, stateWithNpcs);
        
        const currentApiStats = stateWithNpcs.apiUsageStats || {
            totalTokens: 0,
            calls: {
                getInteractionResponse: 0,
                getNpcDefeatDecision: 0,
                generateNpcs: 0,
                generatePlaceNames: 0,
                sendMessage: 0,
            }
        };

        stateWithNpcs = {
            ...stateWithNpcs,
            generatedNpcs: {
                ...stateWithNpcs.generatedNpcs,
                [mapId]: npcs,
            },
            initializedMaps: [...new Set([...(stateWithNpcs.initializedMaps || []), mapId])],
            nameUsageCounts: updatedNameCounts,
            apiUsageStats: {
                ...currentApiStats,
                totalTokens: (currentApiStats.totalTokens || 0) + totalTokenCount,
                calls: {
                    ...currentApiStats.calls,
                    generateNpcs: (currentApiStats.calls.generateNpcs || 0) + 1,
                }
            }
        };
    }

    // Populate initial affinities for static NPCs.
    const allSpawnedNpcs = Object.values(stateWithNpcs.generatedNpcs).flat();
    const initialAffinityStore = { ...(stateWithNpcs.npcAffinityStore || {}) };

    for (const staticDef of ALL_STATIC_NPCS) {
        if (staticDef.initialAffinities) {
            // Find the spawned instance of this static NPC. Note: This assumes only one instance per baseId.
            const sourceNpc = allSpawnedNpcs.find(npc => npc.baseId === staticDef.baseId);
            if (!sourceNpc) continue;

            for (const targetNpcId in staticDef.initialAffinities) {
                const score = staticDef.initialAffinities[targetNpcId];
                // Check if target NPC exists. The ID is hardcoded in the static def.
                const targetNpc = allSpawnedNpcs.find(npc => npc.id === targetNpcId);
                if (targetNpc) {
                    const key = [sourceNpc.id, targetNpc.id].sort().join('_');
                    // Only set if not already present, to respect any previous logic
                    if (initialAffinityStore[key] === undefined) {
                        initialAffinityStore[key] = score;
                    }
                }
            }
        }
    }
    stateWithNpcs.npcAffinityStore = initialAffinityStore;

    // Initialize faction assets
    stateWithNpcs.factionAssets = initializeFactionAssets();

    return stateWithNpcs;
};

export const createNewPlayer = (name: string, linhCan: LinhCan[], gender: 'Nam' | 'Nữ'): PlayerState => {
    let newPlayerState: PlayerState = {
        ...INITIAL_PLAYER_STATE,
        name: name,
        gender: gender,
        time: {
            ...INITIAL_PLAYER_STATE.time,
            year: 17, // Bắt đầu từ 16 tuổi (năm - 1)
        },
        chatHistories: {},
        linhCan: linhCan,
        baseAttributes: { ...INITIAL_PLAYER_STATE.baseAttributes },
        cultivation: { realmIndex: 0, level: -1 }, // Start as Mortal
        cultivationStats: {},
        generatedInteractables: {},
        learnedSkills: [{ skillId: 'cong-phap-hoang-1', currentLevel: 1 }],
        inventory: [
            ...INITIAL_PLAYER_STATE.inventory,
            { itemId: 'seed_linh_thao', quantity: 5 }
        ],
        nameUsageCounts: { male: {}, female: {} },
    };
    
    // Simulate first breakthrough to Luyện Khí Tầng 1 (level 0)
    const firstLevelCultivation = { realmIndex: 0, level: 0 };
    const firstLevelInfo = REALM_PROGRESSION[0].levels[0];
    const initialCultivationStats: Partial<CombatStats & CharacterAttributes> = {};

    for (const key in firstLevelInfo.bonuses) {
        const statKey = key as keyof (CombatStats & CharacterAttributes);
        const value = firstLevelInfo.bonuses[statKey];
        let rolledValue = 0;
        if (typeof value === 'number') {
            rolledValue = value;
        } else if (Array.isArray(value)) {
            rolledValue = Math.floor(Math.random() * (value[1] - value[0] + 1)) + value[0];
        }
        if (rolledValue !== 0) {
            (initialCultivationStats as any)[statKey] = ((initialCultivationStats as any)[statKey] || 0) + rolledValue;
        }
    }

    newPlayerState.cultivation = firstLevelCultivation;
    newPlayerState.cultivationStats = initialCultivationStats;
    
    // Recalculate stats for the new character based on initial state
    const { finalStats, finalAttributes } = calculateAllStats(
        newPlayerState.baseAttributes, 
        newPlayerState.cultivation, 
        newPlayerState.cultivationStats,
        newPlayerState.learnedSkills, 
        ALL_SKILLS, 
        newPlayerState.equipment, 
        ALL_ITEMS, 
        newPlayerState.linhCan
    );
    
    newPlayerState.stats = finalStats;
    newPlayerState.attributes = finalAttributes;
    newPlayerState.hp = finalStats.maxHp;
    newPlayerState.mana = finalStats.maxMana;
    newPlayerState.qi = 0; // Start with 0 Tu Vi, need to meditate

    return newPlayerState;
};

// --- SAVE/LOAD TO FILE ---

export const exportPlayerState = (playerState: PlayerState | null) => {
    if (!playerState) {
        alert("Không có dữ liệu người chơi để xuất.");
        return;
    }
    try {
        const stateToExport = { ...playerState, saveVersion: CURRENT_SAVE_VERSION };
        const compressedString = LZString.compressToUTF16(JSON.stringify(stateToExport));
        const blob = new Blob([compressedString], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tu_tien_save_${playerState.name.replace(/\s/g, '_')}_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Lỗi khi xuất file save:", error);
        alert("Đã có lỗi xảy ra khi xuất file save.");
    }
};


export const importPlayerState = (
    onComplete: (success: boolean, message: string) => void
) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json,text/plain';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
            onComplete(false, "Không có file nào được chọn.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("Nội dung file không hợp lệ.");
                }
                
                let jsonString: string | null = null;
                try {
                    jsonString = LZString.decompressFromUTF16(text);
                } catch (e) {}

                if (jsonString === null || jsonString === '') {
                    jsonString = text; // Assume it's an uncompressed JSON file
                }

                const importedState = JSON.parse(jsonString);

                const processedState = processLoadedState(importedState);

                if (processedState) {
                    savePlayerState(processedState);
                    onComplete(true, "Tải file save thành công!");
                } else {
                    throw new Error("File save không hợp lệ hoặc đã lỗi thời. Vui lòng tạo nhân vật mới hoặc thử một file khác.");
                }
            } catch (error) {
                console.error("Lỗi khi nhập file save:", error);
                const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định.";
                onComplete(false, `Lỗi khi nhập file save: ${errorMessage}`);
            }
        };
        reader.onerror = () => {
             onComplete(false, "Không thể đọc file.");
        };
        reader.readAsText(file);
    };
    input.click();
};