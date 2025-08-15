import { useState, useEffect } from 'react';
import type { PlayerState } from '../types/character';
import { INITIAL_PLAYER_STATE, DAYS_PER_MONTH, MONTHS_PER_YEAR, REALM_PROGRESSION } from '../constants';
import { calculateCombatStats } from '../services/cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { advanceTime } from '../services/timeService';
import { ALL_ITEMS } from '../data/items/index';
import type { LinhCan, LinhCanType } from '../types/linhcan';
import { LINH_CAN_TYPES } from '../types/linhcan';
import type { CharacterAttributes, CombatStats } from '../types/stats';

const PLAYER_STATE_STORAGE_KEY = 'tu_tien_player_state_v3';

const getSeasonLegacy = (month: number): 'Xuân' | 'Hạ' | 'Thu' | 'Đông' => {
    if (month >= 1 && month <= 3) return 'Xuân';
    if (month >= 4 && month <= 6) return 'Hạ';
    if (month >= 7 && month <= 9) return 'Thu';
    return 'Đông';
};

export const generateRandomLinhCan = (): LinhCan[] => {
    const numberOfRoots = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const shuffledTypes = [...LINH_CAN_TYPES].sort(() => 0.5 - Math.random());
    const selectedTypes = shuffledTypes.slice(0, numberOfRoots);

    return selectedTypes.map(type => ({
        type: type,
        purity: Math.floor(Math.random() * 91) + 10, // Purity from 10 to 100
    }));
};

const processLoadedState = (parsed: any): PlayerState | null => {
    try {
        if(!parsed || !parsed.name || !parsed.cultivation || !parsed.attributes || !parsed.stats) {
            return null;
        }
        
        // Add new fields for backward compatibility
        if (!parsed.cultivationStats) {
            parsed.cultivationStats = {};
        }
        if (parsed.cultivation.level === undefined || parsed.cultivation.level === null) {
            parsed.cultivation.level = 0; // Default old saves to level 0
        }

        // Migration: Remove linhLuc if it exists
        if (parsed.attributes && parsed.attributes.linhLuc !== undefined) {
            delete parsed.attributes.linhLuc;
        }

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
        
        if (parsed.cultivation.level === 1 && parsed.cultivation.realmIndex === 0 && !parsed.inventory.some((i: any) => i.itemId === 'book_hoa_cau_thuat')) {
             parsed.learnedSkills.push({ skillId: 'cong-phap-hoang-1', currentLevel: 1 });
        }


        // Always recalculate stats on load to apply balancing changes and new properties.
        const recalculatedStats = calculateCombatStats(
            parsed.attributes, 
            parsed.cultivation, 
            parsed.cultivationStats,
            parsed.learnedSkills || [], 
            ALL_SKILLS, 
            parsed.equipment || {}, 
            ALL_ITEMS, 
            parsed.linhCan || []
        );
        parsed.stats = recalculatedStats;

        // Cap current values to new max values
        parsed.hp = Math.min(parsed.hp, recalculatedStats.maxHp);
        parsed.mana = Math.min(parsed.mana, recalculatedStats.maxMana);
        parsed.qi = Math.min(parsed.qi, recalculatedStats.maxQi);

        return parsed as PlayerState;
    } catch (error) {
        console.error("Error processing player state:", error);
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
    console.error("Failed to load player state:", error);
    return null;
  }
};

export const savePlayerState = (state: PlayerState) => {
  try {
    localStorage.setItem(PLAYER_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save player state:", error);
  }
};

export const usePlayerPersistence = (): [PlayerState | null, React.Dispatch<React.SetStateAction<PlayerState | null>>] => {
    const [playerState, setPlayerState] = useState<PlayerState | null>(loadPlayerState);

    useEffect(() => {
        if (playerState) {
            savePlayerState(playerState);
        }
    }, [playerState]);
    
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
    const newStats = calculateCombatStats(
        newPlayerState.attributes, 
        newPlayerState.cultivation, 
        newPlayerState.cultivationStats,
        newPlayerState.learnedSkills, 
        ALL_SKILLS, 
        newPlayerState.equipment, 
        ALL_ITEMS, 
        newPlayerState.linhCan
    );
    
    newPlayerState.stats = newStats;
    newPlayerState.hp = newStats.maxHp;
    newPlayerState.mana = newStats.maxMana;
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
        const jsonString = JSON.stringify(playerState, null, 2);
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
                    throw new Error("File save không hợp lệ hoặc đã lỗi thời.");
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