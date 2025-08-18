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
import { MAPS } from '../mapdata';

const PLAYER_STATE_STORAGE_KEY = 'tu_tien_player_state_v3';
const CURRENT_SAVE_VERSION = '2.1';

export const INITIAL_PLAYER_STATE: PlayerState = {
    ...BASE_INITIAL_PLAYER_STATE,
    journal: [],
    saveVersion: CURRENT_SAVE_VERSION,
    lastNpcProgressionCheck: { year: 17, season: 'Xuân', month: 1, day: 1, hour: 8, minute: 0 },
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
        // Băng (Băng) = Thủy + Kim (Sinh) | Thủy + Hỏa (Khắc)
        'KIM-THUY': 'BĂNG', 'THUY-KIM': 'BĂNG',
        'THUY-HOA': 'BĂNG', 'HOA-THUY': 'BĂNG',

        // Lôi (Sét) = Mộc + Hỏa (Sinh) | Hỏa + Kim (Khắc)
        'MOC-HOA': 'LOI', 'HOA-MOC': 'LOI',
        'HOA-KIM': 'LOI', 'KIM-HOA': 'LOI',
        
        // Phong (Gió) = Kim + Mộc (Khắc) | Mộc + Thổ (Khắc)
        'KIM-MOC': 'PHONG', 'MOC-KIM': 'PHONG',
        'MOC-THO': 'PHONG', 'THO-MOC': 'PHONG',

        // Quang (Ánh sáng) = Hỏa + Thổ (Sinh) | Thổ + Kim (Sinh)
        'HOA-THO': 'QUANG', 'THO-HOA': 'QUANG',
        'KIM-THO': 'QUANG', 'THO-KIM': 'QUANG',

        // Ám (Bóng tối) = Thổ + Thủy (Khắc) | Thủy + Mộc (Sinh)
        'THUY-THO': 'AM', 'THO-THUY': 'AM',
        'THUY-MOC': 'AM', 'MOC-THUY': 'AM',
    };

    const numBaseRoots = Math.floor(Math.random() * 5) + 1;
    const shuffledBaseElements = [...BASE_ELEMENTS].sort(() => 0.5 - Math.random());
    
    const baseRoots: LinhCan[] = shuffledBaseElements.slice(0, numBaseRoots).map(type => ({
        type: type,
        purity: Math.floor(Math.random() * 91) + 10, // Purity from 10 to 100 for base roots
    }));

    let finalRoots: LinhCan[] = [...baseRoots];

    // Dị linh căn giờ đây chỉ có thể được tạo ra từ Chân Linh Căn (chính xác là 2 linh căn ngũ hành)
    const canHaveVariant = numBaseRoots === 2;
    const hasVariantChance = 0.3; // 30% chance

    if (canHaveVariant && Math.random() < hasVariantChance) {
        // Chọn hai linh căn để kết hợp
        const shuffledBaseRoots = [...baseRoots].sort(() => 0.5 - Math.random());
        const root1 = shuffledBaseRoots[0];
        const root2 = shuffledBaseRoots[1];
        
        const combinationKey = `${root1.type}-${root2.type}`;
        const variantType = VARIANT_COMBINATIONS[combinationKey];

        if (variantType) {
            const newVariantRoot: LinhCan = {
                type: variantType,
                // Độ thuần khiết phải cao hơn hai linh căn gốc
                purity: Math.min(100, Math.max(root1.purity, root2.purity) + Math.floor(Math.random() * 16) + 5) // +5 to 20 higher
            };
            // Thêm dị linh căn mới vào danh sách, KHÔNG thay thế các linh căn gốc.
            finalRoots.push(newVariantRoot);
        }
    }

    return finalRoots;
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
        if (!parsed.cultivationStats) parsed.cultivationStats = {};
        if (parsed.cultivation.level === undefined || parsed.cultivation.level === null) parsed.cultivation.level = 0;
        if (parsed.attributes && parsed.attributes.linhLuc !== undefined) delete parsed.attributes.linhLuc; // Migration
        if (parsed.attributes.coDuyen === undefined) parsed.attributes.coDuyen = 10;
        if (parsed.attributes.tamCanh === undefined) parsed.attributes.tamCanh = 10;
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
        if (!parsed.plantedPlots) parsed.plantedPlots = [];
        if (!parsed.respawningInteractables) parsed.respawningInteractables = [];
        if (!parsed.respawningNpcs) parsed.respawningNpcs = [];
        if (parsed.useRandomNames === undefined) parsed.useRandomNames = false;
        if (!parsed.nameOverrides) parsed.nameOverrides = {};
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


        // Always recalculate stats on load to apply balancing changes and new properties.
        const { finalStats, finalAttributes } = calculateAllStats(
            parsed.attributes, 
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
      const parsed = JSON.parse(savedState);
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
  try {
    // Ensure the state being saved always has the current version
    const stateToSave = { ...state, saveVersion: CURRENT_SAVE_VERSION };
    localStorage.setItem(PLAYER_STATE_STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error("Failed to save player state:", error);
  }
};

export const usePlayerPersistence = (): [PlayerState | null, React.Dispatch<React.SetStateAction<PlayerState | null>>] => {
    const [playerState, setPlayerState] = useState<PlayerState | null>(loadPlayerState);
    return [playerState, setPlayerState];
};

export const createNewPlayer = (name: string, useRandomNames: boolean, linhCan: LinhCan[], gender: 'Nam' | 'Nữ'): PlayerState => {
    let newPlayerState: PlayerState = {
        ...INITIAL_PLAYER_STATE,
        name: name,
        gender: gender,
        time: {
            ...INITIAL_PLAYER_STATE.time,
            year: 17, // Bắt đầu từ 16 tuổi (năm - 1)
        },
        useRandomNames: useRandomNames,
        nameOverrides: {},
        chatHistories: {},
        linhCan: linhCan,
        cultivation: { realmIndex: 0, level: -1 }, // Start as Mortal
        cultivationStats: {},
        generatedInteractables: {},
        learnedSkills: [{ skillId: 'cong-phap-hoang-1', currentLevel: 1 }],
        inventory: [
            ...INITIAL_PLAYER_STATE.inventory,
            { itemId: 'seed_linh_thao', quantity: 5 }
        ]
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
        newPlayerState.attributes, 
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
    newPlayerState.qi = 0; // Start with 0 Qi, need to meditate

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
        const jsonString = JSON.stringify(stateToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
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
    input.accept = '.json,application/json';
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
                const importedState = JSON.parse(text);

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