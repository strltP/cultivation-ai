import { useState, useCallback, useEffect, useRef } from 'react';
import type { PlayerState, JournalEntry } from '../types/character';
import { getNextCultivationLevel, getCultivationInfo, calculateAllStats, getRealmLevelInfo } from '../services/cultivationService';
import { ALL_SKILLS } from '../data/skills/skills';
import { advanceTime } from '../services/timeService';
import { ALL_ITEMS } from '../data/items/index';
import type { CharacterAttributes, CombatStats } from '../types/stats';
import { INITIAL_PLAYER_STATE, DAYS_PER_MONTH } from '../hooks/usePlayerPersistence';

const STAT_ATTRIBUTE_NAMES: Record<string, string> = {
    // Attributes
    canCot: 'Căn Cốt',
    thanPhap: 'Thân Pháp',
    thanThuc: 'Thần Thức',
    ngoTinh: 'Ngộ Tính',
    coDuyen: 'Cơ Duyên',
    tamCanh: 'Tâm Cảnh',
    // Combat Stats
    maxHp: 'Sinh Lực Tối đa',
    maxQi: 'Chân Khí Tối đa',
    maxMana: 'Linh Lực Tối đa',
    maxThoNguyen: 'Thọ Nguyên Tối đa',
    attackPower: 'Lực Công',
    defensePower: 'Lực Thủ',
    speed: 'Tốc Độ',
    critRate: 'Tỉ lệ Bạo kích',
    critDamage: 'ST Bạo kích',
    armorPenetration: 'Xuyên Giáp',
};

export const usePlayerActions = (
    updateAndPersistPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void,
    setGameMessage: (message: string | null) => void,
    stopAllActions: React.MutableRefObject<() => void>
) => {
    const [isMeditating, setIsMeditating] = useState<boolean>(false);

    // Effect for handling the meditation process over time
    useEffect(() => {
        if (!isMeditating) {
            return;
        }

        const intervalId = window.setInterval(() => {
            updateAndPersistPlayerState(prev => {
                if (!prev) return prev;

                const isQiFull = prev.qi >= prev.stats.maxQi;
                const isHpFull = prev.hp >= prev.stats.maxHp;
                const isManaFull = prev.mana >= prev.stats.maxMana;

                if (isQiFull && isHpFull && isManaFull) {
                    setIsMeditating(false);
                    setGameMessage("Trạng thái đã viên mãn.");
                    return {
                        ...prev,
                        qi: prev.stats.maxQi,
                        hp: prev.stats.maxHp,
                        mana: prev.stats.maxMana,
                    };
                }

                const MINUTES_PER_TICK = 30;
                
                // Advance time first to use it for Qi calculation
                const newTime = advanceTime(prev.time, MINUTES_PER_TICK);

                // Calculate Qi gain: 1 Qi every 2 hours
                let qiGained = 0;
                if (!isQiFull) {
                    // Check if the hour has changed and if the new hour is an even number
                    if (newTime.hour !== prev.time.hour && newTime.hour % 2 === 0) {
                        qiGained = 1;
                    }
                }
                
                // Keep HP, Mana, Cam Ngo gains per minute as before.
                const HP_RECOVERY_RATE_PER_MINUTE = 0.001; // 0.1% max HP / min
                const MANA_RECOVERY_RATE_PER_MINUTE = 0.002; // 0.2% max Mana / min
                const CAM_NGO_PER_MINUTE = Math.round(1 + prev.attributes.ngoTinh / 20);

                // Ensure recovery amounts are integers
                const hpGained = isHpFull ? 0 : Math.ceil(prev.stats.maxHp * HP_RECOVERY_RATE_PER_MINUTE * MINUTES_PER_TICK);
                const manaGained = isManaFull ? 0 : Math.ceil(prev.stats.maxMana * MANA_RECOVERY_RATE_PER_MINUTE * MINUTES_PER_TICK);
                const camNgoGained = Math.round(CAM_NGO_PER_MINUTE * MINUTES_PER_TICK);

                const newHp = Math.min(prev.stats.maxHp, prev.hp + hpGained);
                const newMana = Math.min(prev.stats.maxMana, prev.mana + manaGained);
                const newQi = Math.min(prev.stats.maxQi, prev.qi + qiGained);
                
                return {
                    ...prev,
                    hp: newHp,
                    mana: newMana,
                    qi: newQi,
                    camNgo: prev.camNgo + camNgoGained,
                    time: newTime,
                };
            });
        }, 1000); // Tick every 1 second (1000ms)

        return () => {
            clearInterval(intervalId);
        };
    }, [isMeditating, setIsMeditating, updateAndPersistPlayerState, setGameMessage]);


    const handleBreakthrough = useCallback(() => {
        stopAllActions.current();
        updateAndPersistPlayerState(prev => {
            if (!prev || prev.qi < prev.stats.maxQi) return prev;
            const nextCultivation = getNextCultivationLevel(prev.cultivation);

            if (!nextCultivation) {
                setGameMessage("Đạo hữu đã đạt đến đỉnh cao của thế giới này, không thể đột phá thêm.");
                return { ...prev, qi: prev.stats.maxQi };
            }

            const newLevelInfo = getRealmLevelInfo(nextCultivation);
            if (!newLevelInfo) return prev;

            const newCultivationStats = { ...prev.cultivationStats };
            let breakthroughMessages: string[] = [];

            for (const key in newLevelInfo.bonuses) {
                const statKey = key as keyof (CombatStats & CharacterAttributes);
                const value = newLevelInfo.bonuses[statKey];
                let rolledValue = 0;
                if (typeof value === 'number') {
                    rolledValue = value;
                } else if (Array.isArray(value)) {
                    rolledValue = Math.floor(Math.random() * (value[1] - value[0] + 1)) + value[0];
                }
                
                if (rolledValue !== 0) {
                    (newCultivationStats as any)[statKey] = ((newCultivationStats as any)[statKey] || 0) + rolledValue;
                    const statName = STAT_ATTRIBUTE_NAMES[statKey] || statKey;
                    breakthroughMessages.push(`${statName} +${rolledValue}`);
                }
            }
            
            const nextCultivationInfo = getCultivationInfo(nextCultivation);
            const { finalStats, finalAttributes } = calculateAllStats(
                INITIAL_PLAYER_STATE.attributes, 
                nextCultivation, 
                newCultivationStats, 
                prev.learnedSkills, 
                ALL_SKILLS, 
                prev.equipment, 
                ALL_ITEMS, 
                prev.linhCan
            );
            const timeAdvanced = advanceTime(prev.time, 12 * 60); // Breakthrough takes 12 hours
            
            const message = `Chúc mừng! Đã đột phá đến ${nextCultivationInfo.name}! ${breakthroughMessages.join(', ')}. (Tốn 12 giờ)`;
            setGameMessage(message);
            
            const newJournalEntry: JournalEntry = {
                time: timeAdvanced,
                message: message
            };

            return {
                ...prev,
                cultivation: nextCultivation,
                attributes: finalAttributes,
                stats: finalStats,
                cultivationStats: newCultivationStats,
                hp: finalStats.maxHp,
                qi: 0,
                time: timeAdvanced,
                journal: [...(prev.journal || []), newJournalEntry],
            };
        });
    }, [updateAndPersistPlayerState, setGameMessage, stopAllActions]);

    const handleStartSeclusion = useCallback((months: number) => {
        stopAllActions.current();
        updateAndPersistPlayerState(prev => {
            if (!prev || months <= 0) return prev;

            const totalMinutesToAdvance = months * DAYS_PER_MONTH * 24 * 60;
            const totalHoursToAdvance = months * DAYS_PER_MONTH * 24;
            
            const SECLUSION_QI_PER_HOUR_BASE = 1.5;
            const NGO_TINH_FACTOR = 0.05;
            const realmMultiplier = 1 + (prev.cultivation.realmIndex * 0.15);
            const qiPerHour = (SECLUSION_QI_PER_HOUR_BASE + (prev.attributes.ngoTinh * NGO_TINH_FACTOR)) * realmMultiplier;
            const totalQiGained = Math.round(qiPerHour * totalHoursToAdvance);

            const newQi = Math.min(prev.stats.maxQi, prev.qi + totalQiGained);
            const newTime = advanceTime(prev.time, totalMinutesToAdvance);

            const message = `Bế quan ${months} tháng kết thúc. Chân khí tăng ${totalQiGained.toLocaleString()}, đạt tới ${newQi.toLocaleString()}. Toàn bộ sinh lực và linh lực đã hồi phục.`;
            setGameMessage(message);
            
            const newJournalEntry: JournalEntry = {
                time: newTime,
                message: message,
            };

            return {
                ...prev,
                time: newTime,
                qi: newQi,
                hp: prev.stats.maxHp,
                mana: prev.stats.maxMana,
                journal: [...(prev.journal || []), newJournalEntry],
            };
        });
    }, [updateAndPersistPlayerState, setGameMessage, stopAllActions]);

    const handleToggleMeditation = useCallback(() => {
        if (isMeditating) {
            setIsMeditating(false);
            setGameMessage("Đã dừng đả toạ.");
        } else {
            stopAllActions.current();
            updateAndPersistPlayerState(prev => {
                if (!prev) return prev;
                const isFull = prev.qi >= prev.stats.maxQi && prev.hp >= prev.stats.maxHp && prev.mana >= prev.stats.maxMana;
                if (isFull) {
                    setGameMessage("Trạng thái đã viên mãn, không cần đả toạ.");
                    return prev;
                }

                setIsMeditating(true);
                setGameMessage("Bắt đầu đả toạ...");
                
                return { 
                    ...prev, 
                    targetPosition: prev.position // Stop movement
                };
            });
        }
    }, [isMeditating, updateAndPersistPlayerState, setGameMessage, stopAllActions]);

    const handleLevelUpSkill = useCallback((skillId: string) => {
        updateAndPersistPlayerState(prev => {
            if (!prev) return prev;
            const skillToLevelUp = prev.learnedSkills.find(s => s.skillId === skillId);
            const skillDef = ALL_SKILLS.find(s => s.id === skillId);
            if (!skillToLevelUp || !skillDef) return prev;
            
            if (skillToLevelUp.currentLevel >= skillDef.maxLevel) {
                setGameMessage("Kỹ năng đã đạt tầng tối đa.");
                return prev;
            }

            const cost = skillDef.enlightenmentBaseCost + skillToLevelUp.currentLevel * skillDef.enlightenmentCostPerLevel;
            if (prev.camNgo < cost) {
                setGameMessage("Điểm cảm ngộ không đủ để đột phá.");
                return prev;
            }
            
            // Leveling up a skill costs 2 hours
            const timeAdvanced = advanceTime(prev.time, 2 * 60);
            const newLearnedSkills = prev.learnedSkills.map(s => 
                s.skillId === skillId ? { ...s, currentLevel: s.currentLevel + 1 } : s
            );
            const { finalStats, finalAttributes } = calculateAllStats(prev.attributes, prev.cultivation, prev.cultivationStats, newLearnedSkills, ALL_SKILLS, prev.equipment, ALL_ITEMS, prev.linhCan);
            
            const message = `"${skillDef.name}" đã được tu luyện tới tầng ${skillToLevelUp.currentLevel + 1}! (Tiêu tốn ${cost} Cảm Ngộ và 2 giờ)`;
            setGameMessage(message);
            
            const newJournalEntry: JournalEntry = {
                time: timeAdvanced,
                message: message
            };

            return {
                ...prev,
                learnedSkills: newLearnedSkills,
                attributes: finalAttributes,
                stats: finalStats,
                camNgo: prev.camNgo - cost,
                hp: Math.round(prev.hp / prev.stats.maxHp * finalStats.maxHp),
                time: timeAdvanced,
                journal: [...(prev.journal || []), newJournalEntry],
            };
        });
    }, [updateAndPersistPlayerState, setGameMessage]);
    
    return {
        isMeditating,
        setIsMeditating,
        handleBreakthrough,
        handleToggleMeditation,
        handleLevelUpSkill,
        handleStartSeclusion,
    };
};
